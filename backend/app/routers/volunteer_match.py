from __future__ import annotations

import json
from typing import Literal

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db import get_db
from app.models.volunteer_activity import VolunteerActivity
from app.services.ollama_client import chat_json
from app.services.volunteer_matcher import (
    AVAILABILITY_OPTIONS,
    INTEREST_OPTIONS,
    activity_to_dict,
    match_activities,
)

router = APIRouter(prefix="/ai/volunteer", tags=["ai"])

Interest = Literal["hands-on", "food", "people", "skills"]
Availability = Literal["weekday-am", "weekday-pm", "weekend-am", "flexible"]


class VolunteerMatchRequest(BaseModel):
    interest: Interest
    availability: Availability


class VolunteerActivityItem(BaseModel):
    role_id: str
    icon: str
    title: str
    desc: str
    when: str
    where: str
    category: str
    filled: int | None = None
    total: int | None = None
    note: str | None = None
    cta_label: str = "I'm interested"


class VolunteerMatchItem(VolunteerActivityItem):
    score: int = Field(ge=0, le=100)
    reasons: list[str]


class VolunteerMatchResponse(BaseModel):
    enabled: bool
    ai_enhanced: bool
    matches: list[VolunteerMatchItem]
    message: str | None = None


def _enhance_reasons_with_ollama(interest: Interest, availability: Availability, matches: list[dict]) -> list[dict] | None:
    interest_label = str(INTEREST_OPTIONS[interest]["label"])
    availability_labels = {
        "weekday-am": "Weekday mornings",
        "weekday-pm": "Weekday afternoons/evenings",
        "weekend-am": "Weekend mornings",
        "flexible": "Flexible — it varies",
    }

    payload = {
        "interest": interest_label,
        "availability": availability_labels[availability],
        "matches": [
            {
                "role_id": match["role_id"],
                "title": match["title"],
                "when": match["when"],
                "where": match["where"],
                "score": match["score"],
                "reasons": match["reasons"],
            }
            for match in matches
        ],
    }

    parsed = chat_json(
        system=(
            "You help Love 21 Foundation match volunteers to open roles. "
            "Use ability-first, warm language. Keep each reason to one short sentence. "
            'Return JSON: {"matches":[{"role_id":"...","reasons":["...","..."]}]}'
        ),
        user=(
            "Improve the match reasons for these volunteer role suggestions. "
            "Keep the same role_id values and provide 2 reasons each.\n\n"
            f"{json.dumps(payload)}"
        ),
    )
    if not parsed:
        return None

    reason_map = {
        item["role_id"]: item.get("reasons", [])
        for item in parsed.get("matches", [])
        if isinstance(item, dict) and item.get("role_id")
    }

    enhanced = []
    for match in matches:
        updated = dict(match)
        ai_reasons = reason_map.get(match["role_id"])
        if ai_reasons:
            updated["reasons"] = [str(reason) for reason in ai_reasons[:3]]
        enhanced.append(updated)
    return enhanced


@router.get("/activities", response_model=list[VolunteerActivityItem])
def list_volunteer_activities(db: Session = Depends(get_db)) -> list[VolunteerActivityItem]:
    activities = db.scalars(
        select(VolunteerActivity)
        .where(VolunteerActivity.status == "active")
        .order_by(VolunteerActivity.display_order)
    ).all()
    return [VolunteerActivityItem(**activity_to_dict(activity)) for activity in activities]


@router.post("/match", response_model=VolunteerMatchResponse)
def match_volunteer(payload: VolunteerMatchRequest, db: Session = Depends(get_db)) -> VolunteerMatchResponse:
    if payload.interest not in INTEREST_OPTIONS:
        return VolunteerMatchResponse(
            enabled=False,
            ai_enhanced=False,
            matches=[],
            message="Unknown interest value.",
        )
    if payload.availability not in AVAILABILITY_OPTIONS:
        return VolunteerMatchResponse(
            enabled=False,
            ai_enhanced=False,
            matches=[],
            message="Unknown availability value.",
        )

    activity_count = db.scalar(
        select(VolunteerActivity.id).where(VolunteerActivity.status == "active").limit(1)
    )
    if activity_count is None:
        return VolunteerMatchResponse(
            enabled=False,
            ai_enhanced=False,
            matches=[],
            message="No volunteer activities in the database yet. Run: python seed.py",
        )

    base_matches = match_activities(db, payload.interest, payload.availability, limit=2)
    enhanced_matches = _enhance_reasons_with_ollama(payload.interest, payload.availability, base_matches)
    ai_enhanced = enhanced_matches is not None
    final_matches = enhanced_matches or base_matches

    settings = get_settings()
    message = None
    if not ai_enhanced and settings.ollama_enabled:
        message = (
            f"Rule-based matching is active. Start Ollama with `{settings.ollama_model}` "
            f"for AI-polished reasons (ollama pull {settings.ollama_model})."
        )

    return VolunteerMatchResponse(
        enabled=True,
        ai_enhanced=ai_enhanced,
        matches=[VolunteerMatchItem(**match) for match in final_matches],
        message=message,
    )
