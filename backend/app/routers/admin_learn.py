from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db import get_db
from app.deps import require_roles
from app.models.learn_content import (
    LearnContentStatus,
    LearnQuestion,
    LearnQuestionKind,
    LearnResource,
    LearnVideo,
)
from app.models.user import Role, User
from app.schemas.learn import (
    LearnQuestionCreate,
    LearnQuestionGenerateRequest,
    LearnQuestionGenerateResponse,
    LearnQuestionRead,
    LearnQuestionUpdate,
    LearnResourceCreate,
    LearnResourceRead,
    LearnResourceUpdate,
    LearnVideoCreate,
    LearnVideoRead,
    LearnVideoUpdate,
)
from app.services.learn_ai import generate_learn_questions

router = APIRouter(prefix="/admin/learn", tags=["admin-learn"])


def _parse_status(value: str) -> LearnContentStatus:
    try:
        return LearnContentStatus(value)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid status") from exc


def _parse_kind(value: str) -> LearnQuestionKind:
    try:
        return LearnQuestionKind(value)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid kind") from exc


@router.get("/questions", response_model=list[LearnQuestionRead])
def list_questions(
    status_filter: str | None = Query(default=None, alias="status"),
    kind: str | None = Query(default=None),
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> list[LearnQuestion]:
    query = select(LearnQuestion)
    if status_filter:
        query = query.where(LearnQuestion.status == _parse_status(status_filter))
    if kind:
        query = query.where(LearnQuestion.kind == _parse_kind(kind))
    return db.scalars(query.order_by(LearnQuestion.display_order.asc(), LearnQuestion.id.desc())).all()


@router.post("/questions", response_model=LearnQuestionRead, status_code=status.HTTP_201_CREATED)
def create_question(
    payload: LearnQuestionCreate,
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> LearnQuestion:
    question = LearnQuestion(
        external_id=payload.external_id,
        kind=_parse_kind(payload.kind),
        status=_parse_status(payload.status),
        statement=payload.statement,
        answer=payload.answer,
        explanation=payload.explanation,
        hint=payload.hint,
        topic=payload.topic,
        question_type=payload.question_type,
        options_json=payload.options_json,
        image_url=payload.image_url,
        image_credit=payload.image_credit,
        source=payload.source,
        related_story_slugs=payload.related_story_slugs,
        audience=payload.audience,
        display_order=payload.display_order,
        trail_location_id=payload.trail_location_id,
    )
    db.add(question)
    db.commit()
    db.refresh(question)
    return question


@router.patch("/questions/{question_id}", response_model=LearnQuestionRead)
def update_question(
    question_id: int,
    payload: LearnQuestionUpdate,
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> LearnQuestion:
    question = db.get(LearnQuestion, question_id)
    if question is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")

    data = payload.model_dump(exclude_unset=True)
    if "kind" in data:
        data["kind"] = _parse_kind(data["kind"])
    if "status" in data:
        data["status"] = _parse_status(data["status"])

    for key, value in data.items():
        setattr(question, key, value)

    db.commit()
    db.refresh(question)
    return question


@router.delete("/questions/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_question(
    question_id: int,
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> Response:
    question = db.get(LearnQuestion, question_id)
    if question is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")
    db.delete(question)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/questions/generate", response_model=LearnQuestionGenerateResponse)
def generate_questions(
    payload: LearnQuestionGenerateRequest,
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> LearnQuestionGenerateResponse:
    if payload.kind not in {"quiz", "daily"}:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Only quiz and daily generation are supported for now")

    generated, error = generate_learn_questions(
        topic=payload.topic,
        count=payload.count,
        kind=payload.kind,
        guidance=payload.guidance,
    )
    if generated is None:
        return LearnQuestionGenerateResponse(enabled=False, message=error, questions=[])

    saved: list[LearnQuestion] = []
    next_order = db.scalar(select(func.max(LearnQuestion.display_order))) or 0
    for item in generated:
        next_order += 1
        question = LearnQuestion(
            kind=_parse_kind(payload.kind),
            status=LearnContentStatus.DRAFT,
            statement=item["statement"],
            answer=item["answer"],
            explanation=item["explanation"],
            hint=item.get("hint"),
            topic=item.get("topic"),
            display_order=next_order,
        )
        db.add(question)
        saved.append(question)

    db.commit()
    for question in saved:
        db.refresh(question)

    return LearnQuestionGenerateResponse(
        enabled=True,
        message=f"Saved {len(saved)} draft question(s) for staff review.",
        questions=[LearnQuestionRead.model_validate(q) for q in saved],
    )


@router.get("/resources", response_model=list[LearnResourceRead])
def list_resources(
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> list[LearnResource]:
    return db.scalars(select(LearnResource).order_by(LearnResource.display_order.asc(), LearnResource.id.desc())).all()


@router.post("/resources", response_model=LearnResourceRead, status_code=status.HTTP_201_CREATED)
def create_resource(
    payload: LearnResourceCreate,
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> LearnResource:
    existing = db.scalar(select(LearnResource).where(LearnResource.slug == payload.slug))
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Slug already exists")

    resource = LearnResource(
        slug=payload.slug,
        title=payload.title,
        date_label=payload.date_label,
        cover_image_url=payload.cover_image_url,
        source_url=payload.source_url,
        source_label=payload.source_label,
        topics=payload.topics,
        learning_hook=payload.learning_hook,
        audience=payload.audience,
        resource_type=payload.resource_type,
        origin=payload.origin,
        show_on_learn=payload.show_on_learn,
        show_on_stories=payload.show_on_stories,
        status=_parse_status(payload.status),
        display_order=payload.display_order,
    )
    db.add(resource)
    db.commit()
    db.refresh(resource)
    return resource


@router.patch("/resources/{resource_id}", response_model=LearnResourceRead)
def update_resource(
    resource_id: int,
    payload: LearnResourceUpdate,
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> LearnResource:
    resource = db.get(LearnResource, resource_id)
    if resource is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")

    data = payload.model_dump(exclude_unset=True)
    if "status" in data:
        data["status"] = _parse_status(data["status"])
    if "slug" in data and data["slug"] != resource.slug:
        conflict = db.scalar(select(LearnResource).where(LearnResource.slug == data["slug"]))
        if conflict:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Slug already exists")

    for key, value in data.items():
        setattr(resource, key, value)

    db.commit()
    db.refresh(resource)
    return resource


@router.delete("/resources/{resource_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resource(
    resource_id: int,
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> Response:
    resource = db.get(LearnResource, resource_id)
    if resource is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")
    db.delete(resource)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/videos", response_model=list[LearnVideoRead])
def list_videos(
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> list[LearnVideo]:
    return db.scalars(select(LearnVideo).order_by(LearnVideo.display_order.asc(), LearnVideo.id.desc())).all()


@router.post("/videos", response_model=LearnVideoRead, status_code=status.HTTP_201_CREATED)
def create_video(
    payload: LearnVideoCreate,
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> LearnVideo:
    existing = db.scalar(select(LearnVideo).where(LearnVideo.video_id == payload.video_id))
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Video ID already exists")

    video = LearnVideo(
        video_id=payload.video_id,
        title=payload.title,
        channel_title=payload.channel_title,
        published_at=payload.published_at,
        thumbnail_url=payload.thumbnail_url or f"https://img.youtube.com/vi/{payload.video_id}/hqdefault.jpg",
        status=_parse_status(payload.status),
        display_order=payload.display_order,
    )
    db.add(video)
    db.commit()
    db.refresh(video)
    return video


@router.patch("/videos/{video_id}", response_model=LearnVideoRead)
def update_video(
    video_id: int,
    payload: LearnVideoUpdate,
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> LearnVideo:
    video = db.get(LearnVideo, video_id)
    if video is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video not found")

    data = payload.model_dump(exclude_unset=True)
    if "status" in data:
        data["status"] = _parse_status(data["status"])
    if "video_id" in data and data["video_id"] != video.video_id:
        conflict = db.scalar(select(LearnVideo).where(LearnVideo.video_id == data["video_id"]))
        if conflict:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Video ID already exists")

    for key, value in data.items():
        setattr(video, key, value)

    db.commit()
    db.refresh(video)
    return video


@router.delete("/videos/{video_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_video(
    video_id: int,
    _: User = Depends(require_roles(Role.ADMIN)),
    db: Session = Depends(get_db),
) -> Response:
    video = db.get(LearnVideo, video_id)
    if video is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video not found")
    db.delete(video)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
