from sqlalchemy import Column, Integer, String, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from app.db.base_class import Base


class CareerPath(Base):
    """
    커리어 패스 (직업 또는 창업) 모델
    """
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)  # 이름 (예: 전기안전관리자, 인력사무소)
    type = Column(String, index=True)  # 유형 (job 또는 startup)
    category = Column(String, index=True)  # 분야 (예: IT, 전기, 건설)
    description = Column(Text)  # 설명
    salary_range = Column(String)  # 예상 연봉/매출 범위
    growth_potential = Column(String)  # 성장 가능성 (높음, 보통, 낮음)
    is_active = Column(Boolean, default=True)  # 활성 상태

    requirements = relationship("Requirement", back_populates="career_path", cascade="all, delete-orphan")


class Requirement(Base):
    """
    요구사항 모델 (커리어와 자격증 연결)
    """
    id = Column(Integer, primary_key=True, index=True)
    career_path_id = Column(Integer, ForeignKey('careerpath.id'))
    certification_id = Column(Integer, ForeignKey('certification.id'), nullable=True)
    description = Column(Text)  # 법적 요건 텍스트 설명
    is_mandatory = Column(Boolean, default=False)  # 필수 여부

    career_path = relationship("CareerPath", back_populates="requirements")
    certification = relationship("Certification")
