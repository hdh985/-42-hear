from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles
from database import Base, engine
from api import order, waiting, admin_waiting
import os

Base.metadata.create_all(bind=engine)

app = FastAPI()

# GZip: 512 bytes 이상 응답 자동 압축 (주문 목록 JSON 트래픽 대폭 감소)
app.add_middleware(GZipMiddleware, minimum_size=512)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Data-Version"],  # 프론트에서 커스텀 헤더 읽기 허용
)

@app.get("/api/health")
def api_health():
    return {"status": "ok"}

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.include_router(order.router)
app.include_router(waiting.router)
app.include_router(admin_waiting.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8080)
