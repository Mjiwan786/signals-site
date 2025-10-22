Signals-Site — Agentic Product Requirements (v2, Acquire-Ready)
Context (for Claude / GPT-5 / Cursor)

Project: signals-site
Role: Frontend SaaS portal for the Crypto AI Bot ecosystem (public landing + live signals + pricing; optional dashboard).
Tech Stack: Next.js 14 (App Router, TypeScript, TailwindCSS), Motion (Framer Motion), React Three Fiber (Three.js), SWR, Recharts/Visx.
Payments/Auth (Phase 2): Stripe Checkout + Webhooks, Discord OAuth + Role Sync, Supabase (Postgres).
Streaming: signals-api (FastAPI) → REST + SSE/WS, backed by Redis Cloud (TLS).
Deployment: Vercel → https://aipredictedsignals.cloud

Working style: Agentic coding with Claude/GPT-5 in Cursor; small, incremental patches; typed fetchers; strict env hygiene.

Executive Summary

Signals-Site is a modern, futuristic dark-themed web app that markets and demonstrates the Crypto-AI-Bot trading system. The site must do three things exceedingly well:

Show live performance (PnL) and signals with credibility and low latency.

Convert users/investors via a clean landing experience, trust signals, and transparent methodology.

Scale gracefully toward subscriptions (Stripe) and community gating (Discord roles) without compromising UX.

Design language: premium SaaS x AI — neon-glass accents, subtle 3D hero animation, micro-interactions, strong accessibility (reduced-motion support). Performance: fast first paint, LCP < 2s, signal-to-UI < 1s.

Personas & Primary Journeys

Investor (Acquire.com buyer / VC)

Goal: Assess traction, UX quality, technical maturity, and transparency quickly.

Journey: Land on / → see hero & PnL snapshot → skim tech/architecture → view pricing readiness → Discord/community → contact.

Trader / Prospective Customer

Goal: See real value (PnL, hit-rate), watch live signals, understand tiers.

Journey: Land on / → Live preview → /signals for PnL + feed → /pricing → join Discord (MVP) → later: subscribe (Stripe).

Maintainer

Goal: Reliable deploys, clear errors, simple observability, live metrics sanity.

Journey: Push to GitHub → Vercel preview → env check → launch → monitor health.

Objectives & Success Metrics (MVP → Phase 2)

Core MVP (public, no login required)

LCP < 2s on Vercel production (desktop & 4G mid-tier mobile).

Signal latency < 1s (Redis → signals-api → SSE/WS → render).

Lighthouse ≥ 90 for Performance & Accessibility.

Live PnL chart visible above the fold on /signals, preview on /.

Reduced-motion respected globally (no critical info lost if animations off).

Phase 2 (monetization/community)

Stripe checkout success ≥ 99%; webhook processing idempotent.

Discord role sync accuracy 100% vs subscription tier (Supabase).

Dashboard shows tier, expiry, Discord role mapping (optional initially).

Scope (MVP) & What’s Out of Scope

In Scope (MVP)

Landing page with 3D hero, investor snapshot, how-it-works, community CTA.

/signals with PnL (cumulative + daily returns + drawdown overlay) + live feed (SSE).

/pricing stub (tiers, CTA → Discord for now).

/tech (architecture, safety nets, methodology & disclaimers).

Legal pages (Terms, Privacy, Risk), SEO (metadata, sitemap, robots).

Basic observability (console web-vitals in dev, soft error boundaries).

Accessibility (keyboard nav, focus states, contrast, reduced motion).

Out of Scope (MVP)

Full NextAuth session and personalized dashboards.

Stripe/Supabase/Discord role enforcement (Phase 2).

Heavy 3D scenes; complex shaders (keep hero lightweight).

Email marketing, blog/CMS.

System Architecture (MVP → Phase 2)
signals-site (Next.js 14 + Tailwind + Motion + R3F)
    ↳ signals-api (FastAPI) — REST (/v1/pnl, /v1/signals) + SSE (/v1/signals/stream)
        ↳ Redis Cloud (TLS) — live signals stream
    [Phase 2]
    ↳ Supabase (Postgres) — user/subscription data
    ↳ Stripe — checkout & webhook events
    ↳ Discord — OAuth + role management


Runtime: Vercel (Edge for static; Node for SSR where needed).

Networking: CORS must allow Vercel domains and apex/subdomains for the API.

Security: all secrets in Vercel env; no credentials in client bundles.

Core Pages & Responsibilities

/ (Landing)

3D hero (R3F) with low-poly object + emissive glow; headline + dual CTAs.

Investor snapshot (MTD PnL, win rate, max drawdown).

Live preview mini PnL (24h) & “view full performance”.

How it works (3 steps), trust strip (partners), Discord CTA.

/signals

PnLChart: cumulative PnL with timeframe toggles (1D/1W/1M/YTD/All).

Daily returns and drawdown overlays (toggleable).

Live feed: streaming cards via SSE; filter by mode/pair; ARIA live region.

/pricing

Three tiers (Starter/Pro/Enterprise); CTA → Discord (Phase 2: Stripe).

/tech

Architecture diagram (bots → Redis → signals-api → site).

Risk controls, methodology & disclaimers, latency notes, SLA/SLO.

/legal/terms, /legal/privacy, /legal/risk

Concise, readable, dark theme; print-friendly.

Global

Sticky Navbar (blur), Footer (links, status pill), SEO metadata, sitemap, robots.

Design & Interaction Requirements

Visual system

Base: #0A0B0F (bg), #E6E8EC (text), dim #9AA0AA.

Accents: cyan #6EE7FF, violet #A78BFA, success #10B981, danger #EF4444.

Neon-glass glow, thin grid dividers, soft grain. Buttons have subtle glow on hover.

Animation policy

Motion (Framer Motion/motion) for page/section transitions and micro-interactions.

Scroll smoothing via Lenis; disable if prefers-reduced-motion.

R3F hero capped complexity (≤ 1k particles, low-poly mesh, throttled on blur/tab hidden).

Accessibility

Keyboard navigation & visible focus, ARIA live regions for incoming signals.

Minimum contrast AA; no content locked behind motion.

Functional Requirements (MVP)

1) Data contracts (typed)

SignalDTO: { id:string; ts:number; pair:string; side:"buy"|"sell"; entry:number; sl?:number; tp?:number; strategy:string; confidence:number; mode:"paper"|"live" }

PnLPoint: { ts:number; equity:number; daily_pnl:number }

2) API integration

GET {API}/v1/pnl?n=500 → PnLPoint[]

GET {API}/v1/signals?mode=paper|live&pair=&limit= → SignalDTO[]

GET {API}/v1/signals/stream?mode=paper|live → SSE (event: message, data: SignalDTO)

All fetchers cache:"no-store", runtime errors surface non-blocking banners.

3) PnL visualization

Cumulative PnL line; optional daily bars; drawdown series.

Timeframe filters update n or query params; default n=500.

Resilient to sparse/flat data (empty states, baseline shown).

4) Signals feed

SSE subscription; onmessage parse → zod validate → push to store → render.

Filter: { mode, pair, limit } (default mode="paper", limit=200).

Performance: 60 FPS steady; render windows to avoid long lists.

5) Offline & error UX

API down: show degraded banner; /signals uses last known data snapshot if available.

SSE fails: retry with backoff; show hint.

Non-Functional Requirements

Performance

LCP < 2s; FID/INP within good thresholds; TTFB < 200ms.

Bundle hygiene: lazy-load 3D; dynamically import heavy charts; code-split /signals.

Security

HTTPS only; CSP tightened (no unsafe-inline where possible; allowlist API host).

Secrets only in server runtime (Stripe/Supabase/Discord in Phase 2).

Reliability

Graceful degradation if streams break.

Error Boundaries around PnL and LiveFeed.

Observability (lean)

Log web-vitals in dev; console timings around SSE connect → first render.

Optional: Sentry later; status pill polls /v1/status/health.

SEO

Open Graph, Twitter cards, canonical tags; sitemap, robots; clean URL structure.

Environment & Config (MVP)
NEXT_PUBLIC_API_URL=https://api.aipredictedsignals.cloud
NEXT_PUBLIC_SIGNALS_MODE=paper
NEXT_PUBLIC_DISCORD_INVITE=https://discord.gg/<invite>
SITE_NAME=aipredictedsignals.cloud


Phase 2 adds (server-only):

REDIS_URL=rediss://default:<password>@<host>:<port>
SUPABASE_URL=<url>
SUPABASE_ANON_KEY=<public>
SUPABASE_SERVICE_KEY=<secret>
STRIPE_PUBLIC_KEY=<pk_live_xxx>
STRIPE_SECRET_KEY=<sk_live_xxx>
STRIPE_WEBHOOK_SECRET=<whsec_xxx>
DISCORD_CLIENT_ID=<id>
DISCORD_CLIENT_SECRET=<secret>
DISCORD_BOT_TOKEN=<bot_token>
NEXTAUTH_SECRET=<generated>
NEXTAUTH_URL=https://aipredictedsignals.cloud

Page-by-Page Acceptance Criteria

/

Hero renders 3D object; if WebGL unsupported, shows static gradient fallback.

Headline/CTA animate in under 300ms; reduced-motion disables.

Investor snapshot shows three KPIs with animated count-up (respecting reduced-motion).

Trust strip visible (logos or placeholders), Discord CTA link works.

/signals

Cumulative PnL visible on first paint; timeframe filter updates data.

SSE connects; new signals appear within ≤ 1s of server push.

Live region announces new rows to screen readers without causing focus loss.

Error states (API/SSE) show non-blocking banners and fallback content.

/pricing

Three plans, responsive grid, CTA buttons link to Discord (Phase 2 → Stripe).

Legal footnote present.

/tech

Diagram + text explain architecture, safety, methodology; risk disclaimer.

Legal pages

Load fast; readable; print-friendly.

Delivery Plan & Milestones (agentic)

Milestone M0 — Base wiring (1 PR)

Tailwind theme, dark tokens, globals, layout + nav + footer, Section wrapper.

Env guards: banner if NEXT_PUBLIC_API_URL missing/unhealthy.

M1 — Hero + Landing sections (1–2 PRs)

R3F Hero3D (lightweight), investor snapshot, mini PnL preview, how-it-works, Discord CTA.

M2 — Signals page (2 PRs)

PnLChart (cumulative + toggles).

LiveFeed + SSE + filters + ARIA live region.

M3 — Pricing, Tech, Legal, SEO (1–2 PRs)

Pricing stubs, Tech page, legal pages, metadata/sitemap/robots.

M4 — Polish & Perf (1 PR)

Motion pass (reduced-motion support), Lenis smooth scroll, code-split heavy modules, error boundaries, a11y sweep.

Phase 2 (separate epic)

Stripe Checkout, webhooks; Supabase user tiers; NextAuth (Discord) + role sync; Dashboard.

Agentic Coding Protocol (Claude / GPT-5 / Cursor)

Always load this PRD before edits: /read ./PRD_SIGNALS_SITE_AGENTIC.md.

Keep files ≤ 250 LOC per route/component.

Produce small, reviewable diffs; stop after each file; run typecheck/lint/build.

No secrets or hardcoded URLs in client code; use env with zod validation.

zod-parse API responses; never trust shape.

Follow reduced-motion across all animations.

Use dynamic import for heavy components (R3F, charts).

Testing & Verification

Local

npm run dev → sanity clickthrough on / and /signals.

Simulate SSE with mock data if API not available.

Lighthouse (mobile) ≥ 90 on Performance/A11y.

WebGL off test → static hero fallback confirmed.

Preview (Vercel)

Confirm NEXT_PUBLIC_API_URL pointed to staging or prod.

/signals: first paint PnL chart; stream updates within 1s.

No hydration warnings; console clean.

Production

LCP < 2s; signals streaming stable; error banners rare and readable.

Risks & Mitigations

3D performance on low devices → keep scene minimal; lazy-load; cap FPS; fallback static art.

Stream flakiness → exponential backoff; banner; retry; local buffer.

SEO vs heavy motion → pre-render everything critical; reduce motion for bots; text content always present.

Design drift → tokens + Section wrapper enforce consistency.

Success Criteria (for Launch & Acquire Listing)

Site live at https://aipredictedsignals.cloud
 with /signals streaming & PnL live.

Landing clearly communicates value; investor snapshot & tech page present.

Lighthouse mobile ≥ 90 Perf/A11y; LCP < 2s.

Clean README + PRD (this doc) versioned.

Phase-2 readiness: pricing stubs + Stripe/Supabase/Discord integration plan outlined.

Appendix

Build

npm install

npm run dev (local)

npm run build && npm run start (prod)

Lint & Test

npm run lint

npm run typecheck

Optional unit tests for PnL/drawdown math; Playwright smoke for / & /signals.

Sitemap/Robots

app/sitemap.ts (/, /signals, /pricing, /tech, /legal/*)

app/robots.ts (allow; point to sitemap)

