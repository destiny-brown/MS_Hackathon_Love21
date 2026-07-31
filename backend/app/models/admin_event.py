from __future__ import annotations

from datetime import date, datetime, timezone
from enum import StrEnum

from sqlalchemy import Date, DateTime, Enum, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class EventCategory(StrEnum):
    FUNDRAISING = "fundraising"
    COMMUNITY = "community"
    SPORTS = "sports"
    NUTRITION = "nutrition"
    FAMILY = "family"


class EventStatus(StrEnum):
    UPCOMING = "upcoming"
    ONGOING = "ongoing"
    COMPLETED = "completed"


class AdminEvent(Base):
    __tablename__ = "admin_events"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    event_date: Mapped[date] = mapped_column(Date, nullable=False)
    location: Mapped[str] = mapped_column(String(255), default="", nullable=False)
    registrations: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    max_capacity: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    category: Mapped[EventCategory] = mapped_column(
        Enum(EventCategory, values_callable=lambda enum: [item.value for item in enum]),
        default=EventCategory.COMMUNITY,
        nullable=False,
    )
    status: Mapped[EventStatus] = mapped_column(
        Enum(EventStatus, values_callable=lambda enum: [item.value for item in enum]),
        default=EventStatus.UPCOMING,
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
