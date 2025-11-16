# Signals Site

A production-ready Next.js frontend for real-time crypto trading signals with SSE streaming, Stripe payments, and comprehensive analytics.

## 📋 Product Requirements

**👉 [PRD-003: Signals-Site Frontend Specification](docs/PRD-003-SIGNALS-SITE.md)**

This is the **authoritative product specification** for this repository. It defines:
- Complete page specifications (Home, Live Signals, PnL, Pricing, Docs)
- SSE integration architecture for real-time signal delivery
- API integration requirements and schema normalization
- Stripe subscription flow and user dashboard requirements
- UI/UX standards, accessibility, and mobile responsiveness
- SEO optimization and performance targets (90+ Lighthouse scores)
- Testing requirements and deployment procedures

**📊 [PRD-003 Checklist](docs/PRD-003-CHECKLIST.md)** - Track implementation progress

**All development, testing, and deployment must align with PRD-003.**

---

## Quick Start

1. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your Redis credentials and Discord OAuth settings.

3. Run with Docker:
   ```bash
   docker compose up -d --build
   ```

4. Check health:
   ```bash
   curl http://localhost:8000/healthz
   ```

## Health Checks

- API: `curl http://localhost:8000/healthz`
- Web: Open http://localhost:3000

## Development

### API (Python 3.10)
```bash
pip install -r api/requirements.txt -c api/constraints.txt
uvicorn api.main:app --port 8000
```

### Web (Node 20)
```bash
cd web
npm install
npm run dev
```

### Test Signal
```bash
python scripts/publish_test_signal.py
```

## Architecture

- **API**: FastAPI with Redis Streams (signals-api)
- **Web**: Next.js 14 with Server-Sent Events
- **Auth**: NextAuth.js with Discord provider (Phase 2)
- **Payments**: Stripe Checkout with webhooks
- **Streaming**: SSE for real-time signals and PnL updates
- **Backend**: Vercel serverless deployment

## Redis Cloud Connection

This frontend connects to the signals-api which uses Redis Cloud:

```bash
# Redis Cloud connection (for reference)
# URL: rediss://default:PASSWORD@redis-19818.c9.us-east-1-4.ec2.redns.redis-cloud.com:19818
# CA Cert: redis-ca.crt (in root directory)
# Note: Encode special characters in password ($ → %24, * → %2A)
```

## Environment Variables

Key environment variables (see `.env.example` for full list):

```bash
# API Connection
NEXT_PUBLIC_API_URL=https://crypto-signals-api.fly.dev
NEXT_PUBLIC_SIGNALS_MODE=paper

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRICE_STARTER=price_xxxxx
STRIPE_PRICE_PRO=price_xxxxx
STRIPE_PRICE_TEAM=price_xxxxx
STRIPE_PRICE_LIFETIME=price_xxxxx
```

See `web/docs/STRIPE_SETUP.md` for complete Stripe setup instructions.