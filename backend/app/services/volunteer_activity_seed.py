"""Seed public volunteer activities and demo registrations."""

from sqlalchemy import func, select

from app.data.volunteer_activity_seed import VOLUNTEER_ACTIVITY_SEED
from app.db import SessionLocal
from app.models.user import User
from app.models.volunteer_activity import VolunteerActivity, VolunteerActivityRegistration


DEMO_REGISTRATION_EMAILS = ("supporter@love21.demo", "member@love21.demo")
DEMO_REGISTRATION_SLUGS = ("football-basketball", "cooking-workshop")


def ensure_volunteer_activity_demo_data() -> None:
    with SessionLocal() as db:
        count = db.scalar(select(func.count()).select_from(VolunteerActivity)) or 0
        if count == 0:
            db.add_all([VolunteerActivity(**entry) for entry in VOLUNTEER_ACTIVITY_SEED])
            db.commit()

        for email, slug in zip(DEMO_REGISTRATION_EMAILS, DEMO_REGISTRATION_SLUGS, strict=False):
            user = db.scalar(select(User).where(User.email == email))
            activity = db.scalar(select(VolunteerActivity).where(VolunteerActivity.slug == slug))
            if user is None or activity is None:
                continue

            registration = db.scalar(
                select(VolunteerActivityRegistration).where(
                    VolunteerActivityRegistration.user_id == user.id,
                    VolunteerActivityRegistration.activity_id == activity.id,
                )
            )
            if registration is None:
                db.add(
                    VolunteerActivityRegistration(
                        user_id=user.id,
                        activity_id=activity.id,
                        activity_slug=activity.slug,
                        activity_name=activity.title,
                        status="registered",
                    )
                )
            else:
                registration.activity_slug = activity.slug
                registration.activity_name = activity.title
                registration.status = "registered"
        db.commit()
