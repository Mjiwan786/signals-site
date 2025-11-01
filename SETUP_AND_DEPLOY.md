# 🚀 Deploy Signals-Site via CLI - Complete Guide

## Prerequisites Check

Before deploying, make sure you have:
- ✅ Vercel CLI installed (`npm install -g vercel`)
- ✅ Logged in to Vercel (`vercel login`)
- ✅ Your Discord server invite URL ready

---

## Step 1: Set Environment Variables in Vercel

You need to add environment variables **before** deploying. Here's how:

### Option A: Add via Vercel Dashboard (Recommended)

1. Go to: https://vercel.com/dashboard
2. Click on your `signals-site` project
3. Go to: **Settings** → **Environment Variables**
4. Add these variables (check all 3 environments for each):

```bash
# Essential Variables (REQUIRED)
NEXT_PUBLIC_API_URL = https://api.aipredictedsignals.cloud
NEXT_PUBLIC_SIGNALS_MODE = paper
NEXT_PUBLIC_SITE_NAME = AI Predicted Signals

# Discord Invite (UPDATE THIS)
NEXT_PUBLIC_DISCORD_INVITE = https://discord.gg/YOUR-INVITE-CODE

# Optional (for Phase 2 - can skip for now)
NEXTAUTH_URL = https://aipredictedsignals.cloud
NEXTAUTH_SECRET = your-random-32-char-secret
NEXT_PUBLIC_STRIPE_PRICE_PRO = price_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PRICE_ELITE = price_xxxxxxxxxxxxx
```

**Important Notes:**
- Redis Cloud credentials are **NOT needed** for frontend deployment (only backend API uses them)
- The Redis cert file stays on your backend server, not in Vercel
- Environment: Select ✓ Production, ✓ Preview, ✓ Development for each variable

### Option B: Add via CLI

```bash
# Navigate to project
cd "C:\Users\Maith\OneDrive\Desktop\signals-site"

# Add variables one by one
vercel env add NEXT_PUBLIC_API_URL production
# When prompted, enter: https://api.aipredictedsignals.cloud

vercel env add NEXT_PUBLIC_SIGNALS_MODE production
# When prompted, enter: paper

vercel env add NEXT_PUBLIC_SITE_NAME production
# When prompted, enter: AI Predicted Signals

vercel env add NEXT_PUBLIC_DISCORD_INVITE production
# When prompted, enter: https://discord.gg/YOUR-INVITE-CODE
```

---

## Step 2: Deploy via CLI

### Method 1: Using the Batch Script (Easiest)

Double-click on: `DEPLOY_NOW.bat` in your project folder

OR in PowerShell/CMD:
```cmd
cd "C:\Users\Maith\OneDrive\Desktop\signals-site"
DEPLOY_NOW.bat
```

### Method 2: Manual CLI Commands

```bash
# Navigate to project root
cd "C:\Users\Maith\OneDrive\Desktop\signals-site"

# Deploy to production
vercel --prod --yes
```

### What Will Happen:

1. **Vercel CLI will ask questions:**

   ```
   ? Set up and deploy "C:\Users\Maith\OneDrive\Desktop\signals-site"? [Y/n]
   ```
   **Answer:** Y (or just press Enter)

   ```
   ? Which scope do you want to deploy to?
   ```
   **Answer:** Select your account/organization

   ```
   ? Link to existing project? [Y/n]
   ```
   **Answer:** Y (if signals-site exists), or N (to create new)

   ```
   ? What's your project's name?
   ```
   **Answer:** signals-site

   ```
   ? In which directory is your code located?
   ```
   **Answer:** `web` ← **IMPORTANT!**

2. **Vercel will then:**
   - Upload your code
   - Install dependencies (npm install)
   - Run build (npm run build)
   - Deploy to production
   - Give you a live URL

3. **Expected Output:**
   ```
   ✅ Production: https://signals-site-abc123xyz.vercel.app [3m 24s]
   ```

---

## Step 3: Verify Deployment

Once you get the URL, test these pages:

```bash
# Homepage with Hero, InvestorSnapshot, CommunityStrip
https://signals-site-abc123xyz.vercel.app/

# Signals page with PnL chart
https://signals-site-abc123xyz.vercel.app/signals

# Pricing tiers
https://signals-site-abc123xyz.vercel.app/pricing

# Legal pages
https://signals-site-abc123xyz.vercel.app/legal/terms
https://signals-site-abc123xyz.vercel.app/legal/privacy
https://signals-site-abc123xyz.vercel.app/legal/risk
```

---

## Common Questions

### Q: Do I need to upload the Redis cert file to Vercel?
**A:** No! The Redis cert file (`redis-ca.crt`) is only used by your **backend API** (FastAPI) to connect to Redis Cloud. Your frontend (Next.js on Vercel) only makes HTTP requests to your API, it never connects directly to Redis.

### Q: What about the Redis password?
**A:** Same answer - Redis credentials stay on your backend server. Vercel never needs them.

### Q: Where is my backend API running?
**A:** Based on your PRD, your backend API should be at `https://api.aipredictedsignals.cloud`. If it's not live yet, your frontend will use fallback data (hardcoded metrics).

### Q: What if I get "NEXT_PUBLIC_API_URL is undefined"?
**A:** You forgot to add environment variables. Go to Vercel dashboard → Settings → Environment Variables and add them, then redeploy.

### Q: What's my Discord invite URL?
**A:** Go to your Discord server → Server Settings → Invites → Create a new invite link. Use that URL.

---

## After Deployment

### Set Up Custom Domain (Optional)

1. In Vercel dashboard → Your project → Settings → Domains
2. Add: `aipredictedsignals.cloud`
3. Update DNS records at your domain registrar:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```

### Enable Vercel Analytics

1. Go to your project → Analytics tab
2. Enable "Vercel Analytics"
3. Monitor Web Vitals (LCP, FID, CLS)

### Connect to Backend API

If your backend API is ready:
1. Make sure it's running at `https://api.aipredictedsignals.cloud`
2. Test the endpoints:
   - GET https://api.aipredictedsignals.cloud/v1/signals
   - GET https://api.aipredictedsignals.cloud/v1/pnl
   - GET https://api.aipredictedsignals.cloud/v1/status/health

If not ready yet, that's OK - your frontend uses fallback data.

---

## Troubleshooting

### "No Next.js version detected"
**Fix:** When deploying, make sure to answer `web` when asked for directory location.

### "Build failed - Missing environment variables"
**Fix:** Add environment variables in Vercel dashboard first, then redeploy.

### "Module not found" errors
**Fix:**
```bash
cd web
npm install
git add package-lock.json
git commit -m "fix: Update dependencies"
git push origin main
vercel --prod --yes
```

### Deployment times out
**Fix:**
- Check your internet connection
- Try again: `vercel --prod --yes`
- Check Vercel status: https://www.vercel-status.com/

---

## Architecture Reference

```
Your Setup:
┌─────────────────────────────────────────┐
│  Frontend (Next.js) on Vercel          │
│  https://signals-site-abc.vercel.app   │
│                                         │
│  Environment Variables:                 │
│  - NEXT_PUBLIC_API_URL                 │
│  - NEXT_PUBLIC_DISCORD_INVITE          │
│  - NEXT_PUBLIC_SITE_NAME               │
└──────────────┬──────────────────────────┘
               │ HTTP/HTTPS requests
               ↓
┌─────────────────────────────────────────┐
│  Backend API (FastAPI)                  │
│  https://api.aipredictedsignals.cloud  │
│                                         │
│  Uses Redis Cloud credentials:          │
│  - redis-ca.crt (TLS cert)              │
│  - REDIS_URL with password              │
└──────────────┬──────────────────────────┘
               │ TLS connection
               ↓
┌─────────────────────────────────────────┐
│  Redis Cloud                            │
│  redis-19818.c9.us-east-1-4...          │
└─────────────────────────────────────────┘
```

**Key Point:** Your Vercel deployment (frontend) never touches Redis directly!

---

## Quick Reference Commands

```bash
# Check Vercel CLI version
vercel --version

# Login to Vercel
vercel login

# Deploy to production
cd "C:\Users\Maith\OneDrive\Desktop\signals-site"
vercel --prod --yes

# Check deployment status
vercel ls

# View logs
vercel logs

# Open project in dashboard
vercel
```

---

## Summary

**To deploy RIGHT NOW:**

1. **Add environment variables** in Vercel dashboard (4 variables minimum)
2. **Open PowerShell** in project folder
3. **Run:** `vercel --prod --yes`
4. **When asked for directory:** Type `web`
5. **Wait 2-3 minutes**
6. **Get your live URL!** 🎉

**Your site will be publicly accessible to everyone at that URL.**

No Redis setup needed on Vercel - that's all backend!
