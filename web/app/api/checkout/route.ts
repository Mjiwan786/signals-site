/**
 * Stripe Checkout API Route
 * Creates a Stripe Checkout session for subscription purchases
 * POST /api/checkout
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';

// Request body schema
const CheckoutRequestSchema = z.object({
  priceId: z.string().min(1, 'Price ID is required'),
  tierId: z.enum(['pro', 'elite']),
});

// Error response helper
function errorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

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

export async function POST(req: NextRequest) {
  try {
    // Validate Stripe configuration
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY is not configured');
      return errorResponse('Stripe is not configured. Please contact support.', 500);
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.warn('⚠️ STRIPE_WEBHOOK_SECRET is not configured. Webhooks will not work.');
    }

    // Initialize Stripe client
    const stripe = getStripeClient();

    // Parse and validate request body
    const body = await req.json();
    const validation = CheckoutRequestSchema.safeParse(body);

    if (!validation.success) {
      console.error('❌ Invalid checkout request:', validation.error);
      return errorResponse('Invalid request. Missing priceId or tierId.');
    }

    const { priceId, tierId } = validation.data;

    // Validate price ID exists (optional: verify against Stripe)
    if (!priceId || priceId === 'undefined') {
      return errorResponse(
        'Price ID not configured for this tier. Please configure NEXT_PUBLIC_STRIPE_PRICE_PRO or NEXT_PUBLIC_STRIPE_PRICE_ELITE.',
        500
      );
    }

    // Get origin for success/cancel URLs
    const origin = req.headers.get('origin') || 'http://localhost:3000';

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${origin}/pricing?canceled=true`,
      metadata: {
        tierId,
      },
      // Optional: Customer email collection
      customer_email: undefined, // Will be collected in checkout form
      // Optional: Allow promo codes
      allow_promotion_codes: true,
      // Optional: Billing address collection
      billing_address_collection: 'auto',
      // Optional: Subscription data
      subscription_data: {
        metadata: {
          tier: tierId,
        },
      },
    });

    console.log(`✅ Checkout session created: ${session.id} for tier: ${tierId}`);

    // Return checkout session URL
    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('❌ Checkout error:', error);

    if (error instanceof Stripe.errors.StripeError) {
      return errorResponse(`Stripe error: ${error.message}`, 500);
    }

    return errorResponse(
      'Failed to create checkout session. Please try again or contact support.',
      500
    );
  }
}

// OPTIONS for CORS (if needed)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
