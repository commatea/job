from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.certification import Certification
from app.schemas.certification import Certification as CertificationSchema
from app.schemas.certification import CertificationCreate, GraphData, GraphNode, GraphEdge

router = APIRouter()

@router.get("/", response_model=List[CertificationSchema])
async def read_certifications(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    자격증 목록 조회
    """
    result = await db.execute(select(Certification).offset(skip).limit(limit))
    certifications = result.scalars().all()
    return certifications

@router.post("/", response_model=CertificationSchema)
async def create_certification(
    *,
    db: AsyncSession = Depends(get_db),
    certification_in: CertificationCreate
) -> Any:
    """
    새로운 자격증 생성
    """
    certification = Certification(
        name=certification_in.name,
        issuer=certification_in.issuer,
        level=certification_in.level,
        fee=certification_in.fee,
        description=certification_in.description
    )
    db.add(certification)
    await db.commit()
    await db.refresh(certification)
    return certification

@router.get("/graph", response_model=GraphData)
async def get_certification_graph(
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    React Flow용 그래프 데이터 조회
    """
    # 자격증과 선수 과목 관계를 함께 로드
    stmt = select(Certification).options(selectinload(Certification.prerequisites))
    result = await db.execute(stmt)
    certs = result.scalars().all()
    
    nodes = []
    edges = []
    
    # MVP용 간단한 레이아웃 알고리즘
    # 실제로는 라이브러리를 사용하거나 더 정교한 계산이 필요함
    y_offset = 0
    x_offset = 0
    
    for cert in certs:
        # 노드 생성
        nodes.append(GraphNode(
            id=str(cert.id),
            data={"label": cert.name},
            position={"x": x_offset, "y": y_offset}
        ))
        
        # 엣지 생성 (선수 과목 관계)
        for prereq in cert.prerequisites:
            edges.append(GraphEdge(
                id=f"e{prereq.id}-{cert.id}",
                source=str(prereq.id),
                target=str(cert.id)
            ))
            
        y_offset += 100
        if y_offset > 500:
            y_offset = 0
            x_offset += 200
            
    return {"nodes": nodes, "edges": edges}
