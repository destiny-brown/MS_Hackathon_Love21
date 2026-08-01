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

## Demo logins

All demo users use password `demo1234`:

- Admin: `admin@love21.demo`
- Member: `member@love21.demo`
- Supporter: `supporter@love21.demo` — includes giving history, impact, activity sign-ups, and volunteer hours

Legacy `donor@love21.demo` and `volunteer@love21.demo` rows are converted to the `supporter` role if they already exist in a local database.

## Managing donations and the wishlist

1. Sign in with an admin account at `http://localhost:3000/login`.
2. Open the **Donations and wishlist** section on the dashboard.
3. Create or edit a campaign, ongoing cause, or wishlist need.
4. After reconciling MoonClerk payments and in-kind gifts, update the funded amount (and secured quantity for wishlist items).

Published progress is shared by the Donate, Wishlist, and supporter dashboard pages through the same API. Payments are mocked for now: the demo records a successful donation locally and includes a TODO where a real processor such as Stripe should be connected. This project does not store card details.

The initial seeded goals, placeholder image URLs, activities, donation history, and volunteer hours are demonstration content. Love 21 should verify and replace them before publishing the site in production.

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
- `GET /admin/metrics` — admin-only role-protection template
- `GET /supporter/recurring-donation` — supporter recurring-support template
- `GET /supporter/dashboard` — supporter giving, impact, activities, and volunteer hours
- `GET /activities` — public activity calendar, with signed-up flags when logged in
- `POST /activities/{id}/signup` — supporter activity sign-up
- `POST /supporter/hours` — supporter volunteer-hour logging
- `POST /donations/mock` — public mocked donation recording; supporter donations are attributed when logged in
- `GET /member/profile` — member-only profile template
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

Pull requests and pushes to `main` run backend tests, migration drift checks,
and a production frontend build through GitHub Actions.

### Database migrations

Schema changes are managed with Alembic. After changing a SQLAlchemy model:

```bash
cd backend
alembic revision --autogenerate -m "describe the change"
alembic upgrade head
alembic check
```

The backend container applies pending migrations before starting Uvicorn. Its
migration launcher also stamps complete databases created by older versions of
the project before applying newer migrations.

### Frontend on Vercel

1. Import the repo in Vercel.
2. Set root directory to `frontend`.
3. Set `NEXT_PUBLIC_API_URL` to your deployed backend URL.
4. Deploy.

### Backend on Render

This repo includes `render.yaml` for a Docker-based Render web service and a
managed PostgreSQL database.

1. Push the repo to GitHub.
2. In Render, create a Blueprint from the repo.
3. Set `CORS_ORIGINS` to the deployed frontend origin, for example
	`https://your-app.vercel.app`.
4. Set `ANTHROPIC_API_KEY` and `YOUTUBE_API_KEY` only when those integrations
	are enabled. Render generates `SECRET_KEY` and connects `DATABASE_URL`.

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
