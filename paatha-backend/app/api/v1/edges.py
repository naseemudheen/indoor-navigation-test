from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.core.database import get_db
from app.models.models import Edge, User
from app.schemas.schemas import EdgeCreate, EdgeOut
from app.api.deps import require_role

router = APIRouter()

@router.post("/", response_model=EdgeOut)
async def create_edge(
    edge_in: EdgeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin", "admin", "editor"]))
):
    edge = Edge(
        source_node_id=edge_in.source_node_id,
        target_node_id=edge_in.target_node_id,
        distance=edge_in.distance,
        is_parent=edge_in.is_parent
    )
    db.add(edge)
    await db.commit()
    await db.refresh(edge)
    return edge

@router.delete("/{edge_id}")
async def delete_edge(
    edge_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin", "admin", "editor"]))
):
    result = await db.execute(select(Edge).where(Edge.id == edge_id))
    edge = result.scalars().first()
    if not edge:
        raise HTTPException(status_code=404, detail="Edge not found")
    await db.delete(edge)
    await db.commit()
    return {"ok": True}
