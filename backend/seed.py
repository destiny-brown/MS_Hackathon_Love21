import random
from datetime import datetime, timedelta, timezone

from faker import Faker
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.db import SessionLocal, create_db_and_tables
from app.models.activity import Activity, ActivitySignup, VolunteerHour
from app.models.donation import Donation
from app.models.item import Item
from app.models.newsletter import NewsletterSubscriber
from app.models.support_opportunity import SupportOpportunity
from app.models.user import Role, User
from app.models.volunteer_activity import VolunteerActivity, VolunteerActivityRegistration

DEMO_PASSWORD = "demo1234"
DEMO_USERS = [
    ("admin@love21.demo", Role.ADMIN),
    ("member@love21.demo", Role.MEMBER),
    ("supporter@love21.demo", Role.SUPPORTER),
]
MOCK_CHECKOUT_NOTE = "Mocked checkout records donations locally for the demo."
FAKER_SEED = 21
VOLUNTEER_ACTIVITY_COUNT = 10
SUPPORT_OPPORTUNITY_COUNT = 8
NEWSLETTER_SUBSCRIBER_COUNT = 2
GENERATED_RECORD_CAP = 20

assert (
    VOLUNTEER_ACTIVITY_COUNT
    + SUPPORT_OPPORTUNITY_COUNT
    + NEWSLETTER_SUBSCRIBER_COUNT
    <= GENERATED_RECORD_CAP
), "Generated record budget exceeds cap"

fake = Faker()
Faker.seed(FAKER_SEED)
rng = random.Random(FAKER_SEED)

VOLUNTEER_ICONS = ["⚽", "🏀", "🎨", "🤝", "🍳", "📚", "🎯", "🌟"]
VOLUNTEER_CATEGORIES = ["sport", "community", "skills", "admin"]
VOLUNTEER_CATEGORY_WEIGHTS = [0.4, 0.3, 0.2, 0.1]
VOLUNTEER_SEED_OVERRIDES = [
    {
        "slug": "skills-based",
        "title": "Skills-based placement",
        "category": "skills",
        "icon": "🧩",
    },
    {
        "slug": "community-dinners",
        "title": "Community dinners",
        "category": "community",
        "icon": "🍽️",
    },
]

SUPPORT_KINDS = ["campaign", "cause", "wishlist"]
SUPPORT_PROGRESS_RATIOS = [0.04, 0.09, 0.28, 0.37, 0.61, 0.72, 0.89, 0.96]
SUPPORT_TARGET_AMOUNTS = [18000, 24000, 36000, 50000, 80000, 120000]


def upsert_opportunity(db: Session, **values) -> SupportOpportunity:
    values.setdefault("moonclerk_url", None)
    opportunity = db.scalar(select(SupportOpportunity).where(SupportOpportunity.slug == values["slug"]))
    if opportunity is None:
        opportunity = SupportOpportunity(**values)
        db.add(opportunity)
    else:
        for key, value in values.items():
            setattr(opportunity, key, value)
    db.commit()
    db.refresh(opportunity)
    return opportunity


def upsert_activity(db: Session, title: str, starts_at: datetime, ends_at: datetime, location: str, description: str) -> Activity:
    activity = db.scalar(select(Activity).where(Activity.title == title))
    if activity is None:
        activity = Activity(title=title, starts_at=starts_at, ends_at=ends_at, location=location, description=description)
        db.add(activity)
    else:
        activity.starts_at = starts_at
        activity.ends_at = ends_at
        activity.location = location
        activity.description = description
    db.commit()
    db.refresh(activity)
    return activity


def ensure_signup(db: Session, supporter: User, activity: Activity, status: str = "signed_up") -> ActivitySignup:
    signup = db.scalar(
        select(ActivitySignup).where(
            ActivitySignup.supporter_id == supporter.id,
            ActivitySignup.activity_id == activity.id,
        )
    )
    if signup is None:
        signup = ActivitySignup(supporter_id=supporter.id, activity_id=activity.id, status=status)
        db.add(signup)
    else:
        signup.status = status
    db.commit()
    db.refresh(signup)
    return signup


def ensure_hour(db: Session, supporter: User, activity: Activity | None, hours: float, notes: str) -> None:
    existing = db.scalar(
        select(VolunteerHour).where(
            VolunteerHour.supporter_id == supporter.id,
            VolunteerHour.activity_id == (activity.id if activity else None),
            VolunteerHour.notes == notes,
        )
    )
    if existing is None:
        db.add(VolunteerHour(supporter_id=supporter.id, activity_id=activity.id if activity else None, hours=hours, notes=notes))
        db.commit()


def ensure_donation(
    db: Session,
    supporter: User,
    opportunity: SupportOpportunity,
    amount: int,
    frequency: str,
    reference: str,
) -> None:
    existing = db.scalar(select(Donation).where(Donation.payment_reference == reference))
    if existing is None:
        db.add(
            Donation(
                supporter_id=supporter.id,
                support_opportunity_id=opportunity.id,
                donor_email=supporter.email,
                donor_name="Demo Supporter",
                amount_hkd=amount,
                frequency=frequency,
                status="succeeded",
                payment_reference=reference,
                message="Seeded demo donation",
            )
        )
    db.commit()


def upsert_volunteer_activity(db: Session, **values) -> VolunteerActivity:
    activity = db.scalar(select(VolunteerActivity).where(VolunteerActivity.slug == values["slug"]))
    if activity is None:
        activity = VolunteerActivity(**values)
        db.add(activity)
    else:
        for key, value in values.items():
            setattr(activity, key, value)
    db.commit()
    db.refresh(activity)
    return activity


def ensure_volunteer_registration(
    db: Session,
    user: User,
    activity: VolunteerActivity,
    status: str,
) -> None:
    existing = db.scalar(
        select(VolunteerActivityRegistration).where(
            VolunteerActivityRegistration.user_id == user.id,
            VolunteerActivityRegistration.activity_id == activity.id,
        )
    )
    if existing is None:
        existing = VolunteerActivityRegistration(
            user_id=user.id,
            activity_id=activity.id,
            activity_slug=activity.slug,
            activity_name=activity.title,
            status=status,
        )
        db.add(existing)
    else:
        existing.activity_slug = activity.slug
        existing.activity_name = activity.title
        existing.status = status
    db.commit()


def upsert_newsletter_subscriber(db: Session, **values) -> NewsletterSubscriber:
    email = values["email"].lower().strip()
    payload = {**values, "email": email}
    subscriber = db.scalar(select(NewsletterSubscriber).where(NewsletterSubscriber.email == email))
    if subscriber is None:
        subscriber = NewsletterSubscriber(**payload)
        db.add(subscriber)
    else:
        for key, value in payload.items():
            if key != "email":
                setattr(subscriber, key, value)
        subscriber.email = email
    db.commit()
    db.refresh(subscriber)
    return subscriber


def _build_volunteer_rows(now: datetime) -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []

    for index in range(VOLUNTEER_ACTIVITY_COUNT):
        if index < len(VOLUNTEER_SEED_OVERRIDES):
            override = VOLUNTEER_SEED_OVERRIDES[index]
            title = str(override["title"])
            slug = str(override["slug"])
            category = str(override["category"])
            icon = str(override["icon"])
        else:
            title = fake.sentence(nb_words=3).replace(".", "")
            slug = f"volunteer-{index + 1}-{fake.lexify(text='????')}".lower()
            category = rng.choices(VOLUNTEER_CATEGORIES, weights=VOLUNTEER_CATEGORY_WEIGHTS, k=1)[0]
            icon = rng.choice(VOLUNTEER_ICONS)

        total_spots = rng.randint(8, 40)
        filled_count = rng.randint(0, total_spots)
        status = "active" if index < 8 else "archived"
        schedule_day = fake.day_of_week()
        schedule_label = f"{schedule_day} {rng.choice(['morning', 'afternoon', 'evening'])}"
        created_at = fake.date_time_between(start_date="-120d", end_date="now", tzinfo=timezone.utc)

        rows.append(
            {
                "slug": slug,
                "icon": icon,
                "title": title,
                "description": fake.paragraph(nb_sentences=2),
                "schedule_label": schedule_label,
                "location_label": f"{fake.city()}, {rng.choice(['community hall', 'sports centre', 'studio'])}",
                "category": category,
                "filled_count": filled_count,
                "total_spots": total_spots,
                "note": fake.sentence(nb_words=8) if index % 3 == 0 else None,
                "cta_label": "I'm interested",
                "status": status,
                "display_order": index,
                "created_at": min(created_at, now),
            }
        )
    return rows


def _build_support_rows(now: datetime) -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    for index in range(SUPPORT_OPPORTUNITY_COUNT):
        kind = SUPPORT_KINDS[index % len(SUPPORT_KINDS)]
        title = fake.sentence(nb_words=4).replace(".", "")
        slug = f"support-{index + 1}-{fake.lexify(text='????')}".lower()
        target_amount_hkd = rng.choice(SUPPORT_TARGET_AMOUNTS)
        ratio = SUPPORT_PROGRESS_RATIOS[index]
        funded_amount_hkd = int(target_amount_hkd * ratio)

        quantity_needed: int | None = None
        quantity_secured: int | None = None
        purchase_url: str | None = None
        moonclerk_url: str | None = None
        if kind == "wishlist":
            quantity_needed = rng.randint(10, 40)
            quantity_secured = min(quantity_needed, max(0, int(quantity_needed * ratio)))
            purchase_url = f"https://example.com/wishlist/{slug}"
        else:
            moonclerk_url = f"https://buy.stripe.test/{slug}"

        created_at = fake.date_time_between(start_date="-160d", end_date="now", tzinfo=timezone.utc)
        rows.append(
            {
                "slug": slug,
                "kind": kind,
                "title": title,
                "description": fake.paragraph(nb_sentences=2),
                "impact_statement": fake.sentence(nb_words=14),
                "image_url": f"https://picsum.photos/seed/{slug}/1200/800",
                "target_amount_hkd": target_amount_hkd,
                "funded_amount_hkd": funded_amount_hkd,
                "moonclerk_url": moonclerk_url,
                "purchase_url": purchase_url,
                "quantity_needed": quantity_needed,
                "quantity_secured": quantity_secured,
                "status": "active" if index < 7 else "archived",
                "display_order": index,
                "created_at": min(created_at, now),
                "updated_at": now,
            }
        )
    return rows


def run() -> None:
    create_db_and_tables()
    with SessionLocal() as db:
        demo_accounts: list[User] = []
        for email, role in DEMO_USERS:
            user = db.scalar(select(User).where(User.email == email))
            if user is None:
                user = User(email=email, hashed_password=hash_password(DEMO_PASSWORD), role=role)
                db.add(user)
                db.commit()
                db.refresh(user)
            else:
                user.role = role
                user.hashed_password = hash_password(DEMO_PASSWORD)
                db.commit()
                db.refresh(user)
            demo_accounts.append(user)

        for old_email in ("donor@love21.demo", "volunteer@love21.demo"):
            old_user = db.scalar(select(User).where(User.email == old_email))
            if old_user is not None:
                old_user.role = Role.SUPPORTER
                db.commit()

        admin_user = next(user for user in demo_accounts if user.role == Role.ADMIN)
        member_user = next(user for user in demo_accounts if user.role == Role.MEMBER)
        supporter_user = next(user for user in demo_accounts if user.role == Role.SUPPORTER)
        existing_items = db.scalars(select(Item).where(Item.owner_id == admin_user.id)).all()
        if not existing_items:
            db.add_all(
                [
                    Item(title="Pitch deck", description="Draft the 5-slide demo story.", owner_id=admin_user.id),
                    Item(title="Judge flow", description="Practice login → create item → AI ask.", owner_id=admin_user.id),
                    Item(title="Stretch goal", description="Copy Item into the real feature.", owner_id=admin_user.id),
                ]
            )
            db.commit()

        now = datetime.now(timezone.utc)

        volunteer_rows = _build_volunteer_rows(now)
        seeded_volunteer_activities = [upsert_volunteer_activity(db, **row) for row in volunteer_rows]

        support_rows = _build_support_rows(now)
        seeded_support_opportunities = [upsert_opportunity(db, **row) for row in support_rows]

        for index in range(NEWSLETTER_SUBSCRIBER_COUNT):
            upsert_newsletter_subscriber(
                db,
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                email=f"demo-news-{index + 1}@love21.demo",
                phone_number=fake.numerify(text="+852#### ####"),
                status="active",
                frequency="weekly" if index == 0 else "monthly",
                subscribed_at=fake.date_time_between(start_date="-60d", end_date="now", tzinfo=timezone.utc),
            )

        activities = [
            upsert_activity(
                db,
                "Saturday Sports Buddy Session",
                now + timedelta(days=5, hours=2),
                now + timedelta(days=5, hours=4),
                "Love 21 Space, San Po Kong",
                "Support coaches during warm-ups, games, and confidence-building sport stations.",
            ),
            upsert_activity(
                db,
                "Nutrition Workshop Helpers",
                now + timedelta(days=12, hours=3),
                now + timedelta(days=12, hours=5),
                "Community kitchen, Kowloon",
                "Help set up ingredients, support members at cooking stations, and tidy equipment after class.",
            ),
            upsert_activity(
                db,
                "Family Picnic Support Crew",
                now + timedelta(days=19, hours=1),
                now + timedelta(days=19, hours=5),
                "Jordan Valley Park",
                "Welcome families, guide activity stations, and help make the picnic calm and inclusive.",
            ),
            upsert_activity(
                db,
                "Creative Arts Showcase Prep",
                now + timedelta(days=27, hours=2),
                now + timedelta(days=27, hours=5),
                "Love 21 Studio",
                "Prepare display boards and support members as they choose artwork for the showcase.",
            ),
        ]
        ensure_signup(db, supporter_user, activities[0], "attended")
        ensure_signup(db, supporter_user, activities[1], "signed_up")
        ensure_signup(db, supporter_user, activities[2], "signed_up")
        ensure_hour(db, supporter_user, activities[0], 2.5, "Supported Saturday sports stations")
        ensure_hour(db, supporter_user, None, 1.0, "Manual log: helped prepare family resource packs")
        ensure_donation(
            db,
            supporter_user,
            seeded_support_opportunities[0],
            500,
            "monthly",
            "seed_monthly_support_500",
        )
        ensure_donation(
            db,
            supporter_user,
            seeded_support_opportunities[1],
            1000,
            "one_time",
            "seed_support_1000",
        )

        ensure_volunteer_registration(db, member_user, seeded_volunteer_activities[0], "registered")
        ensure_volunteer_registration(db, member_user, seeded_volunteer_activities[1], "registered")
        ensure_volunteer_registration(db, supporter_user, seeded_volunteer_activities[2], "registered")

    print("Seeded demo users:")
    for email, role in DEMO_USERS:
        print(f"- {role.value}: {email} / {DEMO_PASSWORD}")
    print(
        "Generated records: "
        f"{VOLUNTEER_ACTIVITY_COUNT} volunteer activities + "
        f"{SUPPORT_OPPORTUNITY_COUNT} support opportunities + "
        f"{NEWSLETTER_SUBSCRIBER_COUNT} newsletter subscribers = "
        f"{VOLUNTEER_ACTIVITY_COUNT + SUPPORT_OPPORTUNITY_COUNT + NEWSLETTER_SUBSCRIBER_COUNT} total"
    )
    print("Progress spread includes near-0%, early traction, momentum, and near-complete support opportunities.")
    print(MOCK_CHECKOUT_NOTE)


if __name__ == "__main__":
    run()
