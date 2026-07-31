from __future__ import annotations

from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.deps import require_roles
from app.models.admin_event import AdminEvent, EventCategory, EventStatus
from app.models.admin_volunteer_program import AdminVolunteerProgram, ProgramCategory, ProgramStatus
from app.models.newsletter_subscriber import NewsletterSubscriber, SubscriberStatus
from app.models.user import Role, User
from app.services.analytics_service import admin_metrics, record_event

router = APIRouter(tags=["analytics"])


class TrackEventRequest(BaseModel):
    event_name: str = Field(min_length=1, max_length=120)
    session_id: str | None = Field(default=None, max_length=64)
    locale: str | None = Field(default=None, max_length=8)
    page_path: str | None = Field(default=None, max_length=255)
    properties: dict[str, str | int | float | bool | None] = Field(default_factory=dict)


class TrackEventResponse(BaseModel):
    ok: bool = True
    event_id: int


@router.post("/events", response_model=TrackEventResponse, status_code=status.HTTP_201_CREATED)
def track_event(payload: TrackEventRequest, db: Session = Depends(get_db)) -> TrackEventResponse:
    event = record_event(
        db,
        event_name=payload.event_name,
        session_id=payload.session_id,
        locale=payload.locale,
        page_path=payload.page_path,
        properties=payload.properties,
    )
    db.commit()
    return TrackEventResponse(event_id=event.id)


@router.get("/admin/metrics")
def get_admin_metrics(
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> dict[str, int]:
    return admin_metrics(db)


# --- Newsletter ---


class NewsletterSubscribeRequest(BaseModel):
    first_name: str = ""
    last_name: str = ""
    email: EmailStr
    phone_number: str = ""


class NewsletterSubscriberRead(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone_number: str
    status: SubscriberStatus
    subscribed_at: str

    model_config = {"from_attributes": True}


@router.post("/newsletter/subscribe", response_model=NewsletterSubscriberRead)
def subscribe_newsletter(payload: NewsletterSubscribeRequest, db: Session = Depends(get_db)) -> NewsletterSubscriber:
    existing = db.scalar(select(NewsletterSubscriber).where(NewsletterSubscriber.email == payload.email))
    if existing:
        existing.first_name = payload.first_name
        existing.last_name = payload.last_name
        existing.phone_number = payload.phone_number
        existing.status = SubscriberStatus.ACTIVE
        subscriber = existing
    else:
        subscriber = NewsletterSubscriber(
            first_name=payload.first_name,
            last_name=payload.last_name,
            email=payload.email,
            phone_number=payload.phone_number,
        )
        db.add(subscriber)

    record_event(
        db,
        event_name="newsletter_subscribed",
        properties={"email_domain": payload.email.split("@")[-1]},
    )
    db.commit()
    db.refresh(subscriber)
    return subscriber


@router.get("/admin/newsletter", response_model=list[NewsletterSubscriberRead])
def list_newsletter_subscribers(
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> list[NewsletterSubscriber]:
    return list(db.scalars(select(NewsletterSubscriber).order_by(NewsletterSubscriber.subscribed_at.desc())))


@router.delete("/admin/newsletter/{subscriber_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_newsletter_subscriber(
    subscriber_id: int,
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> None:
    subscriber = db.get(NewsletterSubscriber, subscriber_id)
    if subscriber is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscriber not found")
    db.delete(subscriber)
    db.commit()


class NewsletterSubscriberUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    email: EmailStr | None = None
    phone_number: str | None = None
    status: SubscriberStatus | None = None


@router.patch("/admin/newsletter/{subscriber_id}", response_model=NewsletterSubscriberRead)
def update_newsletter_subscriber(
    subscriber_id: int,
    payload: NewsletterSubscriberUpdate,
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> NewsletterSubscriber:
    subscriber = db.get(NewsletterSubscriber, subscriber_id)
    if subscriber is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscriber not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(subscriber, key, value)
    db.commit()
    db.refresh(subscriber)
    return subscriber


# --- Admin events ---


class AdminEventWrite(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str = ""
    event_date: date
    location: str = ""
    registrations: int = 0
    max_capacity: int = 0
    category: EventCategory = EventCategory.COMMUNITY
    status: EventStatus = EventStatus.UPCOMING


class AdminEventRead(AdminEventWrite):
    id: int
    created_at: str

    model_config = {"from_attributes": True}


@router.get("/admin/events", response_model=list[AdminEventRead])
def list_admin_events(
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> list[AdminEvent]:
    return list(db.scalars(select(AdminEvent).order_by(AdminEvent.event_date.desc())))


@router.post("/admin/events", response_model=AdminEventRead, status_code=status.HTTP_201_CREATED)
def create_admin_event(
    payload: AdminEventWrite,
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> AdminEvent:
    event = AdminEvent(**payload.model_dump())
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@router.put("/admin/events/{event_id}", response_model=AdminEventRead)
def update_admin_event(
    event_id: int,
    payload: AdminEventWrite,
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> AdminEvent:
    event = db.get(AdminEvent, event_id)
    if event is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    for key, value in payload.model_dump().items():
        setattr(event, key, value)
    db.commit()
    db.refresh(event)
    return event


@router.delete("/admin/events/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_admin_event(
    event_id: int,
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> None:
    event = db.get(AdminEvent, event_id)
    if event is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    db.delete(event)
    db.commit()


# --- Admin volunteer programs ---


class AdminVolunteerProgramWrite(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str = ""
    category: ProgramCategory = ProgramCategory.SPORT
    schedule: str = ""
    location: str = ""
    filled: int = 0
    total: int = 0
    status: ProgramStatus = ProgramStatus.OPEN


class AdminVolunteerProgramRead(AdminVolunteerProgramWrite):
    id: int
    created_at: str

    model_config = {"from_attributes": True}


@router.get("/admin/volunteer-programs", response_model=list[AdminVolunteerProgramRead])
def list_admin_volunteer_programs(
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> list[AdminVolunteerProgram]:
    return list(db.scalars(select(AdminVolunteerProgram).order_by(AdminVolunteerProgram.created_at.desc())))


@router.post("/admin/volunteer-programs", response_model=AdminVolunteerProgramRead, status_code=status.HTTP_201_CREATED)
def create_admin_volunteer_program(
    payload: AdminVolunteerProgramWrite,
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> AdminVolunteerProgram:
    program = AdminVolunteerProgram(**payload.model_dump())
    db.add(program)
    db.commit()
    db.refresh(program)
    return program


@router.put("/admin/volunteer-programs/{program_id}", response_model=AdminVolunteerProgramRead)
def update_admin_volunteer_program(
    program_id: int,
    payload: AdminVolunteerProgramWrite,
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> AdminVolunteerProgram:
    program = db.get(AdminVolunteerProgram, program_id)
    if program is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Program not found")
    for key, value in payload.model_dump().items():
        setattr(program, key, value)
    db.commit()
    db.refresh(program)
    return program


@router.delete("/admin/volunteer-programs/{program_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_admin_volunteer_program(
    program_id: int,
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> None:
    program = db.get(AdminVolunteerProgram, program_id)
    if program is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Program not found")
    db.delete(program)
    db.commit()
