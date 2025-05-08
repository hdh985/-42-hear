from sqlalchemy import Column, Integer, String, Boolean, Text
from database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    table = Column(String(10))
    name = Column(String(50))
    items = Column(Text)
    total = Column(Integer)
    song = Column(String(100))
    image_path = Column(String(200))
    timestamp = Column(String(50))
    processed = Column(Boolean, default=False) 
    consent = Column(Boolean, default=False) 

class Waiting(Base):
    __tablename__ = "waiting"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50))
    phone = Column(String(20))
    table_size = Column(Integer)
    timestamp = Column(String(50))
    consent = Column(Boolean, default=False) 