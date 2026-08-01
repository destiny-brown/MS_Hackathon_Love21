from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator

GratitudeEntryStatus = Literal["pending", "approved", "rejected"]


class GratitudeEntryCreate(BaseModel):
    display_name: str | None = Field(default=None, max_length=120)
    message: str = Field(min_length=1, max_length=800)
    photo_url: str | None = Field(default=None, max_length=500)

    @model_validator(mode="after")
    def trim_fields(self):
        self.message = self.message.strip()
        if not self.message:
            raise ValueError("Message is required")
        if self.display_name is not None:
            self.display_name = self.display_name.strip() or None
        if self.photo_url is not None:
            self.photo_url = self.photo_url.strip() or None
        return self


class GratitudeEntryRead(BaseModel):
    id: int
    author_id: int
    display_name: str | None
    message: str
    photo_url: str | None
    status: GratitudeEntryStatus | str
    submitted_at: datetime
    moderated_at: datetime | None
    moderator_id: int | None

    model_config = ConfigDict(from_attributes=True)


class GratitudeEntryModeration(BaseModel):
    status: Literal["approved", "rejected"]
