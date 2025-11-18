import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRICES, assertPrices } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { plan, priceId } = body;

    // Support both legacy plan names and new priceId parameter
    let price: string;
    let mode: 'payment' | 'subscription' = 'subscription';

    if (priceId) {
      // New flow: use priceId directly
      price = priceId;
      // Determine mode based on price ID (lifetime prices typically have 'lifetime' in them)
      mode = priceId.includes('lifetime') ? 'payment' : 'subscription';
    } else if (plan) {
      // Legacy flow: use plan name
      if (!['STARTER','PRO','TEAM','LIFETIME'].includes(plan)) {
        return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
      }
      assertPrices();
      price = PRICES[plan as keyof typeof PRICES];
      mode = plan === 'LIFETIME' ? 'payment' : 'subscription';
    } else {
      return NextResponse.json({ error: 'Missing plan or priceId' }, { status: 400 });
    }

    if (!price) {
      return NextResponse.json({ error: 'Invalid price ID' }, { status: 400 });
    }

    const origin = req.headers.get('origin') ?? 'https://aipredictedsignals.cloud';
    const session = await stripe.checkout.sessions.create({
      mode,
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
