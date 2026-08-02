from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.schemas.support_opportunity import SupportOpportunityRead

DonationFrequency = Literal["one_time", "monthly"]
DonationStatus = Literal["succeeded", "failed"]
ActivitySignupStatus = Literal["signed_up", "attended", "cancelled"]


class DonationCreate(BaseModel):
    amount_hkd: int = Field(gt=0, le=1_000_000)
    frequency: DonationFrequency = "one_time"
    support_opportunity_id: int | None = None
    donor_email: str | None = Field(default=None, max_length=255)
    donor_name: str | None = Field(default=None, max_length=200)
    message: str | None = Field(default=None, max_length=1000)

    @model_validator(mode="after")
    def require_guest_email(self):
        if self.donor_email is not None:
            self.donor_email = self.donor_email.lower()
        if self.donor_name is not None:
            self.donor_name = self.donor_name.strip() or None
        if self.message is not None:
            self.message = self.message.strip() or None
        return self


class DonationRead(BaseModel):
    id: int
    supporter_id: int | None
    support_opportunity_id: int | None
    donor_email: str | None
    donor_name: str | None
    amount_hkd: int
    frequency: DonationFrequency
    status: DonationStatus | str
    payment_reference: str
    message: str | None
    created_at: datetime
    support_opportunity: SupportOpportunityRead | None = None

    model_config = ConfigDict(from_attributes=True)


class DonationReceipt(BaseModel):
    donation: DonationRead
    attributed_to_account: bool
    account_prompt: str | None = None


class ActivityRead(BaseModel):
    id: int
    title: str
    starts_at: datetime
    ends_at: datetime | None
    location: str
    description: str
    signed_up: bool = False

    model_config = ConfigDict(from_attributes=True)


class ActivitySignupRead(BaseModel):
    id: int
    supporter_id: int
    activity_id: int
    status: ActivitySignupStatus | str
    created_at: datetime
    activity: ActivityRead

    model_config = ConfigDict(from_attributes=True)


class VolunteerActivityRegistrationRead(BaseModel):
    id: int
    user_id: int
    activity_id: int
    activity_slug: str
    activity_name: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class VolunteerHourCreate(BaseModel):
    activity_id: int | None = None
    hours: float = Field(gt=0, le=24)
    notes: str | None = Field(default=None, max_length=1000)


class VolunteerHourRead(BaseModel):
    id: int
    supporter_id: int
    activity_id: int | None
    hours: float
    notes: str | None
    logged_at: datetime
    activity: ActivityRead | None = None

    model_config = ConfigDict(from_attributes=True)


class ImpactItem(BaseModel):
    title: str
    amount_hkd: int
    message: str
    progress_percent: int


class SupporterDashboardRead(BaseModel):
    donations: list[DonationRead]
    total_given_hkd: int
    recurring_status: str
    impact_items: list[ImpactItem]
    signed_up_activities: list[ActivitySignupRead]
    volunteer_hours: list[VolunteerHourRead]
    total_volunteer_hours: float


class UserPlayStateRead(BaseModel):
    day_number: int
    event_index: int
    correct_count: int
    total_answered: int
    current_streak: int
    best_streak: int
    total_plays: int
    location_id: str
    location_label: str
    events_total: int
    events_remaining: int
    last_played_at: datetime | None
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserPlayStateUpdate(BaseModel):
    day_number: int = Field(ge=1, le=10_000)
    event_index: int = Field(ge=0, le=100)
    correct_count: int = Field(ge=0, le=1_000_000)
    total_answered: int = Field(ge=0, le=1_000_000)
    current_streak: int = Field(ge=0, le=10_000)
    best_streak: int = Field(ge=0, le=10_000)
    total_plays: int = Field(ge=0, le=10_000)


class CaptainsCornerRead(BaseModel):
    play_state: UserPlayStateRead
    captain_message: str
    ai_enhanced: bool
