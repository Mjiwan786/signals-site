import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-09-30.clover',
      typescript: true,
    });
  }
  return _stripe;
}

// For backwards compatibility
export const stripe = new Proxy({} as Stripe, {
  get: (target, prop) => {
    const client = getStripe();
    return client[prop as keyof Stripe];
  }
});

export const PRICES = {
  STARTER: process.env.STRIPE_PRICE_STARTER ?? '',
  PRO: process.env.STRIPE_PRICE_PRO ?? '',
  TEAM: process.env.STRIPE_PRICE_TEAM ?? '',
  LIFETIME: process.env.STRIPE_PRICE_LIFETIME ?? '',
} as const;

export function assertPrices() {
  const missing = Object.entries(PRICES).filter(([,v]) => !v);
  if (missing.length) {
    throw new Error('Missing Stripe Price IDs: ' + missing.map(([k])=>k).join(', '));
  }
}
