# api/admin_waiting.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Waiting
from typing import List

router = APIRouter(prefix="/api/admin")

@router.get("/waiting")
async def get_admin_waiting(db: Session = Depends(get_db)) -> List[dict]:
    entries = db.query(Waiting).order_by(Waiting.timestamp).all()
    return [
        {
            "id": e.id,
            "name": e.name,
            "phone": e.phone,  # ✅ 전체 전화번호 노출
            "tableSize": e.table_size,
            "timestamp": e.timestamp
        }
        for e in entries
    ]


