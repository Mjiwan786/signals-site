# ⚡ Quick Deploy Guide - Get Live in 5 Minutes

## 🎯 Fastest Way to Deploy

### Step 1: Go to Vercel Dashboard
👉 **Open this link:** https://vercel.com/dashboard

### Step 2: Find Your Project
- Look for `signals-site` in your projects list
- Click on it

### Step 3: Add Environment Variables (2 minutes)
1. Click **Settings** tab
2. Click **Environment Variables** (left sidebar)
3. Click **Add New** and add these **4 variables**:

```
Name: NEXT_PUBLIC_API_URL
Value: https://api.aipredictedsignals.cloud
Environment: ✓ Production ✓ Preview ✓ Development
[Save]

Name: NEXT_PUBLIC_SIGNALS_MODE
Value: paper
Environment: ✓ Production ✓ Preview ✓ Development
[Save]

Name: NEXT_PUBLIC_SITE_NAME
Value: AI Predicted Signals
Environment: ✓ Production ✓ Preview ✓ Development
[Save]

Name: NEXT_PUBLIC_DISCORD_INVITE
Value: https://discord.gg/chaingpt
Environment: ✓ Production ✓ Preview ✓ Development
[Save]
```

### Step 4: Deploy (1 minute)
1. Click **Deployments** tab at the top
2. You should see your latest deployment from the GitHub push
3. **If you see a failed deployment:**
   - Click the three dots (•••) on the right
   - Click **Redeploy**
   - Wait 2-3 minutes for build to complete

4. **If you don't see any deployment:**
   - Go back to project overview
   - Look for **"Visit"** button or deployment URL
   - OR manually trigger deployment (see Alternative Method below)

### Step 5: Get Your Live URL! 🎉
Once deployment is complete (green checkmark):
- Click on the deployment
- Click **Visit** button
- Your site will be at: `https://signals-site-[random].vercel.app`
- **Copy this URL and share it with everyone!**

---

## 🔧 Alternative Method: Deploy via Command Line

If the dashboard method doesn't work, use the CLI:

```bash
# Open terminal/PowerShell in the project folder
cd "C:\Users\Maith\OneDrive\Desktop\signals-site"

# Make sure you're in the root directory (where vercel.json is)
# Deploy to production
vercel --prod --yes
```

When prompted, confirm:
- Link to existing project? **YES**
- Which project? Select **signals-site**

The CLI will output your live URL at the end!

---

## ✅ Verify Your Site is Live

Visit these URLs (replace `[your-url]` with your Vercel URL):

1. **Homepage:** https://[your-url].vercel.app/
   - Should show Hero with 3D animation
   - InvestorSnapshot section with MTD PnL
   - CommunityStrip with metrics

2. **Signals Page:** https://[your-url].vercel.app/signals
   - Should show signals table or fallback data

3. **Pricing Page:** https://[your-url].vercel.app/pricing
   - Should show 3 pricing tiers

4. **Legal Pages:**
   - Terms: https://[your-url].vercel.app/legal/terms
   - Privacy: https://[your-url].vercel.app/legal/privacy
   - Risk: https://[your-url].vercel.app/legal/risk

---

## 🚨 Troubleshooting

### "Environment Variable references Secret which does not exist"
**Fix:** You added environment variables, now click **Deployments** → **Redeploy**

### "Build failed"
**Fix:** Check the build logs in Vercel dashboard. Usually missing dependencies or env vars.

### "Site loads but shows errors"
**Fix:** Check browser console (F12). If API calls fail, that's expected - site will use fallback data.

### "Discord invite doesn't work"
**Fix:** Replace `https://discord.gg/chaingpt` with your actual Discord server invite in the environment variables.

---

## 📱 Share Your Live Site

Once deployed, your site is **publicly accessible** to anyone with the URL!

**Production URL Format:**
- `https://signals-site-abc123xyz.vercel.app`
- OR your custom domain: `https://aipredictedsignals.cloud` (if DNS configured)

**Share it:**
- Post on Twitter/X
- Share in Discord
- Send to investors
- Add to your portfolio

---

## 🎯 Next Steps After Deployment

1. **Test on mobile devices** (iPhone, Android)
2. **Check Web Vitals** in Vercel Analytics tab
3. **Configure custom domain** (aipredictedsignals.cloud)
4. **Set up Stripe** for payment processing (if needed)
5. **Connect real backend API** (if you have one running)

---

## 🆘 Still Need Help?

**If you're stuck:**
1. Check Vercel dashboard → Deployments → Click on latest → View **Function Logs**
2. Look for error messages in the build logs
3. Try deploying via CLI: `vercel --prod --yes`
4. Check that all 4 environment variables are set correctly

**Your site WILL go live after:**
✅ Environment variables are added in Vercel dashboard
✅ A deployment is triggered (automatic or manual)
✅ Build completes successfully (takes 2-3 minutes)

That's it! Your signals-site will be live and accessible to everyone! 🚀
