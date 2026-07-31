from sqlalchemy import select

from app.core.security import hash_password
from app.data.volunteer_activity_seed import VOLUNTEER_ACTIVITY_SEED
from app.db import SessionLocal, create_db_and_tables
from app.models.item import Item
from app.models.support_opportunity import SupportOpportunity
from app.models.user import User
from app.models.volunteer_activity import VolunteerActivity

DEMO_EMAIL = "demo@demo.com"
DEMO_PASSWORD = "demo1234"
MOONCLERK_URL = "https://app.moonclerk.com/pay/2805gcehxjca"


def run() -> None:
    create_db_and_tables()
    with SessionLocal() as db:
        user = db.scalar(select(User).where(User.email == DEMO_EMAIL))
        if user is None:
            user = User(email=DEMO_EMAIL, hashed_password=hash_password(DEMO_PASSWORD), role="admin")
            db.add(user)
            db.commit()
            db.refresh(user)

        existing_items = db.scalars(select(Item).where(Item.owner_id == user.id)).all()
        if not existing_items:
            db.add_all(
                [
                    Item(title="Pitch deck", description="Draft the 5-slide demo story.", owner_id=user.id),
                    Item(title="Judge flow", description="Practice login → create item → AI ask.", owner_id=user.id),
                    Item(title="Stretch goal", description="Copy Item into the real feature.", owner_id=user.id),
                ]
            )
            db.commit()

        existing_opportunity = db.scalar(select(SupportOpportunity.id).limit(1))
        if existing_opportunity is None:
            db.add_all(
                [
                    SupportOpportunity(
                        slug="beyond-limits-banquet",
                        kind="campaign",
                        title="Beyond Limits Banquet",
                        description=(
                            "Help bring Hong Kong together to celebrate the talent, confidence, and achievements "
                            "of Love 21 members."
                        ),
                        impact_statement="Your support helps create more stages where every ability can be seen.",
                        target_amount_hkd=250000,
                        funded_amount_hkd=180000,
                        moonclerk_url=MOONCLERK_URL,
                        display_order=10,
                    ),
                    SupportOpportunity(
                        slug="movement-builds-confidence",
                        kind="cause",
                        title="Movement Builds Confidence",
                        description=(
                            "Back inclusive sport where members build strength, teamwork, and the confidence "
                            "to pursue ambitious goals."
                        ),
                        impact_statement="HKD 500 supports one sport session for 12 Love 21 members.",
                        target_amount_hkd=80000,
                        funded_amount_hkd=44800,
                        moonclerk_url=MOONCLERK_URL,
                        display_order=20,
                    ),
                    SupportOpportunity(
                        slug="skills-open-doors",
                        kind="cause",
                        title="Skills Open Doors",
                        description=(
                            "Support employment training that gives members opportunities to demonstrate their "
                            "skills, reliability, and potential."
                        ),
                        impact_statement="HKD 100 supports two hours of employment training for one member.",
                        target_amount_hkd=60000,
                        funded_amount_hkd=24600,
                        moonclerk_url=MOONCLERK_URL,
                        display_order=30,
                    ),
                    SupportOpportunity(
                        slug="families-grow-together",
                        kind="cause",
                        title="Families Grow Together",
                        description=(
                            "Strengthen the family networks that help members make choices, take ownership, and "
                            "thrive in their communities."
                        ),
                        impact_statement="HKD 1,000 provides two counselling sessions for a Love 21 family.",
                        target_amount_hkd=100000,
                        funded_amount_hkd=41000,
                        moonclerk_url=MOONCLERK_URL,
                        display_order=40,
                    ),
                    SupportOpportunity(
                        slug="athlete-training-kits",
                        kind="wishlist",
                        title="Athlete Training Kits",
                        description=(
                            "Training kits give members dependable equipment for practising skills and reaching "
                            "their next sporting milestone."
                        ),
                        impact_statement="Fund or purchase a kit that members can use across weekly sport sessions.",
                        target_amount_hkd=12000,
                        funded_amount_hkd=3600,
                        quantity_needed=20,
                        quantity_secured=6,
                        moonclerk_url=MOONCLERK_URL,
                        display_order=50,
                    ),
                    SupportOpportunity(
                        slug="nutrition-workshop-equipment",
                        kind="wishlist",
                        title="Nutrition Workshop Equipment",
                        description=(
                            "Practical workshop equipment helps members and families turn nutrition knowledge "
                            "into confident everyday choices."
                        ),
                        impact_statement="Contribute toward reusable equipment for hands-on nutrition workshops.",
                        target_amount_hkd=18000,
                        funded_amount_hkd=4500,
                        quantity_needed=12,
                        quantity_secured=3,
                        moonclerk_url=MOONCLERK_URL,
                        display_order=60,
                    ),
                    SupportOpportunity(
                        slug="creative-learning-tablets",
                        kind="wishlist",
                        title="Creative Learning Tablets",
                        description=(
                            "Shared tablets expand how members communicate, create, learn, and show what they know."
                        ),
                        impact_statement="Help equip accessible learning and creative sessions at Love 21 Space.",
                        target_amount_hkd=24000,
                        funded_amount_hkd=8000,
                        quantity_needed=6,
                        quantity_secured=2,
                        moonclerk_url=MOONCLERK_URL,
                        display_order=70,
                    ),
                ]
            )
            db.commit()

        existing_activity = db.scalar(select(VolunteerActivity.id).limit(1))
        if existing_activity is None:
            db.add_all([VolunteerActivity(**entry) for entry in VOLUNTEER_ACTIVITY_SEED])
            db.commit()

    print(f"Seeded demo admin: {DEMO_EMAIL} / {DEMO_PASSWORD}")


if __name__ == "__main__":
    run()
