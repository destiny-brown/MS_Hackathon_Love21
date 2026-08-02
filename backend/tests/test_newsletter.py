from fastapi.testclient import TestClient
import pytest
from sqlalchemy import delete

from app.db import SessionLocal
from app.main import app
from app.models.newsletter import NewsletterDelivery
from app.models.newsletter import NewsletterSubscriber
from app.routers import admin
from app.services import newsletter_ai

client = TestClient(app)


@pytest.fixture(autouse=True)
def reset_newsletter_tables():
    with SessionLocal() as db:
        db.execute(delete(NewsletterDelivery))
        db.execute(delete(NewsletterSubscriber))
        db.commit()
    yield


def _login(client: TestClient, email: str) -> str:
    response = client.post("/auth/login", json={"email": email, "password": "demo1234"})
    assert response.status_code == 200
    return response.json()["access_token"]


def test_subscribe_stores_frequency():
    response = client.post(
        "/newsletter/subscribe",
        json={
            "first_name": "Weekly",
            "last_name": "Reader",
            "email": "weekly.reader@example.com",
            "frequency": "weekly",
        },
    )
    assert response.status_code == 201
    assert response.json()["frequency"] == "weekly"


def test_generate_newsletter_uses_fallback_when_model_disabled():
    admin_token = _login(client, "admin@love21.demo")
    response = client.post(
        "/admin/newsletter/generate",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"cadence": "weekly", "guidance": "Keep it short."},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["subject"]
    assert data["content"]
    assert data["cadence"] == "weekly"
    assert data["sources"]["member_stories"]
    assert data["notice"]


def test_send_newsletter_filters_recipient_groups(monkeypatch):
    with SessionLocal() as db:
        db.add(
            NewsletterSubscriber(
                first_name="Weekly",
                last_name="One",
                email="weekly-one@example.com",
                frequency="weekly",
                status="active",
            )
        )
        db.add(
            NewsletterSubscriber(
                first_name="Monthly",
                last_name="One",
                email="monthly-one@example.com",
                frequency="monthly",
                status="active",
            )
        )
        db.commit()

    sent: list[str] = []

    def fake_send_email(*, to_email: str, **_kwargs):
        sent.append(to_email)
        return True

    monkeypatch.setattr(admin, "send_email", fake_send_email)

    admin_token = _login(client, "admin@love21.demo")
    response = client.post(
        "/admin/newsletter/send",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={
            "subject": "Weekly update",
            "content": "Hello from Love 21.",
            "cadence": "weekly",
            "recipient_groups": ["weekly"],
        },
    )
    assert response.status_code == 200
    assert response.json()["sent_count"] == 1
    assert sent == ["weekly-one@example.com"]


def test_gather_newsletter_sources_includes_member_stories():
    with SessionLocal() as db:
        sources = newsletter_ai.gather_newsletter_sources(db, "monthly")
    assert sources["member_stories"]
    assert any(story["name"] == "Yuk Lam" for story in sources["member_stories"])
