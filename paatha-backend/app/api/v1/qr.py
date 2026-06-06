import os
import io
import uuid
import zipfile
import qrcode
from datetime import datetime
from typing import List, Optional, Any
from urllib.parse import parse_qs, quote, urlparse
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete, or_, and_, func
from sqlalchemy.orm import selectinload

from app.core.config import settings
from app.core.database import get_db
from app.models.models import QRLocation, Node, User, Floor
from app.schemas.schemas import (
    QRLocationCreate,
    QRLocationUpdate,
    QRLocationOut,
    QRResolveRequest,
    QRResolveResponse
)
from app.api.deps import require_role

router = APIRouter()

def get_block_symbol(block_name: Optional[str], block_id: Optional[int]) -> str:
    if not block_name:
        return f"B{block_id or 1}"

    tokens = [
        token.upper()
        for token in block_name.replace("-", " ").replace("_", " ").split()
        if token.strip()
    ]
    meaningful_tokens = [token for token in tokens if token not in {"BLOCK", "BLK"}]
    if meaningful_tokens:
        token = meaningful_tokens[0]
        return token if len(token) <= 3 else token[0]

    compact_name = "".join(char for char in block_name.upper() if char.isalnum())
    return compact_name[:3] or f"B{block_id or 1}"


def get_floor_symbol(floor_name: Optional[str], floor_level: Optional[int]) -> str:
    if floor_level is not None:
        if floor_level < 0:
            return "B"
        if floor_level == 0:
            return "G"
        return str(floor_level)

    if not floor_name:
        return "G"

    normalized_name = floor_name.strip().lower()
    if "basement" in normalized_name:
        return "B"
    if "ground" in normalized_name:
        return "G"
    if "first" in normalized_name:
        return "1"
    if "second" in normalized_name:
        return "2"
    if "third" in normalized_name:
        return "3"

    compact_name = "".join(char for char in floor_name.upper() if char.isalnum())
    return compact_name[:2] or "G"


def get_qr_number(qr_code: str) -> Optional[int]:
    try:
        return int(qr_code.split("-")[-1])
    except (AttributeError, TypeError, ValueError):
        return None


def get_qr_scan_payload(qr_code_val: str) -> str:
    frontend_url = settings.FRONTEND_URL.rstrip("/")
    return f"{frontend_url}/directions?qr={quote(qr_code_val)}"


def normalize_qr_code_payload(qr_code_val: str) -> str:
    if not qr_code_val:
        return qr_code_val

    raw_value = qr_code_val.strip()
    parsed = urlparse(raw_value)
    if parsed.scheme and parsed.netloc:
        query_code = parse_qs(parsed.query).get("qr", [None])[0]
        if query_code:
            return query_code.strip()

        path_parts = [part for part in parsed.path.split("/") if part]
        if len(path_parts) >= 2 and path_parts[-2].lower() == "qr":
            return path_parts[-1].strip()

    return raw_value


# Helper: Auto-generate sequential QR Code in {Block}-{Floor}-{Number} format
async def generate_next_qr_code(db: AsyncSession, node: Node) -> str:
    block = node.floor.block if node.floor else None
    block_symbol = get_block_symbol(block.name if block else None, block.id if block else None)
    floor_symbol = get_floor_symbol(node.floor.name if node.floor else None, node.floor.level if node.floor else None)
    code_prefix = f"{block_symbol}-{floor_symbol}"

    result = await db.execute(
        select(QRLocation.qr_code)
        .where(QRLocation.is_deleted == False)
    )
    existing_numbers = [
        number
        for number in (get_qr_number(qr_code) for qr_code in result.scalars().all())
        if number is not None
    ]
    next_number = (max(existing_numbers) + 1) if existing_numbers else 1
    return f"{code_prefix}-{next_number:03d}"

# Helper: Generate QR PNG Image Bytes in memory
def generate_qr_png_bytes(qr_code_val: str) -> bytes:
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(get_qr_scan_payload(qr_code_val))
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()

def get_qr_image_route(qr_code_val: str) -> str:
    return f"/api/qr/image/{qr_code_val}"

# Endpoint: Serve QR image dynamically
@router.get("/image/{qr_code}")
async def get_qr_image(qr_code: str, db: AsyncSession = Depends(get_db)):
    # Verify if the QR code exists to prevent arbitrary generations
    result = await db.execute(
        select(QRLocation).where(
            and_(
                QRLocation.qr_code == qr_code,
                QRLocation.is_deleted == False
            )
        )
    )
    qr_loc = result.scalars().first()
    if not qr_loc:
        raise HTTPException(status_code=404, detail="QR Code not found or is deleted")
        
    png_bytes = generate_qr_png_bytes(qr_code)
    return StreamingResponse(
        io.BytesIO(png_bytes),
        media_type="image/png",
        headers={"Cache-Control": "public, max-age=31536000"}
    )

# Create QR Code
@router.post("/", response_model=QRLocationOut, status_code=status.HTTP_201_CREATED)
async def create_qr(
    qr_in: QRLocationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin", "admin", "editor"]))
):
    # Verify node exists
    node_result = await db.execute(
        select(Node)
        .where(Node.id == qr_in.node_id)
        .options(selectinload(Node.floor).selectinload(Floor.block))
    )
    node = node_result.scalars().first()
    if not node:
        raise HTTPException(status_code=400, detail="The specified navigation node does not exist.")
        
    qr_code_val = await generate_next_qr_code(db, node)
    image_path = get_qr_image_route(qr_code_val)
    
    qr_loc = QRLocation(
        qr_code=qr_code_val,
        name=qr_in.name,
        node_id=qr_in.node_id,
        x_coordinate=qr_in.x_coordinate if qr_in.x_coordinate is not None else node.x_coordinate,
        y_coordinate=qr_in.y_coordinate if qr_in.y_coordinate is not None else node.y_coordinate,
        heading_direction=qr_in.heading_direction,
        qr_type=qr_in.qr_type,
        description=qr_in.description,
        is_active=qr_in.is_active,
        image_path=image_path
    )
    
    db.add(qr_loc)
    await db.commit()
    await db.refresh(qr_loc)
    return qr_loc

# List QR Codes with Pagination and Filters
@router.get("/")
async def list_qrs(
    search: Optional[str] = None,
    qr_type: Optional[str] = None,
    is_active: Optional[bool] = None,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    query = select(QRLocation).where(QRLocation.is_deleted == False).options(selectinload(QRLocation.node))
    
    # Filters
    if search:
        query = query.where(
            or_(
                QRLocation.name.ilike(f"%{search}%"),
                QRLocation.qr_code.ilike(f"%{search}%"),
                QRLocation.node_id.ilike(f"%{search}%")
            )
        )
    if qr_type:
        query = query.where(QRLocation.qr_type == qr_type.upper())
    if is_active is not None:
        query = query.where(QRLocation.is_active == is_active)
        
    # Count Total Items
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0
    
    # Pagination
    query = query.order_by(QRLocation.created_at.desc()).offset((page - 1) * size).limit(size)
    result = await db.execute(query)
    items = result.scalars().all()
    
    return {
        "items": items,
        "total": total,
        "page": page,
        "size": size,
        "pages": (total + size - 1) // size
    }

# PDF printable sheet generator
@router.get("/print-sheet")
async def download_print_sheet(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(QRLocation)
        .where(and_(QRLocation.is_active == True, QRLocation.is_deleted == False))
    )
    qrs = result.scalars().all()
    if not qrs:
        raise HTTPException(status_code=404, detail="No active QR codes available to print.")
        
    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib import colors
    
    pdf_buffer = io.BytesIO()
    doc = SimpleDocTemplate(pdf_buffer, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    story = []
    
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Heading2'],
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#0F172A'),
        alignment=1
    )
    code_style = ParagraphStyle(
        'CodeStyle',
        parent=styles['Normal'],
        fontSize=15,
        leading=19,
        fontName='Helvetica-Bold',
        textColor=colors.HexColor('#2563EB'),
        alignment=1
    )
    text_style = ParagraphStyle(
        'TextStyle',
        parent=styles['Normal'],
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#64748B'),
        alignment=1
    )
    
    for i, qr in enumerate(qrs):
        qr_bytes = generate_qr_png_bytes(qr.qr_code)
        qr_img = Image(io.BytesIO(qr_bytes), width=160, height=160)
        
        card_data = [
            [Paragraph(f"<b>{qr.name}</b>", title_style)],
            [Spacer(1, 8)],
            [qr_img],
            [Spacer(1, 8)],
            [Paragraph(f"Code: {qr.qr_code}", code_style)],
            [Paragraph(f"Type: {qr.qr_type} | Node ID: {qr.node_id}", text_style)]
        ]
        
        card_table = Table(card_data, colWidths=[320])
        card_table.setStyle(TableStyle([
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
            ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor('#CBD5E1')),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#F1F5F9')),
            ('TOPPADDING', (0,0), (-1,-1), 16),
            ('BOTTOMPADDING', (0,0), (-1,-1), 16),
        ]))
        
        story.append(card_table)
        story.append(Spacer(1, 24))
        
        # 2 cards per page
        if (i + 1) % 2 == 0 and (i + 1) < len(qrs):
            story.append(PageBreak())
            
    doc.build(story)
    pdf_buffer.seek(0)
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=paadha-qr-sheet.pdf"}
    )

# Get QR Code detail
@router.get("/{id}", response_model=QRLocationOut)
async def get_qr(id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(QRLocation)
        .where(and_(QRLocation.id == id, QRLocation.is_deleted == False))
        .options(selectinload(QRLocation.node))
    )
    qr_loc = result.scalars().first()
    if not qr_loc:
        raise HTTPException(status_code=404, detail="QR Location not found")
    return qr_loc

# Update QR Code
@router.put("/{id}", response_model=QRLocationOut)
async def update_qr(
    id: uuid.UUID,
    qr_in: QRLocationUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin", "admin", "editor"]))
):
    result = await db.execute(select(QRLocation).where(and_(QRLocation.id == id, QRLocation.is_deleted == False)))
    qr_loc = result.scalars().first()
    if not qr_loc:
        raise HTTPException(status_code=404, detail="QR Location not found")
        
    # Verify node exists
    node_result = await db.execute(select(Node).where(Node.id == qr_in.node_id))
    node = node_result.scalars().first()
    if not node:
        raise HTTPException(status_code=400, detail="The specified navigation node does not exist.")
        
    qr_loc.name = qr_in.name
    qr_loc.node_id = qr_in.node_id
    qr_loc.x_coordinate = qr_in.x_coordinate if qr_in.x_coordinate is not None else node.x_coordinate
    qr_loc.y_coordinate = qr_in.y_coordinate if qr_in.y_coordinate is not None else node.y_coordinate
    qr_loc.heading_direction = qr_in.heading_direction
    qr_loc.qr_type = qr_in.qr_type
    qr_loc.description = qr_in.description
    qr_loc.is_active = qr_in.is_active
    qr_loc.updated_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(qr_loc)
    return qr_loc

# Soft Delete QR Code
@router.delete("/{id}")
async def delete_qr(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin", "admin", "editor"]))
):
    result = await db.execute(select(QRLocation).where(and_(QRLocation.id == id, QRLocation.is_deleted == False)))
    qr_loc = result.scalars().first()
    if not qr_loc:
        raise HTTPException(status_code=404, detail="QR Location not found")
        
    # Soft delete
    qr_loc.is_deleted = True
    qr_loc.updated_at = datetime.utcnow()
    await db.commit()
    return {"ok": True, "message": "QR Location successfully soft-deleted"}

# Resolve QR Code
@router.post("/resolve", response_model=QRResolveResponse)
async def resolve_qr(payload: QRResolveRequest, db: AsyncSession = Depends(get_db)):
    qr_code = normalize_qr_code_payload(payload.qr_code)
    result = await db.execute(
        select(QRLocation)
        .where(
            and_(
                QRLocation.qr_code == qr_code,
                QRLocation.is_active == True,
                QRLocation.is_deleted == False
            )
        )
    )
    qr_loc = result.scalars().first()
    if not qr_loc:
        raise HTTPException(status_code=404, detail="Active QR Code not found or has been disabled.")
        
    return QRResolveResponse(
        node_id=qr_loc.node_id,
        name=qr_loc.name,
        x_coordinate=qr_loc.x_coordinate or 0.0,
        y_coordinate=qr_loc.y_coordinate or 0.0,
        heading_direction=qr_loc.heading_direction or 0,
        qr_type=qr_loc.qr_type
    )

# Bulk Generation with ZIP Download
@router.post("/bulk-generate")
async def bulk_generate_qrs(
    node_ids: List[str],
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin", "admin", "editor"]))
):
    if not node_ids:
        raise HTTPException(status_code=400, detail="Node IDs list cannot be empty.")
        
    qr_locs = []
    for node_id in node_ids:
        # Check node
        node_result = await db.execute(
            select(Node)
            .where(Node.id == node_id)
            .options(selectinload(Node.floor).selectinload(Floor.block))
        )
        node = node_result.scalars().first()
        if not node:
            continue # Skip invalid nodes
            
        qr_code_val = await generate_next_qr_code(db, node)
        image_path = get_qr_image_route(qr_code_val)
        
        qr_loc = QRLocation(
            qr_code=qr_code_val,
            name=node.name or f"QR for {node_id}",
            node_id=node_id,
            x_coordinate=node.x_coordinate,
            y_coordinate=node.y_coordinate,
            heading_direction=90, # default heading
            qr_type="JUNCTION", # default junction type
            description=f"Auto-generated QR for node {node_id}",
            is_active=True,
            image_path=image_path
        )
        db.add(qr_loc)
        await db.commit()
        await db.refresh(qr_loc)
        qr_locs.append(qr_loc)
        
    if not qr_locs:
        raise HTTPException(status_code=400, detail="No QR locations were generated. Check node IDs.")
        
    # Generate ZIP in memory
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "a", zipfile.ZIP_DEFLATED, False) as zip_file:
        for qr in qr_locs:
            qr_bytes = generate_qr_png_bytes(qr.qr_code)
            zip_file.writestr(f"{qr.qr_code}.png", qr_bytes)
                
    zip_buffer.seek(0)
    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=paadha-qrcodes.zip"}
    )
