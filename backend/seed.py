from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.db import SessionLocal, create_db_and_tables
from app.models.activity import Activity, ActivitySignup, VolunteerHour
from app.models.donation import Donation
from app.models.gratitude_entry import GratitudeEntry, GratitudeEntryStatus
from app.models.item import Item
from app.models.support_opportunity import SupportOpportunity
from app.models.user import Role, User

DEMO_PASSWORD = "demo1234"
DEMO_USERS = [
    ("admin@love21.demo", Role.ADMIN),
    ("member@love21.demo", Role.MEMBER),
    ("supporter@love21.demo", Role.SUPPORTER),
]
MOCK_CHECKOUT_NOTE = "Mocked checkout records donations locally for the demo."


PLACEHOLDER_IMAGES = {
    "sports": "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80",
    "nutrition": "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80",
    "learning": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    "family": "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=80",
    "transport": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=80",
    "art": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80",
}


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
    opportunity.funded_amount_hkd += amount
    db.commit()


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

        campaign = upsert_opportunity(
            db,
            slug="beyond-limits-banquet",
            kind="campaign",
            title="Beyond Limits Banquet",
            description=(
                "Help bring Hong Kong together to celebrate the talent, confidence, and achievements "
                "of Love 21 members."
            ),
            impact_statement="Your support helps create more stages where every ability can be seen.",
            image_url=PLACEHOLDER_IMAGES["family"],
            target_amount_hkd=250000,
            funded_amount_hkd=180000,
            display_order=10,
        )
        movement = upsert_opportunity(
            db,
            slug="movement-builds-confidence",
            kind="cause",
            title="Movement Builds Confidence",
            description=(
                "Back inclusive sport where members build strength, teamwork, and the confidence "
                "to pursue ambitious goals."
            ),
            impact_statement="HKD 500 supports one sport session for 12 Love 21 members.",
            image_url=PLACEHOLDER_IMAGES["sports"],
            target_amount_hkd=80000,
            funded_amount_hkd=44800,
            display_order=20,
        )
        upsert_opportunity(
            db,
            slug="skills-open-doors",
            kind="cause",
            title="Skills Open Doors",
            description=(
                "Support employment training that gives members opportunities to demonstrate their "
                "skills, reliability, and potential."
            ),
            impact_statement="HKD 100 supports two hours of employment training for one member.",
            image_url=PLACEHOLDER_IMAGES["learning"],
            target_amount_hkd=60000,
            funded_amount_hkd=24600,
            display_order=30,
        )
        upsert_opportunity(
            db,
            slug="families-grow-together",
            kind="cause",
            title="Families Grow Together",
            description=(
                "Strengthen the family networks that help members make choices, take ownership, and "
                "thrive in their communities."
            ),
            impact_statement="HKD 1,000 provides two counselling sessions for a Love 21 family.",
            image_url=PLACEHOLDER_IMAGES["family"],
            target_amount_hkd=100000,
            funded_amount_hkd=41000,
            display_order=40,
        )

        wishlist_items = [
            {
                "slug": "athlete-training-kits",
                "title": "Athlete Training Kits",
                "description": "Placeholder image — swap for real Love 21 sports-session photos. Kits give members dependable equipment for practising skills and reaching their next sporting milestone.",
                "impact_statement": "HKD 600 funds one reusable training kit for weekly sport sessions.",
                "image_url": PLACEHOLDER_IMAGES["sports"],
                "target_amount_hkd": 12000,
                "funded_amount_hkd": 3600,
                "quantity_needed": 20,
                "quantity_secured": 6,
                "display_order": 50,
            },
            {
                "slug": "nutrition-workshop-equipment",
                "title": "Nutrition Workshop Equipment",
                "description": "Placeholder image — swap for real workshop photos. Practical equipment helps members and families turn nutrition knowledge into confident everyday choices.",
                "impact_statement": "HKD 1,500 equips one hands-on nutrition station.",
                "image_url": PLACEHOLDER_IMAGES["nutrition"],
                "target_amount_hkd": 18000,
                "funded_amount_hkd": 4500,
                "quantity_needed": 12,
                "quantity_secured": 3,
                "display_order": 60,
            },
            {
                "slug": "creative-learning-tablets",
                "title": "Creative Learning Tablets",
                "description": "Placeholder image — swap for real learning-session photos. Shared tablets expand how members communicate, create, learn, and show what they know.",
                "impact_statement": "HKD 4,000 funds one shared accessibility-friendly tablet.",
                "image_url": PLACEHOLDER_IMAGES["learning"],
                "target_amount_hkd": 24000,
                "funded_amount_hkd": 8000,
                "quantity_needed": 6,
                "quantity_secured": 2,
                "display_order": 70,
            },
            {
                "slug": "family-day-transport",
                "title": "Family Day Transport",
                "description": "Placeholder image — swap for real outing photos. Accessible transport helps families join community activities without cost becoming the barrier.",
                "impact_statement": "HKD 2,000 covers an accessible coach for one family day route.",
                "image_url": PLACEHOLDER_IMAGES["transport"],
                "target_amount_hkd": 20000,
                "funded_amount_hkd": 9200,
                "quantity_needed": 10,
                "quantity_secured": 4,
                "display_order": 80,
            },
            {
                "slug": "art-studio-supplies",
                "title": "Art Studio Supplies",
                "description": "Placeholder image — swap for real creative-class photos. Quality supplies help members explore identity, communication, and confidence through art.",
                "impact_statement": "HKD 300 fills one art box for a member-led creative session.",
                "image_url": PLACEHOLDER_IMAGES["art"],
                "target_amount_hkd": 9000,
                "funded_amount_hkd": 3900,
                "quantity_needed": 30,
                "quantity_secured": 13,
                "display_order": 90,
            },
        ]
        for item in wishlist_items:
            upsert_opportunity(db, kind="wishlist", status="active", purchase_url=None, **item)

        now = datetime.now(timezone.utc)
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
        ensure_donation(db, supporter_user, movement, 500, "monthly", "seed_monthly_movement_500")
        ensure_donation(db, supporter_user, campaign, 1000, "one_time", "seed_campaign_1000")

        gratitude_entries = [
            {
                "message": "Thank you to the coaches who help our family celebrate every new skill and every brave try.",
                "display_name": "Demo Member Family",
                "status": GratitudeEntryStatus.APPROVED,
                "moderator_id": admin_user.id,
                "moderated_at": now,
            },
            {
                "message": "Love 21 gives me friends, movement, and a place to show what I can do.",
                "display_name": "A Love 21 Member",
                "status": GratitudeEntryStatus.APPROVED,
                "moderator_id": admin_user.id,
                "moderated_at": now,
            },
            {
                "message": "I want to thank the volunteers for making Saturday sports calm, fun, and welcoming.",
                "display_name": "Pending Demo Entry",
                "status": GratitudeEntryStatus.PENDING,
                "moderator_id": None,
                "moderated_at": None,
            },
            {
                "message": "Our family is grateful for nutrition workshops that turn advice into everyday confidence.",
                "display_name": "Pending Family Note",
                "status": GratitudeEntryStatus.PENDING,
                "moderator_id": None,
                "moderated_at": None,
            },
        ]
        for values in gratitude_entries:
            existing = db.scalar(
                select(GratitudeEntry).where(
                    GratitudeEntry.author_id == member_user.id,
                    GratitudeEntry.message == values["message"],
                )
            )
            if existing is None:
                db.add(GratitudeEntry(author_id=member_user.id, **values))
            else:
                for key, value in values.items():
                    setattr(existing, key, value)
        db.commit()

    print("Seeded demo users:")
    for email, role in DEMO_USERS:
        print(f"- {role.value}: {email} / {DEMO_PASSWORD}")
    print("- legacy donor/volunteer demo accounts, if present, were converted to supporter")
    print(MOCK_CHECKOUT_NOTE)


if __name__ == "__main__":
    run()
