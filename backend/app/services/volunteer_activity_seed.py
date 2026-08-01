"""Seed public volunteer activities when the table is empty."""

from sqlalchemy import func, select

from app.data.volunteer_activity_seed import VOLUNTEER_ACTIVITY_SEED
from app.db import SessionLocal
from app.models.volunteer_activity import VolunteerActivity


def ensure_volunteer_activity_demo_data() -> None:
    with SessionLocal() as db:
        count = db.scalar(select(func.count()).select_from(VolunteerActivity)) or 0
        if count > 0:
            return

        db.add_all([VolunteerActivity(**entry) for entry in VOLUNTEER_ACTIVITY_SEED])
        db.commit()
