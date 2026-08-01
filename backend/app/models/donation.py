from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class Donation(Base):
    __tablename__ = "donations"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    supporter_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), index=True, nullable=True)
    support_opportunity_id: Mapped[int | None] = mapped_column(
        ForeignKey("support_opportunities.id"), index=True, nullable=True
    )
    donor_email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    donor_name: Mapped[str | None] = mapped_column(String(200), nullable=True)
    amount_hkd: Mapped[int] = mapped_column(Integer, nullable=False)
    frequency: Mapped[str] = mapped_column(String(30), default="one_time", nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="succeeded", nullable=False)
    payment_reference: Mapped[str] = mapped_column(String(80), unique=True, index=True, nullable=False)
    message: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )

    supporter: Mapped["User | None"] = relationship(back_populates="donations")
    support_opportunity: Mapped["SupportOpportunity | None"] = relationship(back_populates="donations")
