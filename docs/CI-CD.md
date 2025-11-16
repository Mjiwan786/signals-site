# CI/CD Pipeline Documentation - signals-site

**Repository**: `signals-site`
**Last Updated**: 2025-11-16
**Maintainer**: DevOps Team

---

## Overview

This document describes the complete CI/CD pipeline for the signals-site repository, from code commit to production deployment on Vercel. All pipeline configurations align with **[PRD-003: Signals-Site Frontend Specification](PRD-003-SIGNALS-SITE.md)**.

### Pipeline Philosophy

- **Quality Gates**: Every commit must pass linting, type checking, tests, and PRD checklist validation
- **Automated Deployment**: Vercel automatically deploys on push to `main` branch
- **Preview Deployments**: Every PR gets a unique preview URL for testing
- **Zero Downtime**: Atomic deployments ensure instant rollback capability

---

## CI/CD Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        COMMIT TO GITHUB                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  Trigger CI/CD  │
                    │  GitHub Actions │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────────────┐
            │                │                        │
      ┌─────▼─────┐    ┌────▼────┐    ┌────────▼──────────┐
      │   Lint    │    │  Test   │    │   Type Check      │
      │ (ESLint)  │    │ (Jest,  │    │  (TypeScript)     │
      │           │    │  React  │    │                   │
      │           │    │  Testing│    │                   │
      │           │    │  Library│    │                   │
      └─────┬─────┘    └────┬────┘    └────────┬──────────┘
            │                │                   │
            │                │                   │
            └────────┬───────┴───────────┬───────┘
                     │                   │
              ┌──────▼──────┐     ┌──────▼──────┐
              │ PRD Checklist│     │Build Next.js│
              │  Validation  │     │   (SSR)     │
              └──────┬──────┘     └──────┬──────┘
                     │                   │
                     └────────┬──────────┘
                              │
                     ┌────────▼────────┐
                     │  Coverage Check │
                     │    (≥80%)       │
                     └────────┬────────┘
                              │
                   ┌──────────┴──────────┐
                   │                     │
          ┌────────▼────────┐  ┌────────▼────────┐
          │ Deploy to Vercel│  │  E2E Smoke Test │
          │   (Automatic)   │  │  (Landing Page) │
          └────────┬────────┘  └────────┬────────┘
                   │                     │
                   └──────────┬──────────┘
                              │
                     ┌────────▼────────┐
                     │  PRODUCTION     │
                     │ aipredictedsignals│
                     │    .cloud       │
                     └─────────────────┘
```

---

## Workflows

### 1. Main Test Workflow (`.github/workflows/test.yml`)

**Trigger**: Push or Pull Request to `main`, `master`, or `develop` branches

**Jobs**:

#### 1.1 Test Job (Matrix)

- **Operating Systems**: Ubuntu, Windows
- **Node Versions**: 18.x, 20.x, 22.x
- **Working Directory**: `./web`
- **Steps**:
  1. Checkout code
  2. Set up Node.js with npm cache
  3. Install dependencies (`npm ci`)
  4. Lint code (`npm run lint`)
  5. Run tests (`npm run test:ci`)
  6. Upload coverage to Codecov (Ubuntu + Node 22 only)
  7. **Validate PRD-003 Checklist** (Ubuntu + Node 22 only)

**Environment Variables**:
```yaml
CI: true
```

#### 1.2 Build Job

- **Depends On**: Test job success
- **Node Version**: 22.x (latest LTS)
- **Steps**:
  1. Checkout code
  2. Set up Node.js
  3. Install dependencies (`npm ci`)
  4. Build application (`npm run build`)
  5. Upload build artifacts (`.next` directory)

**Environment Variables** (mock values for build):
```yaml
NODE_ENV: production
NEXTAUTH_URL: https://example.com
NEXTAUTH_SECRET: test_secret_for_ci_build_only
NEXT_PUBLIC_API_URL: https://api.example.com
```

#### 1.3 Type Check Job

- **Parallel**: Runs in parallel with test job
- **Steps**:
  1. Checkout code
  2. Set up Node.js
  3. Install dependencies
  4. Run TypeScript compiler (`npx tsc --noEmit`)

#### 1.4 Coverage Check Job

- **Depends On**: Test job success
- **Threshold**: ≥80% for all metrics (lines, statements, functions, branches)
- **Steps**:
  1. Checkout code
  2. Set up Node.js
  3. Install dependencies
  4. Run tests with coverage (`npm run test:cov`)
  5. Validate coverage thresholds with Node.js script

#### 1.5 E2E Smoke Test Job

- **Depends On**: Build job success
- **Purpose**: Verify Next.js server starts and pages load
- **Steps**:
  1. Checkout code
  2. Set up Node.js
  3. Install dependencies
  4. Build application
  5. Start Next.js server (`npm run start &`)
  6. Test landing page (`curl http://localhost:3000`)
  7. Test pricing page (`curl http://localhost:3000/pricing`)
  8. Test API route (`curl http://localhost:3000/api/signals`)

---

## Vercel Deployment

### Automatic Deployment

**Vercel is the primary deployment platform** for signals-site. Deployment is **fully automated** with zero configuration needed in GitHub Actions.

#### How Vercel Auto-Deployment Works

1. **Vercel GitHub Integration**:
   - Vercel app is connected to the GitHub repository
   - Vercel automatically detects pushes to `main` branch
   - No manual deployment workflow needed in `.github/workflows/`

2. **Deployment Trigger**:
   ```
   Push to main → Vercel detects change → Build & Deploy
   ```

3. **Build Process**:
   - Vercel runs `npm run build` in the `./web` directory
   - Generates optimized Next.js production build
   - Deploys to global edge network

4. **Production URL**:
   - **Primary**: `https://aipredictedsignals.cloud`
   - **Vercel Default**: `https://signals-site.vercel.app`

#### Preview Deployments

**Every Pull Request** gets a unique preview URL:

```
PR #42 → https://signals-site-pr-42.vercel.app
```

**Benefits**:
- Test changes before merging
- Share preview links with team
- Automated comments on PR with preview URL

### Vercel Configuration

**Project Settings** (configured in Vercel dashboard):

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js |
| **Build Command** | `cd web && npm run build` |
| **Output Directory** | `web/.next` |
| **Install Command** | `cd web && npm ci` |
| **Node Version** | 22.x |
| **Root Directory** | `./` |

**Environment Variables** (set in Vercel dashboard):

```bash
# Production Environment
NEXT_PUBLIC_API_URL=https://crypto-signals-api.fly.dev
NEXT_PUBLIC_SIGNALS_MODE=paper
NEXT_PUBLIC_SITE_NAME=AI Predicted Signals

# Stripe (Production)
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRICE_STARTER=price_xxxxx
STRIPE_PRICE_PRO=price_xxxxx
STRIPE_PRICE_TEAM=price_xxxxx
STRIPE_PRICE_LIFETIME=price_xxxxx

# NextAuth
NEXTAUTH_URL=https://aipredictedsignals.cloud
NEXTAUTH_SECRET=<generated-secret>

# Discord OAuth (Phase 2)
DISCORD_CLIENT_ID=<client-id>
DISCORD_CLIENT_SECRET=<client-secret>
```

### Deployment Process (Automatic)

**Step-by-Step**:

1. Developer pushes to `main`:
   ```bash
   git push origin main
   ```

2. GitHub Actions CI runs:
   - Lint, test, type check
   - Build validation
   - PRD checklist validation
   - Coverage check

3. **If CI passes**, Vercel automatically:
   - Detects the push via GitHub integration
   - Clones the repository
   - Installs dependencies
   - Runs `npm run build`
   - Deploys to production
   - Updates DNS to point to new deployment
   - **Instant rollback** capability retained

4. Deployment complete:
   - **New version live** at `https://aipredictedsignals.cloud`
   - **Previous version** still available for instant rollback
   - Deployment metrics available in Vercel dashboard

### Manual Deployment (via Vercel CLI)

For emergency deployments or testing:

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to production
cd signals-site/web
vercel --prod

# Deploy to preview
vercel

# View deployments
vercel ls

# Inspect specific deployment
vercel inspect <deployment-url>

# Promote deployment to production
vercel promote <deployment-url>
```

### Rollback Procedure

**Instant Rollback** (Vercel dashboard):

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select `signals-site` project
3. Go to **Deployments** tab
4. Find the previous successful deployment
5. Click **•••** menu → **Promote to Production**
6. Confirm → Rollback completes in seconds

**Via Vercel CLI**:

```bash
# List deployments
vercel ls signals-site

# Example output:
# Age     Deployment                      Status
# 10m     signals-site-abc123.vercel.app  Ready   (current)
# 1h      signals-site-xyz789.vercel.app  Ready

# Rollback to previous deployment
vercel promote signals-site-xyz789.vercel.app
```

---

## PRD Checklist Validation

### Purpose

Ensures all PRD-003 requirements are implemented before merging code. This prevents incomplete features from reaching production.

### Implementation

**Script**: `scripts/check_prd_checklist.py`

**What it does**:
1. Reads `docs/PRD-003-CHECKLIST.md`
2. Counts checked `[x]` vs unchecked `[ ]` items
3. Exits with code 1 if any items are unchecked
4. Exits with code 0 if all items are checked

**Usage**:
```bash
# Run locally
python scripts/check_prd_checklist.py

# Expected output (if complete):
[*] PRD-003 Checklist Validation
============================================================
[>] Checklist: /path/to/docs/PRD-003-CHECKLIST.md

Total items:     250
Checked [x]:     250
Unchecked [ ]:   0

Completion: 100.0%

[+] SUCCESS: All checklist items complete!
    Safe to merge/deploy.
```

### CI Integration

The PRD checklist validation runs as part of the test job:

```yaml
- name: Validate PRD-003 Checklist
  if: matrix.os == 'ubuntu-latest' && matrix.node-version == '22.x'
  run: |
    echo "Validating PRD-003 checklist completion..."
    python3 scripts/check_prd_checklist.py
```

**Behavior**:
- ✅ **Success**: All items checked → CI passes → Vercel deploys
- ❌ **Failure**: Unchecked items found → CI fails → Vercel deployment blocked

---

## Testing Locally Before Commit

### Run Full CI Suite Locally

```bash
# Navigate to web directory
cd signals-site/web

# Install dependencies
npm ci

# Lint code
npm run lint

# Type check
npx tsc --noEmit

# Run tests
npm run test

# Run tests with coverage
npm run test:cov

# Build application
npm run build

# Validate PRD checklist
cd ..
python scripts/check_prd_checklist.py
```

### Quick Pre-Commit Check

```bash
cd signals-site/web

# Fast check (lint + tests + type check)
npm run lint && npx tsc --noEmit && npm run test

# Validate PRD checklist
cd .. && python scripts/check_prd_checklist.py
```

### Test Production Build Locally

```bash
cd signals-site/web

# Build for production
npm run build

# Start production server
npm run start

# Test in browser
open http://localhost:3000
```

---

## Monitoring & Observability

### CI/CD Monitoring

- **GitHub Actions Dashboard**: View workflow runs in Actions tab
- **Build Status Badge**:
  ```markdown
  [![Tests](https://github.com/user/signals-site/workflows/Tests/badge.svg)](https://github.com/user/signals-site/actions)
  ```

### Vercel Deployment Monitoring

- **Vercel Dashboard**: https://vercel.com/dashboard/signals-site
- **Deployment Status**: Real-time build logs and deployment status
- **Analytics**: Page views, performance metrics, Core Web Vitals
- **Logs**: Serverless function logs and errors
- **Speed Insights**: Lighthouse scores and performance tracking

**Key Metrics**:
- **Build Time**: Target <2 minutes
- **Deployment Time**: Target <30 seconds
- **Lighthouse Performance**: Target 90+
- **Core Web Vitals**: All green

### Production Monitoring

- **Health Check**: `curl https://aipredictedsignals.cloud`
- **API Health**: `curl https://aipredictedsignals.cloud/api/signals`
- **Vercel Logs**:
  ```bash
  vercel logs https://aipredictedsignals.cloud
  ```

---

## Common Issues & Troubleshooting

### Issue: PRD Checklist Validation Fails

**Symptom**: CI fails with "FAILURE: X unchecked item(s) found!"

**Solution**:
1. Review `docs/PRD-003-CHECKLIST.md`
2. Mark completed items with `[x]`
3. Commit and push updated checklist

### Issue: Vercel Build Fails

**Symptom**: Vercel build fails with "Build failed" error

**Possible Causes**:
1. TypeScript errors
2. Missing environment variables
3. Next.js build errors

**Solution**:
```bash
# Test build locally
cd signals-site/web
npm run build

# Check build logs in Vercel dashboard
# Fix errors and push

# Verify environment variables in Vercel
vercel env ls
```

### Issue: Environment Variables Not Loading

**Symptom**: Application errors due to undefined env vars

**Solution**:
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Verify all required variables are set for **Production** environment
3. Redeploy after adding variables:
   ```bash
   vercel --prod
   ```

### Issue: Deployment Succeeded But Site Not Working

**Symptom**: Vercel says "Deployment successful" but site shows errors

**Possible Causes**:
1. API endpoint unreachable (`NEXT_PUBLIC_API_URL` incorrect)
2. Stripe keys invalid
3. Runtime errors in serverless functions

**Solution**:
```bash
# Check Vercel logs
vercel logs https://aipredictedsignals.cloud

# Test API connectivity
curl https://crypto-signals-api.fly.dev/health/live

# Verify environment variables
vercel env ls

# Test locally with production env vars
npm run build
npm run start
```

### Issue: Type Check Fails in CI

**Symptom**: TypeScript errors in GitHub Actions but not locally

**Possible Causes**:
1. Missing type definitions
2. Different TypeScript version
3. Cached node_modules

**Solution**:
```bash
# Match CI Node version (22.x)
nvm use 22

# Clean install
rm -rf node_modules package-lock.json
npm install

# Run type check
npx tsc --noEmit
```

---

## Pipeline Metrics & SLOs

### Success Criteria

- ✅ **CI Pass Rate**: >95%
- ✅ **Deployment Success Rate**: >99%
- ✅ **CI Runtime**: <15 minutes for full pipeline
- ✅ **Vercel Deployment Time**: <3 minutes
- ✅ **Test Coverage**: ≥80% (enforced in CI)
- ✅ **Lighthouse Performance**: ≥90

### Current Performance

View real-time metrics:
- [GitHub Actions Insights](https://github.com/user/signals-site/actions)
- [Vercel Analytics](https://vercel.com/dashboard/analytics)

---

## Best Practices

### For Developers

1. **Test before pushing**:
   ```bash
   npm run lint && npm run test && python ../scripts/check_prd_checklist.py
   ```

2. **Keep PRD checklist current**:
   - Mark items `[x]` immediately after implementation

3. **Use Vercel preview deployments**:
   - Create PRs to test changes
   - Share preview URLs with team

4. **Monitor Lighthouse scores**:
   - Check Vercel Speed Insights after deployment
   - Optimize images, code splitting

### For Maintainers

1. **Review Vercel analytics weekly**:
   - Check Core Web Vitals
   - Identify slow pages
   - Monitor error rates

2. **Update dependencies regularly**:
   - Review Dependabot PRs
   - Test in preview deployments first

3. **Configure custom domain**:
   - Add `aipredictedsignals.cloud` in Vercel dashboard
   - Configure DNS (A/CNAME records)

---

## Related Documentation

- **[PRD-003: Signals-Site](PRD-003-SIGNALS-SITE.md)** - Authoritative requirements
- **[PRD-003 Checklist](PRD-003-CHECKLIST.md)** - Implementation tracking
- **[README.md](../README.md)** - Repository overview
- **[STRIPE_SETUP.md](../web/docs/STRIPE_SETUP.md)** - Stripe integration guide
- **[STRIPE_TEST_FLOW.md](../web/docs/STRIPE_TEST_FLOW.md)** - Stripe testing guide

---

## Support & Contact

**CI/CD Issues**: Open an issue with the `ci/cd` label
**Deployment Issues**: Tag `@devops-team`
**Vercel Issues**: Check [Vercel Status](https://www.vercel-status.com/)
**PRD Questions**: Tag `@product-team`

---

**Last Updated**: 2025-11-16
**Next Review**: Monthly or when pipeline changes
