from fastapi.testclient import TestClient

from app.main import app
from app.routers import captain_chat
from app.services import captain_rag

client = TestClient(app)


def test_captain_rag_retrieves_volunteer_content():
    chunks = captain_rag.retrieve_knowledge("how can I volunteer on weekends", limit=3)
    assert any("volunteer" in chunk.title.lower() or "volunteer" in chunk.text.lower() for chunk in chunks)


def test_captain_chat_agent_returns_tool_calls(monkeypatch):
    monkeypatch.setattr(
        captain_chat,
        "chat_json",
        lambda **_kwargs: {
            "reply": "Volunteering is a wonderful way to support Love 21!",
            "tool_calls": [{"name": "navigate_to_page", "arguments": {"path": "/our-volunteer"}}],
        },
    )
    response = client.post(
        "/ai/captain/chat",
        json={"message": "Take me to volunteer", "history": [], "locale": "en"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["enabled"] is True
    assert len(data["tool_calls"]) == 1
    assert data["tool_calls"][0]["name"] == "navigate_to_page"
    assert data["tool_calls"][0]["arguments"]["path"] == "/our-volunteer"
    assert len(data["links"]) >= 1


def test_captain_chat_returns_site_links_for_donate(monkeypatch):
    monkeypatch.setattr(
        captain_chat,
        "chat_json",
        lambda **_kwargs: {
            "reply": "Every gift helps our members thrive!",
            "tool_calls": [{"name": "navigate_to_page", "arguments": {"path": "/donate"}}],
        },
    )
    response = client.post(
        "/ai/captain/chat",
        json={"message": "I want to make a donation", "history": []},
    )
    assert response.status_code == 200
    data = response.json()
    assert any(link["href"] == "/donate" for link in data["links"])
    assert data["tool_calls"][0]["arguments"]["path"] == "/donate"


def test_captain_chat_infers_language_tool(monkeypatch):
    monkeypatch.setattr(captain_chat, "chat_json", lambda **_kwargs: {"reply": "Sure!", "tool_calls": []})
    response = client.post(
        "/ai/captain/chat",
        json={"message": "Please switch to Cantonese", "history": [], "locale": "en"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["tool_calls"][0]["name"] == "set_site_language"
    assert data["tool_calls"][0]["arguments"]["locale"] == "yue"


def test_captain_chat_fallback_when_hosted_model_unavailable(monkeypatch):
    monkeypatch.setattr(captain_chat, "chat_json", lambda **_kwargs: None)
    monkeypatch.setattr(captain_chat, "chat_text", lambda **_kwargs: None)
    response = client.post(
        "/ai/captain/chat",
        json={"message": "Take me to sport programmes", "history": [], "locale": "en"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["enabled"] is False
    assert data["message"]
    assert len(data["links"]) >= 1
    assert len(data["reply"]) > 10
