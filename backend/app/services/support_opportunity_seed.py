"""Seed support opportunities (campaigns, causes, wishlist) when the table is empty."""

from sqlalchemy import func, select

from app.db import SessionLocal
from app.models.support_opportunity import SupportOpportunity

PLACEHOLDER_IMAGES = {
    "sports": "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80",
    "nutrition": "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80",
    "learning": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    "family": "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=80",
    "transport": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=80",
    "art": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80",
}

SUPPORT_OPPORTUNITY_SEED: list[dict] = [
    {
        "slug": "beyond-limits-banquet",
        "kind": "campaign",
        "title": "Beyond Limits Banquet",
        "description": (
            "Help bring Hong Kong together to celebrate the talent, confidence, and achievements "
            "of Love 21 members."
        ),
        "impact_statement": "Your support helps create more stages where every ability can be seen.",
        "image_url": PLACEHOLDER_IMAGES["family"],
        "target_amount_hkd": 250000,
        "funded_amount_hkd": 180000,
        "display_order": 10,
        "status": "active",
    },
    {
        "slug": "movement-builds-confidence",
        "kind": "cause",
        "title": "Movement Builds Confidence",
        "description": (
            "Back inclusive sport where members build strength, teamwork, and the confidence "
            "to pursue ambitious goals."
        ),
        "impact_statement": "HKD 500 supports one sport session for 12 Love 21 members.",
        "image_url": PLACEHOLDER_IMAGES["sports"],
        "target_amount_hkd": 80000,
        "funded_amount_hkd": 44800,
        "display_order": 20,
        "status": "active",
    },
    {
        "slug": "skills-open-doors",
        "kind": "cause",
        "title": "Skills Open Doors",
        "description": (
            "Support employment training that gives members opportunities to demonstrate their "
            "skills, reliability, and potential."
        ),
        "impact_statement": "HKD 100 supports two hours of employment training for one member.",
        "image_url": PLACEHOLDER_IMAGES["learning"],
        "target_amount_hkd": 60000,
        "funded_amount_hkd": 24600,
        "display_order": 30,
        "status": "active",
    },
    {
        "slug": "families-grow-together",
        "kind": "cause",
        "title": "Families Grow Together",
        "description": (
            "Strengthen the family networks that help members make choices, take ownership, and "
            "thrive in their communities."
        ),
        "impact_statement": "HKD 1,000 provides two counselling sessions for a Love 21 family.",
        "image_url": PLACEHOLDER_IMAGES["family"],
        "target_amount_hkd": 100000,
        "funded_amount_hkd": 41000,
        "display_order": 40,
        "status": "active",
    },
    {
        "slug": "athlete-training-kits",
        "kind": "wishlist",
        "title": "Athlete Training Kits",
        "description": (
            "Kits give members dependable equipment for practising skills and reaching their next sporting milestone."
        ),
        "impact_statement": "HKD 600 funds one reusable training kit for weekly sport sessions.",
        "image_url": PLACEHOLDER_IMAGES["sports"],
        "target_amount_hkd": 12000,
        "funded_amount_hkd": 3600,
        "quantity_needed": 20,
        "quantity_secured": 6,
        "display_order": 50,
        "status": "active",
    },
    {
        "slug": "nutrition-workshop-equipment",
        "kind": "wishlist",
        "title": "Nutrition Workshop Equipment",
        "description": (
            "Practical equipment helps members and families turn nutrition knowledge into confident everyday choices."
        ),
        "impact_statement": "HKD 1,500 equips one hands-on nutrition station.",
        "image_url": PLACEHOLDER_IMAGES["nutrition"],
        "target_amount_hkd": 18000,
        "funded_amount_hkd": 4500,
        "quantity_needed": 12,
        "quantity_secured": 3,
        "display_order": 60,
        "status": "active",
    },
    {
        "slug": "creative-learning-tablets",
        "kind": "wishlist",
        "title": "Creative Learning Tablets",
        "description": (
            "Shared tablets expand how members communicate, create, learn, and show what they know."
        ),
        "impact_statement": "HKD 4,000 funds one shared accessibility-friendly tablet.",
        "image_url": PLACEHOLDER_IMAGES["learning"],
        "target_amount_hkd": 24000,
        "funded_amount_hkd": 8000,
        "quantity_needed": 6,
        "quantity_secured": 2,
        "display_order": 70,
        "status": "active",
    },
    {
        "slug": "family-day-transport",
        "kind": "wishlist",
        "title": "Family Day Transport",
        "description": (
            "Accessible transport helps families join community activities without cost becoming the barrier."
        ),
        "impact_statement": "HKD 2,000 covers an accessible coach for one family day route.",
        "image_url": PLACEHOLDER_IMAGES["transport"],
        "target_amount_hkd": 20000,
        "funded_amount_hkd": 9200,
        "quantity_needed": 10,
        "quantity_secured": 4,
        "display_order": 80,
        "status": "active",
    },
    {
        "slug": "art-studio-supplies",
        "kind": "wishlist",
        "title": "Art Studio Supplies",
        "description": (
            "Quality supplies help members explore identity, communication, and confidence through art."
        ),
        "impact_statement": "HKD 300 fills one art box for a member-led creative session.",
        "image_url": PLACEHOLDER_IMAGES["art"],
        "target_amount_hkd": 9000,
        "funded_amount_hkd": 3900,
        "quantity_needed": 30,
        "quantity_secured": 13,
        "display_order": 90,
        "status": "active",
    },
]


def ensure_support_opportunities() -> None:
    with SessionLocal() as db:
        count = db.scalar(select(func.count()).select_from(SupportOpportunity)) or 0
        if count > 0:
            return

        for item in SUPPORT_OPPORTUNITY_SEED:
            db.add(
                SupportOpportunity(
                    slug=item["slug"],
                    kind=item["kind"],
                    title=item["title"],
                    description=item["description"],
                    impact_statement=item["impact_statement"],
                    image_url=item["image_url"],
                    target_amount_hkd=item["target_amount_hkd"],
                    funded_amount_hkd=item["funded_amount_hkd"],
                    moonclerk_url=None,
                    purchase_url=item.get("purchase_url"),
                    quantity_needed=item.get("quantity_needed"),
                    quantity_secured=item.get("quantity_secured"),
                    status=item["status"],
                    display_order=item["display_order"],
                )
            )

        db.commit()
