from fastapi.testclient import TestClient
from sqlalchemy import delete, select

from app.db import SessionLocal
from app.main import app
from app.models.user import User
from app.models.volunteer_activity import VolunteerActivity, VolunteerActivityRegistration


def _login(client: TestClient, email: str) -> str:
    response = client.post("/auth/login", json={"email": email, "password": "demo1234"})
    assert response.status_code == 200
    return response.json()["access_token"]


def _delete_registration(email: str, slug: str) -> None:
    with SessionLocal() as db:
        user = db.scalar(select(User).where(User.email == email))
        activity = db.scalar(select(VolunteerActivity).where(VolunteerActivity.slug == slug))
        if user is None or activity is None:
            return
        db.execute(
            delete(VolunteerActivityRegistration).where(
                VolunteerActivityRegistration.user_id == user.id,
                VolunteerActivityRegistration.activity_id == activity.id,
            )
        )
        db.commit()


def test_logged_in_user_can_register_for_volunteer_activity():
    _delete_registration("supporter@love21.demo", "skills-based")
    try:
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
    finally:
        _delete_registration("supporter@love21.demo", "skills-based")


def test_guest_cannot_register_for_volunteer_activity():
    with TestClient(app) as client:
        response = client.post("/ai/volunteer/activities/skills-based/signup")

    assert response.status_code == 401


def test_admin_registration_endpoint_requires_admin_role():
    _delete_registration("member@love21.demo", "community-dinners")
    try:
        with TestClient(app) as client:
            member_token = _login(client, "member@love21.demo")
            client.post(
                "/ai/volunteer/activities/community-dinners/signup",
                headers={"Authorization": f"Bearer {member_token}"},
            )
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
        assert any(
            registration["activity_slug"] == "community-dinners"
            and registration["user_email"] == "member@love21.demo"
            for registration in admin_response.json()
        )
    finally:
        _delete_registration("member@love21.demo", "community-dinners")
