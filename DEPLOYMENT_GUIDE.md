# 🚀 Signals-Site Deployment Guide

This guide will help you deploy your signals-site to Vercel and make it live for everyone.

---

## Prerequisites

- ✅ GitHub repository: https://github.com/Mjiwan786/signals-site
- ✅ Vercel account connected to your GitHub
- ✅ Code pushed to main branch
- ⚠️ Environment variables (need to configure)

---

## Step 1: Configure Vercel Environment Variables

### Option A: Using Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Log in to your account

2. **Find Your Project:**
   - Look for `signals-site` or `ai-predicted-signals-projects/signals-site`
   - Click on the project name

3. **Navigate to Settings:**
   - Click **Settings** tab at the top
   - Click **Environment Variables** in the left sidebar

4. **Add Required Variables:**

   For each variable below, click **Add New** and enter:

   #### Essential Variables (Required for Basic Site)
   ```bash
   # API Configuration
   NEXT_PUBLIC_API_URL=https://api.aipredictedsignals.cloud
   NEXT_PUBLIC_SIGNALS_MODE=paper

   # Site Configuration
   NEXT_PUBLIC_SITE_NAME=AI Predicted Signals
   NEXT_PUBLIC_DISCORD_INVITE=https://discord.gg/your-invite-code
   ```

   #### Optional Variables (Can add later)
   ```bash
   # Stripe (for payments - Phase 2)
   NEXT_PUBLIC_STRIPE_PRICE_PRO=price_xxxxxxxxxxxxx
   NEXT_PUBLIC_STRIPE_PRICE_ELITE=price_xxxxxxxxxxxxx
   STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

   # NextAuth (for authentication - Phase 2)
   NEXTAUTH_URL=https://your-site.vercel.app
   NEXTAUTH_SECRET=generate-random-32-char-string

   # Discord OAuth (Phase 2)
   DISCORD_CLIENT_ID=your-client-id
   DISCORD_CLIENT_SECRET=your-client-secret
   DISCORD_BOT_TOKEN=your-bot-token
   ```

5. **Important Settings for Each Variable:**
   - **Environment:** Select `Production`, `Preview`, and `Development` (all three)
   - **Value:** Enter the actual value
   - Click **Save**

### Option B: Using Vercel CLI (Alternative)

If you prefer the command line:

```bash
# Navigate to web directory
cd C:\Users\Maith\OneDrive\Desktop\signals-site\web

# Add environment variables
vercel env add NEXT_PUBLIC_API_URL production
# When prompted, enter: https://api.aipredictedsignals.cloud

vercel env add NEXT_PUBLIC_SIGNALS_MODE production
# When prompted, enter: paper

vercel env add NEXT_PUBLIC_SITE_NAME production
# When prompted, enter: AI Predicted Signals

vercel env add NEXT_PUBLIC_DISCORD_INVITE production
# When prompted, enter: https://discord.gg/your-invite
```

---

## Step 2: Deploy to Vercel

### Option A: Automatic Deployment (Recommended)

Since your GitHub is connected to Vercel:

1. **Trigger Deployment:**
   - Every push to `main` branch automatically deploys
   - You already pushed your code, so check the dashboard

2. **Check Deployment Status:**
   - Go to: https://vercel.com/dashboard
   - Click on your project
   - Click **Deployments** tab
   - You should see a deployment in progress or completed

3. **View Your Live Site:**
   - Once deployment is complete (usually 2-3 minutes)
   - Click on the deployment
   - Click **Visit** button
   - Your site URL will be: `https://signals-site-[hash].vercel.app`

### Option B: Manual Deployment via CLI

If automatic deployment didn't trigger:

```bash
# Navigate to web directory
cd C:\Users\Maith\OneDrive\Desktop\signals-site\web

# Deploy to production
vercel --prod
```

---

## Step 3: Configure Custom Domain (Optional)

If you want `aipredictedsignals.cloud` instead of the Vercel subdomain:

1. **In Vercel Dashboard:**
   - Go to your project → Settings → Domains
   - Click **Add Domain**
   - Enter: `aipredictedsignals.cloud`

2. **Update DNS Records:**
   - Go to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)
   - Add these DNS records:

   **For root domain (aipredictedsignals.cloud):**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```

   **For www subdomain:**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Wait for DNS Propagation:**
   - Usually takes 5 minutes to 48 hours
   - Check status in Vercel dashboard

4. **Enable HTTPS:**
   - Vercel automatically provisions SSL certificates
   - Your site will be accessible via `https://aipredictedsignals.cloud`

---

## Step 4: Verify Deployment

### Check These Pages:

- ✅ **Homepage:** https://your-site.vercel.app/
- ✅ **Signals:** https://your-site.vercel.app/signals
- ✅ **Performance:** https://your-site.vercel.app/performance
- ✅ **Pricing:** https://your-site.vercel.app/pricing
- ✅ **Dashboard:** https://your-site.vercel.app/dashboard
- ✅ **Legal Pages:**
  - Terms: https://your-site.vercel.app/legal/terms
  - Privacy: https://your-site.vercel.app/legal/privacy
  - Risk: https://your-site.vercel.app/legal/risk

### Test These Features:

1. **Smooth Scrolling:**
   - Scroll on homepage - should be butter smooth
   - No jank or stuttering

2. **Animations:**
   - Page transitions when navigating
   - Section entrance animations (scroll down)
   - Hover effects on buttons and links

3. **InvestorSnapshot:**
   - Should show MTD PnL, Win Rate, Max Drawdown
   - If API is unavailable, shows fallback data

4. **CommunityStrip:**
   - Shows community metrics
   - Discord invite link works

5. **Mobile Responsive:**
   - Open on phone (iPhone SE or similar)
   - All content should be readable
   - No horizontal scrolling

6. **Error Boundaries:**
   - If something fails, you should see graceful error message
   - Not a blank white screen

---

## Step 5: Monitor Performance

### Vercel Analytics (Built-in)

1. **Enable Analytics:**
   - Go to project → Analytics tab
   - View Web Vitals metrics
   - Check LCP, FID, CLS scores

2. **Check Logs:**
   - Go to project → Logs tab
   - View real-time server logs
   - Debug any issues

### Web Vitals Console (Dev Mode)

1. **Run locally:**
   ```bash
   cd web
   npm run dev
   ```

2. **Open browser console:**
   - You'll see color-coded Web Vitals logs
   - LCP, FID, CLS, FCP, TTFB, INP

---

## Troubleshooting

### Issue: "Environment Variable X references Secret Y which does not exist"

**Solution:** Add the missing environment variable in Vercel dashboard.

### Issue: "Build failed - Module not found"

**Solution:**
```bash
cd web
npm install
git add package-lock.json
git commit -m "fix: Update dependencies"
git push origin main
```

### Issue: "API calls failing"

**Solution:** Check that `NEXT_PUBLIC_API_URL` is set correctly. If your backend API isn't ready yet, the site will use fallback data (hardcoded metrics).

### Issue: "Discord invite doesn't work"

**Solution:** Update `NEXT_PUBLIC_DISCORD_INVITE` with your actual Discord server invite link.

### Issue: "Site is slow"

**Solution:**
- Check Vercel Analytics for bottlenecks
- Ensure PnL data is being cached (SWR)
- Check Network tab in browser DevTools

---

## Quick Deployment Checklist

- [ ] Vercel account created and GitHub connected
- [ ] Project exists in Vercel dashboard (`signals-site`)
- [ ] Environment variables added (at minimum: API_URL, DISCORD_INVITE)
- [ ] Latest code pushed to GitHub main branch
- [ ] Deployment triggered (automatic or manual)
- [ ] Deployment completed successfully (green checkmark)
- [ ] Site URL obtained (e.g., `signals-site-abc123.vercel.app`)
- [ ] Homepage loads without errors
- [ ] All pages accessible (signals, pricing, dashboard, legal)
- [ ] Mobile responsive (tested on phone or DevTools)
- [ ] Custom domain configured (optional)

---

## Production URLs

### Vercel Auto-Generated URL
- Format: `https://signals-site-[hash].vercel.app`
- Available immediately after deployment
- Never changes for production branch

### Custom Domain (If Configured)
- Primary: `https://aipredictedsignals.cloud`
- WWW: `https://www.aipredictedsignals.cloud`
- Requires DNS configuration

---

## Need Help?

### Vercel Support
- Documentation: https://vercel.com/docs
- Support: https://vercel.com/support

### Project Repository
- GitHub Issues: https://github.com/Mjiwan786/signals-site/issues

### Discord Community
- Join your Discord and ask for help: https://discord.gg/your-invite

---

## Summary

**To get your site live RIGHT NOW:**

1. **Go to Vercel:** https://vercel.com/dashboard
2. **Find your project:** `signals-site`
3. **Add these 4 environment variables:**
   - `NEXT_PUBLIC_API_URL` = `https://api.aipredictedsignals.cloud`
   - `NEXT_PUBLIC_SIGNALS_MODE` = `paper`
   - `NEXT_PUBLIC_SITE_NAME` = `AI Predicted Signals`
   - `NEXT_PUBLIC_DISCORD_INVITE` = `https://discord.gg/your-invite`
4. **Go to Deployments tab**
5. **Click "Redeploy" on the latest deployment**
6. **Wait 2-3 minutes**
7. **Click "Visit" to see your live site! 🎉**

That's it! Your site will be live at the Vercel URL.
