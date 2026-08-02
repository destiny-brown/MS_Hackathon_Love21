FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["sh", "-c", "python -m scripts.migrate && if [ \"${RUN_DEMO_SEED:-false}\" = \"true\" ]; then echo 'RUN_DEMO_SEED=true, running seed.py'; python seed.py; else echo 'RUN_DEMO_SEED not true, skipping seed'; fi && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
