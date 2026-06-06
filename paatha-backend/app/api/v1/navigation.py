import uuid
import heapq
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.models import Node, QRLocation, NavigationSession, Floor
from app.schemas.schemas import (
    GuestSessionCreate,
    RecalibrationRequest,
    RecalibrationResponse
)

router = APIRouter()

# Helper: Find node by name and floor level
async def find_node_by_name_and_floor(db: AsyncSession, name: str, floor_val: Any) -> Node:
    # Try exact name match
    result = await db.execute(select(Node).where(Node.name == name))
    nodes = result.scalars().all()
    
    if not nodes:
        # Fallback to ID match
        result = await db.execute(select(Node).where(Node.id == name))
        node = result.scalars().first()
        if node:
            return node
        raise HTTPException(
            status_code=404, 
            detail=f"Navigation node with name or ID '{name}' not found."
        )
        
    if len(nodes) == 1:
        return nodes[0]
        
    # If multiple nodes match, resolve by floor level comparison
    for node in nodes:
        floor_result = await db.execute(select(Floor).where(Floor.id == node.floor_id))
        floor = floor_result.scalars().first()
        if floor:
            # Match floor level (e.g. 0, 1, -1) or floor name
            if str(floor.level) == str(floor_val) or floor.name.lower() == str(floor_val).lower():
                return node
                
    return nodes[0]

# Standard Dijkstra Pathfinding in Python
def dijkstra_find_path(graph: Dict[str, Dict[str, float]], start: str, end: str) -> Optional[List[str]]:
    if start not in graph or end not in graph:
        return None
        
    queue = [(0.0, start, [start])]
    visited = set()
    
    while queue:
        (cost, current, path) = heapq.heappop(queue)
        
        if current in visited:
            continue
        visited.add(current)
        
        if current == end:
            return path
            
        for neighbor, weight in graph.get(current, {}).items():
            if neighbor not in visited:
                heapq.heappush(queue, (cost + weight, neighbor, path + [neighbor]))
                
    return None

# Guest Session Creation API
# Maps to POST /navigation/guest-session/
@router.post("/guest-session/")
async def create_guest_session(payload: GuestSessionCreate, db: AsyncSession = Depends(get_db)):
    start_node = await find_node_by_name_and_floor(db, payload.start_location.name, payload.start_location.floor)
    end_node = await find_node_by_name_and_floor(db, payload.end_location.name, payload.end_location.floor)
    
    session = NavigationSession(
        device_id=payload.device_id,
        start_node_id=start_node.id,
        end_node_id=end_node.id,
        current_node_id=start_node.id
    )
    
    db.add(session)
    await db.commit()
    await db.refresh(session)
    
    return {
        "session_id": session.id,
        "start_node_id": session.start_node_id,
        "end_node_id": session.end_node_id,
        "current_node_id": session.current_node_id
    }

# Recalibrate Navigation Route from Scanned QR Location
# Maps to POST /api/navigation/recalibrate
@router.post("/recalibrate", response_model=RecalibrationResponse)
async def recalibrate_navigation(payload: RecalibrationRequest, db: AsyncSession = Depends(get_db)):
    # 1. Resolve QR Code
    qr_result = await db.execute(
        select(QRLocation)
        .where(
            QRLocation.qr_code == payload.qr_code,
            QRLocation.is_active == True,
            QRLocation.is_deleted == False
        )
    )
    qr_loc = qr_result.scalars().first()
    if not qr_loc:
        raise HTTPException(
            status_code=400,
            detail="The scanned QR code is either invalid, inactive, or deleted."
        )
        
    # 2. Find Navigation Session
    session_result = await db.execute(
        select(NavigationSession).where(NavigationSession.id == payload.current_route_id)
    )
    session = session_result.scalars().first()
    if not session:
        raise HTTPException(
            status_code=404,
            detail="Active navigation session not found."
        )
        
    # 3. Update current location in the session
    session.current_node_id = qr_loc.node_id
    await db.commit()
    
    # 4. Fetch the entire Node Graph to perform Dijkstra on the server side
    node_stmt = select(Node).options(selectinload(Node.source_edges))
    nodes_result = await db.execute(node_stmt)
    all_nodes = nodes_result.scalars().all()
    
    # Build Adjacency Matrix for Dijkstra
    graph = {}
    for node in all_nodes:
        graph[node.id] = {}
        for edge in node.source_edges:
            graph[node.id][edge.target_node_id] = edge.distance
            
    # 5. Compute the new path from resolved QR location node to destination node
    recalculated_path = dijkstra_find_path(graph, qr_loc.node_id, session.end_node_id)
    if not recalculated_path:
        raise HTTPException(
            status_code=400,
            detail="Could not calculate a path to the destination from the recalibrated QR position."
        )
        
    return RecalibrationResponse(
        session_id=session.id,
        current_node_id=qr_loc.node_id,
        route=recalculated_path
    )
