from fastapi import APIRouter, Depends, Form, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from models import Order
from database import get_db
from datetime import datetime
import os, uuid, shutil, json

router = APIRouter(prefix="/api", tags=["Order"])

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "../uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ✅ 주문 등록 API (인원수 + 동의 항목 포함)
@router.post("/orders")
async def receive_order(
    table: str = Form(...),
    name: str = Form(...),
    items: str = Form(...),
    total: int = Form(...),
    song: str = Form(...),
    table_size: int = Form(...),
    consent_privacy: bool = Form(...),
    consent_terms: bool = Form(...),
    payment_image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    image_url_path = None
    if payment_image:
        ext = os.path.splitext(payment_image.filename)[1]
        unique_filename = f"{uuid.uuid4().hex}{ext}"
        full_path = os.path.join(UPLOAD_DIR, unique_filename)
        image_url_path = f"uploads/{unique_filename}"
        with open(full_path, "wb") as buf:
            shutil.copyfileobj(payment_image.file, buf)

    try:
        parsed_items = json.loads(items)
        if isinstance(parsed_items, list):
            parsed_items = [
                {"name": item, "served_by": None} if isinstance(item, str) else item
                for item in parsed_items
            ]
    except:
        parsed_items = [{"name": items, "served_by": None}]

    order = Order(
        table=table,
        name=name,
        items=json.dumps(parsed_items, ensure_ascii=False),
        total=total,
        song=song,
        image_path=image_url_path,
        timestamp=datetime.now().isoformat(),
        processed=False,
        table_size=table_size,
        consent_privacy=consent_privacy,
        consent_terms=consent_terms
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return {"message": "Order received", "order_id": order.id}


# ✅ 주문 목록 조회 API (table_size 포함)
@router.get("/orders")
def get_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).order_by(Order.timestamp).all()
    return [{
        "id": o.id,
        "table": o.table,
        "name": o.name,
        "items": json.loads(o.items),
        "total": o.total,
        "song": o.song,
        "image_path": o.image_path,
        "timestamp": o.timestamp,
        "processed": o.processed,
        "table_size": o.table_size,
        "consent_privacy": o.consent_privacy,
        "consent_terms": o.consent_terms
    } for o in orders]


# ✅ 주문 처리 상태 토글 API
@router.patch("/orders/{order_id}/toggle")
async def toggle_processed(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.processed = not order.processed
    db.commit()
    return {"message": "ok", "processed": order.processed}


# ✅ 개별 항목 제공자(served_by) 토글 API
@router.patch("/orders/{order_id}/serve-item")
def toggle_item_served(
    order_id: int,
    item_index: int = Form(...),
    admin: str = Form(...),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    try:
        items = json.loads(order.items)
    except:
        raise HTTPException(status_code=500, detail="Invalid item format")

    if item_index < 0 or item_index >= len(items):
        raise HTTPException(status_code=400, detail="Invalid item index")

    if admin == '':
        items[item_index]['served_by'] = None
    else:
        items[item_index]['served_by'] = admin

    order.items = json.dumps(items, ensure_ascii=False)
    db.commit()
    return {"message": "Item toggled", "processed": order.processed}


# ✅ 주문 전체 완료 API (serve-item 누락시 system 처리)
@router.patch("/orders/{order_id}/complete")
def complete_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    try:
        items = json.loads(order.items)
    except:
        raise HTTPException(status_code=500, detail="Invalid item format")

    for item in items:
        if not item.get('served_by'):
            item['served_by'] = 'system'
    order.items = json.dumps(items, ensure_ascii=False)

    order.processed = True
    db.commit()
    return {"message": "Order marked as complete"}
