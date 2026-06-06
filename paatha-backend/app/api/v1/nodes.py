from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.core.database import get_db
from app.models.models import Node, User
from app.schemas.schemas import NodeCreate, NodeOut, NodeBase
from app.api.deps import require_role

router = APIRouter()

@router.get("/floor/{floor_id}", response_model=List[NodeOut])
async def get_nodes_by_floor(floor_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Node).where(Node.floor_id == floor_id))
    return result.scalars().all()

@router.post("/", response_model=NodeOut)
async def create_node(
    node_in: NodeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin", "admin", "editor"]))
):
    node = Node(
        id=node_in.id,
        floor_id=node_in.floor_id,
        x_coordinate=node_in.x_coordinate,
        y_coordinate=node_in.y_coordinate,
        name=node_in.name,
        is_searchable=node_in.is_searchable
    )
    db.add(node)
    try:
        await db.commit()
        await db.refresh(node)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Could not create node, ID might already exist.")
    return node

@router.put("/{db_id}", response_model=NodeOut)
async def update_node(
    db_id: int,
    node_in: NodeBase,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin", "admin", "editor"]))
):
    result = await db.execute(select(Node).where(Node.db_id == db_id))
    node = result.scalars().first()
    if not node:
        raise HTTPException(status_code=404, detail="Node not found")
        
    node.id = node_in.id
    node.x_coordinate = node_in.x_coordinate
    node.y_coordinate = node_in.y_coordinate
    node.name = node_in.name
    node.is_searchable = node_in.is_searchable
    
    await db.commit()
    await db.refresh(node)
    return node

@router.delete("/{db_id}")
async def delete_node(
    db_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin", "admin", "editor"]))
):
    result = await db.execute(select(Node).where(Node.db_id == db_id))
    node = result.scalars().first()
    if not node:
        raise HTTPException(status_code=404, detail="Node not found")
    await db.delete(node)
    await db.commit()
    return {"ok": True}
