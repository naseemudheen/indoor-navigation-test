from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.core.database import get_db
from app.models.models import Marker, User
from app.schemas.schemas import MarkerCreate, MarkerOut, MarkerBase
from app.api.deps import require_role

router = APIRouter()

@router.get("/floor/{floor_id}", response_model=List[MarkerOut])
async def get_markers_by_floor(floor_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Marker).where(Marker.floor_id == floor_id))
    return result.scalars().all()

@router.post("/", response_model=MarkerOut)
async def create_marker(
    marker_in: MarkerCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin", "admin", "editor"]))
):
    marker = Marker(
        id=marker_in.id,
        floor_id=marker_in.floor_id,
        type=marker_in.type,
        text=marker_in.text,
        x_coordinate=marker_in.x_coordinate,
        y_coordinate=marker_in.y_coordinate,
        icon_type=marker_in.icon_type
    )
    db.add(marker)
    try:
        await db.commit()
        await db.refresh(marker)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Could not create marker, ID might already exist.")
    return marker

@router.put("/{db_id}", response_model=MarkerOut)
async def update_marker(
    db_id: int,
    marker_in: MarkerBase,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin", "admin", "editor"]))
):
    result = await db.execute(select(Marker).where(Marker.db_id == db_id))
    marker = result.scalars().first()
    if not marker:
        raise HTTPException(status_code=404, detail="Marker not found")
        
    marker.id = marker_in.id
    marker.type = marker_in.type
    marker.text = marker_in.text
    marker.x_coordinate = marker_in.x_coordinate
    marker.y_coordinate = marker_in.y_coordinate
    marker.icon_type = marker_in.icon_type
    
    await db.commit()
    await db.refresh(marker)
    return marker

@router.delete("/{db_id}")
async def delete_marker(
    db_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin", "admin", "editor"]))
):
    result = await db.execute(select(Marker).where(Marker.db_id == db_id))
    marker = result.scalars().first()
    if not marker:
        raise HTTPException(status_code=404, detail="Marker not found")
    await db.delete(marker)
    await db.commit()
    return {"ok": True}
