import pytest
from sqlalchemy import select

from app.data.volunteer_activity_seed import VOLUNTEER_ACTIVITY_SEED
from app.db import SessionLocal, create_db_and_tables, ensure_demo_users
from app.models.volunteer_activity import VolunteerActivity


@pytest.fixture(autouse=True)
def seed_volunteer_activities():
    create_db_and_tables()
    ensure_demo_users()
    with SessionLocal() as db:
        existing = db.scalar(select(VolunteerActivity.id).limit(1))
        if existing is None:
            db.add_all([VolunteerActivity(**entry) for entry in VOLUNTEER_ACTIVITY_SEED])
            db.commit()
    yield
