from sqlalchemy import Column, Integer, String, ForeignKey, Table, Date, Text, Boolean
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
    name = Column(String, index=True, nullable=False)  # 자격증 이름 (예: 정보처리기사)
    code = Column(String, unique=True, index=True)  # 자격증 코드
    issuer = Column(String, index=True)  # 시행 기관 (예: 한국산업인력공단)

    # 카테고리 (대분류 > 중분류)
    category_main = Column(String, index=True)  # 대분류 (예: IT, 전기, 건설)
    category_sub = Column(String, index=True)   # 중분류 (예: 소프트웨어, 네트워크)

    level = Column(String, index=True)  # 등급 (기술사, 기사, 산업기사, 기능사)
    level_order = Column(Integer, default=0)  # 레벨 정렬 순서 (기술사=4, 기사=3, 산업기사=2, 기능사=1)

    # 시험 정보
    fee_written = Column(Integer)  # 필기 응시료
    fee_practical = Column(Integer)  # 실기 응시료
    pass_rate = Column(String)  # 합격률 (예: "45.2%")

    # 상세 정보
    description = Column(Text)  # 상세 설명
    eligibility = Column(Text)  # 응시 자격
    subjects = Column(Text)  # 시험 과목 (JSON string)

    is_active = Column(Boolean, default=True)  # 활성 상태

    # 테크트리를 위한 자기 참조 관계
    prerequisites = relationship(
        'Certification',
        secondary=certification_prerequisites,
        primaryjoin=id == certification_prerequisites.c.certification_id,
        secondaryjoin=id == certification_prerequisites.c.prerequisite_id,
        backref='required_for'
    )


class ExamSchedule(Base):
    """
    시험 일정 모델
    """
    id = Column(Integer, primary_key=True, index=True)
    certification_id = Column(Integer, ForeignKey('certification.id'))
    round_name = Column(String)  # 회차 명 (예: 2024년 정기 기사 1회)
    application_start_date = Column(Date)  # 원서 접수 시작일
    application_end_date = Column(Date)  # 원서 접수 마감일
    exam_date = Column(Date)  # 시험일
    result_announcement_date = Column(Date)  # 합격자 발표일

    certification = relationship("Certification", backref="schedules")
