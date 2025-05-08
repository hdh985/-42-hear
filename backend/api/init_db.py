from database import Base, engine
import models

# DB 테이블 생성
print("[INIT] Creating tables...")
Base.metadata.create_all(bind=engine)
print("[INIT] Done.")
