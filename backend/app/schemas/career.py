from typing import Optional, List
from pydantic import BaseModel
from enum import Enum


class CareerType(str, Enum):
    JOB = "job"
    STARTUP = "startup"


class RequirementBase(BaseModel):
    description: Optional[str] = None
    is_mandatory: bool = False  # 필수 여부


class RequirementCreate(RequirementBase):
    career_path_id: int
    certification_id: Optional[int] = None


class Requirement(RequirementBase):
    id: int
    career_path_id: int
    certification_id: Optional[int] = None
    certification_name: Optional[str] = None

    class Config:
        from_attributes = True


class CareerBase(BaseModel):
    name: str
    type: CareerType = CareerType.JOB
    description: Optional[str] = None
    category: Optional[str] = None  # 분야 (예: IT, 건설, 전기)
    salary_range: Optional[str] = None  # 예상 연봉 범위
    growth_potential: Optional[str] = None  # 성장 가능성


class CareerCreate(CareerBase):
    pass


class CareerUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[CareerType] = None
    description: Optional[str] = None
    category: Optional[str] = None
    salary_range: Optional[str] = None
    growth_potential: Optional[str] = None


class CareerSimple(BaseModel):
    """간단한 커리어 정보"""
    id: int
    name: str
    type: CareerType

    class Config:
        from_attributes = True


class Career(CareerBase):
    """전체 커리어 정보"""
    id: int
    requirements: List[Requirement] = []

    class Config:
        from_attributes = True


class CareerDetail(Career):
    """상세 커리어 정보 (관련 자격증 포함)"""
    required_certifications: List["CertificationSimple"] = []
    recommended_certifications: List["CertificationSimple"] = []


# Forward reference
from app.schemas.certification import CertificationSimple
CareerDetail.model_rebuild()
