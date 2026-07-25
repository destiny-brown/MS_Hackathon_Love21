from sqlalchemy import select

from app.core.security import hash_password
from app.db import SessionLocal, create_db_and_tables
from app.models.item import Item
from app.models.user import User

DEMO_EMAIL = "demo@demo.com"
DEMO_PASSWORD = "demo1234"


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

    print(f"Seeded demo admin: {DEMO_EMAIL} / {DEMO_PASSWORD}")


if __name__ == "__main__":
    run()
