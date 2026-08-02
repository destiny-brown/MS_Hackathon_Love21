from __future__ import annotations

from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db import get_db
from app.deps import require_roles
from app.models.user import Role, User
from app.models.volunteer_activity import VolunteerActivity, VolunteerActivityRegistration
from app.schemas.supporter import VolunteerActivityRegistrationRead
from app.services.volunteer_ai_matcher import match_volunteer_with_ai
from app.services.volunteer_matcher import (
    INTEREST_OPTIONS,
    AVAILABILITY_OPTIONS,
    activity_to_dict,
    match_volunteer_with_rules,
)

router = APIRouter(prefix="/ai/volunteer", tags=["ai"])
optional_bearer = HTTPBearer(auto_error=False)

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
    signed_up: bool = False


class VolunteerMatchItem(VolunteerActivityItem):
    score: int = Field(ge=0, le=100)
    reasons: list[str]


class VolunteerMatchResponse(BaseModel):
    enabled: bool
    ai_enhanced: bool
    matches: list[VolunteerMatchItem]
    message: str | None = None


def get_optional_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(optional_bearer),
    db: Session = Depends(get_db),
) -> User | None:
    if credentials is None:
        return None
    subject = decode_access_token(credentials.credentials)
    if subject is None or not subject.isdigit():
        return None
    return db.get(User, int(subject))


@router.get("/activities", response_model=list[VolunteerActivityItem])
def list_volunteer_activities(
    current_user: User | None = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
) -> list[VolunteerActivityItem]:
    activities = db.scalars(
        select(VolunteerActivity)
        .where(VolunteerActivity.status == "active")
        .order_by(VolunteerActivity.display_order)
    ).all()
    registered_slugs: set[str] = set()
    if current_user is not None:
        registered_slugs = set(
            db.scalars(
                select(VolunteerActivityRegistration.activity_slug).where(
                    VolunteerActivityRegistration.user_id == current_user.id,
                    VolunteerActivityRegistration.status != "cancelled",
                )
            ).all()
        )
    return [
        VolunteerActivityItem(**activity_to_dict(activity), signed_up=activity.slug in registered_slugs)
        for activity in activities
    ]


@router.post("/activities/{activity_slug}/signup", response_model=VolunteerActivityRegistrationRead, status_code=status.HTTP_201_CREATED)
def sign_up_for_volunteer_activity(
    activity_slug: str,
    current_user: User = Depends(require_roles(Role.SUPPORTER, Role.MEMBER, Role.ADMIN)),
    db: Session = Depends(get_db),
) -> VolunteerActivityRegistrationRead:
    activity = db.scalar(
        select(VolunteerActivity).where(
            VolunteerActivity.slug == activity_slug,
            VolunteerActivity.status == "active",
        )
    )
    if activity is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Volunteer activity not found")

    registration = db.scalar(
        select(VolunteerActivityRegistration).where(
            VolunteerActivityRegistration.user_id == current_user.id,
            VolunteerActivityRegistration.activity_id == activity.id,
        )
    )
    if registration is None:
        registration = VolunteerActivityRegistration(
            user_id=current_user.id,
            activity_id=activity.id,
            activity_slug=activity.slug,
            activity_name=activity.title,
            status="registered",
        )
        db.add(registration)
    else:
        registration.activity_slug = activity.slug
        registration.activity_name = activity.title
        registration.status = "registered"
    db.commit()
    db.refresh(registration)
    return VolunteerActivityRegistrationRead.model_validate(registration)


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

    matches, _error = match_volunteer_with_ai(
        db,
        payload.interest,
        payload.availability,
        payload.commitment,
        payload.group_size,
        limit=2,
    )
    if matches:
        return VolunteerMatchResponse(
            enabled=True,
            ai_enhanced=True,
            matches=[VolunteerMatchItem(**match) for match in matches],
            message=None,
        )

    rule_matches = match_volunteer_with_rules(
        db,
        payload.interest,
        payload.availability,
        payload.commitment,
        payload.group_size,
        limit=2,
    )
    if rule_matches:
        return VolunteerMatchResponse(
            enabled=True,
            ai_enhanced=False,
            matches=[VolunteerMatchItem(**match) for match in rule_matches],
            message=None,
        )

    return VolunteerMatchResponse(
        enabled=False,
        ai_enhanced=False,
        matches=[],
        message="No volunteer roles are available to match right now.",
    )
