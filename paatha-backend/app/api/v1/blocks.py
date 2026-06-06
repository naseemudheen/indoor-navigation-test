from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.core.database import get_db
from app.models.models import Block, User
from app.schemas.schemas import BlockCreate, BlockOut
from app.api.deps import require_role

router = APIRouter()

@router.get("/", response_model=List[BlockOut])
async def get_blocks(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Block))
    return result.scalars().all()

@router.post("/", response_model=BlockOut)
async def create_block(
    block_in: BlockCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin", "admin"]))
):
    block = Block(name=block_in.name)
    db.add(block)
    await db.commit()
    await db.refresh(block)
    return block

@router.delete("/{block_id}")
async def delete_block(
    block_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin", "admin"]))
):
    result = await db.execute(select(Block).where(Block.id == block_id))
    block = result.scalars().first()
    if not block:
        raise HTTPException(status_code=404, detail="Block not found")
    await db.delete(block)
    await db.commit()
    return {"ok": True}
