# Stripe Price IDs Configuration

## Updated Files
This document tracks the Stripe Price ID configuration across the codebase.

### Price IDs (USD)
```
STARTER  - $25/mo   → price_1SMSpqBWpRHnRcjnkTPTQDkL
PRO      - $49/mo   → price_1SMStuBWpRHnRcjn9uxdCOfa
TEAM     - $149/mo  → price_1SMSxQBWpRHnRcjn72hbfgTd
LIFETIME - $999     → price_1SMSzJBWpRHnRcjnjzAP77pe
```

### Files Updated

#### 1. `lib/stripe.ts`
- ✅ Already configured to use env vars
- References: `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_TEAM`, `STRIPE_PRICE_LIFETIME`

#### 2. `.env.example`
- ✅ Updated with all 4 price IDs
- ✅ Added Discord role names (`NEXT_PUBLIC_ROLE_*`)
- ✅ Removed deprecated `NEXT_PUBLIC_STRIPE_PRICE_*` vars

#### 3. `.env.local.example`
- ✅ Updated with all 4 price IDs
- ✅ Added Discord role names
- ✅ Removed deprecated `STRIPE_PUBLIC_KEY` var

#### 4. `app/pricing/page.tsx`
- ✅ Displays correct prices: $25, $49, $149, $999
- ✅ Uses correct plan keys: STARTER, PRO, TEAM, LIFETIME
- ✅ References Discord role env vars

#### 5. `app/api/checkout/route.ts`
- ✅ Uses `PRICES` constant from `lib/stripe.ts`
- ✅ Validates plan names
- ✅ Handles subscription vs one-time payment modes

### Environment Variables Required

#### Server-Side (Secret - Never expose to browser)
```bash
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Price IDs
STRIPE_PRICE_STARTER=price_1SMSpqBWpRHnRcjnkTPTQDkL
STRIPE_PRICE_PRO=price_1SMStuBWpRHnRcjn9uxdCOfa
STRIPE_PRICE_TEAM=price_1SMSxQBWpRHnRcjn72hbfgTd
STRIPE_PRICE_LIFETIME=price_1SMSzJBWpRHnRcjnjzAP77pe
```

#### Client-Side (Public - Safe to expose)
```bash
# Discord Role Names (optional, for display)
NEXT_PUBLIC_ROLE_STARTER=Starter Trader
NEXT_PUBLIC_ROLE_PRO=Pro Trader
NEXT_PUBLIC_ROLE_TEAM=Team Leader
NEXT_PUBLIC_ROLE_FOUNDER=Lifetime Elite
```

### Vercel Deployment Checklist

- [ ] Set `STRIPE_SECRET_KEY` in Vercel (Production + Preview)
- [ ] Set `STRIPE_WEBHOOK_SECRET` in Vercel (leave empty for now)
- [ ] Set all 4 `STRIPE_PRICE_*` variables in Vercel
- [ ] Set all 4 `NEXT_PUBLIC_ROLE_*` variables in Vercel
- [ ] Trigger redeploy
- [ ] Test checkout flow at https://aipredictedsignals.cloud/pricing

### Testing Locally

1. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

2. Update with your Stripe test keys

3. Start dev server:
```bash
npm run dev
```

4. Visit http://localhost:3000/pricing

5. Click "Continue with Stripe" buttons to verify redirect

### Stripe Dashboard Verification

- [ ] Verify price IDs exist in Stripe Dashboard → Products
- [ ] Confirm amounts match: $25, $49, $149, $999
- [ ] Check currency is USD
- [ ] Verify STARTER/PRO/TEAM are recurring subscriptions
- [ ] Verify LIFETIME is one-time payment

### Build Status
✅ Build completed successfully
✅ No TypeScript errors
✅ Pricing page: 138 B (static)
✅ Checkout API: 0 B (dynamic)

---
Last Updated: 2025-10-27
