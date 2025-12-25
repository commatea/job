from fastapi import APIRouter
from app.api.v1.endpoints import certifications

api_router = APIRouter()
api_router.include_router(certifications.router, prefix="/certifications", tags=["certifications"])
