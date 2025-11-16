# Stripe Checkout - Manual Test Flow

## Quick Start

This is a **step-by-step guide** for testing the Stripe checkout integration in development mode.

## Prerequisites

- [ ] Node.js installed (v18+)
- [ ] Stripe CLI installed ([download here](https://stripe.com/docs/stripe-cli))
- [ ] Stripe test account created ([sign up here](https://dashboard.stripe.com/register))
- [ ] Environment variables configured in `.env.local`

## Step 1: Configure Stripe Test Keys

### Get Your Test API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Ensure "Test mode" toggle is ON (top right)
3. Copy **Secret key** (click "Reveal test key")

### Create Test Products

1. Go to [Products](https://dashboard.stripe.com/test/products)
2. Create 4 products:

| Product       | Price      | Type      |
|---------------|------------|-----------|
| Starter Plan  | $25/month  | Recurring |
| Pro Plan      | $49/month  | Recurring |
| Team Plan     | $149/month | Recurring |
| Lifetime Access | $999     | One-time  |

3. Copy each **Price ID** (starts with `price_`)

### Update Environment Variables

Edit `C:\Users\Maith\OneDrive\Desktop\signals-site\web\.env.local`:

```bash
# Replace with your actual Stripe test keys
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# Replace with your actual price IDs
STRIPE_PRICE_STARTER=price_YOUR_STARTER_ID
STRIPE_PRICE_PRO=price_YOUR_PRO_ID
STRIPE_PRICE_TEAM=price_YOUR_TEAM_ID
STRIPE_PRICE_LIFETIME=price_YOUR_LIFETIME_ID
```

## Step 2: Start Development Server

### Terminal 1: Start Next.js Dev Server

```bash
cd C:\Users\Maith\OneDrive\Desktop\signals-site\web
npm run dev
```

**Expected Output:**
```
  ▲ Next.js 14.2.10
  - Local:        http://localhost:3000
  - Ready in 2.5s
```

### Terminal 2: Start Stripe Webhook Listener

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Expected Output:**
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

**Copy the webhook secret** and add to `.env.local`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

**Restart dev server** (Terminal 1) after updating `.env.local`:
```bash
# Press Ctrl+C, then:
npm run dev
```

## Step 3: Test Checkout Flow

### Navigate to Pricing Page

1. Open browser: `http://localhost:3000/pricing`
2. You should see 4 pricing tiers:
   - Starter ($25/mo)
   - Pro ($49/mo)
   - Team ($149/mo)
   - Lifetime ($999)

### Test Subscription Purchase (Starter Tier)

1. **Click** "Subscribe Now" button on **Starter** tier
2. **Verify** redirect to Stripe Checkout page (URL: `checkout.stripe.com/...`)
3. **Fill out** checkout form:
   - **Email**: `test@example.com`
   - **Card Number**: `4242 4242 4242 4242` (Stripe test card)
   - **Expiry**: `12/34` (any future date)
   - **CVC**: `123` (any 3 digits)
   - **Name**: `Test User`
   - **Country**: `United States`
4. **Click** "Subscribe" button
5. **Verify** redirect to: `http://localhost:3000/pricing?status=success`

### Check Webhook Events (Terminal 2)

You should see events logged:

```
checkout.session.completed [evt_xxxxx]
customer.subscription.created [evt_xxxxx]
invoice.payment_succeeded [evt_xxxxx]
```

### Verify in Stripe Dashboard

1. Go to [Payments](https://dashboard.stripe.com/test/payments)
2. Find your test payment (should show $25.00)
3. Click to view details
4. Verify customer email and subscription status

## Step 4: Test Other Scenarios

### Test One-Time Payment (Lifetime Tier)

1. Click "Get Started" on **Lifetime** tier
2. Use test card: `4242 4242 4242 4242`
3. Complete checkout
4. **Expected**: One-time charge of $999 (no subscription created)
5. **Webhook events**: `checkout.session.completed`, `payment_intent.succeeded`

### Test Cancellation

1. Click any "Subscribe Now" button
2. On Stripe Checkout page, click **Back arrow** (top left)
3. **Verify** redirect to: `http://localhost:3000/pricing?status=cancel`

### Test Declined Payment

1. Click "Subscribe Now" on any tier
2. Use test card: `4000 0000 0000 0341` (decline card)
3. Complete form and submit
4. **Expected**: Error message "Your card was declined"
5. **Verify**: No payment created in dashboard

### Test 3D Secure Authentication

1. Click "Subscribe Now" on any tier
2. Use test card: `4000 0025 0000 3155` (requires 3DS)
3. Complete form and submit
4. **Expected**: 3D Secure modal appears
5. Click "Complete authentication"
6. **Verify**: Payment succeeds

## Step 5: Verify Implementation

### Check API Route Logs (Terminal 1)

Look for these log messages:

```
[POST] /api/checkout
→ Creating checkout session for plan: STARTER
→ Session created: cs_test_xxxxx

[POST] /api/webhooks/stripe
→ Received Stripe event: checkout.session.completed
→ TODO: Create user record in database
→ TODO: Assign Discord role
```

### Check Browser Network Tab

1. Open DevTools → Network tab
2. Click "Subscribe Now" button
3. Find **POST** request to `/api/checkout`
4. **Verify response**:
   ```json
   {
     "url": "https://checkout.stripe.com/c/pay/cs_test_xxxxx..."
   }
   ```

### Check Environment Variables Loaded

Add this temporary log to `lib/stripe.ts`:

```typescript
export function getStripe(): Stripe {
  console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY?.slice(0, 7) + '...');
  // ... rest of function
}
```

**Expected output** in Terminal 1:
```
STRIPE_SECRET_KEY: sk_test...
```

## Test Results Checklist

- [ ] Pricing page loads with 4 tiers
- [ ] Clicking "Subscribe Now" redirects to Stripe Checkout
- [ ] Checkout form accepts test card `4242 4242 4242 4242`
- [ ] Payment succeeds and redirects to success page
- [ ] Webhook events appear in Terminal 2
- [ ] Payment appears in Stripe Dashboard
- [ ] Cancellation redirects to cancel page
- [ ] Declined card shows error message
- [ ] Lifetime tier creates one-time payment (not subscription)

## Troubleshooting

### Issue: "STRIPE_SECRET_KEY is not configured"

**Solution:**
1. Check `.env.local` has `STRIPE_SECRET_KEY=sk_test_...`
2. Restart dev server
3. Verify file is in correct directory: `signals-site/web/.env.local`

### Issue: "No such price: price_xxxxx"

**Solution:**
1. Verify price IDs in Stripe Dashboard match `.env.local`
2. Ensure using **Test mode** price IDs for test keys
3. Copy price IDs from product detail pages, not product IDs

### Issue: Webhook events not showing

**Solution:**
1. Verify `stripe listen` is running in Terminal 2
2. Check forwarding URL: `localhost:3000/api/webhooks/stripe`
3. Update `STRIPE_WEBHOOK_SECRET` in `.env.local`
4. Restart dev server after updating secret

### Issue: Redirect to wrong success URL

**Solution:**
1. Check browser console for errors
2. Verify `origin` header in checkout API route
3. Clear browser cache and try again

### Issue: Checkout page shows "Invalid session"

**Solution:**
1. Session expired (valid for 24 hours)
2. Click "Subscribe Now" again to create new session
3. Check Stripe API logs for errors

## Production Deployment Checklist

Before deploying to production:

- [ ] Switch to **Live mode** in Stripe Dashboard
- [ ] Create live products and get live price IDs
- [ ] Update Vercel environment variables with `sk_live_` keys
- [ ] Configure production webhook endpoint: `https://aipredictedsignals.cloud/api/webhooks/stripe`
- [ ] Test with real card (or use Stripe test mode first)
- [ ] Enable automatic tax collection
- [ ] Set up customer email receipts in Stripe settings
- [ ] Implement database user creation (remove TODOs)
- [ ] Implement Discord role assignment (remove TODOs)
- [ ] Add subscription management dashboard
- [ ] Configure Stripe Customer Portal for self-service billing

## Common Test Cards

| Card Number         | Scenario                    |
|--------------------|-----------------------------|
| 4242 4242 4242 4242 | Success                     |
| 4000 0000 0000 0341 | Declined                    |
| 4000 0025 0000 3155 | 3D Secure required          |
| 4000 0000 0000 9995 | Insufficient funds          |
| 4000 0000 0000 0069 | Expired card                |

**Full list**: [Stripe Test Cards](https://stripe.com/docs/testing#cards)

## Next Steps

After successful testing:

1. **Implement Database Integration**
   - Create user records on successful checkout
   - Store Stripe customer ID and subscription ID
   - Track subscription status

2. **Implement Discord Integration**
   - Assign roles based on tier purchased
   - Update roles on subscription changes
   - Remove roles on cancellation

3. **Add User Dashboard**
   - Display subscription status
   - Link to Stripe Customer Portal
   - Show billing history

4. **Deploy to Production**
   - Follow production deployment checklist above
   - Test thoroughly in production before announcing

---

**Last Updated**: 2025-11-16
**Status**: ✅ Checkout Functional | ⏳ Database/Discord Integration Pending
