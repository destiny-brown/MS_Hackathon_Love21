from fastapi.testclient import TestClient
from passlib.context import CryptContext
from sqlalchemy import select

from app.core.security import verify_password
from app.db import SessionLocal
from app.main import app
from app.models.user import Role, User

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


def test_login_rehashes_outdated_bcrypt_hash():
    email = "rehash-test@love21.demo"
    password = "demo1234"
    weak_context = CryptContext(schemes=["bcrypt"], bcrypt__rounds=4)
    weak_hash = weak_context.hash(password)

    with SessionLocal() as db:
        user = db.scalar(select(User).where(User.email == email))
        if user is None:
            user = User(email=email, hashed_password=weak_hash, role=Role.SUPPORTER)
            db.add(user)
        else:
            user.hashed_password = weak_hash
            user.role = Role.SUPPORTER
        db.commit()

    response = client.post("/auth/login", json={"email": email, "password": password})
    assert response.status_code == 200
    data = response.json()
    assert data["access_token"]
    assert data["refresh_token"]

    with SessionLocal() as db:
        updated = db.scalar(select(User).where(User.email == email))
        assert updated is not None
        assert updated.hashed_password != weak_hash
        assert verify_password(password, updated.hashed_password)
