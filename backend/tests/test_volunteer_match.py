from fastapi.testclient import TestClient

from app.main import app
from app.routers import volunteer_match

client = TestClient(app)

MOCK_MATCHES = [
    {
        "role_id": "football-basketball",
        "icon": "⚽",
        "title": "Football & basketball coach",
        "desc": "Help run our weekly ball-game sessions.",
        "when": "Saturday mornings",
        "where": "San Po Kong centre",
        "category": "sport",
        "filled": 3,
        "total": 5,
        "note": None,
        "cta_label": "I'm interested",
        "score": 94,
        "reasons": [
            "Your hands-on energy fits our Saturday sport sessions.",
            "Weekend mornings line up with when you're free.",
        ],
    },
    {
        "role_id": "swimming-dragonboat",
        "icon": "🏊",
        "title": "Swimming & dragon boat buddy",
        "desc": "Support our water-based sessions.",
        "when": "Sunday mornings",
        "where": "Victoria Park pool",
        "category": "sport",
        "filled": 17,
        "total": 20,
        "note": None,
        "cta_label": "I'm interested",
        "score": 88,
        "reasons": [
            "Another active weekend role if sport is your pillar.",
            "Plenty of open spots on the roster.",
        ],
    },
]


def _mock_ai_match(*_args, **_kwargs):
    return MOCK_MATCHES, None


def test_volunteer_match_ai_weekend_sport(monkeypatch):
    monkeypatch.setattr(volunteer_match, "match_volunteer_with_ai", _mock_ai_match)
    response = client.post(
        "/ai/volunteer/match",
        json={
            "interest": "hands-on",
            "availability": "weekend-am",
            "commitment": "weekly",
            "group_size": "solo",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["enabled"] is True
    assert data["ai_enhanced"] is True
    assert len(data["matches"]) == 2
    assert data["matches"][0]["category"] == "sport"
    assert data["matches"][0]["score"] >= data["matches"][1]["score"]


def test_volunteer_match_ai_skills_flexible(monkeypatch):
    def mock_skills_match(*_args, **_kwargs):
        matches = [
            {
                **MOCK_MATCHES[0],
                "role_id": "skills-based",
                "title": "Skills-based placement",
                "category": "csr",
                "score": 91,
            },
            {
                **MOCK_MATCHES[1],
                "role_id": "corporate-day",
                "title": "Corporate volunteer day",
                "category": "csr",
                "score": 86,
            },
        ]
        return matches, None

    monkeypatch.setattr(volunteer_match, "match_volunteer_with_ai", mock_skills_match)
    response = client.post(
        "/ai/volunteer/match",
        json={
            "interest": "skills",
            "availability": "flexible",
            "commitment": "long-term",
            "group_size": "team",
        },
    )
    assert response.status_code == 200
    titles = [match["title"] for match in response.json()["matches"]]
    assert any("Skills-based" in title or "Corporate" in title for title in titles)


def test_volunteer_match_requires_ollama(monkeypatch):
    monkeypatch.setattr(
        volunteer_match,
        "match_volunteer_with_ai",
        lambda *_args, **_kwargs: (
            None,
            "Start Ollama with `llama3.2` to enable Smart Matching (ollama pull llama3.2, then ollama serve).",
        ),
    )
    response = client.post(
        "/ai/volunteer/match",
        json={
            "interest": "people",
            "availability": "weekday-am",
            "commitment": "one-off",
            "group_size": "friend",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["enabled"] is False
    assert "Ollama" in (data["message"] or "")


def test_list_volunteer_activities():
    response = client.get("/ai/volunteer/activities")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 10
    assert data[0]["role_id"]
    assert data[0]["title"]
