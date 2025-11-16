# Stripe Checkout Integration - Setup Guide

## Overview

The signals-site has a **fully implemented Stripe checkout system** that enables users to purchase subscription tiers (Starter, Pro, Team) and a one-time lifetime access tier. This guide explains how to configure and test the Stripe integration.

## Architecture

### Components

1. **Checkout API Route** (`/app/api/checkout/route.ts`)
   - Creates Stripe Checkout sessions
   - Handles both subscription and one-time payment modes
   - Returns checkout URL for client-side redirect

2. **Pricing Page** (`/app/pricing/page.tsx`)
   - Displays pricing tiers with features
   - Uses Next.js Server Actions for checkout flow
   - Handles success/cancel redirects

3. **Webhook Handler** (`/app/api/webhooks/stripe/route.ts`)
   - Receives and validates Stripe events
   - Handles subscription lifecycle (created, updated, deleted)
   - TODO: Database integration for user management
   - TODO: Discord role assignment

4. **Stripe Client** (`/lib/stripe.ts`)
   - Initializes Stripe SDK with API version 2025-09-30.clover
   - Manages price ID configuration
   - Validates environment variables

### Pricing Tiers

| Tier     | Price      | Mode         | Features                                    |
|----------|------------|--------------|---------------------------------------------|
| Starter  | $25/month  | subscription | Basic signals, 1 user                       |
| Pro      | $49/month  | subscription | Advanced signals, priority support          |
| Team     | $149/month | subscription | Multi-user access, team dashboard           |
| Lifetime | $999       | payment      | One-time payment, lifetime access, all features |

## Setup Instructions

### 1. Get Stripe API Keys

**Test Mode (Development):**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Click "Test mode" toggle (top right)
3. Copy your **Publishable key** (starts with `pk_test_`)
4. Click "Reveal test key" for **Secret key** (starts with `sk_test_`)

**Live Mode (Production):**
1. Complete Stripe account activation
2. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
3. Switch to "Live mode"
4. Copy **Publishable key** (`pk_live_`) and **Secret key** (`sk_live_`)

### 2. Create Products and Prices

**In Stripe Dashboard:**

1. Navigate to [Products](https://dashboard.stripe.com/test/products)
2. Click "+ Add product"

**Create these 4 products:**

#### Product 1: Starter
- **Name**: Starter Plan
- **Description**: Basic trading signals for individual traders
- **Pricing**: Recurring, $25/month
- **Copy Price ID** (e.g., `price_1SMSpqBWpRHnRcjnkTPTQDkL`)

#### Product 2: Pro
- **Name**: Pro Plan
- **Description**: Advanced signals with priority support
- **Pricing**: Recurring, $49/month
- **Copy Price ID** (e.g., `price_1SMStuBWpRHnRcjn9uxdCOfa`)

#### Product 3: Team
- **Name**: Team Plan
- **Description**: Multi-user access with team features
- **Pricing**: Recurring, $149/month
- **Copy Price ID** (e.g., `price_1SMSxQBWpRHnRcjn72hbfgTd`)

#### Product 4: Lifetime
- **Name**: Lifetime Access
- **Description**: One-time payment for unlimited lifetime access
- **Pricing**: One time, $999
- **Copy Price ID** (e.g., `price_1SMSzJBWpRHnRcjnjzAP77pe`)

### 3. Configure Environment Variables

**For Local Development:**

Edit `C:\Users\Maith\OneDrive\Desktop\signals-site\web\.env.local`:

```bash
# Stripe Configuration (TEST MODE)
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_TEST_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# Stripe Price IDs (TEST MODE)
STRIPE_PRICE_STARTER=price_YOUR_STARTER_PRICE_ID
STRIPE_PRICE_PRO=price_YOUR_PRO_PRICE_ID
STRIPE_PRICE_TEAM=price_YOUR_TEAM_PRICE_ID
STRIPE_PRICE_LIFETIME=price_YOUR_LIFETIME_PRICE_ID

# Discord Role Names (optional)
NEXT_PUBLIC_ROLE_STARTER=Starter Trader
NEXT_PUBLIC_ROLE_PRO=Pro Trader
NEXT_PUBLIC_ROLE_TEAM=Team Leader
NEXT_PUBLIC_ROLE_FOUNDER=Lifetime Elite
```

**For Production (Vercel):**

1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your project: `signals-site`
3. Go to **Settings** → **Environment Variables**
4. Add the following variables with **Production** scope:

```bash
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_PRODUCTION_WEBHOOK_SECRET
STRIPE_PRICE_STARTER=price_YOUR_LIVE_STARTER_ID
STRIPE_PRICE_PRO=price_YOUR_LIVE_PRO_ID
STRIPE_PRICE_TEAM=price_YOUR_LIVE_TEAM_ID
STRIPE_PRICE_LIFETIME=price_YOUR_LIVE_LIFETIME_ID
```

### 4. Configure Webhook Endpoint

**Development (Using Stripe CLI):**

1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Authenticate: `stripe login`
3. Forward webhooks to local dev server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. Copy the webhook signing secret (starts with `whsec_`)
5. Add to `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_SIGNING_SECRET
   ```

**Production (Vercel):**

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "+ Add endpoint"
3. **Endpoint URL**: `https://aipredictedsignals.cloud/api/webhooks/stripe`
4. **Events to send**: Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click "Add endpoint"
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

## Testing the Integration

### Manual Test Flow (Development)

1. **Start Development Server:**
   ```bash
   cd C:\Users\Maith\OneDrive\Desktop\signals-site\web
   npm run dev
   ```

2. **Start Stripe Webhook Forwarding (separate terminal):**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

3. **Navigate to Pricing Page:**
   - Open browser: `http://localhost:3000/pricing`
   - You should see 4 pricing tiers

4. **Test Checkout Flow:**
   - Click "Subscribe Now" or "Get Started" on any tier
   - You should be redirected to Stripe Checkout
   - **Test Card Number**: `4242 4242 4242 4242`
   - **Expiry**: Any future date (e.g., `12/34`)
   - **CVC**: Any 3 digits (e.g., `123`)
   - **Email**: Any email address

5. **Complete Payment:**
   - Click "Subscribe" or "Pay"
   - You should be redirected back to: `http://localhost:3000/pricing?status=success`

6. **Verify Webhook Events:**
   - Check the terminal running `stripe listen`
   - You should see events like:
     ```
     checkout.session.completed
     customer.subscription.created (for subscriptions)
     invoice.payment_succeeded
     ```

7. **Check Stripe Dashboard:**
   - Go to [Stripe Dashboard > Payments](https://dashboard.stripe.com/test/payments)
   - Verify the test payment appears

### Testing Different Scenarios

**Test Subscription (Starter/Pro/Team):**
- Checkout creates a recurring subscription
- Customer is charged monthly
- Webhook receives `customer.subscription.created`

**Test One-Time Payment (Lifetime):**
- Checkout creates a one-time payment
- Customer is charged once
- Webhook receives `checkout.session.completed` (no subscription)

**Test Cancellation:**
- Click "Back" on Stripe Checkout page
- Should redirect to: `http://localhost:3000/pricing?status=cancel`

**Test Failed Payment:**
- Use test card: `4000 0000 0000 0341`
- Payment should be declined
- Check error handling

### Webhook Verification

**Check Webhook Logs:**

In your development terminal, you should see:
```
[POST] /api/webhooks/stripe
→ Received Stripe event: checkout.session.completed
→ Processing checkout session: cs_test_...
→ TODO: Create user record in database
→ TODO: Assign Discord role
```

**Current Implementation Status:**

The webhook handler is **fully implemented** but has TODOs for:
- ✅ Signature verification (DONE)
- ✅ Event parsing (DONE)
- ✅ Event type handling (DONE)
- ⏳ Database user creation (TODO - stubbed)
- ⏳ Discord role assignment (TODO - stubbed)

## Code Reference

### Creating Checkout Session

File: `app/api/checkout/route.ts:1`

```typescript
export async function POST(req: NextRequest) {
  const { plan } = await req.json();
  const price = PRICES[plan as keyof typeof PRICES];

  const session = await stripe.checkout.sessions.create({
    mode: plan === 'LIFETIME' ? 'payment' : 'subscription',
    line_items: [{ price, quantity: 1 }],
    success_url: `${origin}/pricing?status=success`,
    cancel_url: `${origin}/pricing?status=cancel`,
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    automatic_tax: { enabled: true },
  });

  return NextResponse.json({ url: session.url });
}
```

### Pricing Page Integration

File: `app/pricing/page.tsx:1`

```typescript
const TIERS = [
  { key: 'STARTER', name: 'Starter', price: '$25 / mo' },
  { key: 'PRO', name: 'Pro', price: '$49 / mo' },
  { key: 'TEAM', name: 'Team', price: '$149 / mo' },
  { key: 'LIFETIME', name: 'Lifetime', price: '$999 once' },
];

// Server Action for checkout
async function createCheckout(plan: string) {
  'use server';
  const res = await fetch('/api/checkout', {
    method: 'POST',
    body: JSON.stringify({ plan }),
  });
  const { url } = await res.json();
  return url;
}
```

### Webhook Event Handling

File: `app/api/webhooks/stripe/route.ts:1`

```typescript
export async function POST(request: NextRequest) {
  // Verify webhook signature
  const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);

  switch (event.type) {
    case 'checkout.session.completed':
      // TODO: Create user in database
      // TODO: Assign Discord role based on tier
      break;

    case 'customer.subscription.updated':
      // TODO: Update user tier
      break;

    case 'customer.subscription.deleted':
      // TODO: Revoke access
      break;
  }
}
```

## Troubleshooting

### Error: "STRIPE_SECRET_KEY is not configured"

**Cause**: Environment variable not set or not loaded

**Fix**:
1. Check `.env.local` file exists
2. Verify `STRIPE_SECRET_KEY=sk_test_...` is set
3. Restart dev server: `npm run dev`

### Error: "Invalid API Key"

**Cause**: Using wrong key mode (test vs live)

**Fix**:
- Development: Use `sk_test_...` keys
- Production: Use `sk_live_...` keys
- Ensure price IDs match the key mode

### Error: "No such price: price_xxxxx"

**Cause**: Price ID doesn't exist in Stripe account

**Fix**:
1. Go to [Stripe Products](https://dashboard.stripe.com/test/products)
2. Click on a product
3. Copy the **Price ID** (not Product ID)
4. Update `.env.local` with correct price IDs

### Webhook Events Not Received

**Cause**: Webhook forwarding not running or wrong URL

**Fix**:
1. Check `stripe listen` is running in separate terminal
2. Verify forwarding URL matches: `localhost:3000/api/webhooks/stripe`
3. Check webhook signing secret in `.env.local`

### Checkout Redirects to Wrong URL

**Cause**: Origin header or success_url misconfigured

**Fix**:
1. Check `success_url` in `app/api/checkout/route.ts`
2. Verify `origin` is set correctly (should be request origin)
3. For production, ensure domain matches Vercel deployment

## Next Steps (TODOs)

### 1. Database Integration

Add user management to webhook handler:

```typescript
// In app/api/webhooks/stripe/route.ts
case 'checkout.session.completed':
  const session = event.data.object;
  const customerEmail = session.customer_email;
  const customerId = session.customer;

  // Create user in database
  await db.user.create({
    email: customerEmail,
    stripeCustomerId: customerId,
    tier: getTierFromPriceId(session.line_items.data[0].price.id),
  });
  break;
```

### 2. Discord Role Assignment

Add Discord bot integration:

```typescript
// In app/api/webhooks/stripe/route.ts
case 'checkout.session.completed':
  const tier = getTierFromPriceId(session.line_items.data[0].price.id);
  const discordRoleId = ROLE_IDS[tier]; // Map tier to role ID

  // Assign Discord role via bot API
  await assignDiscordRole(user.discordId, discordRoleId);
  break;
```

### 3. User Dashboard

Create authenticated user dashboard:
- View subscription status
- Manage billing (Stripe Customer Portal)
- Access Discord server
- Download signals data

## Security Considerations

### Environment Variables

- ✅ **NEVER** commit `.env.local` to git (already in `.gitignore`)
- ✅ **NEVER** expose `STRIPE_SECRET_KEY` to client-side code
- ✅ **ALWAYS** use `NEXT_PUBLIC_*` prefix for client-side variables
- ✅ **ALWAYS** verify webhook signatures (already implemented)

### Webhook Security

- ✅ Signature verification prevents unauthorized event injection
- ✅ Use HTTPS in production (Vercel provides this)
- ✅ Keep `STRIPE_WEBHOOK_SECRET` secure

### Test vs Live Mode

- ✅ Use separate Stripe accounts for test/live (optional but recommended)
- ✅ Never use live keys in development
- ✅ Test thoroughly before switching to live mode

## Support

**Stripe Documentation:**
- [Checkout Overview](https://stripe.com/docs/payments/checkout)
- [Webhooks Guide](https://stripe.com/docs/webhooks)
- [Testing](https://stripe.com/docs/testing)

**Stripe Dashboard:**
- [Test Mode Dashboard](https://dashboard.stripe.com/test)
- [Live Mode Dashboard](https://dashboard.stripe.com)

**Contact:**
- For implementation questions, check the code comments in:
  - `app/api/checkout/route.ts`
  - `app/api/webhooks/stripe/route.ts`
  - `lib/stripe.ts`

---

**Last Updated**: 2025-11-16
**Stripe SDK Version**: 19.1.0
**Stripe API Version**: 2025-09-30.clover
**Implementation Status**: ✅ Checkout Working | ⏳ Database Integration Pending
