from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db import get_db
from app.deps import require_roles
from app.models.activity import Activity
from app.models.newsletter import NewsletterSubscriber
from app.models.user import Role, User
from app.models.volunteer_activity import VolunteerActivity

router = APIRouter(tags=["role examples"])


@router.get("/admin/metrics")
def admin_metrics(_: User = Depends(require_roles(Role.ADMIN)), db: Session = Depends(get_db)) -> dict[str, int]:
    return {
        "active_members": db.scalar(select(func.count()).select_from(NewsletterSubscriber).where(NewsletterSubscriber.status == "active")) or 0,
        "monthly_recurring_donations": 42,
        "open_volunteer_roles": db.scalar(
            select(func.count()).select_from(VolunteerActivity).where(VolunteerActivity.status == "active")
        ) or 0,
        "event_count": db.scalar(select(func.count()).select_from(Activity)) or 0,
    }


@router.get("/supporter/recurring-donation")
def recurring_donation(
    current_user: User = Depends(require_roles(Role.SUPPORTER)),
) -> dict[str, str]:
    # Template: use this pattern for opt-in recurring donation management; one-off donations stay public.
    return {"email": current_user.email, "status": "ready_to_manage"}


@router.get("/member/profile")
def member_profile(current_user: User = Depends(require_roles(Role.MEMBER))) -> dict[str, str]:
    # Template: protect member profile and programme history pages with the member role.
    return {"email": current_user.email, "profile_status": "ready_to_edit"}
