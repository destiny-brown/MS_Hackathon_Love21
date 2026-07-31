from __future__ import annotations

from typing import Literal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.volunteer_activity import VolunteerActivity

Category = Literal["sport", "nutrition", "family", "csr"]
Interest = Literal["hands-on", "food", "people", "skills"]
Availability = Literal["weekday-am", "weekday-pm", "weekend-am", "flexible"]

INTEREST_OPTIONS: dict[Interest, dict[str, str | Category]] = {
    "hands-on": {"label": "Hands-on & active", "category": "sport"},
    "food": {"label": "Food & wellbeing", "category": "nutrition"},
    "people": {"label": "People & connection", "category": "family"},
    "skills": {"label": "My professional skills", "category": "csr"},
}

AVAILABILITY_OPTIONS: dict[Availability, list[str]] = {
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


def score_activity(activity: VolunteerActivity, interest: Interest, availability: Availability) -> tuple[int, list[str]]:
    score = 52
    reasons: list[str] = []
    interest_meta = INTEREST_OPTIONS[interest]
    avail_meta = AVAILABILITY_OPTIONS[availability]

    if activity.category == interest_meta["category"]:
        score += 26
        reasons.append(
            f'You\'re drawn to "{str(interest_meta["label"]).lower()}" — this role sits right in that pillar.'
        )

    when_lower = activity.schedule_label.lower()
    if any(keyword in when_lower for keyword in avail_meta):
        score += 16
        reasons.append(f"The timing ({activity.schedule_label}) lines up with when you said you're free.")

    if activity.total_spots and activity.filled_count is not None:
        open_ratio = 1 - activity.filled_count / activity.total_spots
        if open_ratio > 0.4:
            score += 6
            reasons.append("Plenty of open spots — you'd start right away, no waitlist.")

    if not reasons:
        reasons.append("It's a role with open capacity right now across a pillar close to what you picked.")

    return min(score, 98), reasons


def match_activities(db: Session, interest: Interest, availability: Availability, limit: int = 2) -> list[dict]:
    activities = db.scalars(
        select(VolunteerActivity)
        .where(VolunteerActivity.status == "active")
        .order_by(VolunteerActivity.display_order)
    ).all()
    scored: list[dict] = []

    for activity in activities:
        score, reasons = score_activity(activity, interest, availability)
        match = activity_to_dict(activity)
        match["score"] = score
        match["reasons"] = reasons
        scored.append(match)

    scored.sort(key=lambda item: item["score"], reverse=True)
    return scored[:limit]
