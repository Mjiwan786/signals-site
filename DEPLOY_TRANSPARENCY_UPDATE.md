# Deploy Transparency Update - Quick Guide

**Status**: ✅ Ready to Deploy
**Commit**: `feat(transparency): update landing page KPIs with real backtest data`

---

## What Changed

### 📊 Updated Metrics (Old → New)

| Metric | Before (Placeholder) | After (Real Data) | Change |
|--------|---------------------|-------------------|--------|
| **12-Month ROI** | +247.8% | **+7.54%** | -97% (realistic) |
| **Win Rate** | 68.4% | **54.5%** | -20% (verified) |
| **Max Drawdown** | -12.3% | **-38.8%** | +215% (honest) |
| **Total Trades** | 1,247 | **442** | Actual backtest |
| **Sharpe Ratio** | N/A | **0.76** | New metric |

### 📄 Files Updated (9 files)

1. ✅ `web/components/KpiStrip.tsx` - Main landing page KPIs
2. ✅ `web/app/performance/page.tsx` - Performance page stats
3. ✅ `web/components/ArchitectureDiagram.tsx` - Architecture metrics
4. ✅ `web/components/InvestorSnapshot.tsx` - Investor fallback data
5. ✅ `web/components/SocialProof.tsx` - Active traders count
6. ✅ `web/components/TrustStrip.tsx` - Trust metrics
7. ✅ `web/app/opengraph-image.tsx` - Social media preview (OpenGraph)
8. ✅ `web/app/twitter-image.tsx` - Social media preview (Twitter/X)
9. ✅ `TRANSPARENCY_UPDATE.md` - Documentation

---

## Deploy to Production

### Option 1: Auto-Deploy (Vercel)

Already set up! Just push to main:

```bash
cd signals-site

# Check status
git status

# Push to trigger Vercel deploy
git push origin main
```

Vercel will automatically:
- Build the Next.js app
- Deploy to https://aipredictedsignals.cloud
- No downtime (atomic deployment)

**Monitor**: https://vercel.com/ai-predicted-signals-projects/signals-site

### Option 2: Manual Vercel Deploy

```bash
cd signals-site/web

# Deploy to production
vercel --prod

# Verify
vercel ls
```

---

## Post-Deploy Verification

### 1. Check Landing Page

```bash
# Open in browser
start https://aipredictedsignals.cloud

# Or curl
curl https://aipredictedsignals.cloud | grep "7.54"
```

**Visual Checks:**
- Scroll to "12-Month Backtest Performance" section
- Verify: **+7.54%** ROI
- Verify: **54.5%** Win Rate
- Verify: **-38.8%** Max Drawdown
- Verify: **0.76** Sharpe Ratio
- Check disclaimer text is visible

### 2. Check Social Media Previews

Share on Twitter/Discord and verify OpenGraph images show **+7.54%** (not +247%)

Test tools:
- https://cards-dev.twitter.com/validator
- https://www.opengraph.xyz/url/https%3A%2F%2Faipredictedsignals.cloud

### 3. Check Performance Page

```
https://aipredictedsignals.cloud/performance
```

- Win Rate: **54.5%**
- Total Trades: **442**

### 4. Mobile Responsiveness

Test on:
- iPhone (Safari)
- Android (Chrome)
- Desktop (Chrome, Firefox)

---

## Rollback (If Needed)

### If anything breaks:

```bash
cd signals-site

# Revert to previous commit
git revert HEAD

# Push
git push origin main

# Or use Vercel dashboard:
# 1. Go to deployments
# 2. Click previous successful deployment
# 3. Click "Promote to Production"
```

---

## Expected Timeline

| Step | Time | Notes |
|------|------|-------|
| Push to GitHub | Instant | |
| Vercel Build | 2-3 min | Watch logs |
| Deployment | 30 sec | Atomic swap |
| DNS Propagation | 0 min | Already configured |
| **Total** | **~3 min** | No downtime |

---

## Impact Assessment

### ✅ Positive Impact

1. **Investor Trust**: Real, verified numbers build credibility
2. **Legal Safety**: No misleading claims (SEC compliance)
3. **Realistic Expectations**: Users won't be disappointed
4. **Professionalism**: Shows quant rigor, not marketing fluff
5. **Upside Potential**: 7.5% baseline leaves room to overperform

### ⚠️ Considerations

1. **Lower ROI**: Some visitors may find 7.54% less exciting than 247%
   - **Counter**: Serious investors prefer honesty
   - **Strategy**: Emphasize conservative assumptions, upside potential

2. **Higher Drawdown**: 38.8% DD might scare risk-averse users
   - **Counter**: This is realistic for crypto without leverage
   - **Strategy**: Highlight safety features (circuit breakers, risk limits)

3. **Changed Sharpe**: New metric might confuse some users
   - **Counter**: Standard industry metric, explained in tooltip
   - **Strategy**: Educational hover text included

---

## Communication Strategy

### For Investors/Users

**If asked about the change:**

> "We updated our landing page to show actual backtest results instead of aspirational targets. The 7.54% return is from a conservative 12-month simulation with no leverage and realistic fees. This is our baseline - we see significant upside through strategy optimization, leverage, and bull markets. We prioritize transparency over marketing hype."

### For Team/Stakeholders

**Key Points:**
- ✅ All numbers now traceable to `crypto-ai-bot/out/acquire_annual_snapshot.csv`
- ✅ Fee/slippage model validated against real Kraken data
- ✅ Methodology documented in `ANNUAL_SNAPSHOT_RESULTS_SUMMARY.md`
- ✅ Conservative assumptions clearly stated
- ✅ Legal disclaimers added

---

## Success Metrics (Track These)

### Week 1 Post-Deploy

| Metric | Baseline (Before) | Target (After) | Actual |
|--------|------------------|----------------|--------|
| Bounce Rate | ~60% | <70% | ___ |
| Avg Session | ~45s | >60s | ___ |
| Pricing Page Clicks | ~12% | >10% | ___ |
| Support Tickets | ~5/week | <10/week | ___ |

**Why these matter:**
- Lower bounce = visitors reading more (transparency builds trust)
- Higher session time = engaged, serious visitors
- Pricing clicks = qualified leads (not tire-kickers)
- Support tickets = fewer "this is a scam" inquiries

### Analytics Setup

```javascript
// Google Analytics event
gtag('event', 'kpi_view', {
  roi: '7.54',
  win_rate: '54.5',
  source: 'real_backtest'
});
```

---

## FAQ

### Q: Should we mention this is "backtest" data?

**A**: Yes, we do! Section header says "12-Month Backtest Performance" and disclaimer states "Backtested performance. Past results do not guarantee future returns."

### Q: What if we get better live results?

**A**: Update KpiStrip.tsx quarterly or when live trading starts. See `TRANSPARENCY_UPDATE.md` for live integration code.

### Q: Can we show both backtest AND live data?

**A**: Yes! Add tabs or sections:
- "Backtest Performance" (historical)
- "Live Performance" (current month)

### Q: What about other pages (pricing, about)?

**A**: We updated all pages found. Run this to check for missed ones:

```bash
cd signals-site/web
grep -r "247\|68\.4\|12\.3" --include="*.tsx" --include="*.ts" | grep -v node_modules | grep -v ".next"
```

---

## Next Steps After Deploy

1. **Monitor Vercel Logs**: First 24 hours for any errors
2. **Check Analytics**: Week 1 for user behavior changes
3. **Gather Feedback**: Discord/support tickets
4. **Update Investor Deck**: Use same numbers
5. **Plan Live Integration**: When ready, connect to real API

---

## Contact

**Questions?**
- Technical: See `TRANSPARENCY_UPDATE.md`
- Deployment: Vercel dashboard
- Revert: Git revert or Vercel rollback

**Files Reference:**
- Methodology: `crypto-ai-bot/ANNUAL_SNAPSHOT_RESULTS_SUMMARY.md`
- Raw Data: `crypto-ai-bot/out/acquire_annual_snapshot.csv`
- This Guide: `signals-site/DEPLOY_TRANSPARENCY_UPDATE.md`

---

**Ready to deploy?**

```bash
git push origin main
```

Then watch Vercel deploy at: https://vercel.com/ai-predicted-signals-projects/signals-site

✨ Your site will be transparent, trustworthy, and investor-ready in ~3 minutes!
