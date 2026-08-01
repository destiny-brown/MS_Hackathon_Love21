from __future__ import annotations

from typing import Literal

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.volunteer_activity import VolunteerActivity
from app.services.volunteer_ai_matcher import match_volunteer_with_ai
from app.services.volunteer_matcher import INTEREST_OPTIONS, AVAILABILITY_OPTIONS, activity_to_dict

router = APIRouter(prefix="/ai/volunteer", tags=["ai"])

Interest = Literal["hands-on", "food", "people", "skills"]
Availability = Literal["weekday-am", "weekday-pm", "weekend-am", "flexible"]
Commitment = Literal["one-off", "weekly", "long-term"]
GroupSize = Literal["solo", "friend", "team"]


class VolunteerMatchRequest(BaseModel):
    interest: Interest
    availability: Availability
    commitment: Commitment
    group_size: GroupSize


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

    matches, error = match_volunteer_with_ai(
        db,
        payload.interest,
        payload.availability,
        payload.commitment,
        payload.group_size,
        limit=2,
    )
    if error or not matches:
        return VolunteerMatchResponse(
            enabled=False,
            ai_enhanced=False,
            matches=[],
            message=error or "AI matching is unavailable right now.",
        )

    return VolunteerMatchResponse(
        enabled=True,
        ai_enhanced=True,
        matches=[VolunteerMatchItem(**match) for match in matches],
        message=None,
    )
