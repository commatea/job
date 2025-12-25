from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from app.db.session import get_db
from app.models.user import User
from app.models.certification import Certification
from app.models.career import CareerPath
from app.core.deps import get_current_superuser
from app.schemas.user import (
    User as UserSchema,
    UserList,
    UserAdminUpdate,
)
from app.schemas.certification import (
    Certification as CertificationSchema,
    CertificationCreate,
    CertificationUpdate,
    CertificationSimple,
)
from app.schemas.career import (
    Career as CareerSchema,
    CareerCreate,
    CareerUpdate,
    CareerSimple,
)

router = APIRouter()


# ==================== 사용자 관리 ====================

@router.get("/users/", response_model=UserList)
async def list_users(
    page: int = Query(1, ge=1),
    limit: int = Query(15, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    사용자 목록 조회 (관리자 전용)
    """
    query = select(User)

    if search:
        query = query.where(
            (User.email.ilike(f"%{search}%")) |
            (User.full_name.ilike(f"%{search}%"))
        )

    # 전체 개수
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # 페이지네이션
    offset = (page - 1) * limit
    query = query.order_by(User.id.desc()).offset(offset).limit(limit)

    result = await db.execute(query)
    users = result.scalars().all()

    return UserList(items=users, total=total)


@router.get("/users/{user_id}", response_model=UserSchema)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    사용자 상세 조회 (관리자 전용)
    """
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다")

    return user


@router.put("/users/{user_id}", response_model=UserSchema)
async def update_user(
    user_id: int,
    user_in: UserAdminUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    사용자 정보 수정 (관리자 전용)
    """
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다")

    update_data = user_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)

    await db.commit()
    await db.refresh(user)
    return user


# ==================== 자격증 관리 ====================

@router.get("/certifications/", response_model=dict)
async def list_certifications_admin(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    자격증 목록 조회 (관리자 전용 - 비활성 포함)
    """
    query = select(Certification)

    if search:
        query = query.where(
            (Certification.name.ilike(f"%{search}%")) |
            (Certification.code.ilike(f"%{search}%"))
        )

    # 전체 개수
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # 페이지네이션
    offset = (page - 1) * limit
    query = query.order_by(Certification.id.desc()).offset(offset).limit(limit)

    result = await db.execute(query)
    items = result.scalars().all()

    return {"items": items, "total": total}


@router.post("/certifications/", response_model=CertificationSchema)
async def create_certification_admin(
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


@router.put("/certifications/{certification_id}", response_model=CertificationSchema)
async def update_certification_admin(
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


@router.delete("/certifications/{certification_id}")
async def delete_certification_admin(
    certification_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    자격증 삭제 (관리자 전용)
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


# ==================== 커리어 관리 ====================

@router.get("/careers/", response_model=dict)
async def list_careers_admin(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    커리어 목록 조회 (관리자 전용)
    """
    query = select(CareerPath)

    if search:
        query = query.where(CareerPath.name.ilike(f"%{search}%"))

    # 전체 개수
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # 페이지네이션
    offset = (page - 1) * limit
    query = query.order_by(CareerPath.id.desc()).offset(offset).limit(limit)

    result = await db.execute(query)
    items = result.scalars().all()

    return {"items": items, "total": total}


@router.post("/careers/", response_model=CareerSchema)
async def create_career_admin(
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


@router.put("/careers/{career_id}", response_model=CareerSchema)
async def update_career_admin(
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


@router.delete("/careers/{career_id}")
async def delete_career_admin(
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


# ==================== 통계 ====================

@router.get("/stats")
async def get_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    통계 조회 (관리자 전용)
    """
    users_count = await db.execute(select(func.count(User.id)))
    certs_count = await db.execute(
        select(func.count(Certification.id)).where(Certification.is_active == True)
    )
    careers_count = await db.execute(select(func.count(CareerPath.id)))

    return {
        "total_users": users_count.scalar() or 0,
        "total_certifications": certs_count.scalar() or 0,
        "total_careers": careers_count.scalar() or 0,
    }
