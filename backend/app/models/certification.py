from sqlalchemy import Column, Integer, String, ForeignKey, Table, Date, Text
from sqlalchemy.orm import relationship
from app.db.base_class import Base

# 선수 자격증 관계를 위한 연결 테이블 (Self-referential Many-to-Many)
certification_prerequisites = Table(
    'certification_prerequisites',
    Base.metadata,
    Column('certification_id', Integer, ForeignKey('certification.id'), primary_key=True),
    Column('prerequisite_id', Integer, ForeignKey('certification.id'), primary_key=True)
)

class Certification(Base):
    """
    자격증 정보 모델
    """
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False) # 자격증 이름 (예: 정보처리기사)
    issuer = Column(String, index=True) # 시행 기관 (예: 한국산업인력공단)
    level = Column(String) # 등급 (예: 기사, 산업기사, 기능사)
    fee = Column(Integer) # 응시료
    description = Column(Text) # 상세 설명
    
    # 테크트리를 위한 자기 참조 관계
    # prerequisites: 이 자격증을 따기 위해 필요한 선수 자격증들
    # required_for: 이 자격증이 선수 조건이 되는 상위 자격증들
    prerequisites = relationship(
        'Certification',
        secondary=certification_prerequisites,
        primaryjoin=id==certification_prerequisites.c.certification_id,
        secondaryjoin=id==certification_prerequisites.c.prerequisite_id,
        backref='required_for'
    )

class ExamSchedule(Base):
    """
    시험 일정 모델
    """
    id = Column(Integer, primary_key=True, index=True)
    certification_id = Column(Integer, ForeignKey('certification.id'))
    round_name = Column(String) # 회차 명 (예: 2024년 정기 기사 1회)
    application_start_date = Column(Date) # 원서 접수 시작일
    application_end_date = Column(Date) # 원서 접수 마감일
    exam_date = Column(Date) # 시험일
    result_announcement_date = Column(Date) # 합격자 발표일
    
    certification = relationship("Certification", backref="schedules")
