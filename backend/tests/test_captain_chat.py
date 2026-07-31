from fastapi.testclient import TestClient

from app.main import app
from app.routers import captain_chat
from app.services import captain_rag

client = TestClient(app)


def test_captain_rag_retrieves_volunteer_content():
    chunks = captain_rag.retrieve_knowledge("how can I volunteer on weekends", limit=3)
    assert any("volunteer" in chunk.title.lower() or "volunteer" in chunk.text.lower() for chunk in chunks)


def test_captain_chat_with_mock_ollama(monkeypatch):
    monkeypatch.setattr(
        captain_chat,
        "chat_text",
        lambda **_kwargs: "Volunteering is a wonderful way to support Love 21 — check our Volunteer page!",
    )
    response = client.post(
        "/ai/captain/chat",
        json={"message": "How do I volunteer?", "history": [], "locale": "en"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["enabled"] is True
    assert len(data["links"]) >= 1
    assert any(link["href"] == "/our-volunteer" for link in data["links"])
    assert len(data["reply"]) > 10


def test_captain_chat_returns_site_links_for_donate(monkeypatch):
    monkeypatch.setattr(
        captain_chat,
        "chat_text",
        lambda **_kwargs: "Every gift helps our members thrive — visit our Donate page to give.",
    )
    response = client.post(
        "/ai/captain/chat",
        json={"message": "I want to make a donation", "history": []},
    )
    assert response.status_code == 200
    data = response.json()
    assert any(link["href"] == "/donate" for link in data["links"])


def test_captain_chat_fallback_when_ollama_unavailable(monkeypatch):
    monkeypatch.setattr(captain_chat, "chat_text", lambda **_kwargs: None)
    response = client.post(
        "/ai/captain/chat",
        json={"message": "Tell me about sport programmes", "history": [], "locale": "en"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["enabled"] is False
    assert data["message"]
    assert len(data["links"]) >= 1
    assert len(data["reply"]) > 10
