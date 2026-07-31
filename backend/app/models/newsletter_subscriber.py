from __future__ import annotations

from datetime import datetime, timezone
from enum import StrEnum

from sqlalchemy import DateTime, Enum, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class SubscriberStatus(StrEnum):
    ACTIVE = "active"
    UNSUBSCRIBED = "unsubscribed"


class NewsletterSubscriber(Base):
    __tablename__ = "newsletter_subscribers"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    first_name: Mapped[str] = mapped_column(String(120), default="", nullable=False)
    last_name: Mapped[str] = mapped_column(String(120), default="", nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    phone_number: Mapped[str] = mapped_column(String(40), default="", nullable=False)
    status: Mapped[SubscriberStatus] = mapped_column(
        Enum(SubscriberStatus, values_callable=lambda enum: [item.value for item in enum]),
        default=SubscriberStatus.ACTIVE,
        nullable=False,
    )
    subscribed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
