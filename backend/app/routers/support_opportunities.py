import re

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.deps import require_roles
from app.models.support_opportunity import SupportOpportunity
from app.models.user import Role, User
from app.schemas.support_opportunity import (
    OpportunityKind,
    SupportOpportunityCreate,
    SupportOpportunityRead,
    SupportOpportunityUpdate,
)

router = APIRouter(prefix="/support-opportunities", tags=["support opportunities"])


def serialize(opportunity: SupportOpportunity) -> SupportOpportunityRead:
    progress = min(100, round(opportunity.funded_amount_hkd / opportunity.target_amount_hkd * 100))
    return SupportOpportunityRead.model_validate(
        {**opportunity.__dict__, "progress_percent": progress}
    )


def make_unique_slug(title: str, db: Session) -> str:
    base = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-") or "opportunity"
    candidate = base
    suffix = 2
    while db.scalar(select(SupportOpportunity.id).where(SupportOpportunity.slug == candidate)) is not None:
        candidate = f"{base}-{suffix}"
        suffix += 1
    return candidate


@router.get("", response_model=list[SupportOpportunityRead])
def list_public_opportunities(
    kind: OpportunityKind | None = Query(default=None),
    db: Session = Depends(get_db),
):
    query = select(SupportOpportunity).where(SupportOpportunity.status == "active")
    if kind is not None:
        query = query.where(SupportOpportunity.kind == kind)
    opportunities = db.scalars(
        query.order_by(SupportOpportunity.display_order, SupportOpportunity.created_at)
    ).all()
    return [serialize(opportunity) for opportunity in opportunities]


@router.get("/admin", response_model=list[SupportOpportunityRead])
def list_admin_opportunities(
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
):
    opportunities = db.scalars(
        select(SupportOpportunity).order_by(
            SupportOpportunity.display_order, SupportOpportunity.created_at
        )
    ).all()
    return [serialize(opportunity) for opportunity in opportunities]


@router.post("", response_model=SupportOpportunityRead, status_code=status.HTTP_201_CREATED)
def create_opportunity(
    payload: SupportOpportunityCreate,
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
):
    opportunity = SupportOpportunity(
        **payload.model_dump(),
        slug=make_unique_slug(payload.title, db),
    )
    db.add(opportunity)
    db.commit()
    db.refresh(opportunity)
    return serialize(opportunity)


@router.patch("/admin/{opportunity_id}", response_model=SupportOpportunityRead)
def update_opportunity(
    opportunity_id: int,
    payload: SupportOpportunityUpdate,
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
):
    opportunity = db.get(SupportOpportunity, opportunity_id)
    if opportunity is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Support opportunity not found")

    updates = payload.model_dump(exclude_unset=True)
    prospective_kind = updates.get("kind", opportunity.kind)
    prospective_purchase_url = updates.get("purchase_url", opportunity.purchase_url)
    prospective_quantity_needed = updates.get("quantity_needed", opportunity.quantity_needed)
    prospective_quantity_secured = updates.get("quantity_secured", opportunity.quantity_secured)
    if prospective_kind != "wishlist" and (
        prospective_purchase_url is not None
        or prospective_quantity_needed is not None
        or prospective_quantity_secured is not None
    ):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Purchase and quantity fields are only available for wishlist items",
        )
    if prospective_quantity_secured is not None and prospective_quantity_needed is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="quantity_needed is required when quantity_secured is provided",
        )
    if (
        prospective_quantity_needed is not None
        and prospective_quantity_secured is not None
        and prospective_quantity_secured > prospective_quantity_needed
    ):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="quantity_secured cannot exceed quantity_needed",
        )

    for key, value in updates.items():
        setattr(opportunity, key, value)
    db.commit()
    db.refresh(opportunity)
    return serialize(opportunity)


@router.get("/{slug}", response_model=SupportOpportunityRead)
def get_public_opportunity(slug: str, db: Session = Depends(get_db)):
    opportunity = db.scalar(
        select(SupportOpportunity).where(
            SupportOpportunity.slug == slug,
            SupportOpportunity.status == "active",
        )
    )
    if opportunity is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Support opportunity not found")
    return serialize(opportunity)
