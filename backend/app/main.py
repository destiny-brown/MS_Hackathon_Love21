from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.db import create_db_and_tables
from app.routers import (
    admin,
    ai,
    auth,
    captain_chat,
    items,
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
app.include_router(ai.router)
app.include_router(volunteer_match.router)
app.include_router(captain_chat.router)
app.include_router(trail_debrief.router)
app.include_router(support_opportunities.router)
app.include_router(supporter.router)
app.include_router(role_examples.router)
app.include_router(newsletter.router)
app.include_router(admin.router)
