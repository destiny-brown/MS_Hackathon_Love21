from datetime import datetime, timezone

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class SupportOpportunity(Base):
    __tablename__ = "support_opportunities"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    slug: Mapped[str] = mapped_column(String(220), unique=True, index=True, nullable=False)
    kind: Mapped[str] = mapped_column(String(30), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    impact_statement: Mapped[str] = mapped_column(Text, nullable=False)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    target_amount_hkd: Mapped[int] = mapped_column(Integer, nullable=False)
    funded_amount_hkd: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    moonclerk_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    purchase_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    quantity_needed: Mapped[int | None] = mapped_column(Integer, nullable=True)
    quantity_secured: Mapped[int | None] = mapped_column(Integer, nullable=True)
    status: Mapped[str] = mapped_column(String(30), default="active", index=True, nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    donations: Mapped[list["Donation"]] = relationship(back_populates="support_opportunity")
