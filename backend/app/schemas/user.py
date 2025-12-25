from typing import Optional, List
from datetime import date
from pydantic import BaseModel, EmailStr
from app.schemas.certification import CertificationSimple


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    is_active: bool = True


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None


class UserAdminUpdate(BaseModel):
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None


class User(UserBase):
    id: int
    is_superuser: bool = False

    class Config:
        from_attributes = True


class UserInDB(User):
    hashed_password: str


# User Certification
class UserCertificationBase(BaseModel):
    acquired_date: Optional[date] = None
    score: Optional[int] = None
    certificate_number: Optional[str] = None


class UserCertificationCreate(UserCertificationBase):
    pass


class UserCertification(UserCertificationBase):
    id: int
    user_id: int
    certification_id: int
    certification: Optional[CertificationSimple] = None

    class Config:
        from_attributes = True


# User Goal
class UserGoalBase(BaseModel):
    target_date: Optional[date] = None
    status: str = "pending"


class UserGoalCreate(UserGoalBase):
    pass


class UserGoalUpdate(BaseModel):
    target_date: Optional[date] = None
    status: Optional[str] = None


class UserGoal(UserGoalBase):
    id: int
    user_id: int
    certification_id: int
    certification: Optional[CertificationSimple] = None

    class Config:
        from_attributes = True


# Auth
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: Optional[int] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(UserCreate):
    pass


# Paginated Response
class UserList(BaseModel):
    items: List[User]
    total: int
