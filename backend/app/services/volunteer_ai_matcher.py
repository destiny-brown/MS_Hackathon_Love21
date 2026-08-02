from __future__ import annotations

import json
from typing import Literal

from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models.volunteer_activity import VolunteerActivity
from app.services.model_client import chat_json
from app.services.volunteer_matcher import (
    AVAILABILITY_OPTIONS,
    INTEREST_OPTIONS,
    activity_to_dict,
    load_active_activities,
)

Interest = Literal["hands-on", "food", "people", "skills"]
Availability = Literal["weekday-am", "weekday-pm", "weekend-am", "flexible"]
Commitment = Literal["one-off", "weekly", "long-term"]
GroupSize = Literal["solo", "friend", "team"]

COMMITMENT_LABELS: dict[Commitment, str] = {
    "one-off": "One-off or occasional — a single date, not a standing slot",
    "weekly": "A regular weekly slot — same day, most weeks",
    "long-term": "Flexible and ongoing — show up on their own schedule, long-term",
}

GROUP_SIZE_LABELS: dict[GroupSize, str] = {
    "solo": "Just me — happy to volunteer alone",
    "friend": "With a friend — roles that welcome pairs or small groups",
    "team": "As a team or corporate group — bring colleagues along",
}

AVAILABILITY_LABELS: dict[Availability, str] = {
    "weekday-am": "Weekday mornings",
    "weekday-pm": "Weekday afternoons/evenings",
    "weekend-am": "Weekend mornings",
    "flexible": "Flexible — availability varies",
}


def _load_active_activities(db: Session) -> list[VolunteerActivity]:
    return load_active_activities(db)


def _build_catalog(activities: list[VolunteerActivity]) -> list[dict]:
    catalog = []
    for activity in activities:
        item = activity_to_dict(activity)
        catalog.append(
            {
                "role_id": item["role_id"],
                "title": item["title"],
                "description": item["desc"],
                "when": item["when"],
                "where": item["where"],
                "category": item["category"],
                "filled": item.get("filled"),
                "total": item.get("total"),
                "note": item.get("note"),
            }
        )
    return catalog


def _parse_ai_matches(raw: dict, activities_by_id: dict[str, VolunteerActivity], limit: int = 2) -> list[dict]:
    matches: list[dict] = []
    for item in raw.get("matches", []):
        if not isinstance(item, dict):
            continue

        role_id = str(item.get("role_id", "")).strip()
        activity = activities_by_id.get(role_id)
        if not activity:
            continue

        try:
            score = int(item.get("score", 0))
        except (TypeError, ValueError):
            score = 0
        score = max(0, min(score, 100))

        reasons = [str(reason).strip() for reason in item.get("reasons", []) if str(reason).strip()]
        if not reasons:
            continue

        match = activity_to_dict(activity)
        match["score"] = score
        match["reasons"] = reasons[:3]
        matches.append(match)

    matches.sort(key=lambda entry: entry["score"], reverse=True)
    return matches[:limit]


def match_volunteer_with_ai(
    db: Session,
    interest: Interest,
    availability: Availability,
    commitment: Commitment,
    group_size: GroupSize,
    limit: int = 2,
) -> tuple[list[dict] | None, str | None]:
    settings = get_settings()
    if not settings.model_enabled:
        return None, "AI matching is disabled. Set MODEL_ENABLED=true in backend/.env."

    activities = _load_active_activities(db)
    if not activities:
        return None, "No volunteer activities in the database yet. Run: python seed.py"

    catalog = _build_catalog(activities)
    activities_by_id = {activity.slug: activity for activity in activities}

    volunteer_profile = {
        "interest": str(INTEREST_OPTIONS[interest]["label"]),
        "availability": AVAILABILITY_LABELS[availability],
        "commitment": COMMITMENT_LABELS[commitment],
        "group_size": GROUP_SIZE_LABELS[group_size],
    }

    system = (
        "You are Love 21 Foundation's volunteer matching assistant. "
        "Pick the best open volunteer roles for each person using ability-first, warm, inclusive language. "
        "Only choose role_id values from the provided catalog. "
        "Prefer roles with open capacity when timing and interests are similar. "
        'Return JSON only: {"matches":[{"role_id":"...","score":0-100,"reasons":["...","..."]}]} '
        f"Return exactly {limit} matches, sorted from best to second-best."
    )
    user = (
        "Match this volunteer to the best roles.\n\n"
        f"Volunteer profile:\n{json.dumps(volunteer_profile, indent=2)}\n\n"
        f"Open roles catalog:\n{json.dumps(catalog, indent=2)}"
    )

    # Volunteer matching should fall back to rules quickly if Modal is cold or slow.
    parsed = chat_json(system=system, user=user, max_attempts=3)
    if not parsed:
        return None, f"The hosted `{settings.model_name}` model is unavailable. Please try again shortly."

    matches = _parse_ai_matches(parsed, activities_by_id, limit=limit)
    if not matches:
        return None, "AI matching could not find suitable roles. Please try again."

    return matches, None
