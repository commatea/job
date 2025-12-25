from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import func

from app.db.session import get_db
from app.models.certification import Certification
from app.models.user import User
from app.core.deps import get_current_superuser
from app.schemas.certification import (
    Certification as CertificationSchema,
    CertificationCreate,
    CertificationUpdate,
    CertificationSimple,
    GraphData,
    GraphNode,
    GraphEdge,
    CategoryTree,
    CategoryCount,
)

router = APIRouter()

# 레벨별 Y 위치 (테크트리 레이아웃)
LEVEL_Y_POSITIONS = {
    "기술사": 0,
    "기사": 150,
    "산업기사": 300,
    "기능사": 450,
}


@router.get("/", response_model=List[CertificationSimple])
async def list_certifications(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = Query(None, description="카테고리 필터"),
    level: Optional[str] = Query(None, description="레벨 필터"),
    search: Optional[str] = Query(None, description="검색어"),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    자격증 목록 조회
    """
    query = select(Certification).where(Certification.is_active == True)

    if category:
        query = query.where(Certification.category_main == category)
    if level:
        query = query.where(Certification.level == level)
    if search:
        query = query.where(Certification.name.ilike(f"%{search}%"))

    query = query.order_by(Certification.level_order.desc(), Certification.name)
    query = query.offset(skip).limit(limit)

    result = await db.execute(query)
    return result.scalars().all()


@router.get("/categories", response_model=List[CategoryTree])
async def get_categories(db: AsyncSession = Depends(get_db)) -> Any:
    """
    카테고리 트리 조회
    """
    # 대분류별 중분류 개수 집계
    query = select(
        Certification.category_main,
        Certification.category_sub,
        func.count(Certification.id).label("count")
    ).where(
        Certification.is_active == True
    ).group_by(
        Certification.category_main,
        Certification.category_sub
    )

    result = await db.execute(query)
    rows = result.all()

    # 트리 구조로 변환
    category_map = {}
    for row in rows:
        main = row.category_main or "기타"
        sub = row.category_sub or "기타"
        count = row.count

        if main not in category_map:
            category_map[main] = {"subs": [], "total": 0}

        category_map[main]["subs"].append(CategoryCount(name=sub, count=count))
        category_map[main]["total"] += count

    return [
        CategoryTree(main=main, subs=data["subs"], total=data["total"])
        for main, data in category_map.items()
    ]


@router.get("/graph", response_model=GraphData)
async def get_certification_graph(
    category: Optional[str] = Query(None, description="카테고리 필터"),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    React Flow용 테크트리 그래프 데이터
    """
    query = select(Certification).options(
        selectinload(Certification.prerequisites)
    ).where(Certification.is_active == True)

    if category:
        query = query.where(Certification.category_main == category)

    result = await db.execute(query)
    certs = result.scalars().all()

    nodes = []
    edges = []

    # 레벨별로 그룹핑하여 X 위치 계산
    level_groups = {}
    for cert in certs:
        level = cert.level or "기타"
        if level not in level_groups:
            level_groups[level] = []
        level_groups[level].append(cert)

    # 노드 생성
    for cert in certs:
        level = cert.level or "기타"
        level_certs = level_groups.get(level, [])
        x_index = level_certs.index(cert) if cert in level_certs else 0

        # 레벨별 색상
        level_colors = {
            "기술사": {"background": "#fef3c7", "border": "#f59e0b"},
            "기사": {"background": "#dbeafe", "border": "#3b82f6"},
            "산업기사": {"background": "#dcfce7", "border": "#22c55e"},
            "기능사": {"background": "#f3e8ff", "border": "#a855f7"},
        }
        colors = level_colors.get(level, {"background": "#f3f4f6", "border": "#9ca3af"})

        nodes.append(GraphNode(
            id=str(cert.id),
            data={
                "label": cert.name,
                "level": level,
                "category": cert.category_main,
                "issuer": cert.issuer,
            },
            position={
                "x": x_index * 220,
                "y": LEVEL_Y_POSITIONS.get(level, 600)
            },
            type="default",
            style={
                "background": colors["background"],
                "border": f"2px solid {colors['border']}",
                "borderRadius": "8px",
                "padding": "10px",
                "width": 180,
            }
        ))

        # 엣지 생성
        for prereq in cert.prerequisites:
            edges.append(GraphEdge(
                id=f"e{prereq.id}-{cert.id}",
                source=str(prereq.id),
                target=str(cert.id),
                type="smoothstep",
                animated=False,
            ))

    return GraphData(nodes=nodes, edges=edges)


@router.get("/{certification_id}", response_model=CertificationSchema)
async def get_certification(
    certification_id: int,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    자격증 상세 조회
    """
    query = select(Certification).options(
        selectinload(Certification.prerequisites),
        selectinload(Certification.required_for)
    ).where(Certification.id == certification_id)

    result = await db.execute(query)
    cert = result.scalar_one_or_none()

    if not cert:
        raise HTTPException(status_code=404, detail="자격증을 찾을 수 없습니다")

    return cert


@router.post("/", response_model=CertificationSchema)
async def create_certification(
    certification_in: CertificationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    자격증 생성 (관리자 전용)
    """
    certification = Certification(**certification_in.model_dump())
    db.add(certification)
    await db.commit()
    await db.refresh(certification)
    return certification


@router.put("/{certification_id}", response_model=CertificationSchema)
async def update_certification(
    certification_id: int,
    certification_in: CertificationUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    자격증 수정 (관리자 전용)
    """
    result = await db.execute(
        select(Certification).where(Certification.id == certification_id)
    )
    cert = result.scalar_one_or_none()

    if not cert:
        raise HTTPException(status_code=404, detail="자격증을 찾을 수 없습니다")

    update_data = certification_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(cert, field, value)

    await db.commit()
    await db.refresh(cert)
    return cert


@router.delete("/{certification_id}")
async def delete_certification(
    certification_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    자격증 삭제 (관리자 전용) - Soft delete
    """
    result = await db.execute(
        select(Certification).where(Certification.id == certification_id)
    )
    cert = result.scalar_one_or_none()

    if not cert:
        raise HTTPException(status_code=404, detail="자격증을 찾을 수 없습니다")

    cert.is_active = False
    await db.commit()

    return {"message": "자격증이 삭제되었습니다"}


@router.post("/{certification_id}/prerequisites/{prereq_id}")
async def add_prerequisite(
    certification_id: int,
    prereq_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    선수 자격증 추가 (관리자 전용)
    """
    query = select(Certification).options(
        selectinload(Certification.prerequisites)
    ).where(Certification.id == certification_id)

    result = await db.execute(query)
    cert = result.scalar_one_or_none()

    if not cert:
        raise HTTPException(status_code=404, detail="자격증을 찾을 수 없습니다")

    prereq_result = await db.execute(
        select(Certification).where(Certification.id == prereq_id)
    )
    prereq = prereq_result.scalar_one_or_none()

    if not prereq:
        raise HTTPException(status_code=404, detail="선수 자격증을 찾을 수 없습니다")

    if prereq not in cert.prerequisites:
        cert.prerequisites.append(prereq)
        await db.commit()

    return {"message": "선수 자격증이 추가되었습니다"}


@router.delete("/{certification_id}/prerequisites/{prereq_id}")
async def remove_prerequisite(
    certification_id: int,
    prereq_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    선수 자격증 제거 (관리자 전용)
    """
    query = select(Certification).options(
        selectinload(Certification.prerequisites)
    ).where(Certification.id == certification_id)

    result = await db.execute(query)
    cert = result.scalar_one_or_none()

    if not cert:
        raise HTTPException(status_code=404, detail="자격증을 찾을 수 없습니다")

    prereq_result = await db.execute(
        select(Certification).where(Certification.id == prereq_id)
    )
    prereq = prereq_result.scalar_one_or_none()

    if prereq and prereq in cert.prerequisites:
        cert.prerequisites.remove(prereq)
        await db.commit()

    return {"message": "선수 자격증이 제거되었습니다"}
