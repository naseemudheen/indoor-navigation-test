from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
from typing import List, Any, Dict

from app.core.database import get_db
from app.models.models import Node, Edge, Marker, User
from app.api.deps import require_role
from pydantic import BaseModel

router = APIRouter()

class SyncPayload(BaseModel):
    nodes: List[Dict[str, Any]]
    markers: List[Dict[str, Any]]

@router.post("/sync/{floor_id}")
async def sync_map_data(
    floor_id: int,
    payload: SyncPayload,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin", "admin", "editor"]))
):
    try:
        # Delete existing data for this floor in correct order
        # First edges related to nodes on this floor
        await db.execute(
            delete(Edge).where(
                Edge.source_node_id.in_(
                    select(Node.id).where(Node.floor_id == floor_id)
                )
            )
        )
        # Then markers
        await db.execute(delete(Marker).where(Marker.floor_id == floor_id))
        # Then nodes
        await db.execute(delete(Node).where(Node.floor_id == floor_id))
        
        await db.commit()

        # Insert new nodes
        for n in payload.nodes:
            node = Node(
                id=n["id"],
                floor_id=floor_id,
                x_coordinate=n["coordinates"][0],
                y_coordinate=n["coordinates"][1],
                name=n.get("name"),
                is_searchable=n.get("isSearchable", False)
            )
            db.add(node)
        await db.commit()

        # Insert new edges
        for n in payload.nodes:
            for neighbor in n.get("neighbors", []):
                edge = Edge(
                    source_node_id=n["id"],
                    target_node_id=neighbor["id"],
                    distance=neighbor.get("distance", 0.0),
                    is_parent=neighbor.get("isParent", False)
                )
                db.add(edge)
        await db.commit()

        # Insert new markers
        for m in payload.markers:
            marker = Marker(
                id=m["id"],
                floor_id=floor_id,
                type=m.get("type", "label"),
                text=m.get("text"),
                x_coordinate=m["coordinates"][0],
                y_coordinate=m["coordinates"][1],
                icon_type=m.get("iconType")
            )
            db.add(marker)
        await db.commit()

        return {"ok": True, "message": "Map data synchronized successfully"}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
