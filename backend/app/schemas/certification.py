from typing import Optional, List
from pydantic import BaseModel

# Shared properties
class CertificationBase(BaseModel):
    name: str
    issuer: Optional[str] = None
    level: Optional[str] = None
    fee: Optional[int] = None
    description: Optional[str] = None

# Properties to receive via API on creation
class CertificationCreate(CertificationBase):
    pass

# Properties to return to client
class Certification(CertificationBase):
    id: int
    prerequisites: List["Certification"] = []

    class Config:
        from_attributes = True

# Schema for Graph Visualization (React Flow style)
class GraphNode(BaseModel):
    id: str
    data: dict
    position: dict # {x: 0, y: 0}
    type: str = "default"

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str

class GraphData(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]

Certification.model_rebuild()
