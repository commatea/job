from sqlalchemy import Column, Integer, String, Boolean
from app.db.base_class import Base

class User(Base):
    """
    사용자 모델
    """
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False) # 이메일 (로그인 ID)
    hashed_password = Column(String, nullable=False) # 해시된 비밀번호
    full_name = Column(String, index=True) # 사용자 실명
    is_active = Column(Boolean(), default=True) # 활성 상태 여부
    is_superuser = Column(Boolean(), default=False) # 관리자 여부
