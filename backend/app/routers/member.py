from datetime import date, datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.deps import require_roles
from app.models.user import Role, User
from app.models.volunteer_activity import VolunteerActivityRegistration
from app.routers.supporter import serialize_play_state
from app.schemas.supporter import (
    CaptainsCornerRead,
    MemberDashboardRead,
    RecommendedVolunteerRoleRead,
    RecommendedVolunteerRolesResponse,
    UserPlayStateRead,
    UserPlayStateUpdate,
    VolunteerActivityRegistrationRead,
)
from app.services.captain_greeting import (
    build_trail_snapshot,
    generate_greeting,
    get_or_create_play_state,
    load_member_context,
)
from app.services.volunteer_role_recommendations import recommend_volunteer_roles_for_user

router = APIRouter(tags=["member"])


@router.get("/member/dashboard", response_model=MemberDashboardRead)
def member_dashboard(
    current_user: User = Depends(require_roles(Role.MEMBER)),
    db: Session = Depends(get_db),
) -> MemberDashboardRead:
    registrations = db.scalars(
        select(VolunteerActivityRegistration)
        .where(
            VolunteerActivityRegistration.user_id == current_user.id,
            VolunteerActivityRegistration.status != "cancelled",
        )
        .order_by(VolunteerActivityRegistration.created_at.desc())
    ).all()
    serialized = [VolunteerActivityRegistrationRead.model_validate(item) for item in registrations]
    return MemberDashboardRead(
        registered_activities=serialized,
        total_registrations=len(serialized),
        upcoming_registrations=len(serialized),
    )


@router.get("/member/captains-corner", response_model=CaptainsCornerRead)
def member_captains_corner(
    current_user: User = Depends(require_roles(Role.MEMBER)),
    db: Session = Depends(get_db),
) -> CaptainsCornerRead:
    state = get_or_create_play_state(db, current_user.id)
    trail = build_trail_snapshot(state)
    context = load_member_context(db, current_user.id)
    message, ai_enhanced = generate_greeting(db, current_user, trail, context, date.today())
    return CaptainsCornerRead(
        play_state=serialize_play_state(state),
        captain_message=message,
        ai_enhanced=ai_enhanced,
    )


@router.get("/member/play-state", response_model=UserPlayStateRead)
def get_member_play_state(
    current_user: User = Depends(require_roles(Role.MEMBER)),
    db: Session = Depends(get_db),
) -> UserPlayStateRead:
    state = get_or_create_play_state(db, current_user.id)
    return serialize_play_state(state)


@router.put("/member/play-state", response_model=UserPlayStateRead)
def upsert_member_play_state(
    payload: UserPlayStateUpdate,
    current_user: User = Depends(require_roles(Role.MEMBER)),
    db: Session = Depends(get_db),
) -> UserPlayStateRead:
    state = get_or_create_play_state(db, current_user.id)
    state.day_number = payload.day_number
    state.event_index = payload.event_index
    state.correct_count = payload.correct_count
    state.total_answered = payload.total_answered
    state.current_streak = payload.current_streak
    state.best_streak = max(payload.best_streak, payload.current_streak, state.best_streak)
    state.total_plays = payload.total_plays
    state.last_played_at = datetime.now(timezone.utc)
    state.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(state)
    return serialize_play_state(state)


@router.get("/member/recommended-roles", response_model=RecommendedVolunteerRolesResponse)
def member_recommended_roles(
    current_user: User = Depends(require_roles(Role.MEMBER)),
    db: Session = Depends(get_db),
) -> RecommendedVolunteerRolesResponse:
    headline, matches, ai_enhanced, message = recommend_volunteer_roles_for_user(db, current_user)
    return RecommendedVolunteerRolesResponse(
        enabled=bool(matches),
        ai_enhanced=ai_enhanced,
        headline=headline,
        matches=[RecommendedVolunteerRoleRead.model_validate(match) for match in matches],
        message=message,
    )


@router.get("/member/profile")
def member_profile(current_user: User = Depends(require_roles(Role.MEMBER))) -> dict[str, str]:
    return {"email": current_user.email, "profile_status": "ready_to_edit"}
