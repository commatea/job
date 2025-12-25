from sqlalchemy import Column, Integer, String, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import enum

class CareerType(str, enum.Enum):
    JOB = "job" # 취업
    STARTUP = "startup" # 창업

class CareerPath(Base):
    """
    커리어 패스 (직업 또는 창업) 모델
    """
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False) # 이름 (예: 전기안전관리자, 인력사무소)
    type = Column(String) # 유형 (job 또는 startup)
    description = Column(Text) # 설명
    
    requirements = relationship("Requirement", back_populates="career_path")

class Requirement(Base):
    """
    요구사항 모델 (커리어와 자격증 연결)
    """
    id = Column(Integer, primary_key=True, index=True)
    career_path_id = Column(Integer, ForeignKey('careerpath.id'))
    certification_id = Column(Integer, ForeignKey('certification.id'), nullable=True)
    description = Column(Text) # 법적 요건 텍스트 설명
    
    career_path = relationship("CareerPath", back_populates="requirements")
    certification = relationship("Certification")
