from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class NewsletterSubscribeRequest(BaseModel):
    first_name: str = Field(default="", max_length=100)
    last_name: str = Field(default="", max_length=100)
    email: EmailStr
    phone_number: str | None = Field(default=None, max_length=50)


class NewsletterSubscriberRead(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone_number: str | None
    status: str
    subscribed_at: datetime

    model_config = ConfigDict(from_attributes=True)


class NewsletterSubscriberCreate(BaseModel):
    first_name: str = Field(default="", max_length=100)
    last_name: str = Field(default="", max_length=100)
    email: EmailStr
    phone_number: str | None = Field(default=None, max_length=50)
    status: str = Field(default="active", max_length=30)


class NewsletterSubscriberUpdate(BaseModel):
    first_name: str | None = Field(default=None, max_length=100)
    last_name: str | None = Field(default=None, max_length=100)
    email: EmailStr | None = None
    phone_number: str | None = Field(default=None, max_length=50)
    status: str | None = Field(default=None, max_length=30)


class NewsletterSendRequest(BaseModel):
    subject: str = Field(min_length=1, max_length=300)
    content: str = Field(min_length=1)


class NewsletterPreviewRequest(BaseModel):
    subject: str = Field(min_length=1, max_length=300)
    content: str = Field(min_length=1)
    unsubscribe_url: str | None = Field(default=None, max_length=500)


class NewsletterDeliveryRead(BaseModel):
    id: int
    subject: str
    content_text: str
    recipient_count: int
    sent_at: datetime

    model_config = ConfigDict(from_attributes=True)


class NewsletterUnsubscribeResponse(BaseModel):
    email: str
    status: str
    message: str


class NewsletterPreviewResponse(BaseModel):
    html: str
