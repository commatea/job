from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "message": "Welcome to SpecLab API",
        "project": settings.PROJECT_NAME,
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    return {"status": "ok"}


# API 라우터 등록
from app.api.v1.api import api_router
app.include_router(api_router, prefix=settings.API_V1_STR)
