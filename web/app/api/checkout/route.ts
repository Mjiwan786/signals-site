import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRICES, assertPrices } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json();
    if (!['STARTER','PRO','TEAM','LIFETIME'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }
    assertPrices();

    const price = PRICES[plan as keyof typeof PRICES];

    const origin = req.headers.get('origin') ?? 'https://aipredictedsignals.cloud';
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
  } catch (err:any) {
    return NextResponse.json({ error: err?.message ?? 'checkout_failed' }, { status: 500 });
  }
}
