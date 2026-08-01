from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.learn_content import LearnContentStatus, LearnQuestion, LearnResource, LearnVideo
from app.schemas.learn import LearnQuestionRead, LearnResourceRead, LearnVideoRead

router = APIRouter(prefix="/learn", tags=["learn"])


@router.get("/questions", response_model=list[LearnQuestionRead])
def list_published_questions(
    kind: str | None = Query(default=None),
    db: Session = Depends(get_db),
) -> list[LearnQuestion]:
    query = select(LearnQuestion).where(LearnQuestion.status == LearnContentStatus.PUBLISHED)
    if kind:
        query = query.where(LearnQuestion.kind == kind)
    return db.scalars(query.order_by(LearnQuestion.display_order.asc(), LearnQuestion.id.asc())).all()


@router.get("/resources", response_model=list[LearnResourceRead])
def list_published_resources(
    audience: str | None = Query(default=None),
    db: Session = Depends(get_db),
) -> list[LearnResource]:
    query = select(LearnResource).where(
        LearnResource.status == LearnContentStatus.PUBLISHED,
        LearnResource.show_on_learn.is_(True),
    )
    if audience in {"teachers", "parents", "all"}:
        if audience == "all":
            pass
        else:
            query = query.where(LearnResource.audience.in_([audience, "all"]))
    return db.scalars(query.order_by(LearnResource.display_order.asc(), LearnResource.id.asc())).all()


@router.get("/videos", response_model=list[LearnVideoRead])
def list_published_videos(db: Session = Depends(get_db)) -> list[LearnVideo]:
    return db.scalars(
        select(LearnVideo)
        .where(LearnVideo.status == LearnContentStatus.PUBLISHED)
        .order_by(LearnVideo.display_order.asc(), LearnVideo.id.asc())
    ).all()
