/**
 * Stripe Webhook Handler
 * Processes Stripe events with signature verification
 * POST /api/webhooks/stripe
 *
 * Events handled:
 * - checkout.session.completed (subscription created)
 * - customer.subscription.updated (tier change)
 * - customer.subscription.deleted (cancellation)
 * - invoice.payment_succeeded (renewal)
 * - invoice.payment_failed (payment issue)
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe client
function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-09-30.clover',
    typescript: true,
  });
}

// Log event helper
function logEvent(event: Stripe.Event, message: string, data?: Record<string, unknown>) {
  console.log(`[Stripe Webhook] ${event.type} | ${message}`, {
    eventId: event.id,
    timestamp: new Date(event.created * 1000).toISOString(),
    ...data,
  });
}

export async function POST(request: NextRequest) {
  const stripe = getStripeClient();

  // Verify webhook secret is configured
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!endpointSecret) {
    console.error('❌ STRIPE_WEBHOOK_SECRET is not configured');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  // Get raw body and signature
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('❌ No Stripe signature found in request headers');
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  // Verify webhook signature
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    logEvent(event, '✅ Signature verified');
  } catch (error) {
    console.error('❌ Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      // Checkout session completed (new subscription)
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        logEvent(event, 'Checkout completed', {
          sessionId: session.id,
          customerId: session.customer,
          subscriptionId: session.subscription,
          tierId: session.metadata?.tierId,
        });

        // TODO: Create user record in database
        // TODO: Assign Discord role based on tier
        // TODO: Send welcome email

        break;
      }

      // Subscription created
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        logEvent(event, 'Subscription created', {
          subscriptionId: subscription.id,
          customerId: subscription.customer,
          status: subscription.status,
          tier: subscription.metadata?.tier,
        });

        // TODO: Update user subscription status
        // TODO: Grant access to premium features

        break;
      }

      // Subscription updated (tier change, renewal)
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        logEvent(event, 'Subscription updated', {
          subscriptionId: subscription.id,
          customerId: subscription.customer,
          status: subscription.status,
          tier: subscription.metadata?.tier,
        });

        // TODO: Update user tier in database
        // TODO: Update Discord role if tier changed

        break;
      }

      // Subscription deleted (cancellation)
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        logEvent(event, 'Subscription canceled', {
          subscriptionId: subscription.id,
          customerId: subscription.customer,
          canceledAt: subscription.canceled_at,
        });

        // TODO: Revoke premium access
        // TODO: Remove Discord role
        // TODO: Send cancellation confirmation email

        break;
      }

      // Invoice payment succeeded (renewal successful)
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        logEvent(event, 'Payment succeeded', {
          invoiceId: invoice.id,
          customerId: invoice.customer,
          amount: invoice.amount_paid,
        });

        // TODO: Extend subscription period
        // TODO: Send receipt email

        break;
      }

      // Invoice payment failed
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        logEvent(event, 'Payment failed', {
          invoiceId: invoice.id,
          customerId: invoice.customer,
          amount: invoice.amount_due,
        });

        // TODO: Notify user of failed payment
        // TODO: Grace period before revoking access

        break;
      }

      // Payment intent succeeded
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logEvent(event, 'Payment intent succeeded', {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
        });

        // TODO: Confirm payment received

        break;
      }

      // Payment intent failed
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logEvent(event, 'Payment intent failed', {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
        });

        // TODO: Log failed payment attempt

        break;
      }

      // Customer created
      case 'customer.created': {
        const customer = event.data.object as Stripe.Customer;
        logEvent(event, 'Customer created', {
          customerId: customer.id,
          email: customer.email,
        });

        // TODO: Link customer to user record

        break;
      }

      // Customer updated
      case 'customer.updated': {
        const customer = event.data.object as Stripe.Customer;
        logEvent(event, 'Customer updated', {
          customerId: customer.id,
          email: customer.email,
        });

        // TODO: Update customer info in database

        break;
      }

      // Customer deleted
      case 'customer.deleted': {
        const customer = event.data.object as Stripe.Customer;
        logEvent(event, 'Customer deleted', {
          customerId: customer.id,
        });

        // TODO: Handle customer deletion

        break;
      }

      // Unhandled event type
      default:
        logEvent(event, `⚠️ Unhandled event type: ${event.type}`);
    }

    // Return success response
    return NextResponse.json({ received: true, eventId: event.id });
  } catch (error) {
    console.error('❌ Error processing webhook event:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Disable body parsing to get raw body for signature verification
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
