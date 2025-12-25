from fastapi import APIRouter
from app.api.v1.endpoints import certifications, careers, auth, admin, users

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["인증"])
api_router.include_router(certifications.router, prefix="/certifications", tags=["자격증"])
api_router.include_router(careers.router, prefix="/careers", tags=["커리어"])
api_router.include_router(admin.router, prefix="/admin", tags=["관리자"])
api_router.include_router(users.router, prefix="/users", tags=["사용자"])
