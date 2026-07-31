from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.volunteer_activity import VolunteerActivity

INTEREST_OPTIONS = {
    "hands-on": {"label": "Hands-on & active", "category": "sport"},
    "food": {"label": "Food & wellbeing", "category": "nutrition"},
    "people": {"label": "People & connection", "category": "family"},
    "skills": {"label": "My professional skills", "category": "csr"},
}

AVAILABILITY_OPTIONS = {
    "weekday-am": ["weekday mornings"],
    "weekday-pm": ["weekday afternoons", "wednesday evenings"],
    "weekend-am": ["saturday mornings", "sunday mornings"],
    "flexible": ["flexible", "varies", "one sunday a month", "occasional", "weekly, your schedule"],
}


def activity_to_dict(activity: VolunteerActivity) -> dict:
    return {
        "role_id": activity.slug,
        "icon": activity.icon,
        "title": activity.title,
        "desc": activity.description,
        "when": activity.schedule_label,
        "where": activity.location_label,
        "category": activity.category,
        "filled": activity.filled_count,
        "total": activity.total_spots,
        "note": activity.note,
        "cta_label": activity.cta_label,
    }


def load_active_activities(db: Session) -> list[VolunteerActivity]:
    return list(
        db.scalars(
            select(VolunteerActivity)
            .where(VolunteerActivity.status == "active")
            .order_by(VolunteerActivity.display_order)
        ).all()
    )
