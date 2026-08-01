from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class Activity(Base):
    __tablename__ = "activities"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    starts_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True, nullable=False)
    ends_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )

    signups: Mapped[list["ActivitySignup"]] = relationship(back_populates="activity", cascade="all, delete-orphan")
    volunteer_hours: Mapped[list["VolunteerHour"]] = relationship(back_populates="activity")


class ActivitySignup(Base):
    __tablename__ = "activity_signups"
    __table_args__ = (UniqueConstraint("supporter_id", "activity_id", name="uq_supporter_activity_signup"),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    supporter_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)
    activity_id: Mapped[int] = mapped_column(ForeignKey("activities.id"), index=True, nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="signed_up", nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )

    supporter: Mapped["User"] = relationship(back_populates="activity_signups")
    activity: Mapped[Activity] = relationship(back_populates="signups")


class VolunteerHour(Base):
    __tablename__ = "volunteer_hours"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    supporter_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)
    activity_id: Mapped[int | None] = mapped_column(ForeignKey("activities.id"), index=True, nullable=True)
    hours: Mapped[float] = mapped_column(Float, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    logged_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )

    supporter: Mapped["User"] = relationship(back_populates="volunteer_hours")
    activity: Mapped[Activity | None] = relationship(back_populates="volunteer_hours")
