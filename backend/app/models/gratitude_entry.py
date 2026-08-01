from datetime import datetime, timezone
from enum import StrEnum

from sqlalchemy import DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class GratitudeEntryStatus(StrEnum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class GratitudeEntry(Base):
    __tablename__ = "gratitude_entries"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)
    display_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    photo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    status: Mapped[GratitudeEntryStatus] = mapped_column(
        Enum(GratitudeEntryStatus, values_callable=lambda enum: [status.value for status in enum]),
        default=GratitudeEntryStatus.PENDING,
        index=True,
        nullable=False,
    )
    submitted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )
    moderated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    moderator_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)

    author: Mapped["User"] = relationship(foreign_keys=[author_id], back_populates="gratitude_entries")
    moderator: Mapped["User | None"] = relationship(foreign_keys=[moderator_id])
