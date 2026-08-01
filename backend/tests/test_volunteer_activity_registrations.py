from fastapi.testclient import TestClient

from app.main import app


def _login(client: TestClient, email: str) -> str:
    response = client.post("/auth/login", json={"email": email, "password": "demo1234"})
    assert response.status_code == 200
    return response.json()["access_token"]


def test_logged_in_user_can_register_for_volunteer_activity():
    with TestClient(app) as client:
        token = _login(client, "supporter@love21.demo")
        response = client.post(
            "/ai/volunteer/activities/skills-based/signup",
            headers={"Authorization": f"Bearer {token}"},
        )

    assert response.status_code == 201
    data = response.json()
    assert data["activity_slug"] == "skills-based"
    assert data["activity_name"] == "Skills-based placement"
    assert data["status"] == "registered"


def test_guest_cannot_register_for_volunteer_activity():
    with TestClient(app) as client:
        response = client.post("/ai/volunteer/activities/skills-based/signup")

    assert response.status_code == 401


def test_admin_registration_endpoint_requires_admin_role():
    with TestClient(app) as client:
        member_token = _login(client, "member@love21.demo")
        member_response = client.get(
            "/admin/volunteer-activity-registrations",
            headers={"Authorization": f"Bearer {member_token}"},
        )

        admin_token = _login(client, "admin@love21.demo")
        admin_response = client.get(
            "/admin/volunteer-activity-registrations",
            headers={"Authorization": f"Bearer {admin_token}"},
        )

    assert member_response.status_code == 403
    assert admin_response.status_code == 200
    assert len(admin_response.json()) >= 2
