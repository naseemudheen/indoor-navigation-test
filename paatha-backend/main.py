from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.database import engine, Base
from app.api.v1 import auth, blocks, floors, nodes, edges, map_data, markers, map_sync
from app.core.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(blocks.router, prefix=f"{settings.API_V1_STR}/blocks", tags=["blocks"])
app.include_router(floors.router, prefix=f"{settings.API_V1_STR}/floors", tags=["floors"])
app.include_router(nodes.router, prefix=f"{settings.API_V1_STR}/nodes", tags=["nodes"])
app.include_router(edges.router, prefix=f"{settings.API_V1_STR}/edges", tags=["edges"])
app.include_router(markers.router, prefix=f"{settings.API_V1_STR}/markers", tags=["markers"])
app.include_router(map_sync.router, prefix=f"{settings.API_V1_STR}/map", tags=["map_sync"])
app.include_router(map_data.router, prefix=f"{settings.API_V1_STR}/map", tags=["map"])
