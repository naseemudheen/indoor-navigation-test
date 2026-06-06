from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="admin")  # "superadmin", "editor", "admin"
    is_active = Column(Boolean, default=True)


class Block(Base):
    __tablename__ = "blocks"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    
    floors = relationship("Floor", back_populates="block", cascade="all, delete-orphan")


class Floor(Base):
    __tablename__ = "floors"
    
    id = Column(Integer, primary_key=True, index=True)
    block_id = Column(Integer, ForeignKey("blocks.id"), nullable=False)
    name = Column(String, nullable=False)
    level = Column(Integer, nullable=False, default=0)
    
    block = relationship("Block", back_populates="floors")
    nodes = relationship("Node", back_populates="floor", cascade="all, delete-orphan")


class Node(Base):
    __tablename__ = "nodes"
    
    # Internal DB id
    db_id = Column(Integer, primary_key=True, index=True)
    # The string ID used in frontend (e.g. "G-001")
    id = Column(String, unique=True, index=True, nullable=False)
    floor_id = Column(Integer, ForeignKey("floors.id"), nullable=False)
    
    x_coordinate = Column(Float, nullable=False)
    y_coordinate = Column(Float, nullable=False)
    name = Column(String, nullable=True)
    is_searchable = Column(Boolean, default=False)
    
    floor = relationship("Floor", back_populates="nodes")
    
    # Edges where this node is the source
    source_edges = relationship(
        "Edge", 
        foreign_keys="Edge.source_node_id",
        back_populates="source_node",
        cascade="all, delete-orphan"
    )
    
    # Edges where this node is the target
    target_edges = relationship(
        "Edge", 
        foreign_keys="Edge.target_node_id",
        back_populates="target_node",
        cascade="all, delete-orphan"
    )

class Marker(Base):
    __tablename__ = "markers"
    
    db_id = Column(Integer, primary_key=True, index=True)
    id = Column(String, unique=True, index=True, nullable=False)
    floor_id = Column(Integer, ForeignKey("floors.id"), nullable=False)
    
    type = Column(String, nullable=False) # 'label' or 'icon'
    text = Column(String, nullable=True)
    x_coordinate = Column(Float, nullable=False)
    y_coordinate = Column(Float, nullable=False)
    icon_type = Column(String, nullable=True)
    
    floor = relationship("Floor")


class Edge(Base):
    __tablename__ = "edges"
    
    id = Column(Integer, primary_key=True, index=True)
    source_node_id = Column(String, ForeignKey("nodes.id"), nullable=False)
    target_node_id = Column(String, ForeignKey("nodes.id"), nullable=False)
    
    distance = Column(Float, nullable=False)
    is_parent = Column(Boolean, default=False)
    
    source_node = relationship("Node", foreign_keys=[source_node_id], back_populates="source_edges")
    target_node = relationship("Node", foreign_keys=[target_node_id], back_populates="target_edges")
