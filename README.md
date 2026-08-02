# Love 21 Foundation — Digital Platform

A full-stack web platform for [Love 21 Foundation](https://love21foundation.com): a Hong Kong charity empowering people with Down syndrome, autism, and neurodiversity through sport, nutrition, family support, and holistic community care.

Built for the Microsoft Hackathon, this repo pairs a **Next.js** marketing and learning site with a **FastAPI** backend for accounts, donations, volunteering, admin tools, and optional AI features.

## What’s in the product

### Public site
- **Home** — hero video, impact stats, programme pillars, story carousel, newsletter signup
- **Learn & Play** — neurodiversity education, quizzes, resources, short videos, and the **21 Moves** interactive trail
- **Get Involved / Volunteer / Donate / Wishlist** — pathways to support Love 21
- **Stories & media** — member and community stories
- **Governance pages** — board, staff, finance, contact, and more
- **i18n** — English, Traditional Chinese (Cantonese), and Simplified Chinese via `react-i18next`
- **Captain 21** — optional AI chat assistant on public pages (when the model backend is enabled)
- **Floating CTAs** — persistent Donate and Volunteer buttons on marketing pages

### Accounts & dashboards
- **Supporter** — giving history, impact stats, activity sign-ups, volunteer hours, AI event recommendations, Captain’s Corner
- **Member** — profile, gratitude submissions (moderated), Captain’s Corner
- **Admin** — donations & wishlist, activities, volunteers, gratitude moderation, newsletter, learn content, analytics

### Donations (demo)
- Public **mock donation** flow at `/donation-form` (no real payment processor wired yet)
- Campaigns, causes, and wishlist items with shared progress via `/support-opportunities`
- Gratitude wall on the **Donate** page (approved member messages + seeded highlights)

## Tech stack

| Layer | Stack |
|--------|--------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, i18next |
| Backend | FastAPI, SQLAlchemy 2, Alembic, JWT auth |
| Database | SQLite locally; PostgreSQL in production (Render) |
| AI (optional) | OpenAI-compatible Qwen endpoint on Modal |
| Email (optional) | Resend for newsletter |

## Repository layout

```
MS_Hackathon_Love21/
├── frontend/          Next.js app (Vercel root directory)
│   ├── app/           Routes (donate, learn-play, admin, dashboards, …)
│   ├── components/    UI, site shell, learn trail, admin panels
│   └── locales/       en, yue, zh translation JSON
├── backend/           FastAPI API
│   ├── app/           routers, models, services, seeds
│   └── migrations/    Alembic schema migrations
├── docker-compose.yml Local dev with backend + frontend
└── render.yaml        Render blueprint (backend + Postgres)
```

## Local development

### Prerequisites
- Python 3.11+
- Node.js 20+
- npm

### 1. Backend

```bash
cd backend
python3.11 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python -m scripts.migrate
python seed.py
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Open:
- **Frontend:** http://localhost:3000
- **API health:** http://localhost:8000/health
- **API docs:** http://localhost:8000/docs

### Docker (optional)

```bash
cp backend/.env.example backend/.env
docker compose up --build
```

The compose file runs migrations and seed on backend startup.

## Demo logins

All demo users use password **`demo1234`**:

| Role | Email |
|------|--------|
| Admin | `admin@love21.demo` |
| Member | `member@love21.demo` |
| Supporter | `supporter@love21.demo` |

Legacy `donor@` / `volunteer@` demo rows are migrated to the **supporter** role on startup when present.

Override the bootstrap admin with `BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_PASSWORD` in `backend/.env`.

## Environment variables

### Backend (`backend/.env`)

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | SQLite or Postgres connection string |
| `SECRET_KEY` | JWT signing secret — change before production |
| `CORS_ORIGINS` | Comma-separated frontend origins |
| `SITE_URL` | Public site URL (links in emails) |
| `MODEL_ENABLED` | `true` to enable AI features |
| `MODEL_BASE_URL` | OpenAI-compatible model base URL + `/v1` |
| `MODEL_API_KEY` | Bearer token for the model server |
| `MODEL_NAME` | Model id (e.g. `qwen3-8b`) |
| `RESEND_API_KEY` | Newsletter sending (optional) |
| `NEWSLETTER_FROM_EMAIL` | From address for newsletter |

See `backend/.env.example` for defaults.

### Frontend (`frontend/.env.local`)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend URL (e.g. `http://localhost:8000`) |
| `SITE_URL` | Used by server routes such as newsletter |

## Deployment

CI runs backend tests, migration checks, and a production frontend build on pushes/PRs to `main`.

### Frontend — Vercel
1. Import the repo; set **root directory** to `frontend`.
2. Set `NEXT_PUBLIC_API_URL` to your deployed backend URL.
3. Deploy.

### Backend — Render
1. Create a Blueprint from `render.yaml` (Docker service + Postgres).
2. Set `CORS_ORIGINS` to your Vercel origin.
3. Set `MODEL_BASE_URL` and `MODEL_API_KEY` if using AI.

Migrations run automatically before Uvicorn starts (`python -m scripts.migrate`).

### AI model — Modal (optional)

```bash
pip install modal
python3 -m modal setup
python3 -m modal secret create love21-model MODEL_API_KEY=<your-token>
cd backend
python3 -m modal deploy modal_llm.py
```

Set `MODEL_BASE_URL` to the deployed Modal URL with `/v1` appended, and use the same token for `MODEL_API_KEY`.

## Notable routes

| Path | Description |
|------|-------------|
| `/donate` | Donation marketing page, tiers, gratitude wall, campaigns |
| `/donation-form` | Mock checkout (wishlist / campaign / cause) |
| `/wishlist` | In-kind needs |
| `/learn-play` | Education hub |
| `/learn-play/21-moves` | Interactive trail game |
| `/our-volunteer` | Volunteer onboarding |
| `/supporter/dashboard` | Supporter account |
| `/member/dashboard` | Member account |
| `/admin` | Staff admin shell |

## Auth notes

- Short-lived JWT access tokens + refresh tokens (defaults: 60 min / 7 days).
- Tokens are stored in `localStorage` in this demo build — convenient for hackathon development; consider HttpOnly cookies for production hardening.
- Role checks are enforced on the server via `require_roles(...)`.

## Demo content disclaimer

Seeded campaigns, wishlist targets, activities, donation history, volunteer hours, and placeholder images are **demonstration data**. Love 21 should verify and replace them before any production launch. Mock donations do not process real payments.

## Troubleshooting

**401 in the browser but login works in API docs**
- Clear `localStorage` keys for the site on `localhost:3000`.
- Confirm `NEXT_PUBLIC_API_URL` points at the running backend.
- Restart both dev servers.

**Gratitude / opportunities empty**
- Ensure the backend is running and seeded (`python seed.py`).
- Check `/support-opportunities` and `/gratitude-entries/public` in the API docs.

**AI features unavailable**
- Set `MODEL_ENABLED=true` and valid `MODEL_BASE_URL` / `MODEL_API_KEY`.
- First request after Modal idle time may be slow while the model cold-starts.

## License & attribution

Built for Love 21 Foundation as part of the Microsoft Hackathon. Charity registration and official branding belong to Love 21 Foundation Limited.
