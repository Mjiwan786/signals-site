# Signals-Site — Agentic Product Requirements Document (Acquire-Ready Edition)

## Context (for Claude / GPT-5 / Cursor)
Project: signals-site  
Role: Frontend SaaS portal for the Crypto AI Bot ecosystem.  
Tech Stack: Next.js 14 (App Router, TypeScript, TailwindCSS), Stripe Checkout + Webhooks, Discord OAuth + Role Sync, Supabase (Postgres), Redis Cloud (TLS live signals stream).  
Deployment: Vercel → https://aipredictedsignals.cloud  
Use: Agentic coding collaboration between Claude, GPT-5, and Cursor IDE.

---

## Executive Summary
Signals-Site is the customer-facing web application for the Crypto AI Bot ecosystem. It provides a seamless SaaS experience where users can view real-time AI trading signals, monitor performance charts, and manage subscriptions through Stripe and Discord. The site consumes data from the signals-api (FastAPI backend connected to Redis Cloud and Supabase) and renders it with modern Next.js 14 features. It emphasizes fast performance, trust, and elegant UX under a dark theme aesthetic. Built for scalability...

---

## Objectives & Success Metrics
- Page load (LCP) < 2s on Vercel production.  
- Signal latency (Redis → UI render) < 1s.  
- Stripe checkout success rate ≥ 99%.  
- Discord role sync accuracy ≥ 100% (based on Supabase tier data).  
- Lighthouse score ≥ 90 for Performance and Accessibility.  
- Mobile responsive (iPhone, Android) and PWA-compatible.  

---

## System Architecture
```
signals-site (Next.js 14 + Tailwind + NextAuth + Stripe)
    ↳ signals-api (FastAPI) — REST + SSE
        ↳ Redis Cloud (TLS) — live signals stream
        ↳ Supabase (Postgres) — user/subscription data
    ↳ Stripe — checkout & webhook events
    ↳ Discord — OAuth + role management
```

All services are containerized and version-controlled via GitHub. Vercel handles deployment with automatic SSL and edge caching.  
Redis TLS ensures secure data streaming. Supabase is used for identity, subscriptions, and entitlement mapping (tiers → Discord roles).

---

## Core Modules & Responsibilities
**/app/page.tsx** — Landing page (hero section, CTA, dark theme).  
**/app/signals/** — Live chart page; subscribes to signals-api WebSocket/SSE.  
**/app/pricing/** — Subscription tiers pulled from Supabase/Stripe.  
**/app/dashboard/** — Authenticated user portal (NextAuth + Supabase data).  
**/app/api/webhooks/stripe/** — Handles checkout.session.completed and updates Supabase & Discord.  
**/components/** — Shared UI: Navbar, Footer, SignalCard, PricingCard, Loader.  
**/lib/redisClient.ts** — Secure Redis connection (TLS).  
**/lib/supabaseClient.ts** — Supabase API client.  
**/lib/stripe.ts** — Stripe helper utilities.  
**/lib/discord.ts** — Discord bot helper for role updates.  
**/styles/** — Tailwind configuration for dark theme.  

---

## Data Flow & Integration Logic
1. Redis publishes live AI signals → signals-api → SSE/WebSocket → signals-site `/signals` page.  
2. Supabase tracks user profiles, active tiers, and Discord role mapping.  
3. Stripe handles payment events (checkout/session → webhook).  
4. Webhook triggers API route → Supabase update → Discord role sync.  
5. Auth flow uses NextAuth (Discord provider) → token validation → Supabase match.  
6. Dashboard aggregates data from Supabase (subscription tier, expiry, Discord role).  

---

## Non-Functional Requirements
- Fast (<200ms TTFB) and globally cached via Vercel Edge Network.  
- Secure: HTTPS enforced, all env secrets stored in Vercel environment settings.  
- Accessible (WCAG 2.1 AA compliance).  
- Resilient: Fallback UI for API downtime (cached signals).  
- SEO: Structured metadata, sitemap, canonical tags.  
- Observability: Sentry optional; Prometheus metrics from signals-api visible via /metrics.  

---

## Environment & Config Keys
```
NEXT_PUBLIC_API_URL=https://api.aipredictedsignals.cloud
REDIS_URL=rediss://default:<password>@<host>:<port>
SUPABASE_URL=<supabase_project_url>
SUPABASE_ANON_KEY=<public_key>
SUPABASE_SERVICE_KEY=<secret_key>
STRIPE_PUBLIC_KEY=<pk_live_xxx>
STRIPE_SECRET_KEY=<sk_live_xxx>
STRIPE_WEBHOOK_SECRET=<whsec_xxx>
DISCORD_CLIENT_ID=<client_id>
DISCORD_CLIENT_SECRET=<client_secret>
DISCORD_BOT_TOKEN=<bot_token>
NEXTAUTH_SECRET=<generated_secret>
NEXTAUTH_URL=https://aipredictedsignals.cloud
```

---

## Agentic Coding Protocol (Claude / GPT-5 / Cursor)
- Load this PRD before generating or editing code (`/read ./PRD_SIGNALS_SITE_AGENTIC.md`).  
- Use Claude for high-level reasoning and architecture.  
- Use GPT-5 for TypeScript + API implementation.  
- Use Cursor for file creation, hot reload testing, and incremental edits.  
- Each route/component ≤ 250 LOC.  
- Keep all credentials externalized; never hardcode.  
- Always match API schema with signals-api (SignalDTO consistency).  
- Validate outputs with ESLint, TypeScript, and Vercel preview builds.  

---

## Deployment & Monitoring
- Hosted on Vercel (GitHub integration, auto-deploy from `main`).  
- Preview branches auto-created for pull requests.  
- Stripe and Supabase webhook URLs use the production domain only.  
- Logs accessible via Vercel Dashboard.  
- Real-time metrics (p95 latency, Redis lag) visible in Grafana (optional).  
- Health verification: `/signals` renders live data within 1s or shows fallback card.  

---

## Success Criteria (for Launch & Acquire Listing)
- Production site live: https://aipredictedsignals.cloud  
- Stripe checkout working with Supabase & Discord sync.  
- Signals page displaying Redis-backed live data.  
- Dashboard accurately shows user tier and expiry.  
- Mobile UX validated; performance score ≥ 90.  
- Documentation (README + PRD) clean and versioned.  

---

## Appendix
**Build Commands:**  
`npm install`  
`npm run dev` (local)  
`npm run build && npm run start` (production)  

**Lint & Test:**  
`npm run lint`  
`npm run test` (Jest/Playwright optional)  

**Verification:**  
Vercel preview = staging → main = production.  
CI pipeline: lint → build → preview → deploy.  
