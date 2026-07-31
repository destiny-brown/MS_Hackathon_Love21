from __future__ import annotations

from datetime import datetime, timezone
from enum import StrEnum

from sqlalchemy import DateTime, Enum, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class ProgramCategory(StrEnum):
    SPORT = "sport"
    NUTRITION = "nutrition"
    FAMILY = "family"
    CSR = "csr"


class ProgramStatus(StrEnum):
    OPEN = "open"
    CLOSING = "closing"
    FILLED = "filled"


class AdminVolunteerProgram(Base):
    __tablename__ = "admin_volunteer_programs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    category: Mapped[ProgramCategory] = mapped_column(
        Enum(ProgramCategory, values_callable=lambda enum: [item.value for item in enum]),
        default=ProgramCategory.SPORT,
        nullable=False,
    )
    schedule: Mapped[str] = mapped_column(String(255), default="", nullable=False)
    location: Mapped[str] = mapped_column(String(255), default="", nullable=False)
    filled: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    status: Mapped[ProgramStatus] = mapped_column(
        Enum(ProgramStatus, values_callable=lambda enum: [item.value for item in enum]),
        default=ProgramStatus.OPEN,
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
