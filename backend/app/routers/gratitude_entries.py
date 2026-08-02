from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.deps import require_roles
from app.models.gratitude_entry import GratitudeEntry, GratitudeEntryStatus
from app.models.user import Role, User
from app.schemas.gratitude_entry import (
    GratitudeEntryCreate,
    GratitudeEntryModeration,
    GratitudeEntryRead,
)

router = APIRouter(prefix="/gratitude-entries", tags=["gratitude entries"])


def serialize(entry: GratitudeEntry) -> GratitudeEntryRead:
    return GratitudeEntryRead.model_validate(entry)


@router.get("/public", response_model=list[GratitudeEntryRead])
def list_public_gratitude_entries(
    db: Session = Depends(get_db),
) -> list[GratitudeEntryRead]:
    entries = db.scalars(
        select(GratitudeEntry)
        .where(GratitudeEntry.status == GratitudeEntryStatus.APPROVED)
        .order_by(
            GratitudeEntry.moderated_at.desc(), GratitudeEntry.submitted_at.desc()
        )
    ).all()
    return [serialize(entry) for entry in entries]


@router.post(
    "/member", response_model=GratitudeEntryRead, status_code=status.HTTP_201_CREATED
)
def submit_gratitude_entry(
    payload: GratitudeEntryCreate,
    current_user: User = Depends(require_roles(Role.MEMBER, Role.SUPPORTER)),
    db: Session = Depends(get_db),
) -> GratitudeEntryRead:
    entry = GratitudeEntry(
        author_id=current_user.id,
        display_name=payload.display_name,
        message=payload.message,
        photo_url=payload.photo_url,
        status=GratitudeEntryStatus.PENDING,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return serialize(entry)


@router.get("/admin/pending", response_model=list[GratitudeEntryRead])
def list_pending_gratitude_entries(
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> list[GratitudeEntryRead]:
    entries = db.scalars(
        select(GratitudeEntry)
        .where(GratitudeEntry.status == GratitudeEntryStatus.PENDING)
        .order_by(GratitudeEntry.submitted_at.asc())
    ).all()
    return [serialize(entry) for entry in entries]


@router.get("/admin", response_model=list[GratitudeEntryRead])
def list_all_gratitude_entries(
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> list[GratitudeEntryRead]:
    entries = db.scalars(
        select(GratitudeEntry).order_by(
            GratitudeEntry.submitted_at.desc(), GratitudeEntry.id.desc()
        )
    ).all()
    return [serialize(entry) for entry in entries]


@router.patch("/admin/{entry_id}", response_model=GratitudeEntryRead)
def moderate_gratitude_entry(
    entry_id: int,
    payload: GratitudeEntryModeration,
    current_user: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> GratitudeEntryRead:
    entry = db.get(GratitudeEntry, entry_id)
    if entry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Gratitude entry not found"
        )

    entry.status = GratitudeEntryStatus(payload.status)
    entry.moderated_at = datetime.now(timezone.utc)
    entry.moderator_id = current_user.id
    db.commit()
    db.refresh(entry)
    return serialize(entry)
