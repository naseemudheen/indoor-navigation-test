import asyncio
from sqlalchemy.future import select
from app.core.database import AsyncSessionLocal
from app.models.models import Node, QRLocation

async def main():
    async with AsyncSessionLocal() as session:
        # Get all nodes
        res = await session.execute(select(Node))
        nodes = res.scalars().all()
        print("=== NODES ===")
        for node in nodes:
            print(f"ID: {node.id} | Name: {node.name}")
            
        # Get all QR locations
        res = await session.execute(select(QRLocation))
        qrs = res.scalars().all()
        print("\n=== QR LOCATIONS ===")
        for qr in qrs:
            print(f"ID: {qr.id} | Name: {qr.name} | QR Code: {qr.qr_code} | Node ID: {qr.node_id}")

if __name__ == "__main__":
    asyncio.run(main())
