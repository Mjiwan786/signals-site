/**
 * Subscription Management API Route
 * Fetches user's subscription details, payment methods, and invoice history
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { stripe } from '@/lib/stripe';

export async function GET(req: NextRequest) {
  try {
    // Get authenticated user session
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In a real implementation, you would:
    // 1. Look up the user's Stripe customer ID from your database
    // 2. Fetch their subscription from Stripe
    // For now, we'll return mock data for testing

    // Mock implementation - replace with real data
    const customerEmail = session.user.email;

    if (!customerEmail) {
      return NextResponse.json({ error: 'No email found' }, { status: 400 });
    }

    // Search for customer by email
    const customers = await stripe.customers.list({
      email: customerEmail,
      limit: 1,
    });

    if (customers.data.length === 0) {
      // No subscription found
      return NextResponse.json({
        subscription: null,
        invoices: [],
        paymentMethods: [],
      });
    }

    const customer = customers.data[0];

    // Get subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'all',
      limit: 1,
    });

    let subscriptionData = null;
    if (subscriptions.data.length > 0) {
      const sub = subscriptions.data[0];
      subscriptionData = {
        id: sub.id,
        plan: sub.items.data[0]?.price.nickname || 'Unknown Plan',
        status: sub.status,
        currentPeriodEnd: new Date((sub.current_period_end as number) * 1000).toISOString(),
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        amount: sub.items.data[0]?.price.unit_amount || 0,
        interval: (sub.items.data[0]?.price.recurring?.interval as 'month' | 'year') || 'month',
      };
    }

    // Get payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer.id,
      type: 'card',
    });

    const paymentMethodsData = paymentMethods.data.map((pm) => ({
      id: pm.id,
      brand: pm.card?.brand || 'unknown',
      last4: pm.card?.last4 || '****',
      expMonth: pm.card?.exp_month || 0,
      expYear: pm.card?.exp_year || 0,
      isDefault: pm.id === customer.invoice_settings.default_payment_method,
    }));

    // Get invoices
    const invoices = await stripe.invoices.list({
      customer: customer.id,
      limit: 10,
    });

    const invoicesData = invoices.data.map((invoice) => ({
      id: invoice.id,
      date: new Date(invoice.created * 1000).toISOString(),
      amount: invoice.amount_paid,
      status: invoice.status === 'paid' ? 'paid' : invoice.status === 'open' ? 'pending' : 'failed',
      invoiceUrl: invoice.hosted_invoice_url || '',
      pdfUrl: invoice.invoice_pdf || '',
    }));

    return NextResponse.json({
      subscription: subscriptionData,
      invoices: invoicesData,
      paymentMethods: paymentMethodsData,
    });
  } catch (err: any) {
    console.error('Subscription fetch error:', err);
    return NextResponse.json(
      { error: err?.message ?? 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}
