# hackkit

A production-lean full-stack hackathon starter kit for shipping a first feature fast: FastAPI + SQLAlchemy + JWT auth + SQLite/Postgres + Next.js App Router + Tailwind + shadcn/ui-style components + Docker + Render/Vercel notes.

Built for a 4–5 day hackathon: clone, seed, run, and start copying the `Item` resource.

## 60-second local quickstart

### Option A: Docker

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
docker compose up --build
```

Then seed once in another terminal:

```bash
docker compose exec backend python seed.py
```

Open:

- Frontend: http://localhost:3000
- Backend health: http://localhost:8000/health
- API docs: http://localhost:8000/docs

### Option B: Non-Docker

Terminal 1 — backend:

```bash
cd backend
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python seed.py
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Terminal 2 — frontend:

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Demo login

- Email: `demo@demo.com`
- Password: `demo1234`
- Role: `admin`

## Managing donations and the wishlist

1. Sign in with an admin account at `http://localhost:3000/login`.
2. Open the **Donations and wishlist** section on the dashboard.
3. Create or edit a campaign, ongoing cause, or wishlist need.
4. After reconciling MoonClerk payments and in-kind gifts, update the funded amount (and secured quantity for wishlist items).

Published progress is shared by the Donate and Wishlist pages and is available to the future Impact dashboard through
the same API. Payments continue through MoonClerk; this project does not store card details or MoonClerk credentials.

The initial seeded goals and totals are demonstration content. Love 21 should verify and replace them before publishing
the site in production.

### Public dashboard handoff

The public Impact dashboard is intentionally left for its owner to implement. It can reuse:

- `api.listSupportOpportunities()` from `frontend/lib/api.ts`
- `SupportOpportunity` and its `target_amount_hkd`, `funded_amount_hkd`, `progress_percent`, and `kind` fields
- `SupportProgress` from `frontend/components/site/support-progress.tsx`

The API calculates `progress_percent`, so the public dashboard should display that value instead of maintaining separate
hard-coded funding percentages.

## Day 1 checklist

1. Rename the product copy (`hackkit`) in `frontend/app/page.tsx`, `frontend/app/layout.tsx`, and `README.md`.
2. Change `SECRET_KEY` in `backend/.env` before sharing a deployed backend.
3. Set production CORS: `CORS_ORIGINS=https://your-vercel-app.vercel.app`.
4. Decide whether SQLite is enough for the demo. If not, set `DATABASE_URL=postgresql+psycopg://...`.
5. Copy the `Item` resource for your first real feature.
6. Replace demo credentials or remove `seed.py` from production workflows.
7. Add your logo/colors in `frontend/app/globals.css` and `tailwind.config.ts`.

## How to add a new feature fast

The `Item` resource is intentionally simple and is marked in code with:

> `COPY THIS to add a new resource fast.`

Copy these files and rename `Item` to your resource:

Backend:

- `backend/app/models/item.py`
- `backend/app/schemas/item.py`
- `backend/app/routers/items.py`
- Add the router in `backend/app/main.py`
- Import the model in `backend/app/models/__init__.py`

Frontend:

- `frontend/lib/api.ts` item types and methods
- The CRUD section in `frontend/app/dashboard/page.tsx`

Keep the same owner scoping pattern unless the resource is intentionally shared.

## API endpoints

- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /items`
- `POST /items`
- `GET /items/{id}`
- `PATCH /items/{id}`
- `DELETE /items/{id}`
- `GET /support-opportunities` — public active campaigns, causes, and wishlist needs
- `GET /support-opportunities/{slug}` — public support-opportunity detail
- `GET /support-opportunities/admin` — admin listing, including archived records
- `POST /support-opportunities` — admin creation
- `PATCH /support-opportunities/admin/{id}` — admin update or archive
- `POST /ai/ask` — no-ops clearly when `ANTHROPIC_API_KEY` is missing

## Environment variables

Backend (`backend/.env`):

```bash
DATABASE_URL=sqlite:///./hackkit.db
SECRET_KEY=change-me
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
ANTHROPIC_API_KEY=
```

Frontend (`frontend/.env.local`):

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Database

SQLite is the default and needs no setup. To use Postgres, set one env var:

```bash
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/hackkit
```

Tables are created on app startup with SQLAlchemy metadata. There is intentionally no migration tool in this starter.

## Deployment

### Frontend on Vercel

1. Import the repo in Vercel.
2. Set root directory to `frontend`.
3. Set `NEXT_PUBLIC_API_URL` to your deployed backend URL.
4. Deploy.

### Backend on Render

This repo includes `render.yaml` for a Docker-based Render web service.

1. Push the repo to GitHub.
2. In Render, create a Blueprint from the repo.
3. Set `SECRET_KEY` and `CORS_ORIGINS` in Render.
4. Optional: add a Render Postgres database and set `DATABASE_URL`.

The backend Dockerfile is also a fallback for any container host:

```bash
docker build -t hackkit-backend ./backend
docker run -p 8000:8000 --env-file backend/.env hackkit-backend
```

## Docker compose with optional Postgres

Default SQLite:

```bash
docker compose up --build
```

With Postgres profile:

```bash
docker compose --profile postgres up --build
```

Then set `DATABASE_URL=postgresql+psycopg://postgres:postgres@postgres:5432/hackkit` for the backend service if you want the backend container to use Postgres.

## Notes on auth storage

The frontend stores the JWT in `localStorage` because it is the fastest hackathon path and simple to inspect/debug. Tradeoff: it is more exposed to XSS than an HttpOnly cookie. If your app handles sensitive data, switch to a cookie-based session before production.
