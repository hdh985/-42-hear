from fastapi import APIRouter, Form, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from database import get_db
from models import Waiting
from datetime import datetime
from typing import List

router = APIRouter(prefix="/api/waiting")

@router.post("")
async def add_waiting(
    name: str = Form(...),
    tableSize: int = Form(...),
    phone: str = Form(...),
    consent: bool = Form(...),  # ✅ 개인정보 수집 동의 여부 추가
    db: Session = Depends(get_db)
):
    entry = Waiting(
        name=name,
        phone=phone,
        table_size=tableSize,
        timestamp=datetime.now().isoformat(),
        consent=consent  # ✅ DB에 기록
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return {
        "message": "ok",
        "entry": {
            "id": entry.id,
            "name": entry.name,
            "phone": entry.phone[-4:],
            "tableSize": entry.table_size,
            "timestamp": entry.timestamp
        }
    }

@router.get("")
async def get_waiting(db: Session = Depends(get_db)) -> List[dict]:
    entries = db.query(Waiting).order_by(Waiting.timestamp).all()
    return [
        {
            "id": e.id,
            "name": e.name,
            "tableSize": e.table_size,
            "timestamp": e.timestamp,
            "phone": e.phone[-4:] if e.phone else ""
        }
        for e in entries
    ]

@router.delete("/{entry_id}")
async def delete_waiting(
    entry_id: int,
    payload: dict = Body(...),
    db: Session = Depends(get_db)
):
    entry = db.query(Waiting).filter(Waiting.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    input_phone = payload.get("phone", "")
    if entry.phone != input_phone:
        raise HTTPException(status_code=403, detail="전화번호 불일치")

    db.delete(entry)
    db.commit()
    return {"message": "deleted"}

@router.delete("/admin/{entry_id}")
async def admin_delete_waiting(entry_id: int, db: Session = Depends(get_db)):
    entry = db.query(Waiting).filter(Waiting.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    db.delete(entry)
    db.commit()
    return {"message": "deleted by admin"}
