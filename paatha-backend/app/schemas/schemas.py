from pydantic import BaseModel, EmailStr
from typing import Optional, List

# --- Auth / User Schemas ---
class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: str = "admin"
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None


# --- Map Schemas ---
class EdgeBase(BaseModel):
    target_node_id: str
    distance: float
    is_parent: bool = False

class EdgeCreate(EdgeBase):
    source_node_id: str

class EdgeOut(EdgeBase):
    id: int
    source_node_id: str

    class Config:
        from_attributes = True

class NodeBase(BaseModel):
    id: str
    x_coordinate: float
    y_coordinate: float
    name: Optional[str] = None
    is_searchable: bool = False

class NodeCreate(NodeBase):
    floor_id: int

class NodeOut(NodeBase):
    db_id: int
    floor_id: int
    source_edges: List[EdgeOut] = []

    class Config:
        from_attributes = True

class FloorBase(BaseModel):
    name: str
    level: int

class FloorCreate(FloorBase):
    block_id: int

class FloorOut(FloorBase):
    id: int
    block_id: int

    class Config:
        from_attributes = True

class BlockBase(BaseModel):
    name: str

class BlockCreate(BlockBase):
    pass

class BlockOut(BlockBase):
    id: int
    floors: List[FloorOut] = []

    class Config:
        from_attributes = True

class MarkerBase(BaseModel):
    id: str
    type: str
    text: Optional[str] = None
    x_coordinate: float
    y_coordinate: float
    icon_type: Optional[str] = None

class MarkerCreate(MarkerBase):
    floor_id: int

class MarkerOut(MarkerBase):
    db_id: int
    floor_id: int

    class Config:
        from_attributes = True
