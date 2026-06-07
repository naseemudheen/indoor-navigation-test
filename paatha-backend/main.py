from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.database import engine, Base
from app.api.v1 import auth, blocks, floors, nodes, edges, map_data, markers, map_sync, qr, navigation
from app.core.config import settings
from fastapi.staticfiles import StaticFiles
import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    # Migrate existing QR image paths from static folder to dynamic route path
    from app.core.database import AsyncSessionLocal
    from app.models.models import QRLocation
    from sqlalchemy.future import select
    
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(QRLocation).where(QRLocation.image_path.like("/static/qrcodes/%"))
        )
        qrs = result.scalars().all()
        if qrs:
            for qr in qrs:
                qr.image_path = f"/api/qr/image/{qr.qr_code}"
            await session.commit()
            
    yield
    # Shutdown
    await engine.dispose()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create static directory if it doesn't exist
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Register routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(blocks.router, prefix=f"{settings.API_V1_STR}/blocks", tags=["blocks"])
app.include_router(floors.router, prefix=f"{settings.API_V1_STR}/floors", tags=["floors"])
app.include_router(nodes.router, prefix=f"{settings.API_V1_STR}/nodes", tags=["nodes"])
app.include_router(edges.router, prefix=f"{settings.API_V1_STR}/edges", tags=["edges"])
app.include_router(markers.router, prefix=f"{settings.API_V1_STR}/markers", tags=["markers"])
app.include_router(map_sync.router, prefix=f"{settings.API_V1_STR}/map", tags=["map_sync"])
app.include_router(map_data.router, prefix=f"{settings.API_V1_STR}/map", tags=["map"])
app.include_router(qr.router, prefix="/api/qr", tags=["qr"])
app.include_router(navigation.router, prefix="/api/navigation", tags=["navigation"])
app.include_router(navigation.router, prefix="/navigation", tags=["guest_navigation"])

