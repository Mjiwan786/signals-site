# 🔐 Stripe Setup Guide - Create Products & Prices

**Time Required:** 10-15 minutes

This guide will help you create the necessary Stripe products and prices for the new pricing page.

---

## Step 1: Access Stripe Dashboard

1. Go to: https://dashboard.stripe.com/test/products
2. Make sure you're in **TEST MODE** (toggle in top-right corner)

---

## Step 2: Create Products

You need to create **4 products** with **7 total prices**:

### Product 1: Starter Plan

**Create Product:**
1. Click **"+ Add product"**
2. Name: `Starter Plan`
3. Description: `Perfect for individual traders`
4. Click **"Add pricing"**

**Create Monthly Price:**
- Price: `$49`
- Billing period: `Monthly`
- Click **"Add pricing"**
- **Copy the Price ID** (looks like `price_xxxxxxxxxxxxx`)
- Paste it in your `.env.local` for both:
  - `STRIPE_PRICE_STARTER_MONTHLY=`
  - `NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY=`

**Create Annual Price:**
1. Click **"Add another price"**
2. Price: `$490` (15% discount from $588)
3. Billing period: `Yearly`
4. Click **"Add pricing"**
5. **Copy the Price ID**
6. Paste it in your `.env.local` for both:
   - `STRIPE_PRICE_STARTER_ANNUAL=`
   - `NEXT_PUBLIC_STRIPE_PRICE_STARTER_ANNUAL=`

---

### Product 2: Pro Plan

**Create Product:**
1. Click **"+ Add product"**
2. Name: `Pro Plan`
3. Description: `Most popular for serious traders`

**Create Monthly Price:**
- Price: `$99`
- Billing period: `Monthly`
- **Copy the Price ID** and update:
  - `STRIPE_PRICE_PRO_MONTHLY=`
  - `NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY=`

**Create Annual Price:**
- Price: `$990` (17% discount from $1,188)
- Billing period: `Yearly`
- **Copy the Price ID** and update:
  - `STRIPE_PRICE_PRO_ANNUAL=`
  - `NEXT_PUBLIC_STRIPE_PRICE_PRO_ANNUAL=`

---

### Product 3: Team Plan

**Create Product:**
1. Click **"+ Add product"**
2. Name: `Team Plan`
3. Description: `For trading teams and firms`

**Create Monthly Price:**
- Price: `$299`
- Billing period: `Monthly`
- **Copy the Price ID** and update:
  - `STRIPE_PRICE_TEAM_MONTHLY=`
  - `NEXT_PUBLIC_STRIPE_PRICE_TEAM_MONTHLY=`

**Create Annual Price:**
- Price: `$2,990` (17% discount from $3,588)
- Billing period: `Yearly`
- **Copy the Price ID** and update:
  - `STRIPE_PRICE_TEAM_ANNUAL=`
  - `NEXT_PUBLIC_STRIPE_PRICE_TEAM_ANNUAL=`

---

### Product 4: Lifetime Access

**Create Product:**
1. Click **"+ Add product"**
2. Name: `Lifetime Access`
3. Description: `One-time payment, forever access`

**Create One-Time Price:**
- Price: `$1,999`
- Billing period: `One time` (select this!)
- **Copy the Price ID** and update:
  - `NEXT_PUBLIC_STRIPE_PRICE_LIFETIME=`

**Note:** You already have this as `price_1SMSzJBWpRHnRcjnjzAP77pe`

---

## Step 3: Get Your API Keys

**Get Secret Key:**
1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy **Secret key** (starts with `sk_test_`)
3. Update in `.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
   ```

**Get Publishable Key:**
1. On the same page, copy **Publishable key** (starts with `pk_test_`)
2. Update in `.env.local`:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
   ```

---

## Step 4: Verify Your .env.local File

Your `.env.local` should now look like this:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY

# Monthly Prices
STRIPE_PRICE_STARTER_MONTHLY=price_YOUR_ACTUAL_ID
STRIPE_PRICE_PRO_MONTHLY=price_YOUR_ACTUAL_ID
STRIPE_PRICE_TEAM_MONTHLY=price_YOUR_ACTUAL_ID

# Annual Prices
STRIPE_PRICE_STARTER_ANNUAL=price_YOUR_ACTUAL_ID
STRIPE_PRICE_PRO_ANNUAL=price_YOUR_ACTUAL_ID
STRIPE_PRICE_TEAM_ANNUAL=price_YOUR_ACTUAL_ID

# Public Prices (same IDs, exposed to frontend)
NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY=price_YOUR_ACTUAL_ID
NEXT_PUBLIC_STRIPE_PRICE_STARTER_ANNUAL=price_YOUR_ACTUAL_ID
NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY=price_YOUR_ACTUAL_ID
NEXT_PUBLIC_STRIPE_PRICE_PRO_ANNUAL=price_YOUR_ACTUAL_ID
NEXT_PUBLIC_STRIPE_PRICE_TEAM_MONTHLY=price_YOUR_ACTUAL_ID
NEXT_PUBLIC_STRIPE_PRICE_TEAM_ANNUAL=price_YOUR_ACTUAL_ID
NEXT_PUBLIC_STRIPE_PRICE_LIFETIME=price_YOUR_ACTUAL_ID
```

---

## Step 5: Enable Customer Portal

For subscription management to work:

1. Go to: https://dashboard.stripe.com/test/settings/billing/portal
2. Click **"Activate test link"**
3. Configure allowed actions:
   - ✅ Update payment method
   - ✅ Cancel subscriptions
4. Click **"Save changes"**

---

## Quick Summary

**Products to Create:**
- ✅ Starter Plan ($49/mo, $490/yr)
- ✅ Pro Plan ($99/mo, $990/yr)
- ✅ Team Plan ($299/mo, $2,990/yr)
- ✅ Lifetime ($1,999 one-time)

**Price IDs Needed:** 7 total
- 2 for Starter (monthly + annual)
- 2 for Pro (monthly + annual)
- 2 for Team (monthly + annual)
- 1 for Lifetime (one-time)

**After Setup:**
- Test the pricing page: http://localhost:3000/pricing
- Click "Get Started" to verify Stripe checkout opens

---

## Troubleshooting

**Issue:** "Missing Stripe Price IDs" error
- **Fix:** Check all price IDs are copied correctly to `.env.local`

**Issue:** Checkout doesn't open
- **Fix:** Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set

**Issue:** "Invalid price ID" error
- **Fix:** Make sure you're using TEST mode price IDs in TEST environment

---

**Next Step:** After completing this, run: `npm run dev` and test the pricing page!
