from fastapi import FastAPI
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

@app.get("/")
async def root():
    return {"message": "Hello World", "project": "Certification Navigation"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

from app.api.v1.api import api_router
app.include_router(api_router, prefix=settings.API_V1_STR)
