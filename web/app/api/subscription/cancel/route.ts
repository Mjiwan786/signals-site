/**
 * Cancel Subscription API Route
 * Cancels the user's subscription at the end of the billing period
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

    // Get active subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
    }

    const subscription = subscriptions.data[0];

    // Cancel at period end (don't cancel immediately)
    await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
    });

    return NextResponse.json({ success: true, message: 'Subscription will cancel at period end' });
  } catch (err: any) {
    console.error('Cancel subscription error:', err);
    return NextResponse.json(
      { error: err?.message ?? 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}
