from datetime import datetime, timezone
from enum import StrEnum

from sqlalchemy import DateTime, Enum, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class Role(StrEnum):
    SUPPORTER = "supporter"
    MEMBER = "member"
    ADMIN = "admin"
    DONOR = "donor"
    VOLUNTEER = "volunteer"

    @classmethod
    def canonical(cls, role: "Role | str") -> "Role":
        normalized = cls(role)
        if normalized in (cls.DONOR, cls.VOLUNTEER):
            return cls.SUPPORTER
        return normalized


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    # Supporter combines donor + volunteer for now. If Love 21 later needs finer permissions,
    # can_donate/can_volunteer flags would be a clean extension without splitting accounts again.
    role: Mapped[Role] = mapped_column(
        Enum(Role, values_callable=lambda enum: [role.value for role in enum]),
        default=Role.SUPPORTER,
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )

    items: Mapped[list["Item"]] = relationship(back_populates="owner", cascade="all, delete-orphan")
    donations: Mapped[list["Donation"]] = relationship(back_populates="supporter")
    activity_signups: Mapped[list["ActivitySignup"]] = relationship(back_populates="supporter", cascade="all, delete-orphan")
    volunteer_activity_registrations: Mapped[list["VolunteerActivityRegistration"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    volunteer_hours: Mapped[list["VolunteerHour"]] = relationship(back_populates="supporter", cascade="all, delete-orphan")
    gratitude_entries: Mapped[list["GratitudeEntry"]] = relationship(
        back_populates="author",
        cascade="all, delete-orphan",
        foreign_keys="GratitudeEntry.author_id",
    )
