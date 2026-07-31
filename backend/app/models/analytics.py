from __future__ import annotations

from datetime import date, datetime, timezone

from sqlalchemy import Date, DateTime, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import JSON

from app.db import Base


class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    occurred_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )
    event_name: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    user_id: Mapped[int | None] = mapped_column(Integer, nullable=True, index=True)
    session_id: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)
    locale: Mapped[str | None] = mapped_column(String(8), nullable=True)
    page_path: Mapped[str | None] = mapped_column(String(255), nullable=True)
    source: Mapped[str] = mapped_column(String(16), default="web", nullable=False)
    properties: Mapped[dict | None] = mapped_column(JSON, nullable=True)


class AnalyticsDailyRollup(Base):
    __tablename__ = "analytics_daily_rollups"
    __table_args__ = (UniqueConstraint("rollup_date", "metric_key", name="uq_rollup_date_metric"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    rollup_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    metric_key: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    dimensions: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    value: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
