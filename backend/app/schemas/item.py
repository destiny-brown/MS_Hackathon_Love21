from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


# COPY THIS to add a new resource fast.
class ItemBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str | None = None


class ItemCreate(ItemBase):
    pass


class ItemUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = None


class ItemRead(ItemBase):
    id: int
    owner_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
