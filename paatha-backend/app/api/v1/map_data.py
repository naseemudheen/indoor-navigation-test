from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.models import Node, Edge, Marker, Floor

router = APIRouter()

@router.get("/data/{floor_id}")
async def get_map_data(floor_id: int, db: AsyncSession = Depends(get_db)):
    """
    Returns the graph data for a specific floor in a format similar to the original JSON.
    """
    # Fetch nodes
    result_nodes = await db.execute(
        select(Node)
        .where(Node.floor_id == floor_id)
        .options(selectinload(Node.source_edges).selectinload(Edge.target_node))
    )
    nodes = result_nodes.scalars().all()
    
    formatted_nodes = []
    for node in nodes:
        neighbors = []
        for edge in node.source_edges:
            target = edge.target_node
            neighbors.append({
                "id": target.id,
                "coordinates": [target.x_coordinate, target.y_coordinate],
                "distance": edge.distance,
                "isParent": edge.is_parent
            })
            
        node_data = {
            "id": node.id,
            "coordinates": [node.x_coordinate, node.y_coordinate],
            "neighbors": neighbors
        }
        if node.name:
            node_data["name"] = node.name
        if node.is_searchable:
            node_data["isSearchable"] = node.is_searchable
        
        formatted_nodes.append(node_data)
        
    # Fetch markers
    result_markers = await db.execute(select(Marker).where(Marker.floor_id == floor_id))
    markers = result_markers.scalars().all()
    
    formatted_markers = []
    for marker in markers:
        marker_data = {
            "id": marker.id,
            "type": marker.type,
            "coordinates": [marker.x_coordinate, marker.y_coordinate]
        }
        if marker.text:
            marker_data["text"] = marker.text
        if marker.icon_type:
            marker_data["iconType"] = marker.icon_type
            
        formatted_markers.append(marker_data)
        
    # Fetch floor calibration
    result_floor = await db.execute(select(Floor).where(Floor.id == floor_id))
    floor = result_floor.scalar_one_or_none()
    
    calibration = None
    if floor:
        calibration = {
            "anchor1": {
                "lat": floor.anchor_1_lat,
                "lng": floor.anchor_1_lng,
                "x": floor.anchor_1_x,
                "y": floor.anchor_1_y
            } if floor.anchor_1_lat is not None else None,
            "anchor2": {
                "lat": floor.anchor_2_lat,
                "lng": floor.anchor_2_lng,
                "x": floor.anchor_2_x,
                "y": floor.anchor_2_y
            } if floor.anchor_2_lat is not None else None
        }
        
    return {
        "nodes": formatted_nodes,
        "markers": formatted_markers,
        "calibration": calibration
    }
