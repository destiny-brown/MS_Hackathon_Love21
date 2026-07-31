from datetime import datetime
from typing import Literal
from urllib.parse import urlparse

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

OpportunityKind = Literal["campaign", "cause", "wishlist"]
OpportunityStatus = Literal["active", "archived"]


def validate_optional_url(value: str | None) -> str | None:
    if value is None:
        return None
    normalized = value.strip()
    if not normalized:
        return None
    parsed = urlparse(normalized)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise ValueError("URL must start with http:// or https://")
    return normalized


class SupportOpportunityBase(BaseModel):
    kind: OpportunityKind
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1)
    impact_statement: str = Field(min_length=1)
    target_amount_hkd: int = Field(gt=0)
    funded_amount_hkd: int = Field(default=0, ge=0)
    moonclerk_url: str | None = Field(default=None, max_length=500)
    purchase_url: str | None = Field(default=None, max_length=500)
    quantity_needed: int | None = Field(default=None, gt=0)
    quantity_secured: int | None = Field(default=None, ge=0)
    status: OpportunityStatus = "active"
    display_order: int = Field(default=0, ge=0)

    @field_validator("title", "description", "impact_statement")
    @classmethod
    def strip_required_text(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("Value cannot be blank")
        return normalized

    @field_validator("moonclerk_url", "purchase_url")
    @classmethod
    def validate_url(cls, value: str | None) -> str | None:
        return validate_optional_url(value)

    @model_validator(mode="after")
    def validate_wishlist_fields(self):
        if self.kind != "wishlist" and (
            self.purchase_url is not None
            or self.quantity_needed is not None
            or self.quantity_secured is not None
        ):
            raise ValueError("Purchase and quantity fields are only available for wishlist items")
        if self.quantity_secured is not None and self.quantity_needed is None:
            raise ValueError("quantity_needed is required when quantity_secured is provided")
        if (
            self.quantity_needed is not None
            and self.quantity_secured is not None
            and self.quantity_secured > self.quantity_needed
        ):
            raise ValueError("quantity_secured cannot exceed quantity_needed")
        return self


class SupportOpportunityCreate(SupportOpportunityBase):
    pass


class SupportOpportunityUpdate(BaseModel):
    kind: OpportunityKind | None = None
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, min_length=1)
    impact_statement: str | None = Field(default=None, min_length=1)
    target_amount_hkd: int | None = Field(default=None, gt=0)
    funded_amount_hkd: int | None = Field(default=None, ge=0)
    moonclerk_url: str | None = Field(default=None, max_length=500)
    purchase_url: str | None = Field(default=None, max_length=500)
    quantity_needed: int | None = Field(default=None, gt=0)
    quantity_secured: int | None = Field(default=None, ge=0)
    status: OpportunityStatus | None = None
    display_order: int | None = Field(default=None, ge=0)

    @field_validator("title", "description", "impact_statement")
    @classmethod
    def strip_optional_text(cls, value: str | None) -> str | None:
        if value is None:
            return None
        normalized = value.strip()
        if not normalized:
            raise ValueError("Value cannot be blank")
        return normalized

    @field_validator("moonclerk_url", "purchase_url")
    @classmethod
    def validate_url(cls, value: str | None) -> str | None:
        return validate_optional_url(value)


class SupportOpportunityRead(SupportOpportunityBase):
    id: int
    slug: str
    progress_percent: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
