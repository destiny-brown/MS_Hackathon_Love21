from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db import get_db
from app.deps import require_roles
from app.models.activity import Activity, ActivitySignup
from app.models.newsletter import NewsletterDelivery, NewsletterSubscriber
from app.models.user import Role, User
from app.models.volunteer_activity import VolunteerActivity
from app.schemas.admin import (
    ActivityAdminCreate,
    ActivityAdminRead,
    ActivityAdminUpdate,
    AdminOverviewRead,
    VolunteerActivityAdminCreate,
    VolunteerActivityAdminRead,
    VolunteerActivityAdminUpdate,
)
from app.schemas.newsletter import (
    NewsletterDeliveryRead,
    NewsletterSendRequest,
    NewsletterSubscriberCreate,
    NewsletterSubscriberRead,
    NewsletterSubscriberUpdate,
)
from app.services.email_service import send_email
from app.services.newsletter_template import render_newsletter_html

router = APIRouter(prefix="/admin", tags=["admin"])


def serialize_activity(activity: Activity, registration_count: int) -> ActivityAdminRead:
    return ActivityAdminRead.model_validate({**activity.__dict__, "registration_count": registration_count})


def registration_count(db: Session, activity_id: int) -> int:
    return db.scalar(
        select(func.count())
        .select_from(ActivitySignup)
        .where(ActivitySignup.activity_id == activity_id, ActivitySignup.status != "cancelled")
    ) or 0


@router.get("/overview", response_model=AdminOverviewRead)
def admin_overview(_: User = Depends(require_roles(Role.ADMIN)), db: Session = Depends(get_db)) -> AdminOverviewRead:
    subscriber_count = db.scalar(select(func.count()).select_from(NewsletterSubscriber)) or 0
    active_subscriber_count = db.scalar(
        select(func.count()).select_from(NewsletterSubscriber).where(NewsletterSubscriber.status == "active")
    ) or 0
    return AdminOverviewRead(
        event_count=db.scalar(select(func.count()).select_from(Activity)) or 0,
        volunteer_program_count=db.scalar(select(func.count()).select_from(VolunteerActivity)) or 0,
        subscriber_count=subscriber_count,
        active_subscriber_count=active_subscriber_count,
    )


@router.get("/activities", response_model=list[ActivityAdminRead])
def list_admin_activities(_: User = Depends(require_roles(Role.ADMIN)), db: Session = Depends(get_db)) -> list[ActivityAdminRead]:
    activities = db.scalars(select(Activity).order_by(Activity.starts_at.desc())).all()
    return [serialize_activity(activity, registration_count(db, activity.id)) for activity in activities]


@router.post("/activities", response_model=ActivityAdminRead, status_code=status.HTTP_201_CREATED)
def create_activity(
    payload: ActivityAdminCreate,
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> ActivityAdminRead:
    activity = Activity(**payload.model_dump())
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return serialize_activity(activity, 0)


@router.patch("/activities/{activity_id}", response_model=ActivityAdminRead)
def update_activity(
    activity_id: int,
    payload: ActivityAdminUpdate,
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> ActivityAdminRead:
    activity = db.get(Activity, activity_id)
    if activity is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(activity, key, value)
    db.commit()
    db.refresh(activity)
    return serialize_activity(activity, registration_count(db, activity.id))


@router.delete("/activities/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_activity(
    activity_id: int,
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> Response:
    activity = db.get(Activity, activity_id)
    if activity is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
    db.delete(activity)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/volunteer-activities", response_model=list[VolunteerActivityAdminRead])
def list_admin_volunteer_activities(
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> list[VolunteerActivityAdminRead]:
    activities = db.scalars(select(VolunteerActivity).order_by(VolunteerActivity.display_order)).all()
    return [VolunteerActivityAdminRead.model_validate(activity) for activity in activities]


@router.post("/volunteer-activities", response_model=VolunteerActivityAdminRead, status_code=status.HTTP_201_CREATED)
def create_volunteer_activity(
    payload: VolunteerActivityAdminCreate,
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> VolunteerActivityAdminRead:
    if db.scalar(select(VolunteerActivity).where(VolunteerActivity.slug == payload.slug)):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Slug already exists")
    activity = VolunteerActivity(**payload.model_dump())
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return VolunteerActivityAdminRead.model_validate(activity)


@router.patch("/volunteer-activities/{activity_id}", response_model=VolunteerActivityAdminRead)
def update_volunteer_activity(
    activity_id: int,
    payload: VolunteerActivityAdminUpdate,
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> VolunteerActivityAdminRead:
    activity = db.get(VolunteerActivity, activity_id)
    if activity is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Volunteer activity not found")
    updates = payload.model_dump(exclude_unset=True)
    if "slug" in updates:
        existing = db.scalar(
            select(VolunteerActivity).where(
                VolunteerActivity.slug == updates["slug"],
                VolunteerActivity.id != activity_id,
            )
        )
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Slug already exists")
    for key, value in updates.items():
        setattr(activity, key, value)
    db.commit()
    db.refresh(activity)
    return VolunteerActivityAdminRead.model_validate(activity)


@router.delete("/volunteer-activities/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_volunteer_activity(
    activity_id: int,
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> Response:
    activity = db.get(VolunteerActivity, activity_id)
    if activity is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Volunteer activity not found")
    db.delete(activity)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/newsletter/subscribers", response_model=list[NewsletterSubscriberRead])
def list_newsletter_subscribers(
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> list[NewsletterSubscriberRead]:
    subscribers = db.scalars(select(NewsletterSubscriber).order_by(NewsletterSubscriber.subscribed_at.desc())).all()
    return [NewsletterSubscriberRead.model_validate(subscriber) for subscriber in subscribers]


@router.post("/newsletter/subscribers", response_model=NewsletterSubscriberRead, status_code=status.HTTP_201_CREATED)
def create_newsletter_subscriber(
    payload: NewsletterSubscriberCreate,
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> NewsletterSubscriberRead:
    email = payload.email.lower()
    subscriber = db.scalar(select(NewsletterSubscriber).where(NewsletterSubscriber.email == email))
    if subscriber:
        for key, value in payload.model_dump().items():
            if key == "email":
                continue
            setattr(subscriber, key, value)
        subscriber.email = email
        subscriber.status = payload.status
    else:
        subscriber = NewsletterSubscriber(**payload.model_dump(), email=email)
        db.add(subscriber)
    db.commit()
    db.refresh(subscriber)
    return NewsletterSubscriberRead.model_validate(subscriber)


@router.patch("/newsletter/subscribers/{subscriber_id}", response_model=NewsletterSubscriberRead)
def update_newsletter_subscriber(
    subscriber_id: int,
    payload: NewsletterSubscriberUpdate,
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> NewsletterSubscriberRead:
    subscriber = db.get(NewsletterSubscriber, subscriber_id)
    if subscriber is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscriber not found")
    updates = payload.model_dump(exclude_unset=True)
    if "email" in updates and updates["email"]:
        updates["email"] = updates["email"].lower()
    for key, value in updates.items():
        setattr(subscriber, key, value)
    db.commit()
    db.refresh(subscriber)
    return NewsletterSubscriberRead.model_validate(subscriber)


@router.delete("/newsletter/subscribers/{subscriber_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_newsletter_subscriber(
    subscriber_id: int,
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> Response:
    subscriber = db.get(NewsletterSubscriber, subscriber_id)
    if subscriber is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscriber not found")
    db.delete(subscriber)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/newsletter/deliveries", response_model=list[NewsletterDeliveryRead])
def list_newsletter_deliveries(
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> list[NewsletterDeliveryRead]:
    deliveries = db.scalars(select(NewsletterDelivery).order_by(NewsletterDelivery.sent_at.desc())).all()
    return [NewsletterDeliveryRead.model_validate(delivery) for delivery in deliveries]


@router.post("/newsletter/send")
def send_newsletter(
    payload: NewsletterSendRequest,
    current_user: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> dict[str, int | str]:
    settings = get_settings()
    subscribers = db.scalars(
        select(NewsletterSubscriber).where(NewsletterSubscriber.status == "active")
    ).all()
    if not subscribers:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No active subscribers")

    sent_count = 0
    for subscriber in subscribers:
        unsubscribe_url = f"{settings.site_url.rstrip('/')}/newsletter/unsubscribe/{subscriber.unsubscribe_token}"
        html_body = render_newsletter_html(payload.subject, payload.content, unsubscribe_url)
        if send_email(
            to_email=subscriber.email,
            subject=payload.subject,
            html_body=html_body,
            text_body=payload.content,
        ):
            sent_count += 1

    delivery = NewsletterDelivery(
        subject=payload.subject,
        content_text=payload.content,
        content_html=render_newsletter_html(
            payload.subject,
            payload.content,
            f"{settings.site_url.rstrip('/')}/newsletter/unsubscribe/example",
        ),
        recipient_count=sent_count,
        sent_by_user_id=current_user.id,
        sent_at=datetime.now(timezone.utc),
    )
    db.add(delivery)
    db.commit()

    return {"success": True, "message": f"Newsletter sent to {sent_count} subscribers", "sent_count": sent_count}
