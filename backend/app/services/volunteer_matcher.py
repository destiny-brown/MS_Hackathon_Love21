from __future__ import annotations

from typing import Literal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.volunteer_activity import VolunteerActivity

Interest = Literal["hands-on", "food", "people", "skills"]
Availability = Literal["weekday-am", "weekday-pm", "weekend-am", "flexible"]
Commitment = Literal["one-off", "weekly", "long-term"]
GroupSize = Literal["solo", "friend", "team"]

INTEREST_OPTIONS = {
    "hands-on": {"label": "Hands-on & active", "category": "sport"},
    "food": {"label": "Food & wellbeing", "category": "nutrition"},
    "people": {"label": "People & connection", "category": "family"},
    "skills": {"label": "My professional skills", "category": "csr"},
}

AVAILABILITY_OPTIONS = {
    "weekday-am": ["weekday mornings", "weekday morning"],
    "weekday-pm": ["weekday afternoons", "weekday afternoon", "wednesday evenings", "wednesday evening"],
    "weekend-am": ["saturday mornings", "saturday morning", "sunday mornings", "sunday morning"],
    "flexible": ["flexible", "varies", "one sunday a month", "occasional", "weekly, your schedule", "book a date"],
}

COMMITMENT_KEYWORDS: dict[Commitment, tuple[str, ...]] = {
    "one-off": ("occasional", "book a date", "one sunday"),
    "weekly": ("saturday", "sunday", "wednesday", "weekly"),
    "long-term": ("flexible", "varies", "your schedule", "remote"),
}

GROUP_SIZE_ROLE_HINTS: dict[GroupSize, tuple[str, ...]] = {
    "solo": (),
    "friend": ("community-dinners", "mentorship-buddy"),
    "team": ("corporate-day",),
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


def _schedule_text(activity: VolunteerActivity) -> str:
    return f"{activity.schedule_label} {activity.note or ''}".lower()


def _availability_matches(activity: VolunteerActivity, availability: Availability) -> bool:
    schedule = _schedule_text(activity)
    return any(keyword in schedule for keyword in AVAILABILITY_OPTIONS[availability])


def _commitment_matches(activity: VolunteerActivity, commitment: Commitment) -> bool:
    schedule = _schedule_text(activity)
    return any(keyword in schedule for keyword in COMMITMENT_KEYWORDS[commitment])


def _open_spots(activity: VolunteerActivity) -> int | None:
    if activity.total_spots is None or activity.filled_count is None:
        return None
    return max(activity.total_spots - activity.filled_count, 0)


def match_volunteer_with_rules(
    db: Session,
    interest: Interest,
    availability: Availability,
    commitment: Commitment,
    group_size: GroupSize,
    limit: int = 2,
) -> list[dict]:
    activities = load_active_activities(db)
    if not activities:
        return []

    preferred_category = INTEREST_OPTIONS[interest]["category"]
    group_hints = GROUP_SIZE_ROLE_HINTS[group_size]
    scored: list[tuple[int, VolunteerActivity, list[str]]] = []

    for activity in activities:
        score = 0
        reasons: list[str] = []

        if activity.category == preferred_category:
            score += 40
            reasons.append(f"Matches your interest in {INTEREST_OPTIONS[interest]['label'].lower()}")
        elif activity.category in {"sport", "nutrition", "family", "csr"}:
            score += 12

        if _availability_matches(activity, availability):
            score += 25
            reasons.append(f"Fits your {AVAILABILITY_OPTIONS[availability][0]} availability")

        if _commitment_matches(activity, commitment):
            score += 15
            reasons.append("Lines up with how often you can commit")

        if activity.slug in group_hints:
            score += 18
            if group_size == "team":
                reasons.append("Works well for a team or corporate group")
            elif group_size == "friend":
                reasons.append("Welcomes pairs or small groups")

        open_spots = _open_spots(activity)
        if open_spots is not None and open_spots > 0:
            score += min(8, open_spots)
            if open_spots <= 3:
                reasons.append("Only a few spots left — great time to join")

        if not reasons:
            reasons.append("Open role at Love 21 with room for new volunteers")

        score = min(max(score, 55), 96)
        scored.append((score, activity, reasons[:3]))

    scored.sort(
        key=lambda entry: (-entry[0], -(_open_spots(entry[1]) or 0), entry[1].display_order),
    )

    matches: list[dict] = []
    for score, activity, reasons in scored[:limit]:
        item = activity_to_dict(activity)
        item["score"] = score
        item["reasons"] = reasons
        matches.append(item)

    return matches
