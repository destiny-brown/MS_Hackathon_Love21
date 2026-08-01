from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.core.security import decode_access_token
from app.db import get_db
from app.deps import require_roles
from app.models.activity import Activity, ActivitySignup, VolunteerHour
from app.models.donation import Donation
from app.models.support_opportunity import SupportOpportunity
from app.models.user import Role, User
from app.routers.support_opportunities import serialize as serialize_opportunity
from app.schemas.supporter import (
    ActivityRead,
    ActivitySignupRead,
    DonationCreate,
    DonationRead,
    DonationReceipt,
    ImpactItem,
    SupporterDashboardRead,
    VolunteerHourCreate,
    VolunteerHourRead,
)

router = APIRouter(tags=["supporter"])
optional_bearer = HTTPBearer(auto_error=False)


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


def serialize_activity(activity: Activity, signed_up: bool = False) -> ActivityRead:
    return ActivityRead.model_validate({**activity.__dict__, "signed_up": signed_up})


def serialize_donation(donation: Donation) -> DonationRead:
    opportunity = donation.support_opportunity
    return DonationRead.model_validate(
        {
            **donation.__dict__,
            "support_opportunity": serialize_opportunity(opportunity) if opportunity else None,
        }
    )


def serialize_signup(signup: ActivitySignup) -> ActivitySignupRead:
    return ActivitySignupRead.model_validate(
        {**signup.__dict__, "activity": serialize_activity(signup.activity, signed_up=True)}
    )


def serialize_hour(hour: VolunteerHour) -> VolunteerHourRead:
    return VolunteerHourRead.model_validate(
        {**hour.__dict__, "activity": serialize_activity(hour.activity, signed_up=True) if hour.activity else None}
    )


@router.post("/donations/mock", response_model=DonationReceipt, status_code=status.HTTP_201_CREATED)
def create_mock_donation(
    payload: DonationCreate,
    current_user: User | None = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
) -> DonationReceipt:
    opportunity = None
    if payload.support_opportunity_id is not None:
        opportunity = db.get(SupportOpportunity, payload.support_opportunity_id)
        if opportunity is None or opportunity.status != "active":
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Support opportunity not found")

    supporter = current_user if current_user and Role.canonical(current_user.role) == Role.SUPPORTER else None
    donor_email = supporter.email if supporter else payload.donor_email
    if donor_email is None:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Guest donations need an email address")

    # TODO: Replace this mock success block with a real payment processor checkout/session
    # (for example Stripe) and only create the donation after verified payment confirmation.
    donation = Donation(
        supporter_id=supporter.id if supporter else None,
        support_opportunity_id=opportunity.id if opportunity else None,
        donor_email=donor_email.lower().strip(),
        donor_name=payload.donor_name,
        amount_hkd=payload.amount_hkd,
        frequency=payload.frequency,
        status="succeeded",
        payment_reference=f"mock_{uuid4().hex[:12]}",
        message=payload.message,
        created_at=datetime.now(timezone.utc),
    )
    db.add(donation)
    if opportunity is not None:
        opportunity.funded_amount_hkd += payload.amount_hkd
    db.commit()
    db.refresh(donation)
    donation = db.scalar(
        select(Donation)
        .where(Donation.id == donation.id)
        .options(selectinload(Donation.support_opportunity))
    )
    assert donation is not None
    return DonationReceipt(
        donation=serialize_donation(donation),
        attributed_to_account=supporter is not None,
        account_prompt=None
        if supporter is not None
        else "Create a supporter account to track your giving, volunteering, and impact in one place.",
    )


@router.get("/activities", response_model=list[ActivityRead])
def list_activities(
    current_user: User | None = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
) -> list[ActivityRead]:
    activities = db.scalars(select(Activity).order_by(Activity.starts_at)).all()
    signed_up_ids: set[int] = set()
    if current_user and Role.canonical(current_user.role) == Role.SUPPORTER:
        signed_up_ids = set(
            db.scalars(
                select(ActivitySignup.activity_id).where(
                    ActivitySignup.supporter_id == current_user.id,
                    ActivitySignup.status != "cancelled",
                )
            ).all()
        )
    return [serialize_activity(activity, activity.id in signed_up_ids) for activity in activities]


@router.post("/activities/{activity_id}/signup", response_model=ActivitySignupRead, status_code=status.HTTP_201_CREATED)
def sign_up_for_activity(
    activity_id: int,
    current_user: User = Depends(require_roles(Role.SUPPORTER)),
    db: Session = Depends(get_db),
) -> ActivitySignupRead:
    activity = db.get(Activity, activity_id)
    if activity is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
    signup = db.scalar(
        select(ActivitySignup).where(
            ActivitySignup.supporter_id == current_user.id,
            ActivitySignup.activity_id == activity_id,
        )
    )
    if signup is None:
        signup = ActivitySignup(supporter_id=current_user.id, activity_id=activity_id, status="signed_up")
        db.add(signup)
    else:
        signup.status = "signed_up"
    db.commit()
    signup = db.scalar(
        select(ActivitySignup)
        .where(ActivitySignup.supporter_id == current_user.id, ActivitySignup.activity_id == activity_id)
        .options(selectinload(ActivitySignup.activity))
    )
    assert signup is not None
    return serialize_signup(signup)


@router.post("/supporter/hours", response_model=VolunteerHourRead, status_code=status.HTTP_201_CREATED)
def log_volunteer_hours(
    payload: VolunteerHourCreate,
    current_user: User = Depends(require_roles(Role.SUPPORTER)),
    db: Session = Depends(get_db),
) -> VolunteerHourRead:
    if payload.activity_id is not None and db.get(Activity, payload.activity_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
    hour = VolunteerHour(
        supporter_id=current_user.id,
        activity_id=payload.activity_id,
        hours=payload.hours,
        notes=payload.notes.strip() if payload.notes else None,
    )
    db.add(hour)
    db.commit()
    db.refresh(hour)
    hour = db.scalar(
        select(VolunteerHour)
        .where(VolunteerHour.id == hour.id)
        .options(selectinload(VolunteerHour.activity))
    )
    assert hour is not None
    return serialize_hour(hour)


@router.get("/supporter/dashboard", response_model=SupporterDashboardRead)
def supporter_dashboard(
    current_user: User = Depends(require_roles(Role.SUPPORTER)),
    db: Session = Depends(get_db),
) -> SupporterDashboardRead:
    donations = db.scalars(
        select(Donation)
        .where(Donation.supporter_id == current_user.id)
        .options(selectinload(Donation.support_opportunity))
        .order_by(Donation.created_at.desc())
    ).all()
    signups = db.scalars(
        select(ActivitySignup)
        .where(ActivitySignup.supporter_id == current_user.id, ActivitySignup.status != "cancelled")
        .options(selectinload(ActivitySignup.activity))
        .order_by(ActivitySignup.created_at.desc())
    ).all()
    hours = db.scalars(
        select(VolunteerHour)
        .where(VolunteerHour.supporter_id == current_user.id)
        .options(selectinload(VolunteerHour.activity))
        .order_by(VolunteerHour.logged_at.desc())
    ).all()

    total_given = sum(donation.amount_hkd for donation in donations if donation.status == "succeeded")
    recurring_count = sum(1 for donation in donations if donation.frequency == "monthly" and donation.status == "succeeded")
    recurring_status = "Active monthly supporter" if recurring_count else "No recurring gift yet"
    impact_items = [
        ImpactItem(
            title=donation.support_opportunity.title,
            amount_hkd=donation.amount_hkd,
            message=f"Your {donation.frequency.replace('_', '-')} gift helped fund {donation.support_opportunity.title}.",
            progress_percent=min(
                100,
                round(donation.support_opportunity.funded_amount_hkd / donation.support_opportunity.target_amount_hkd * 100),
            ),
        )
        for donation in donations
        if donation.support_opportunity is not None and donation.status == "succeeded"
    ]

    return SupporterDashboardRead(
        donations=[serialize_donation(donation) for donation in donations],
        total_given_hkd=total_given,
        recurring_status=recurring_status,
        impact_items=impact_items,
        signed_up_activities=[serialize_signup(signup) for signup in signups],
        volunteer_hours=[serialize_hour(hour) for hour in hours],
        total_volunteer_hours=round(sum(hour.hours for hour in hours), 2),
    )
