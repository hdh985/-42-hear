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

@router.post("/orders")
async def receive_order(
    table: str = Form(...),
    name: str = Form(...),
    items: str = Form(...),
    total: int = Form(...),
    song: str = Form(...),
    consent: bool = Form(...),  # ✅ 개인정보 동의 여부 추가
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
    except:
        parsed_items = [items]

    order = Order(
        table=table,
        name=name,
        items=json.dumps(parsed_items, ensure_ascii=False),
        total=total,
        song=song,
        image_path=image_url_path,
        timestamp=datetime.now().isoformat(),
        processed=False,
        consent=consent  # ✅ DB에 저장
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return {"message": "Order received", "order_id": order.id}


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
        "consent": o.consent  # ✅ 조회 시 포함 (선택)
    } for o in orders]


@router.patch("/orders/{order_id}/toggle")
async def toggle_processed(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.processed = not order.processed
    db.commit()
    return {"message": "ok", "processed": order.processed}
