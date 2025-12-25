from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.user import User, UserCertification, UserGoal
from app.models.certification import Certification
from app.core.deps import get_current_user_required
from app.core.security import get_password_hash
from app.schemas.user import (
    User as UserSchema,
    UserUpdate,
    UserCertification as UserCertificationSchema,
    UserCertificationCreate,
    UserGoal as UserGoalSchema,
    UserGoalCreate,
    UserGoalUpdate,
)

router = APIRouter()


# ==================== 프로필 ====================

@router.get("/me", response_model=UserSchema)
async def get_my_profile(
    current_user: User = Depends(get_current_user_required)
) -> Any:
    """
    내 프로필 조회
    """
    return current_user


@router.put("/me", response_model=UserSchema)
async def update_my_profile(
    user_in: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
) -> Any:
    """
    내 프로필 수정
    """
    update_data = user_in.model_dump(exclude_unset=True)

    # 비밀번호 변경 시 해시 처리
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))

    for field, value in update_data.items():
        setattr(current_user, field, value)

    await db.commit()
    await db.refresh(current_user)
    return current_user


# ==================== 취득 자격증 ====================

@router.get("/me/certifications", response_model=List[UserCertificationSchema])
async def get_my_certifications(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
) -> Any:
    """
    내 취득 자격증 목록
    """
    query = select(UserCertification).options(
        selectinload(UserCertification.certification)
    ).where(UserCertification.user_id == current_user.id)

    result = await db.execute(query)
    return result.scalars().all()


@router.post("/me/certifications/{certification_id}", response_model=UserCertificationSchema)
async def add_my_certification(
    certification_id: int,
    cert_in: UserCertificationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
) -> Any:
    """
    취득 자격증 추가
    """
    # 자격증 존재 확인
    cert_result = await db.execute(
        select(Certification).where(Certification.id == certification_id)
    )
    cert = cert_result.scalar_one_or_none()

    if not cert:
        raise HTTPException(status_code=404, detail="자격증을 찾을 수 없습니다")

    # 중복 확인
    existing = await db.execute(
        select(UserCertification).where(
            UserCertification.user_id == current_user.id,
            UserCertification.certification_id == certification_id
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="이미 등록된 자격증입니다")

    user_cert = UserCertification(
        user_id=current_user.id,
        certification_id=certification_id,
        **cert_in.model_dump()
    )
    db.add(user_cert)
    await db.commit()
    await db.refresh(user_cert)

    # 목표에서 해당 자격증이 있으면 완료 처리
    goal_result = await db.execute(
        select(UserGoal).where(
            UserGoal.user_id == current_user.id,
            UserGoal.certification_id == certification_id
        )
    )
    goal = goal_result.scalar_one_or_none()
    if goal:
        goal.status = "completed"
        await db.commit()

    return user_cert


@router.delete("/me/certifications/{certification_id}")
async def remove_my_certification(
    certification_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
) -> Any:
    """
    취득 자격증 삭제
    """
    result = await db.execute(
        select(UserCertification).where(
            UserCertification.user_id == current_user.id,
            UserCertification.certification_id == certification_id
        )
    )
    user_cert = result.scalar_one_or_none()

    if not user_cert:
        raise HTTPException(status_code=404, detail="등록된 자격증을 찾을 수 없습니다")

    await db.delete(user_cert)
    await db.commit()

    return {"message": "자격증이 삭제되었습니다"}


# ==================== 목표 자격증 ====================

@router.get("/me/goals", response_model=List[UserGoalSchema])
async def get_my_goals(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
) -> Any:
    """
    내 목표 자격증 목록
    """
    query = select(UserGoal).options(
        selectinload(UserGoal.certification)
    ).where(UserGoal.user_id == current_user.id)

    result = await db.execute(query)
    return result.scalars().all()


@router.post("/me/goals/{certification_id}", response_model=UserGoalSchema)
async def add_my_goal(
    certification_id: int,
    goal_in: UserGoalCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
) -> Any:
    """
    목표 자격증 추가
    """
    # 자격증 존재 확인
    cert_result = await db.execute(
        select(Certification).where(Certification.id == certification_id)
    )
    cert = cert_result.scalar_one_or_none()

    if not cert:
        raise HTTPException(status_code=404, detail="자격증을 찾을 수 없습니다")

    # 중복 확인
    existing = await db.execute(
        select(UserGoal).where(
            UserGoal.user_id == current_user.id,
            UserGoal.certification_id == certification_id
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="이미 등록된 목표입니다")

    # 이미 취득한 자격증인지 확인
    acquired = await db.execute(
        select(UserCertification).where(
            UserCertification.user_id == current_user.id,
            UserCertification.certification_id == certification_id
        )
    )
    if acquired.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="이미 취득한 자격증입니다")

    goal = UserGoal(
        user_id=current_user.id,
        certification_id=certification_id,
        **goal_in.model_dump()
    )
    db.add(goal)
    await db.commit()
    await db.refresh(goal)

    return goal


@router.put("/me/goals/{goal_id}", response_model=UserGoalSchema)
async def update_my_goal(
    goal_id: int,
    goal_in: UserGoalUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
) -> Any:
    """
    목표 자격증 수정
    """
    result = await db.execute(
        select(UserGoal).where(
            UserGoal.id == goal_id,
            UserGoal.user_id == current_user.id
        )
    )
    goal = result.scalar_one_or_none()

    if not goal:
        raise HTTPException(status_code=404, detail="목표를 찾을 수 없습니다")

    update_data = goal_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(goal, field, value)

    await db.commit()
    await db.refresh(goal)
    return goal


@router.delete("/me/goals/{goal_id}")
async def remove_my_goal(
    goal_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
) -> Any:
    """
    목표 자격증 삭제
    """
    result = await db.execute(
        select(UserGoal).where(
            UserGoal.id == goal_id,
            UserGoal.user_id == current_user.id
        )
    )
    goal = result.scalar_one_or_none()

    if not goal:
        raise HTTPException(status_code=404, detail="목표를 찾을 수 없습니다")

    await db.delete(goal)
    await db.commit()

    return {"message": "목표가 삭제되었습니다"}
