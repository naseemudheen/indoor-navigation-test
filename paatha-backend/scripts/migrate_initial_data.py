import sys
import os
import json
import asyncio

# Add the parent directory to the python path so we can import from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.future import select
from app.core.database import AsyncSessionLocal, engine, Base
from app.models.models import Block, Floor, Node, Edge, Marker

async def migrate_data():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    async with AsyncSessionLocal() as db:
        # Create default block
        result = await db.execute(select(Block).where(Block.name == "Main Block"))
        block = result.scalars().first()
        if not block:
            block = Block(name="Main Block")
            db.add(block)
            await db.commit()
            await db.refresh(block)
            
        # Create default floor
        result = await db.execute(select(Floor).where(Floor.name == "Ground Floor"))
        floor = result.scalars().first()
        if not floor:
            floor = Floor(name="Ground Floor", level=0, block_id=block.id)
            db.add(floor)
            await db.commit()
            await db.refresh(floor)
            
        # Read JSON file
        json_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
            "Paatha-simple-building", "src", "data", "maps", "groundfloor_data.json"
        )
        
        if not os.path.exists(json_path):
            print(f"File not found: {json_path}")
            return
            
        with open(json_path, "r") as f:
            data = json.load(f)
            
        nodes_data = data.get("nodes", [])
        
        # 1. First pass: insert all nodes
        seen_nodes = set()
        for n in nodes_data:
            if n["id"] in seen_nodes:
                continue
            
            # check if exists
            result = await db.execute(select(Node).where(Node.id == n["id"]))
            if result.scalars().first():
                seen_nodes.add(n["id"])
                continue
                
            node = Node(
                id=n["id"],
                floor_id=floor.id,
                x_coordinate=n["coordinates"][0],
                y_coordinate=n["coordinates"][1],
                name=n.get("name"),
                is_searchable=n.get("isSearchable", False)
            )
            db.add(node)
            seen_nodes.add(n["id"])
            
        await db.commit()
        
        # 2. Second pass: insert all edges
        seen_edges = set()
        for n in nodes_data:
            neighbors = n.get("neighbors", [])
            for neighbor in neighbors:
                edge_key = (n["id"], neighbor["id"])
                if edge_key in seen_edges:
                    continue
                
                # check if edge exists
                result = await db.execute(
                    select(Edge).where(
                        Edge.source_node_id == n["id"],
                        Edge.target_node_id == neighbor["id"]
                    )
                )
                if result.scalars().first():
                    seen_edges.add(edge_key)
                    continue
                    
                edge = Edge(
                    source_node_id=n["id"],
                    target_node_id=neighbor["id"],
                    distance=neighbor.get("distance", 0.0),
                    is_parent=neighbor.get("isParent", False)
                )
                db.add(edge)
                seen_edges.add(edge_key)
                
        # 3. Third pass: insert all markers
        markers_data = data.get("markers", [])
        for m in markers_data:
            # check if marker exists
            result = await db.execute(select(Marker).where(Marker.id == m["id"]))
            if result.scalars().first():
                continue
                
            marker = Marker(
                id=m["id"],
                floor_id=floor.id,
                type=m.get("type", "label"),
                text=m.get("text"),
                x_coordinate=m["coordinates"][0],
                y_coordinate=m["coordinates"][1],
                icon_type=m.get("iconType")
            )
            db.add(marker)
            
        await db.commit()
        print("Migration successful.")

if __name__ == "__main__":
    asyncio.run(migrate_data())
