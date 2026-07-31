from datetime import datetime, timezone
from enum import StrEnum

from sqlalchemy import DateTime, Enum, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class Role(StrEnum):
    DONOR = "donor"
    VOLUNTEER = "volunteer"
    MEMBER = "member"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    # One role per account for now; multi-role accounts can be added later if Love 21 needs overlap.
    role: Mapped[Role] = mapped_column(
        Enum(Role, values_callable=lambda enum: [role.value for role in enum]),
        default=Role.DONOR,
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )

    items: Mapped[list["Item"]] = relationship(back_populates="owner", cascade="all, delete-orphan")
