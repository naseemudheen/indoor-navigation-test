import os
import sys
import asyncio
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import AsyncSessionLocal
from sqlalchemy.future import select
from app.models.models import User
from app.core.security import get_password_hash

async def create_admin():
    async with AsyncSessionLocal() as db:
        try:
            # Check if user exists
            result = await db.execute(select(User).filter(User.email == "admin@gmail.com"))
            existing_user = result.scalars().first()
            if existing_user:
                print("User already exists!")
                return
                
            hashed_password = get_password_hash("admin")
            new_admin = User(
                username="admin",
                email="admin@gmail.com",
                hashed_password=hashed_password,
                role="admin",
                is_active=True
            )
            db.add(new_admin)
            await db.commit()
            print("Admin user created successfully!")
        except Exception as e:
            print(f"An error occurred: {e}")

if __name__ == "__main__":
    asyncio.run(create_admin())
