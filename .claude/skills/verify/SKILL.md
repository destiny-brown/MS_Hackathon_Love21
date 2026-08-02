# Verify hackkit

Use this recipe to verify the starter through its runtime surfaces.

## Backend API

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install --resume-retries 5 -r requirements.txt
cp .env.example .env
python seed.py
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

In another shell, drive the live API:

- `GET http://127.0.0.1:8000/health`
- `POST /auth/login` with `demo@demo.com` / `demo1234`
- `GET /auth/me` with the Bearer token
- CRUD `/items` with the Bearer token
- Probe `/items` with no token (expect 401)

## Frontend

```bash
cd frontend
npm install --cache ./.npm-cache
npm run build
npm run start
```

Then verify pages over HTTP:

- `GET http://127.0.0.1:3000/`
- `GET http://127.0.0.1:3000/login`
- `GET http://127.0.0.1:3000/register`
- `GET http://127.0.0.1:3000/dashboard`

There is no browser harness checked in; use the backend auth/API flow plus the frontend production build and page responses for CLI-only verification.
