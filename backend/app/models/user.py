from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base


class User(Base):
    """
    사용자 모델
    """
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)  # 이메일 (로그인 ID)
    hashed_password = Column(String, nullable=False)  # 해시된 비밀번호
    full_name = Column(String, index=True)  # 사용자 실명
    is_active = Column(Boolean(), default=True)  # 활성 상태 여부
    is_superuser = Column(Boolean(), default=False)  # 관리자 여부

    # Relationships
    certifications = relationship("UserCertification", back_populates="user", cascade="all, delete-orphan")
    goals = relationship("UserGoal", back_populates="user", cascade="all, delete-orphan")


class UserCertification(Base):
    """
    사용자가 취득한 자격증
    """
    __tablename__ = "user_certifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    certification_id = Column(Integer, ForeignKey("certification.id", ondelete="CASCADE"), nullable=False)
    acquired_date = Column(Date)  # 취득일
    score = Column(Integer)  # 점수
    certificate_number = Column(String)  # 자격증 번호

    # Relationships
    user = relationship("User", back_populates="certifications")
    certification = relationship("Certification")


class UserGoal(Base):
    """
    사용자의 목표 자격증
    """
    __tablename__ = "user_goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    certification_id = Column(Integer, ForeignKey("certification.id", ondelete="CASCADE"), nullable=False)
    target_date = Column(Date)  # 목표 취득일
    status = Column(String, default="pending")  # pending, in_progress, completed

    # Relationships
    user = relationship("User", back_populates="goals")
    certification = relationship("Certification")
