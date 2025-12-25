from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.career import CareerPath, Requirement
from app.models.user import User
from app.core.deps import get_current_superuser
from app.schemas.career import (
    Career as CareerSchema,
    CareerCreate,
    CareerUpdate,
    CareerSimple,
    CareerType,
    Requirement as RequirementSchema,
    RequirementCreate,
)

router = APIRouter()


@router.get("/", response_model=List[CareerSimple])
async def list_careers(
    skip: int = 0,
    limit: int = 100,
    type: Optional[CareerType] = Query(None, description="유형 필터 (job/startup)"),
    category: Optional[str] = Query(None, description="분야 필터"),
    search: Optional[str] = Query(None, description="검색어"),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    커리어 목록 조회
    """
    query = select(CareerPath)

    if type:
        query = query.where(CareerPath.type == type.value)
    if category:
        query = query.where(CareerPath.category == category)
    if search:
        query = query.where(CareerPath.name.ilike(f"%{search}%"))

    query = query.order_by(CareerPath.name)
    query = query.offset(skip).limit(limit)

    result = await db.execute(query)
    return result.scalars().all()


@router.get("/jobs", response_model=List[CareerSimple])
async def list_jobs(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    직업 목록 조회
    """
    query = select(CareerPath).where(
        CareerPath.type == "job"
    ).order_by(CareerPath.name).offset(skip).limit(limit)

    result = await db.execute(query)
    return result.scalars().all()


@router.get("/startups", response_model=List[CareerSimple])
async def list_startups(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    창업 목록 조회
    """
    query = select(CareerPath).where(
        CareerPath.type == "startup"
    ).order_by(CareerPath.name).offset(skip).limit(limit)

    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{career_id}", response_model=CareerSchema)
async def get_career(
    career_id: int,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    커리어 상세 조회
    """
    query = select(CareerPath).options(
        selectinload(CareerPath.requirements).selectinload(Requirement.certification)
    ).where(CareerPath.id == career_id)

    result = await db.execute(query)
    career = result.scalar_one_or_none()

    if not career:
        raise HTTPException(status_code=404, detail="커리어를 찾을 수 없습니다")

    return career


@router.post("/", response_model=CareerSchema)
async def create_career(
    career_in: CareerCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    커리어 생성 (관리자 전용)
    """
    career = CareerPath(**career_in.model_dump())
    db.add(career)
    await db.commit()
    await db.refresh(career)
    return career


@router.put("/{career_id}", response_model=CareerSchema)
async def update_career(
    career_id: int,
    career_in: CareerUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    커리어 수정 (관리자 전용)
    """
    result = await db.execute(
        select(CareerPath).where(CareerPath.id == career_id)
    )
    career = result.scalar_one_or_none()

    if not career:
        raise HTTPException(status_code=404, detail="커리어를 찾을 수 없습니다")

    update_data = career_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(career, field, value)

    await db.commit()
    await db.refresh(career)
    return career


@router.delete("/{career_id}")
async def delete_career(
    career_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    커리어 삭제 (관리자 전용)
    """
    result = await db.execute(
        select(CareerPath).where(CareerPath.id == career_id)
    )
    career = result.scalar_one_or_none()

    if not career:
        raise HTTPException(status_code=404, detail="커리어를 찾을 수 없습니다")

    await db.delete(career)
    await db.commit()

    return {"message": "커리어가 삭제되었습니다"}


# Requirements
@router.post("/{career_id}/requirements", response_model=RequirementSchema)
async def add_requirement(
    career_id: int,
    requirement_in: RequirementCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    커리어 요구사항 추가 (관리자 전용)
    """
    result = await db.execute(
        select(CareerPath).where(CareerPath.id == career_id)
    )
    career = result.scalar_one_or_none()

    if not career:
        raise HTTPException(status_code=404, detail="커리어를 찾을 수 없습니다")

    requirement = Requirement(
        career_path_id=career_id,
        certification_id=requirement_in.certification_id,
        description=requirement_in.description,
    )
    db.add(requirement)
    await db.commit()
    await db.refresh(requirement)

    return requirement


@router.delete("/{career_id}/requirements/{requirement_id}")
async def remove_requirement(
    career_id: int,
    requirement_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    커리어 요구사항 제거 (관리자 전용)
    """
    result = await db.execute(
        select(Requirement).where(
            Requirement.id == requirement_id,
            Requirement.career_path_id == career_id
        )
    )
    requirement = result.scalar_one_or_none()

    if not requirement:
        raise HTTPException(status_code=404, detail="요구사항을 찾을 수 없습니다")

    await db.delete(requirement)
    await db.commit()

    return {"message": "요구사항이 삭제되었습니다"}
