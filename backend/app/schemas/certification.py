from typing import Optional, List
from pydantic import BaseModel


class CertificationBase(BaseModel):
    name: str
    code: Optional[str] = None
    issuer: Optional[str] = None
    category_main: Optional[str] = None
    category_sub: Optional[str] = None
    level: Optional[str] = None
    level_order: Optional[int] = 0
    fee_written: Optional[int] = None
    fee_practical: Optional[int] = None
    pass_rate: Optional[str] = None
    description: Optional[str] = None
    eligibility: Optional[str] = None
    subjects: Optional[str] = None
    is_active: bool = True


class CertificationCreate(CertificationBase):
    pass


class CertificationUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    issuer: Optional[str] = None
    category_main: Optional[str] = None
    category_sub: Optional[str] = None
    level: Optional[str] = None
    level_order: Optional[int] = None
    fee_written: Optional[int] = None
    fee_practical: Optional[int] = None
    pass_rate: Optional[str] = None
    description: Optional[str] = None
    eligibility: Optional[str] = None
    subjects: Optional[str] = None
    is_active: Optional[bool] = None


class CertificationSimple(BaseModel):
    """간단한 자격증 정보 (목록용)"""
    id: int
    name: str
    code: Optional[str] = None
    category_main: Optional[str] = None
    category_sub: Optional[str] = None
    level: Optional[str] = None
    level_order: int = 0

    class Config:
        from_attributes = True


class Certification(CertificationBase):
    """전체 자격증 정보"""
    id: int
    prerequisites: List[CertificationSimple] = []
    required_for: List[CertificationSimple] = []

    class Config:
        from_attributes = True


class CertificationDetail(Certification):
    """상세 자격증 정보 (관련 직업 포함)"""
    related_careers: List["CareerSimple"] = []


# Graph Visualization (React Flow)
class GraphNode(BaseModel):
    id: str
    data: dict
    position: dict
    type: str = "default"
    style: Optional[dict] = None


class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    type: str = "smoothstep"
    animated: bool = False


class GraphData(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]


# 카테고리
class CategoryCount(BaseModel):
    name: str
    count: int


class CategoryTree(BaseModel):
    main: str
    subs: List[CategoryCount]
    total: int


# Forward reference 해결
from app.schemas.career import CareerSimple
CertificationDetail.model_rebuild()
