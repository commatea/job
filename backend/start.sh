#!/bin/bash
set -e

echo "Waiting for database..."
sleep 3

echo "Creating database tables..."
python -c "
import asyncio
from app.db.session import engine
from app.db.base import Base

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print('Database tables created!')

asyncio.run(init_db())
"

echo "Starting server..."
exec uvicorn main:app --host 0.0.0.0 --port 8000
