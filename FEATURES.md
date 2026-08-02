# MS_Hackathon_Love21 — Features & Workflows

This document enumerates the features implemented in the MS_Hackathon_Love21 repo, the main files that implement them, a short description of each feature's function, unique or notable details, and how features connect in the website workflow.

---

**Authentication**: User accounts and session tokens

- Files: [backend/app/routers/auth.py](backend/app/routers/auth.py), [frontend/app/register/page.tsx](frontend/app/register/page.tsx)
- Function: Register, login, and `GET /auth/me` for current user. Supports `supporter` and `member` self-registration; `admin` reserved.
- Unique: Uses JWT access token creation in backend core security. Frontend stores token via `lib/api` helpers and redirects to role-based landing.

**Support Opportunities (Donations & Wishlist)**

- Files: [backend/app/routers/support_opportunities.py](backend/app/routers/support_opportunities.py), [frontend/components/support-opportunity-manager.tsx](frontend/components/support-opportunity-manager.tsx), frontend pages that render opportunities (various `app/` pages)
- Function: CRUD for opportunities (admin), public listing, and per-opportunity read. Tracks funding progress and supports campaign/cause/wishlist kinds. Frontend includes manager UI for publishing and editing.
- Unique: Progress percentage is computed server-side and reused across Donate, Wishlist, and Impact components. Wishlist items support retailer purchase links and quantity-tracking.

**Donations (mock checkout)**

- Files: [backend/app/routers/supporter.py](backend/app/routers/supporter.py) (mock donation: `/donations/mock`), frontend donation UI (MoonClerk link in manager, donation components in public pages)
- Function: Creates a mock donation record (placeholder for payment gateway) and attributes gifts to supporter accounts when logged in. Updates opportunity funded amounts.
- Unique: Mock payment flow uses a generated `payment_reference` and returns a `DonationReceipt` — intended to be replaced by a real checkout integration (e.g., Stripe/MoonClerk) for demos.

**Activities & Volunteer Management**

- Files: [backend/app/routers/admin.py](backend/app/routers/admin.py) (admin activities & volunteer activities), [backend/app/routers/supporter.py](backend/app/routers/supporter.py) (list activities, signup, log hours), frontend supporter dashboard [frontend/app/supporter/dashboard/page.tsx](frontend/app/supporter/dashboard/page.tsx)
- Function: Admins create/edit/delete activities and volunteer-program entries. Supporters can view activities, sign up, and log volunteer hours. Dashboard aggregates donations, hours, and signed-up activities.
- Unique: Activity sign-ups are scoped to supporter accounts; volunteer hours can be logged with optional activity association. Dashboard computes totals and impact items.

**Newsletter subscribe / preview / send**

- Files: [backend/app/routers/newsletter.py](backend/app/routers/newsletter.py), [backend/app/routers/admin.py](backend/app/routers/admin.py) (preview & send), [frontend/app/api/newsletter/route.ts](frontend/app/api/newsletter/route.ts), homepage newsletter component [frontend/app/page.tsx] uses `NewsletterForm` component
- Function: Public subscribe/unsubscribe (with token), admin preview and send newsletter to active subscribers. Frontend includes a newsletter form and API route for preview/send flows.
- Unique: Admin send uses `render_newsletter_html` and `send_email` service; unsubscribe is tokenized and safe for demo.

**Captain21 (Site AI assistant / RAG + tool-calls)**

- Files: [backend/app/routers/captain_chat.py](backend/app/routers/captain_chat.py), frontend widget [frontend/components/learn/captain-chat-widget.tsx], captain tools provider [frontend/components/captain/captain-tools-provider.tsx]
- Function: Natural-language site assistant that returns short replies, suggested site links, and optional `tool_calls` (e.g., `navigate_to_page`, `set_site_language`). Backend builds system/user prompts and calls an LLM (Ollama) or falls back. Frontend shows messages, suggested link-cards, and can run tool actions.
- Unique: Agent returns JSON with both reply text and structured tool calls. Tool-call validation restricts navigation and locale changes to allowed paths/locales. Voice input supported in the widget (browser SpeechRecognition) for demo usage.

**AI features: Volunteer matching, Trail debrief, YouTube search, General ask**

- Files: [backend/app/routers/volunteer_match.py](backend/app/routers/volunteer_match.py), [backend/app/routers/trail_debrief.py](backend/app/routers/trail_debrief.py), [backend/app/routers/ai.py](backend/app/routers/ai.py)
- Function:
  - Volunteer matching: `/ai/volunteer/match` accepts interest/availability/commitment/group size and returns scored volunteer activity matches (AI-enhanced). Also `/ai/volunteer/activities` lists volunteer roles.
  - Trail debrief: `/ai/trail/debrief` crafts short encouragements, reply chips, and upgrade messages for learning/trail completion.
  - YouTube search & ask endpoints: `/ai/youtube/search` returns safety-filtered short videos; `/ai/ask` proxies to Anthropic (if configured) with simple RAG stub.
- Unique: Safety and trust heuristics for YouTube results (trusted channels, allowed terms, block terms). Many AI features gracefully fall back to non-AI rule-based responses when external API keys are missing.

**Simple Resource API (Items)**

- Files: [backend/app/routers/items.py](backend/app/routers/items.py)
- Function: Template resource demonstrating owner-scoped CRUD for a per-user `Item` resource (used as an example/utility).

**Admin Overview & Subscriber management**

- Files: [backend/app/routers/admin.py](backend/app/routers/admin.py)
- Function: Admin endpoints to list counts/overviews, manage activities, volunteer activities, subscribers, and newsletter deliveries.

**Frontend UI / Pages (notable pages & components)**

- Files: Many under `frontend/app/*` and `frontend/components/*`. Notable items:
  - Home & impact: [frontend/app/page.tsx](frontend/app/page.tsx) (hero, impact dashboard, featured stories)
  - Supporter dashboard: [frontend/app/supporter/dashboard/page.tsx]
  - Register & login: [frontend/app/register/page.tsx], [frontend/app/login/page.tsx]
  - Member profile: [frontend/app/member/profile/page.tsx]
  - Captain chat widget: [frontend/components/learn/captain-chat-widget.tsx]
  - Trail map and learning components: `frontend/components/learn/trail-map/*` (trail scenes, debrief panel, unlocks)
  - Support opportunity manager: [frontend/components/support-opportunity-manager.tsx]

---

Workflow: how features connect (high level)

1. Public browsing

   - Users browse public pages (home, impact, our-volunteer, events) without logging in. Support opportunities and activity listings are read from the public endpoints.
2. Discovery & AI assistance

   - Visitors can ask Captain21 (widget) for site navigation, which returns a short reply and suggested pages; it may trigger a frontend tool call (navigate/set language).
   - For specific content (e.g., short videos), the site can call `/ai/youtube/search` to surface safe video resources.
3. Convert → register / donate / sign up

   - Visitors can subscribe to the newsletter using the newsletter form (creates a subscriber). Donation CTA links to MoonClerk checkout (manager stores MoonClerk URL) or uses a mock donation endpoint for demo.
   - Users who want to track giving and volunteering are encouraged to create a `supporter` account via `/auth/register` (frontend form) which returns a token and redirects to the role landing.
4. Supporter (authenticated) interactions

   - Signed-in supporters see the `supporter/dashboard`: donation history, impact items, signed-up activities, and can sign up for activities or log volunteer hours.
   - Sign-up calls `POST /activities/{id}/signup` and updates dashboard. Logging hours calls `/supporter/hours`.
5. Admin flows

   - Admin users (role protected) access admin endpoints to create activities, volunteer activities, publish support opportunities, manage newsletter subscribers, preview and send newsletters.
   - Admin UI includes support-opportunity manager component to publish campaigns/wishlist items and adjust funding figures.
6. AI-enhanced features

   - Volunteer matching: frontend can call `/ai/volunteer/match` with user choices to receive scored recommendations (AI-enhanced). If AI is unavailable, endpoint returns an informative message.
   - Trail debrief: learning/trail components call `/ai/trail/debrief` to generate encouragement and reply chips.

---

Notes & suggestions for slides generation (things you may want to highlight)

- Strong demo-friendly design: mock payment flow, tokenized newsletter unsubscribe links, and graceful fallbacks when API keys are missing.
- Accessible assistant: `Captain21` supports short JSON tool-calls, voice input (browser SpeechRecognition), and localized replies (en, yue, zh).
- Safety-first AI: YouTube filtering, RAG stub with allow/block terms, and fallback rule-based responses to avoid demo instability.
- Reusable admin primitives: support opportunities and activities power multiple frontend views (Donate, Impact, Dashboard).

---

If you want, I can:

- produce a CSV or JSON export of this features list, or
- generate slide outlines per feature (title + 3 bullets) ready for an AI slide generator.
