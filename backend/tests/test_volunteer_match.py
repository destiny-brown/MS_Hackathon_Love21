from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_volunteer_match_weekend_sport():
    response = client.post(
        "/ai/volunteer/match",
        json={"interest": "hands-on", "availability": "weekend-am"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["enabled"] is True
    assert len(data["matches"]) == 2
    assert data["matches"][0]["category"] == "sport"
    assert data["matches"][0]["score"] >= data["matches"][1]["score"]


def test_volunteer_match_skills_flexible():
    response = client.post(
        "/ai/volunteer/match",
        json={"interest": "skills", "availability": "flexible"},
    )
    assert response.status_code == 200
    titles = [match["title"] for match in response.json()["matches"]]
    assert any("Skills-based" in title or "Corporate" in title for title in titles)


def test_list_volunteer_activities():
    response = client.get("/ai/volunteer/activities")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 10
    assert data[0]["role_id"]
    assert data[0]["title"]
