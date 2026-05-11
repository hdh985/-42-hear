from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from database import get_db
from models import Waiting
from typing import List
import state

router = APIRouter(prefix="/api/admin")


@router.get("/waiting")
async def get_admin_waiting(db: Session = Depends(get_db)) -> JSONResponse:
    entries = db.query(Waiting).order_by(Waiting.timestamp).all()
    data: List[dict] = [
        {
            "id": e.id,
            "name": e.name,
            "phone": e.phone,
            "tableSize": e.table_size,
            "timestamp": e.timestamp
        }
        for e in entries
    ]
    response = JSONResponse(content=data)
    response.headers["X-Data-Version"] = str(state.waiting_ver())
    return response
