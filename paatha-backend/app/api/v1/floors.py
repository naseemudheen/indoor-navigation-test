from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.core.database import get_db
from app.models.models import Floor, User
from app.schemas.schemas import FloorCreate, FloorOut
from app.api.deps import require_role

router = APIRouter()

@router.get("/block/{block_id}", response_model=List[FloorOut])
async def get_floors_by_block(block_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Floor).where(Floor.block_id == block_id))
    return result.scalars().all()

@router.post("/", response_model=FloorOut)
async def create_floor(
    floor_in: FloorCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin", "admin", "editor"]))
):
    floor = Floor(name=floor_in.name, block_id=floor_in.block_id, level=floor_in.level)
    db.add(floor)
    await db.commit()
    await db.refresh(floor)
    return floor

@router.delete("/{floor_id}")
async def delete_floor(
    floor_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin", "admin"]))
):
    result = await db.execute(select(Floor).where(Floor.id == floor_id))
    floor = result.scalars().first()
    if not floor:
        raise HTTPException(status_code=404, detail="Floor not found")
    await db.delete(floor)
    await db.commit()
    return {"ok": True}
