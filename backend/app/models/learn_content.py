from datetime import datetime, timezone
from enum import StrEnum

from sqlalchemy import Boolean, DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import JSON

from app.db import Base


class LearnContentStatus(StrEnum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class LearnQuestionKind(StrEnum):
    QUIZ = "quiz"
    DAILY = "daily"
    TRAIL = "trail"


class LearnQuestion(Base):
    __tablename__ = "learn_questions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    external_id: Mapped[str | None] = mapped_column(String(40), index=True, nullable=True)
    kind: Mapped[LearnQuestionKind] = mapped_column(String(20), index=True, nullable=False)
    status: Mapped[LearnContentStatus] = mapped_column(
        String(20), default=LearnContentStatus.DRAFT, index=True, nullable=False
    )
    statement: Mapped[str] = mapped_column(Text, nullable=False)
    answer: Mapped[str] = mapped_column(String(40), nullable=False)
    explanation: Mapped[str] = mapped_column(Text, nullable=False)
    hint: Mapped[str | None] = mapped_column(Text, nullable=True)
    topic: Mapped[str | None] = mapped_column(String(120), nullable=True)
    question_type: Mapped[str | None] = mapped_column(String(30), nullable=True)
    options_json: Mapped[list | None] = mapped_column(JSON, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    image_credit: Mapped[str | None] = mapped_column(String(200), nullable=True)
    source: Mapped[str | None] = mapped_column(String(200), nullable=True)
    related_story_slugs: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
    audience: Mapped[str] = mapped_column(String(30), default="all", nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    trail_location_id: Mapped[str | None] = mapped_column(String(40), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class LearnResource(Base):
    __tablename__ = "learn_resources"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    date_label: Mapped[str] = mapped_column(String(40), nullable=False)
    cover_image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    source_url: Mapped[str] = mapped_column(String(500), nullable=False)
    source_label: Mapped[str] = mapped_column(String(200), nullable=False)
    topics: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
    learning_hook: Mapped[str] = mapped_column(Text, nullable=False)
    audience: Mapped[str] = mapped_column(String(30), default="all", nullable=False)
    resource_type: Mapped[str] = mapped_column(String(30), default="press", nullable=False)
    origin: Mapped[str] = mapped_column(String(20), default="love21", nullable=False)
    show_on_learn: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    show_on_stories: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    status: Mapped[LearnContentStatus] = mapped_column(
        String(20), default=LearnContentStatus.DRAFT, index=True, nullable=False
    )
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class LearnVideo(Base):
    __tablename__ = "learn_videos"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    video_id: Mapped[str] = mapped_column(String(40), unique=True, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    channel_title: Mapped[str] = mapped_column(String(200), nullable=False)
    published_at: Mapped[str] = mapped_column(String(40), nullable=False)
    thumbnail_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    status: Mapped[LearnContentStatus] = mapped_column(
        String(20), default=LearnContentStatus.DRAFT, index=True, nullable=False
    )
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
