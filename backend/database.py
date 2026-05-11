from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from contextlib import contextmanager
from dotenv import load_dotenv
import os
import urllib.parse

load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_PASS = urllib.parse.quote_plus(os.getenv("DB_PASS"))
DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME")

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
try:
    engine = create_engine(
        DATABASE_URL,
        echo=False,          # True → 모든 SQL 로깅, 큰 I/O 오버헤드
        pool_pre_ping=True,  # 오래된 커넥션 자동 재연결
        pool_size=10,        # 상시 유지 커넥션 수
        max_overflow=20,     # 버스트 시 추가 허용 커넥션
        pool_timeout=30,     # 커넥션 대기 최대 시간(초)
        pool_recycle=1800,   # 30분마다 커넥션 재생성 (MySQL 타임아웃 방지)
    )
except Exception as e:
    import traceback
    print("🚨 DB 연결 실패:", e)
    traceback.print_exc()
    engine = None

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) if engine else None
Base = declarative_base()



def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
