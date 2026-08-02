from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class VolunteerActivity(Base):
    __tablename__ = "volunteer_activities"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    icon: Mapped[str] = mapped_column(String(16), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    schedule_label: Mapped[str] = mapped_column(String(120), nullable=False)
    location_label: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[str] = mapped_column(String(30), index=True, nullable=False)
    filled_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    total_spots: Mapped[int | None] = mapped_column(Integer, nullable=True)
    note: Mapped[str | None] = mapped_column(String(300), nullable=True)
    cta_label: Mapped[str] = mapped_column(String(80), default="I'm interested", nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="active", index=True, nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )

    registrations: Mapped[list["VolunteerActivityRegistration"]] = relationship(
        back_populates="activity", cascade="all, delete-orphan"
    )


class VolunteerActivityRegistration(Base):
    __tablename__ = "volunteer_activity_registrations"
    __table_args__ = (UniqueConstraint("user_id", "activity_id", name="uq_user_volunteer_activity_registration"),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)
    activity_id: Mapped[int] = mapped_column(ForeignKey("volunteer_activities.id"), index=True, nullable=False)
    activity_slug: Mapped[str] = mapped_column(String(120), nullable=False)
    activity_name: Mapped[str] = mapped_column(String(200), nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="registered", nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )

    user: Mapped["User"] = relationship(back_populates="volunteer_activity_registrations")
    activity: Mapped[VolunteerActivity] = relationship(back_populates="registrations")
