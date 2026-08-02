from __future__ import annotations

import json

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models.user import User
from app.models.volunteer_activity import VolunteerActivity, VolunteerActivityRegistration
from app.services.activity_recommendations import build_volunteer_history
from app.services.model_client import chat_json
from app.services.volunteer_matcher import activity_to_dict, load_active_activities


def _fallback_matches(
    activities: list[VolunteerActivity],
    history: dict[str, list[str]],
    *,
    limit: int = 3,
) -> tuple[str, list[dict]]:
    has_history = bool(history["volunteer_roles"] or history["signed_up_events"])
    headline = (
        "Based on programmes you have joined, here are volunteer roles to explore"
        if has_history
        else "Volunteer roles you might enjoy at Love 21"
    )

    past_text = " ".join(history["volunteer_roles"] + history["signed_up_events"]).lower()
    scored: list[tuple[int, VolunteerActivity, list[str]]] = []

    for activity in activities:
        item = activity_to_dict(activity)
        haystack = f"{item['title']} {item['desc']} {item['where']} {item['category']}".lower()
        overlap = sum(1 for token in past_text.split() if len(token) > 3 and token in haystack)
        reasons = []
        if overlap > 0:
            reasons.append("Builds on programmes you already take part in")
        if activity.category and activity.category.lower() in past_text:
            reasons.append(f"Fits your interest in {activity.category} activities")
        if not reasons:
            reasons.append("Open role with room for new members")
        score = min(95, 66 + overlap * 10)
        scored.append((score, activity, reasons[:2]))

    scored.sort(key=lambda entry: entry[0], reverse=True)
    matches = []
    for score, activity, reasons in scored[:limit]:
        item = activity_to_dict(activity)
        matches.append({**item, "score": score, "reasons": reasons, "signed_up": False})
    return headline, matches


def recommend_volunteer_roles_for_user(
    db: Session,
    user: User,
    *,
    limit: int = 3,
) -> tuple[str, list[dict], bool, str | None]:
    registered_slugs = set(
        db.scalars(
            select(VolunteerActivityRegistration.activity_slug).where(
                VolunteerActivityRegistration.user_id == user.id,
                VolunteerActivityRegistration.status != "cancelled",
            )
        ).all()
    )
    candidates = [item for item in load_active_activities(db) if item.slug not in registered_slugs]
    if not candidates:
        return "You are registered for all open roles", [], False, None

    history = build_volunteer_history(db, user.id)
    settings = get_settings()

    if not settings.model_enabled:
        headline, matches = _fallback_matches(candidates, history, limit=limit)
        return headline, matches, False, None

    catalog = [activity_to_dict(activity) for activity in candidates]
    activities_by_slug = {activity.slug: activity for activity in candidates}

    system = (
        "You recommend Love 21 Foundation volunteer roles for a member based on their activity history. "
        "Only choose role_id values from the catalog. Use warm, inclusive language. "
        'Return JSON only: {"headline":"...","matches":[{"role_id":"...","score":0-100,"reasons":["..."]}]} '
        f"Return up to {limit} matches."
    )
    user_prompt = (
        "Recommend volunteer roles for this member.\n\n"
        f"History:\n{json.dumps(history, indent=2)}\n\n"
        f"Open roles:\n{json.dumps(catalog, indent=2)}"
    )

    parsed = chat_json(system=system, user=user_prompt, num_predict=650, max_attempts=3)
    if not parsed:
        headline, matches = _fallback_matches(candidates, history, limit=limit)
        return headline, matches, False, None

    headline = str(parsed.get("headline", "")).strip() or "Roles picked for you"
    matches: list[dict] = []
    for item in parsed.get("matches", []):
        if not isinstance(item, dict):
            continue
        role_id = str(item.get("role_id", "")).strip()
        activity = activities_by_slug.get(role_id)
        if not activity:
            continue
        try:
            score = max(0, min(int(item.get("score", 0)), 100))
        except (TypeError, ValueError):
            score = 0
        reasons = [str(reason).strip() for reason in item.get("reasons", []) if str(reason).strip()]
        if not reasons:
            continue
        matches.append({**activity_to_dict(activity), "score": score, "reasons": reasons[:3], "signed_up": False})

    if not matches:
        headline, matches = _fallback_matches(candidates, history, limit=limit)
        return headline, matches, False, None

    matches.sort(key=lambda entry: entry["score"], reverse=True)
    return headline, matches[:limit], True, None
