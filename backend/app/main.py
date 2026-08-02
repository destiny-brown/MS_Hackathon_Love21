from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.db import create_db_and_tables, ensure_bootstrap_admin, ensure_demo_users, ensure_role_enum_compatibility
from app.services.learn_seed import ensure_learn_content
from app.services.model_client import warmup_hosted_model
from app.services.support_opportunity_seed import ensure_support_opportunities
from app.services.volunteer_activity_seed import ensure_volunteer_activity_demo_data
from app.routers import (
    admin,
    admin_learn,
    auth,
    captain_chat,
    gratitude_entries,
    items,
    learn,
    member,
    newsletter,
    role_examples,
    support_opportunities,
    supporter,
    trail_debrief,
    volunteer_match,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    ensure_role_enum_compatibility()
    ensure_demo_users()
    ensure_bootstrap_admin()
    ensure_learn_content()
    ensure_support_opportunities()
    ensure_volunteer_activity_demo_data()
    warmup_hosted_model()
    yield


settings = get_settings()
app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "app": settings.app_name}


app.include_router(auth.router)
app.include_router(items.router)
app.include_router(volunteer_match.router)
app.include_router(captain_chat.router)
app.include_router(trail_debrief.router)
app.include_router(support_opportunities.router)
app.include_router(supporter.router)
app.include_router(member.router)
app.include_router(gratitude_entries.router)
app.include_router(learn.router)
app.include_router(role_examples.router)
app.include_router(newsletter.router)
app.include_router(admin.router)
app.include_router(admin_learn.router)
