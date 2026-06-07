from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
from typing import List, Any, Dict

from app.core.database import get_db
from app.models.models import Node, Edge, Marker, User, QRLocation, NavigationSession
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
        # 1. Fetch existing nodes on this floor
        result = await db.execute(select(Node).where(Node.floor_id == floor_id))
        existing_nodes = result.scalars().all()
        existing_nodes_by_id = {node.id: node for node in existing_nodes}

        # 2. Identify incoming nodes from payload
        incoming_nodes = payload.nodes
        incoming_node_ids = {n["id"] for n in incoming_nodes}

        # 3. Determine nodes to delete
        nodes_to_delete = set(existing_nodes_by_id.keys()) - incoming_node_ids

        # 4. Clean up any foreign key references to the nodes we are actually deleting
        if nodes_to_delete:
            # Delete navigation sessions referencing the deleted nodes
            await db.execute(
                delete(NavigationSession).where(
                    NavigationSession.start_node_id.in_(nodes_to_delete) |
                    NavigationSession.end_node_id.in_(nodes_to_delete) |
                    NavigationSession.current_node_id.in_(nodes_to_delete)
                )
            )
            # Delete QR locations referencing the deleted nodes
            await db.execute(
                delete(QRLocation).where(
                    QRLocation.node_id.in_(nodes_to_delete)
                )
            )

        # 5. Delete ALL edges connecting to nodes on this floor
        existing_node_ids = set(existing_nodes_by_id.keys())
        if existing_node_ids:
            if nodes_to_delete:
                await db.execute(
                    delete(Edge).where(
                        Edge.source_node_id.in_(existing_node_ids) |
                        Edge.target_node_id.in_(nodes_to_delete)
                    )
                )
            else:
                await db.execute(
                    delete(Edge).where(
                        Edge.source_node_id.in_(existing_node_ids)
                    )
                )

        # 6. Delete all markers on this floor
        await db.execute(delete(Marker).where(Marker.floor_id == floor_id))

        # 7. Delete nodes that are no longer in the payload
        if nodes_to_delete:
            await db.execute(
                delete(Node).where(
                    Node.id.in_(nodes_to_delete) & (Node.floor_id == floor_id)
                )
            )

        # 8. Update existing nodes and insert new nodes
        for n in incoming_nodes:
            node_id = n["id"]
            x_coord = n["coordinates"][0]
            y_coord = n["coordinates"][1]
            name = n.get("name")
            is_searchable = n.get("isSearchable", False)

            if node_id in existing_nodes_by_id:
                node = existing_nodes_by_id[node_id]
                node.x_coordinate = x_coord
                node.y_coordinate = y_coord
                node.name = name
                node.is_searchable = is_searchable
            else:
                node = Node(
                    id=node_id,
                    floor_id=floor_id,
                    x_coordinate=x_coord,
                    y_coordinate=y_coord,
                    name=name,
                    is_searchable=is_searchable
                )
                db.add(node)

        # Flush nodes to ensure they exist in the DB before inserting edges
        await db.flush()

        # 9. Insert new edges
        for n in incoming_nodes:
            for neighbor in n.get("neighbors", []):
                edge = Edge(
                    source_node_id=n["id"],
                    target_node_id=neighbor["id"],
                    distance=neighbor.get("distance", 0.0),
                    is_parent=neighbor.get("isParent", False)
                )
                db.add(edge)

        # 10. Insert new markers
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

        # 11. Commit transaction
        await db.commit()

        return {"ok": True, "message": "Map data synchronized successfully"}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
