from fastapi import APIRouter, Depends, Form
from sqlalchemy.orm import Session
from models import SoldOutItem, Order
from database import get_db
import state

router = APIRouter(prefix="/api/menu", tags=["Menu"])


@router.get("/soldout")
def get_soldout(db: Session = Depends(get_db)):
    return [item.item_id for item in db.query(SoldOutItem).all()]


@router.post("/soldout/{item_id}")
def toggle_soldout(item_id: str, db: Session = Depends(get_db)):
    existing = db.query(SoldOutItem).filter(SoldOutItem.item_id == item_id).first()
    if existing:
        db.delete(existing)
        db.commit()
        return {"soldout": False, "item_id": item_id}
    db.add(SoldOutItem(item_id=item_id))
    db.commit()
    return {"soldout": True, "item_id": item_id}


@router.post("/checkout-seat")
def checkout_seat(table: str = Form(...), db: Session = Depends(get_db)):
    orders = db.query(Order).filter(
        Order.table == table, Order.checked_out == False
    ).all()
    for o in orders:
        o.checked_out = True
    db.commit()
    state.bump_orders()
    return {"checked_out": len(orders)}
