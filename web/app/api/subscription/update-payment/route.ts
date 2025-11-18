/**
 * Update Payment Method API Route
 * Creates a Stripe billing portal session for updating payment methods
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find customer by email
    const customers = await stripe.customers.list({
      email: session.user.email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json({ error: 'No customer found' }, { status: 404 });
    }

    const customer = customers.data[0];

    // Create billing portal session
    const origin = req.headers.get('origin') ?? 'https://aipredictedsignals.cloud';
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${origin}/subscription`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err: any) {
    console.error('Update payment method error:', err);
    return NextResponse.json(
      { error: err?.message ?? 'Failed to create billing portal session' },
      { status: 500 }
    );
  }
}
