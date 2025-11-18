/**
 * Reactivate Subscription API Route
 * Reactivates a subscription that was set to cancel
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

    // Get subscription (including those set to cancel)
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
    }

    const subscription = subscriptions.data[0];

    if (!subscription.cancel_at_period_end) {
      return NextResponse.json({ error: 'Subscription is not set to cancel' }, { status: 400 });
    }

    // Reactivate by removing cancel_at_period_end
    await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: false,
    });

    return NextResponse.json({ success: true, message: 'Subscription reactivated' });
  } catch (err: any) {
    console.error('Reactivate subscription error:', err);
    return NextResponse.json(
      { error: err?.message ?? 'Failed to reactivate subscription' },
      { status: 500 }
    );
  }
}
