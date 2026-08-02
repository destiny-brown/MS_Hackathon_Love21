from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def _login(client: TestClient, email: str) -> dict:
    response = client.post("/auth/login", json={"email": email, "password": "demo1234"})
    assert response.status_code == 200
    return response.json()


def test_login_returns_access_and_refresh_tokens():
    data = _login(client, "supporter@love21.demo")
    assert data["access_token"]
    assert data["refresh_token"]
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "supporter@love21.demo"


def test_me_requires_bearer_token():
    data = _login(client, "member@love21.demo")
    response = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {data['access_token']}"},
    )
    assert response.status_code == 200
    assert response.json()["role"] == "member"


def test_refresh_rotates_session():
    data = _login(client, "admin@love21.demo")
    refresh_response = client.post(
        "/auth/refresh",
        json={"refresh_token": data["refresh_token"]},
    )
    assert refresh_response.status_code == 200
    refreshed = refresh_response.json()
    assert refreshed["access_token"]
    assert refreshed["refresh_token"]
    assert refreshed["refresh_token"] != data["refresh_token"]

    stale_response = client.post(
        "/auth/refresh",
        json={"refresh_token": data["refresh_token"]},
    )
    assert stale_response.status_code == 401


def test_admin_route_checks_role_from_database():
    supporter = _login(client, "supporter@love21.demo")
    response = client.get(
        "/admin/newsletter/subscribers",
        headers={"Authorization": f"Bearer {supporter['access_token']}"},
    )
    assert response.status_code == 403

    admin = _login(client, "admin@love21.demo")
    response = client.get(
        "/admin/newsletter/subscribers",
        headers={"Authorization": f"Bearer {admin['access_token']}"},
    )
    assert response.status_code == 200
