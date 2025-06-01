# syntax=docker/dockerfile:1
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# ✅ 문법 경고 수정
ENV PORT=8080

CMD ["uvicorn", "main:app", "--host=0.0.0.0", "--port=8080"]
# syntax=docker/dockerfile:1
