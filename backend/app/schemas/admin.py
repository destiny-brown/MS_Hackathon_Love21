from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ActivityAdminRead(BaseModel):
    id: int
    title: str
    starts_at: datetime
    ends_at: datetime | None
    location: str
    description: str
    max_capacity: int | None = None
    category: str | None = None
    status: str
    registration_count: int = 0
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ActivityAdminCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    starts_at: datetime
    ends_at: datetime | None = None
    location: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=1)
    max_capacity: int | None = Field(default=None, ge=1)
    category: str | None = Field(default=None, max_length=50)
    status: str = Field(default="upcoming", max_length=30)


class ActivityAdminUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    starts_at: datetime | None = None
    ends_at: datetime | None = None
    location: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = Field(default=None, min_length=1)
    max_capacity: int | None = Field(default=None, ge=1)
    category: str | None = Field(default=None, max_length=50)
    status: str | None = Field(default=None, max_length=30)


class VolunteerActivityAdminRead(BaseModel):
    id: int
    slug: str
    icon: str
    title: str
    description: str
    schedule_label: str
    location_label: str
    category: str
    filled_count: int | None = None
    total_spots: int | None = None
    note: str | None = None
    cta_label: str
    status: str
    display_order: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class VolunteerActivityAdminCreate(BaseModel):
    slug: str = Field(min_length=1, max_length=120)
    icon: str = Field(default="🤝", max_length=16)
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1)
    schedule_label: str = Field(min_length=1, max_length=120)
    location_label: str = Field(min_length=1, max_length=200)
    category: str = Field(min_length=1, max_length=30)
    filled_count: int | None = Field(default=None, ge=0)
    total_spots: int | None = Field(default=None, ge=1)
    note: str | None = Field(default=None, max_length=300)
    cta_label: str = Field(default="I'm interested", max_length=80)
    status: str = Field(default="active", max_length=30)
    display_order: int = Field(default=0, ge=0)


class VolunteerActivityAdminUpdate(BaseModel):
    slug: str | None = Field(default=None, min_length=1, max_length=120)
    icon: str | None = Field(default=None, max_length=16)
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, min_length=1)
    schedule_label: str | None = Field(default=None, min_length=1, max_length=120)
    location_label: str | None = Field(default=None, min_length=1, max_length=200)
    category: str | None = Field(default=None, max_length=30)
    filled_count: int | None = Field(default=None, ge=0)
    total_spots: int | None = Field(default=None, ge=1)
    note: str | None = Field(default=None, max_length=300)
    cta_label: str | None = Field(default=None, max_length=80)
    status: str | None = Field(default=None, max_length=30)
    display_order: int | None = Field(default=None, ge=0)


class AdminOverviewRead(BaseModel):
    event_count: int
    volunteer_program_count: int
    subscriber_count: int
    active_subscriber_count: int
    learn_question_count: int = 0
    learn_resource_count: int = 0
    learn_video_count: int = 0
