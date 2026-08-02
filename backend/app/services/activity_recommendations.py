from __future__ import annotations

import json
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.core.config import get_settings
from app.models.activity import Activity, ActivitySignup, VolunteerHour
from app.models.user import User
from app.models.volunteer_activity import VolunteerActivityRegistration
from app.services.model_client import chat_json


def build_volunteer_history(db: Session, user_id: int) -> dict[str, list[str]]:
    signups = db.scalars(
        select(ActivitySignup)
        .where(ActivitySignup.supporter_id == user_id, ActivitySignup.status != "cancelled")
        .options(selectinload(ActivitySignup.activity))
        .order_by(ActivitySignup.created_at.desc())
        .limit(8)
    ).all()
    hours = db.scalars(
        select(VolunteerHour)
        .where(VolunteerHour.supporter_id == user_id)
        .options(selectinload(VolunteerHour.activity))
        .order_by(VolunteerHour.logged_at.desc())
        .limit(8)
    ).all()
    registrations = db.scalars(
        select(VolunteerActivityRegistration)
        .where(
            VolunteerActivityRegistration.user_id == user_id,
            VolunteerActivityRegistration.status != "cancelled",
        )
        .order_by(VolunteerActivityRegistration.created_at.desc())
        .limit(8)
    ).all()

    event_titles = [signup.activity.title for signup in signups if signup.activity]
    event_locations = [signup.activity.location for signup in signups if signup.activity]
    hour_summaries = [
        f"{entry.hours}h — {entry.activity.title if entry.activity else 'Manual log'}"
        + (f" ({entry.notes})" if entry.notes else "")
        for entry in hours
    ]
    volunteer_roles = [registration.activity_name for registration in registrations]

    return {
        "signed_up_events": event_titles,
        "event_locations": event_locations,
        "logged_hours": hour_summaries,
        "volunteer_roles": volunteer_roles,
    }


def _upcoming_activities(db: Session, *, signed_up_ids: set[int], limit: int = 12) -> list[Activity]:
    now = datetime.now(timezone.utc)
    activities = db.scalars(
        select(Activity)
        .where(Activity.starts_at >= now, Activity.status != "cancelled")
        .order_by(Activity.starts_at.asc())
    ).all()
    if not activities:
        activities = db.scalars(select(Activity).order_by(Activity.starts_at.desc()).limit(limit)).all()
    return [activity for activity in activities if activity.id not in signed_up_ids][:limit]


def _activity_catalog(activities: list[Activity]) -> list[dict[str, object]]:
    return [
        {
            "activity_id": activity.id,
            "title": activity.title,
            "starts_at": activity.starts_at.isoformat(),
            "location": activity.location,
            "description": activity.description[:280],
            "category": activity.category or "general",
        }
        for activity in activities
    ]


def _fallback_matches(activities: list[Activity], history: dict[str, list[str]], limit: int = 3) -> tuple[str, list[dict]]:
    has_history = any(history.values())
    headline = (
        "Based on your previous volunteering, here are events we think you will enjoy"
        if has_history
        else "Here are upcoming Love 21 events you can join"
    )

    past_text = " ".join(
        history["signed_up_events"]
        + history["volunteer_roles"]
        + history["logged_hours"]
    ).lower()

    scored: list[tuple[int, Activity, list[str]]] = []
    for activity in activities:
        haystack = f"{activity.title} {activity.location} {activity.description} {activity.category or ''}".lower()
        overlap = sum(1 for token in past_text.split() if len(token) > 3 and token in haystack)
        reasons = []
        if overlap > 0:
            reasons.append("Similar to activities you have supported before")
        if activity.category and activity.category.lower() in past_text:
            reasons.append(f"Matches your interest in {activity.category} programmes")
        if not reasons:
            reasons.append("Upcoming community event with open sign-up")
        score = min(95, 68 + overlap * 8)
        scored.append((score, activity, reasons[:2]))

    scored.sort(key=lambda item: item[0], reverse=True)
    matches = []
    for score, activity, reasons in scored[:limit]:
        matches.append(
            {
                "id": activity.id,
                "title": activity.title,
                "starts_at": activity.starts_at,
                "ends_at": activity.ends_at,
                "location": activity.location,
                "description": activity.description,
                "score": score,
                "reasons": reasons,
                "signed_up": False,
            }
        )
    return headline, matches


def recommend_events_for_supporter(
    db: Session,
    user: User,
    *,
    limit: int = 3,
) -> tuple[str, list[dict], bool, str | None]:
    signed_up_ids = set(
        db.scalars(
            select(ActivitySignup.activity_id).where(
                ActivitySignup.supporter_id == user.id,
                ActivitySignup.status != "cancelled",
            )
        ).all()
    )
    candidates = _upcoming_activities(db, signed_up_ids=signed_up_ids)
    if not candidates:
        return "No upcoming events right now", [], False, "Check back soon for new activities."

    history = build_volunteer_history(db, user.id)
    settings = get_settings()

    if not settings.model_enabled:
        headline, matches = _fallback_matches(candidates, history, limit=limit)
        return headline, matches, False, None

    catalog = _activity_catalog(candidates)
    system = (
        "You recommend upcoming Love 21 Foundation events for a returning supporter. "
        "Use their volunteering history to pick events they are likely to enjoy. "
        "Only choose activity_id values from the provided catalog. "
        "Write warm, ability-first reasons tied to their past involvement. "
        'Return JSON only: {"headline":"short friendly sentence","matches":[{"activity_id":1,"score":0-100,"reasons":["...","..."]}]} '
        f"Return up to {limit} matches sorted best-first."
    )
    user_prompt = (
        "Recommend events for this supporter.\n\n"
        f"Volunteering history:\n{json.dumps(history, indent=2)}\n\n"
        f"Upcoming event catalog:\n{json.dumps(catalog, indent=2)}"
    )

    parsed = chat_json(system=system, user=user_prompt, num_predict=700, max_attempts=3)
    if not parsed:
        headline, matches = _fallback_matches(candidates, history, limit=limit)
        return headline, matches, False, None

    activities_by_id = {activity.id: activity for activity in candidates}
    headline = str(parsed.get("headline", "")).strip() or "Based on your volunteering, here are events for you"
    matches: list[dict] = []

    for item in parsed.get("matches", []):
        if not isinstance(item, dict):
            continue
        try:
            activity_id = int(item.get("activity_id"))
        except (TypeError, ValueError):
            continue
        activity = activities_by_id.get(activity_id)
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
        matches.append(
            {
                "id": activity.id,
                "title": activity.title,
                "starts_at": activity.starts_at,
                "ends_at": activity.ends_at,
                "location": activity.location,
                "description": activity.description,
                "score": score,
                "reasons": reasons[:3],
                "signed_up": False,
            }
        )

    if not matches:
        headline, matches = _fallback_matches(candidates, history, limit=limit)
        return headline, matches, False, None

    matches.sort(key=lambda entry: entry["score"], reverse=True)
    return headline, matches[:limit], True, None
