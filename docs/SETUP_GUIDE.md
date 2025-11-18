# Signals-Site Setup Guide

**Version:** 1.0.0
**Last Updated:** 2025-11-17
**Platform:** AI-Predicted-Signals

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Environment Configuration](#environment-configuration)
5. [Local Development](#local-development)
6. [Vercel Deployment](#vercel-deployment)
7. [Verification](#verification)
8. [Troubleshooting](#troubleshooting)

---

## Overview

The **Signals-Site** is the Next.js frontend dashboard of the AI-Predicted-Signals platform. It:

- Displays real-time trading signals via SSE streaming
- Shows live equity curves and PnL tracking
- Provides signal history and analytics
- Implements responsive design for mobile/desktop
- Handles graceful degradation when API unavailable
- Real-time updates via SSE connection to signals-api

This guide provides step-by-step instructions for setting up and deploying the signals-site frontend.

---

## Prerequisites

### System Requirements

- **Operating System**: Windows 10/11, Linux (Ubuntu 20.04+), or macOS 12+
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: Minimum 2GB free space
- **CPU**: Multi-core processor (2+ cores recommended)

### Required Software

1. **Node.js 18+** (LTS recommended)
   - Download: https://nodejs.org/
   - Verify: `node --version` should show 18 or higher

2. **npm** (comes with Node.js)
   - Verify: `npm --version`

3. **Git**
   - Download: https://git-scm.com/downloads
   - Verify: `git --version`

4. **Vercel CLI** (For deployment)
   - Install: `npm install -g vercel`
   - Verify: `vercel --version`

### Required Accounts & Credentials

1. **Signals-API** (Backend API)
   - URL: `https://crypto-signals-api.fly.dev`
   - Must be running for frontend to work
   - See [signals-api setup guide](../../signals_api/docs/SETUP_GUIDE.md)

2. **Vercel Account** (For deployment)
   - Sign up: https://vercel.com/signup
   - Project name: `signals-site`
   - Provided in handoff package

3. **Stripe** (Optional - for payments)
   - API keys and price IDs
   - Provided in handoff package
   - See `web/docs/STRIPE_SETUP.md` for details

4. **Supabase** (Optional - for authentication)
   - Project URL and anon key
   - Provided in handoff package

---

## Installation

### Step 1: Clone Repository

```bash
# Clone the repository
git clone <repository-url>
cd signals-site

# Verify you're in the correct directory
pwd
# Should show: /path/to/signals-site
```

### Step 2: Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Or with Yarn
yarn install

# Or with pnpm
pnpm install
```

**Key Dependencies Installed:**

- `next` - React framework
- `react` - UI library
- `typescript` - Type safety
- `tailwindcss` - Styling
- `recharts` - Charts for PnL visualization
- `eventsource` - SSE client for real-time updates
- `stripe` - Payment processing
- `next-auth` - Authentication

Expected output:

```
added 245 packages, and audited 246 packages in 30s

72 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

---

## Environment Configuration

### Step 1: Copy Environment Template

```bash
# Copy example environment file
cp .env.example .env.local

# For production
cp .env.production.template .env.production.local
```

### Step 2: Configure Environment Variables

Edit `.env.local` file with your configuration:

```bash
# Open in your preferred editor
nano .env.local       # Linux/Mac
notepad .env.local    # Windows
code .env.local       # VS Code
```

**Required Variables:**

```bash
# ============================================
# API CONFIGURATION (REQUIRED)
# ============================================
# Signals-API backend URL (must be running)
NEXT_PUBLIC_API_URL=https://crypto-signals-api.fly.dev

# Trading mode (paper or live)
NEXT_PUBLIC_SIGNALS_MODE=paper

# ============================================
# APPLICATION SETTINGS (REQUIRED)
# ============================================
# Application name
NEXT_PUBLIC_APP_NAME=AI-Predicted-Signals

# Application URL (for local development)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ============================================
# SITE METADATA (OPTIONAL)
# ============================================
NEXT_PUBLIC_SITE_NAME="AI-Predicted-Signals"
NEXT_PUBLIC_SITE_DESCRIPTION="AI-powered crypto trading signals with real-time delivery"
NEXT_PUBLIC_SITE_URL=https://aipredictedsignals.cloud

# ============================================
# STRIPE CONFIGURATION (OPTIONAL - for payments)
# ============================================
# Stripe publishable key (starts with pk_test_ or pk_live_)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx

# Stripe secret key (starts with sk_test_ or sk_live_)
STRIPE_SECRET_KEY=sk_test_xxxxx

# Stripe webhook secret (starts with whsec_)
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Stripe price IDs for subscription tiers
STRIPE_PRICE_STARTER=price_xxxxx
STRIPE_PRICE_PRO=price_xxxxx
STRIPE_PRICE_TEAM=price_xxxxx
STRIPE_PRICE_LIFETIME=price_xxxxx

# ============================================
# SUPABASE CONFIGURATION (OPTIONAL - for auth)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx

# ============================================
# ANALYTICS (OPTIONAL)
# ============================================
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# ============================================
# FEATURE FLAGS (OPTIONAL)
# ============================================
NEXT_PUBLIC_ENABLE_AUTH=false
NEXT_PUBLIC_ENABLE_PAYMENTS=false
NEXT_PUBLIC_ENABLE_LIVE_TRADING=false
```

### Step 3: Verify API Connection

Before starting the frontend, ensure the signals-api is running:

```bash
# Test API health endpoint
curl https://crypto-signals-api.fly.dev/health/live

# Expected: {"status": "ok"}

# Test signals endpoint
curl https://crypto-signals-api.fly.dev/v1/signals?n=10

# Expected: Array of signal objects

# Test PnL endpoint
curl https://crypto-signals-api.fly.dev/v1/pnl/latest

# Expected: PnL object or empty object
```

If API is not responding, follow the [signals-api setup guide](../../signals_api/docs/SETUP_GUIDE.md).

---

## Local Development

### Step 1: Start Development Server

```bash
# Start Next.js development server
npm run dev

# Or with Yarn
yarn dev

# Or with pnpm
pnpm dev
```

Expected output:

```
▲ Next.js 14.0.3
- Local:        http://localhost:3000
- Network:      http://192.168.1.100:3000

✓ Ready in 3.2s
✓ Compiled / in 1234ms
```

### Step 2: Open Dashboard

Open your browser and navigate to:

```
http://localhost:3000
```

You should see:

- **Homepage**: Overview of the AI-Predicted-Signals platform
- **Navigation**: Links to Live Signals, PnL, Pricing, Docs
- **Real-time Signals**: If signals-api is running and publishing signals

### Step 3: Test Real-Time Features

#### Test Live Signals Page

```
http://localhost:3000/signals
```

**Expected behavior:**
- Signals dashboard loads
- SSE connection established to signals-api
- Real-time signals appear as they're published
- Signal cards show: symbol, timeframe, signal direction, confidence, timestamp
- Connection status indicator shows "Connected"

#### Test PnL Dashboard

```
http://localhost:3000/pnl
```

**Expected behavior:**
- PnL metrics load (if crypto-ai-bot is publishing PnL data)
- Equity curve chart displays
- Performance metrics shown: Total Return, Sharpe Ratio, Max Drawdown, Win Rate
- Real-time updates via SSE

#### Test Graceful Degradation

To test how the frontend handles API unavailability:

```bash
# 1. Stop signals-api temporarily
# (or temporarily change NEXT_PUBLIC_API_URL to invalid URL)

# 2. Refresh the page

# Expected behavior:
# - "Metrics unavailable" message shown
# - No error crashes
# - Retry button appears
# - User can still navigate the site
```

### Step 4: Run Tests

```bash
# Run all tests
npm run test

# Run E2E tests (Playwright)
npm run test:e2e

# Run E2E tests in headed mode (see browser)
npm run test:e2e -- --headed

# Run specific test file
npx playwright test tests/e2e/signals.spec.ts

# Debug mode
npx playwright test --debug
```

### Step 5: Build for Production (Local)

```bash
# Build production bundle
npm run build

# Expected output:
# ✓ Compiled successfully
# ✓ Linting and checking validity of types
# ✓ Collecting page data
# ✓ Generating static pages (5/5)
# ✓ Finalizing page optimization

# Start production server locally
npm run start

# Test production build
curl http://localhost:3000
```

### Step 6: View Logs

Development server logs are shown in the terminal where you ran `npm run dev`.

**Common log messages:**

```
✓ Compiled / in 1234ms
○ GET /api/health 200 in 15ms
○ GET /signals 200 in 234ms
⚠ SSE connection error, retrying...
✓ SSE connected to https://crypto-signals-api.fly.dev/v1/stream
```

---

## Vercel Deployment

### Step 1: Install and Authenticate

```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Verify installation
vercel --version

# Login to Vercel
vercel login
```

### Step 2: Configure Project

The repository includes a pre-configured `vercel.json` file. Verify it:

```bash
# View vercel.json
cat vercel.json
```

**Key configurations:**

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_API_URL": "https://crypto-signals-api.fly.dev",
    "NEXT_PUBLIC_SIGNALS_MODE": "paper"
  }
}
```

### Step 3: Link Project to Vercel

```bash
# Link to existing Vercel project (if provided)
vercel link

# Or create new project
vercel

# Follow prompts:
# ? Set up and deploy "~/signals-site"? [Y/n] y
# ? Which scope do you want to deploy to? <your-team>
# ? Link to existing project? [y/N] n
# ? What's your project's name? signals-site
# ? In which directory is your code located? ./
```

### Step 4: Set Environment Variables

**Option 1: Via Vercel CLI**

```bash
# Set production environment variables
vercel env add NEXT_PUBLIC_API_URL production
# Enter value: https://crypto-signals-api.fly.dev

vercel env add NEXT_PUBLIC_SIGNALS_MODE production
# Enter value: paper

vercel env add NEXT_PUBLIC_SITE_URL production
# Enter value: https://aipredictedsignals.cloud

# Set Stripe keys (if using payments)
vercel env add STRIPE_SECRET_KEY production
# Enter value: sk_live_xxxxx

vercel env add STRIPE_WEBHOOK_SECRET production
# Enter value: whsec_xxxxx

# Set Stripe price IDs
vercel env add STRIPE_PRICE_STARTER production
vercel env add STRIPE_PRICE_PRO production
vercel env add STRIPE_PRICE_TEAM production
vercel env add STRIPE_PRICE_LIFETIME production
```

**Option 2: Via Vercel Dashboard**

1. Go to: https://vercel.com/dashboard
2. Select your project: `signals-site`
3. Go to: Settings → Environment Variables
4. Add each environment variable with appropriate scopes (Production, Preview, Development)

### Step 5: Deploy to Vercel

```bash
# Deploy to production
vercel --prod

# This will:
# 1. Build the Next.js application
# 2. Upload static assets to Vercel CDN
# 3. Deploy serverless functions
# 4. Assign production domain
```

Expected output:

```
Vercel CLI 28.4.0
🔍  Inspect: https://vercel.com/your-team/signals-site/xxx [2s]
✅  Production: https://aipredictedsignals.cloud [copied to clipboard] [30s]
```

### Step 6: Configure Custom Domain

If you have a custom domain:

```bash
# Add domain via CLI
vercel domains add aipredictedsignals.cloud

# Or add via Vercel Dashboard:
# 1. Go to Project Settings → Domains
# 2. Add domain: aipredictedsignals.cloud
# 3. Follow DNS configuration instructions
# 4. Add DNS records to your DNS provider:
#    - Type: CNAME
#    - Name: @
#    - Value: cname.vercel-dns.com
#    - TTL: Auto
```

### Step 7: Verify Deployment

```bash
# Check deployment status
vercel ls

# View deployment details
vercel inspect <deployment-url>

# View logs
vercel logs <deployment-url>

# Test production deployment
curl https://aipredictedsignals.cloud

# Test API connectivity
curl https://aipredictedsignals.cloud/api/health
```

### Step 8: Monitor Production

**Vercel Dashboard:**

1. Go to: https://vercel.com/dashboard
2. Select: `signals-site`
3. View:
   - Deployments
   - Analytics
   - Speed Insights
   - Logs
   - Usage

**Key Metrics:**

- **Lighthouse Score**: Should be 90+ for Performance, Accessibility, Best Practices, SEO
- **Web Vitals**: FCP <1.8s, LCP <2.5s, CLS <0.1
- **Error Rate**: <0.1%
- **Bandwidth Usage**: Monitor for cost optimization

---

## Verification

### Step 1: Test Homepage

```bash
# Local
curl http://localhost:3000

# Production
curl https://aipredictedsignals.cloud

# Expected: HTML content of homepage
```

### Step 2: Test Live Signals Page

**In Browser:**

1. Navigate to: `https://aipredictedsignals.cloud/signals`
2. Verify:
   - Page loads successfully
   - SSE connection established
   - Real-time signals appear
   - Signal cards show all fields
   - Connection status shows "Connected"

**Via cURL (test API endpoint):**

```bash
curl https://aipredictedsignals.cloud/api/signals
```

### Step 3: Test PnL Dashboard

**In Browser:**

1. Navigate to: `https://aipredictedsignals.cloud/pnl`
2. Verify:
   - PnL metrics load
   - Equity curve chart displays
   - Performance metrics shown
   - Real-time updates work

### Step 4: Test Mobile Responsiveness

**In Browser:**

1. Open Developer Tools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device (iPhone 12, Pixel 5, etc.)
4. Verify:
   - Layout adjusts to mobile screen
   - Navigation menu works
   - Signal cards stack vertically
   - Charts are readable
   - SSE connection works on mobile

### Step 5: Test Performance

**Run Lighthouse Audit:**

1. Open DevTools → Lighthouse tab
2. Select: Desktop or Mobile
3. Click: "Analyze page load"
4. Verify scores:
   - Performance: 90+
   - Accessibility: 95+
   - Best Practices: 90+
   - SEO: 100

**Or use CLI:**

```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse https://aipredictedsignals.cloud --view

# Expected: Report opens in browser
```

### Step 6: Test Graceful Degradation

1. Stop signals-api temporarily
2. Refresh signals page
3. Verify:
   - "Metrics unavailable" message shown
   - No error crashes
   - Retry button appears
   - Navigation still works

---

## Troubleshooting

### Issue 1: Cannot Connect to API

**Error in Browser Console:**

```
Failed to fetch signals from API
```

**Solutions:**

1. **Verify API is running:**

```bash
curl https://crypto-signals-api.fly.dev/health/live
# Expected: {"status": "ok"}
```

2. **Check NEXT_PUBLIC_API_URL:**

```bash
echo $NEXT_PUBLIC_API_URL
# Should be: https://crypto-signals-api.fly.dev
```

3. **Check CORS configuration:**

```bash
# Verify signals-api allows your domain
# In signals-api .env:
# CORS_ALLOW_ORIGINS=https://aipredictedsignals.cloud
```

4. **Check network tab in DevTools:**
   - Look for failed requests
   - Check response status codes
   - Verify request headers

### Issue 2: SSE Connection Fails

**Error:**

```
SSE connection error, retrying...
```

**Solutions:**

1. **Verify SSE endpoint:**

```bash
curl -N https://crypto-signals-api.fly.dev/v1/stream
# Should show continuous stream of events
```

2. **Check browser console for errors:**
   - Look for EventSource errors
   - Check network tab for /v1/stream request

3. **Test SSE with different browser:**
   - Some browsers have SSE limitations
   - Try Chrome, Firefox, Safari

4. **Check for ad blockers:**
   - Some ad blockers block SSE
   - Temporarily disable and test

### Issue 3: Build Fails

**Error:**

```
Error: Failed to compile
```

**Solutions:**

1. **Check Node.js version:**

```bash
node --version
# Should be 18 or higher
```

2. **Clear cache and reinstall:**

```bash
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

3. **Check for TypeScript errors:**

```bash
npm run type-check
```

4. **Check environment variables:**

```bash
# Ensure all NEXT_PUBLIC_ variables are set
env | grep NEXT_PUBLIC
```

### Issue 4: Vercel Deployment Fails

**Error:**

```
Error: Build failed
```

**Solutions:**

1. **Check Vercel build logs:**

```bash
vercel logs <deployment-url>
```

2. **Verify environment variables in Vercel:**
   - Go to: Project Settings → Environment Variables
   - Ensure all required variables are set for Production

3. **Test build locally:**

```bash
npm run build
# Should complete successfully
```

4. **Check build command in vercel.json:**

```json
{
  "buildCommand": "npm run build"
}
```

### Issue 5: Slow Page Load

**Issue:** Homepage taking >5 seconds to load

**Solutions:**

1. **Optimize images:**

```bash
# Use Next.js Image component
import Image from 'next/image'

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={100}
  priority
/>
```

2. **Enable static generation:**

```typescript
// pages/index.tsx
export async function getStaticProps() {
  return {
    props: {},
    revalidate: 60 // Revalidate every 60 seconds
  }
}
```

3. **Check Vercel Analytics:**
   - Go to: Vercel Dashboard → Analytics
   - Identify slow API calls
   - Optimize or cache

4. **Use Vercel Edge Functions:**
   - For frequently accessed API routes
   - Reduces latency

### Issue 6: Stripe Webhooks Not Working

**Error:**

```
Stripe webhook signature verification failed
```

**Solutions:**

1. **Verify webhook secret:**

```bash
echo $STRIPE_WEBHOOK_SECRET
# Should start with whsec_
```

2. **Check Stripe webhook configuration:**
   - Go to: Stripe Dashboard → Developers → Webhooks
   - Verify endpoint: `https://aipredictedsignals.cloud/api/webhooks/stripe`
   - Events to send: `checkout.session.completed`, `customer.subscription.updated`

3. **Test webhook locally:**

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test event
stripe trigger checkout.session.completed
```

### Issue 7: Charts Not Displaying

**Issue:** PnL equity curve chart not showing

**Solutions:**

1. **Check if data is available:**

```bash
curl https://crypto-signals-api.fly.dev/v1/pnl?n=100
# Should return array of PnL data points
```

2. **Check browser console for errors:**
   - Look for Recharts errors
   - Verify data format

3. **Verify chart component:**

```typescript
// Ensure data is not empty
{data && data.length > 0 ? (
  <LineChart data={data}>
    ...
  </LineChart>
) : (
  <p>No data available</p>
)}
```

---

## Support

### Documentation

- **[PLATFORM_OVERVIEW.md](../../PLATFORM_OVERVIEW.md)** - Complete platform overview
- **[ARCHITECTURE.md](../../crypto_ai_bot/docs/ARCHITECTURE.md)** - Detailed architecture
- **[PRD-003-SIGNALS-SITE.md](PRD-003-SIGNALS-SITE.md)** - Product requirements
- **[USER_GUIDE.md](USER_GUIDE.md)** - Dashboard user guide

### Contact

- **30-Day Support**: Contact support team with any issues
- **GitHub Issues**: Create issue with `[SIGNALS-SITE]` prefix
- **Email**: Support email provided in handoff package

---

## Next Steps

After successful setup:

1. **Test end-to-end flow**: Verify complete signal flow from crypto-ai-bot → Redis → signals-api → signals-site
2. **Configure payments**: Setup Stripe for subscription management (optional)
3. **Setup authentication**: Configure NextAuth.js for user accounts (optional)
4. **Monitor analytics**: Setup Google Analytics or PostHog
5. **Optimize SEO**: Configure meta tags and sitemap
6. **Enable live trading**: Switch from paper to live mode when ready

---

**Document Version:** 1.0.0
**Last Updated:** 2025-11-17
**Status:** ✅ PRODUCTION READY
**Live URL:** https://aipredictedsignals.cloud
