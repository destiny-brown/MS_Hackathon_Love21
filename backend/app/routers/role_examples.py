from fastapi import APIRouter, Depends

from app.deps import require_roles
from app.models.user import Role, User

router = APIRouter(tags=["role examples"])


@router.get("/donor/recurring-donation")
def recurring_donation(
    current_user: User = Depends(require_roles(Role.DONOR, Role.VOLUNTEER, Role.MEMBER)),
) -> dict[str, str]:
    # Template: use this pattern for opt-in recurring donation management; one-off donations stay public.
    return {"email": current_user.email, "status": "ready_to_manage"}


@router.get("/member/profile")
def member_profile(current_user: User = Depends(require_roles(Role.MEMBER))) -> dict[str, str]:
    # Template: protect member profile and programme history pages with the member role.
    return {"email": current_user.email, "profile_status": "ready_to_edit"}
