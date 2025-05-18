from sqlalchemy import Column, Integer, String, Boolean, Text
from database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    table = Column(String(10))
    name = Column(String(50))
    items = Column(Text)  # JSON 문자열로 유지
    total = Column(Integer)
    song = Column(String(100))
    image_path = Column(String(200))
    timestamp = Column(String(50))
    processed = Column(Boolean, default=False)
    served_by = Column(Text, nullable=True)
    table_size = Column(Integer, default=1)

    # ✅ 동의 항목 분리
    consent_privacy = Column(Boolean, default=False)  # 개인정보처리방침 동의
    consent_terms = Column(Boolean, default=False)    # 이용약관 동의

class Waiting(Base):
    __tablename__ = "waiting"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50))
    phone = Column(String(20))
    table_size = Column(Integer)
    timestamp = Column(String(50))
    consent = Column(Boolean, default=False)
