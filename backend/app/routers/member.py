from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.deps import require_roles
from app.models.user import Role, User
from app.models.volunteer_activity import VolunteerActivityRegistration
from app.schemas.supporter import MemberDashboardRead, VolunteerActivityRegistrationRead

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


@router.get("/member/profile")
def member_profile(current_user: User = Depends(require_roles(Role.MEMBER))) -> dict[str, str]:
    return {"email": current_user.email, "profile_status": "ready_to_edit"}
