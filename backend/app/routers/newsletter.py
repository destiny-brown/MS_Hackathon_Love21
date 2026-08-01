from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.newsletter import NewsletterSubscriber
from app.schemas.newsletter import (
    NewsletterSubscribeRequest,
    NewsletterSubscriberRead,
    NewsletterUnsubscribeResponse,
)

router = APIRouter(prefix="/newsletter", tags=["newsletter"])


@router.post("/subscribe", response_model=NewsletterSubscriberRead, status_code=status.HTTP_201_CREATED)
def subscribe(payload: NewsletterSubscribeRequest, db: Session = Depends(get_db)) -> NewsletterSubscriberRead:
    email = payload.email.lower()
    subscriber = db.scalar(select(NewsletterSubscriber).where(NewsletterSubscriber.email == email))
    if subscriber:
        subscriber.first_name = payload.first_name
        subscriber.last_name = payload.last_name
        subscriber.phone_number = payload.phone_number
        subscriber.status = "active"
    else:
        subscriber = NewsletterSubscriber(
            first_name=payload.first_name,
            last_name=payload.last_name,
            email=email,
            phone_number=payload.phone_number,
            status="active",
        )
        db.add(subscriber)
    db.commit()
    db.refresh(subscriber)
    return NewsletterSubscriberRead.model_validate(subscriber)


@router.post("/unsubscribe/{token}", response_model=NewsletterUnsubscribeResponse)
def unsubscribe(token: str, db: Session = Depends(get_db)) -> NewsletterUnsubscribeResponse:
    subscriber = db.scalar(select(NewsletterSubscriber).where(NewsletterSubscriber.unsubscribe_token == token))
    if subscriber is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscription not found")
    subscriber.status = "unsubscribed"
    db.commit()
    return NewsletterUnsubscribeResponse(
        email=subscriber.email,
        status=subscriber.status,
        message="You have been unsubscribed from Love 21 Foundation newsletters.",
    )
