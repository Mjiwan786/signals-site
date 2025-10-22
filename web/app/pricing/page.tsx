/**
 * Pricing Page - Stripe Integration
 * Features: 3 tiers (Free/Pro/Elite), Motion animations, Stripe Checkout
 * CTA → /api/checkout server action
 * Step 12: Error boundary protection
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Check, X } from 'lucide-react';
import PricingCard, { type PricingTier } from '@/components/PricingCard';
import { staggerContainer, fadeInUp } from '@/lib/motion-variants';
import { DISCORD_INVITE } from '@/lib/env';
import PageErrorBoundary from '@/components/PageErrorBoundary';
import { performanceMark } from '@/components/WebVitals';

const pricingTiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'month',
    description: 'Perfect for exploring AI-powered signals and getting started',
    icon: 'zap',
    features: [
      'Up to 10 signals per day',
      'Basic market analysis',
      'Discord community access',
      'Email notifications',
      'Mobile-responsive interface',
      'Public channel access',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 79,
    period: 'month',
    description: 'Most popular for serious traders seeking consistent alpha',
    icon: 'star',
    highlighted: true,
    badge: 'Most Popular',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO,
    features: [
      'Unlimited AI signals (24/7)',
      'Advanced market analysis',
      'Real-time Discord alerts',
      'Priority support (< 2hr response)',
      'API access for automation',
      'Custom risk parameters',
      'Advanced charting tools',
      'Private Discord channels',
      'Backtesting & analytics',
    ],
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 199,
    period: 'month',
    description: 'For professional traders and teams demanding institutional-grade tools',
    icon: 'trending',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ELITE,
    features: [
      'Everything in Pro',
      'Up to 5 team members',
      'Dedicated account manager',
      'Custom integrations (TradingView, MT4)',
      'Advanced analytics dashboard',
      'Multi-user role management',
      'SLA guarantee (99.9% uptime)',
      'Private Discord server',
      'White-glove onboarding',
      '1-on-1 strategy consultation',
    ],
  },
];

const comparisonFeatures = [
  { name: 'Signals per day', free: '10', pro: 'Unlimited', elite: 'Unlimited' },
  { name: 'Market analysis', free: 'Basic', pro: 'Advanced', elite: 'Institutional' },
  { name: 'Discord access', free: true, pro: true, elite: true },
  { name: 'Real-time alerts', free: false, pro: true, elite: true },
  { name: 'API access', free: false, pro: true, elite: true },
  { name: 'Priority support', free: false, pro: true, elite: true },
  { name: 'Team members', free: '1', pro: '1', elite: '5' },
  { name: 'Account manager', free: false, pro: false, elite: true },
  { name: 'Custom integrations', free: false, pro: false, elite: true },
  { name: 'SLA guarantee', free: false, pro: false, elite: true },
];

function PricingPageContent() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  useEffect(() => {
    performanceMark('pricing:mount');
  }, []);

  const handleTierSelect = async (tierId: string) => {
    const tier = pricingTiers.find((t) => t.id === tierId);
    if (!tier) return;

    // Free tier - redirect to Discord
    if (tier.id === 'free') {
      window.open(DISCORD_INVITE, '_blank');
      return;
    }

    // Paid tiers - Stripe Checkout
    setIsProcessing(true);
    setSelectedTier(tierId);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: tier.stripePriceId,
          tierId: tier.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to start checkout. Please try again or contact support.'
      );
      setIsProcessing(false);
      setSelectedTier(null);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-grid-sm opacity-20 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Page Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-6">
            <Activity className="w-4 h-4 text-accent animate-pulse" />
            <span className="text-sm font-medium text-accent">Transparent Pricing</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold text-text mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-text2 max-w-3xl mx-auto leading-relaxed">
            Select the perfect plan for your trading needs. All plans include AI-powered signals
            with transparent performance tracking and real-time Discord alerts.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {pricingTiers.map((tier, index) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              onSelect={handleTierSelect}
              isLoading={isProcessing && selectedTier === tier.id}
              index={index}
            />
          ))}
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          className="mb-20"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-text text-center mb-12">
            Compare Plans
          </h2>

          <div className="glass-card rounded-2xl p-8 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 text-text2 font-semibold">Feature</th>
                  <th className="text-center py-4 px-4 text-text font-bold">Free</th>
                  <th className="text-center py-4 px-4 text-text font-bold">
                    <div className="inline-flex items-center gap-2">
                      Pro
                      <div className="px-2 py-0.5 bg-accent/20 text-accent text-xs font-bold rounded">
                        Popular
                      </div>
                    </div>
                  </th>
                  <th className="text-center py-4 px-4 text-text font-bold">Elite</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                    <td className="py-4 px-4 text-text2">{feature.name}</td>
                    <td className="py-4 px-4 text-center">
                      {typeof feature.free === 'boolean' ? (
                        feature.free ? (
                          <Check className="w-5 h-5 text-success mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-dim mx-auto" />
                        )
                      ) : (
                        <span className="text-text">{feature.free}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof feature.pro === 'boolean' ? (
                        feature.pro ? (
                          <Check className="w-5 h-5 text-success mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-dim mx-auto" />
                        )
                      ) : (
                        <span className="text-text font-semibold">{feature.pro}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof feature.elite === 'boolean' ? (
                        feature.elite ? (
                          <Check className="w-5 h-5 text-success mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-dim mx-auto" />
                        )
                      ) : (
                        <span className="text-text font-semibold">{feature.elite}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className="max-w-4xl mx-auto mb-20"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-text text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: 'How do I get started?',
                a: 'Click "Get Started" for free access, or "Subscribe Now" for Pro/Elite. You\'ll be redirected to secure Stripe checkout for paid plans.',
              },
              {
                q: 'Can I upgrade or downgrade?',
                a: 'Yes! You can upgrade or downgrade your plan anytime from your dashboard. Changes take effect immediately.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, debit cards, and digital wallets via Stripe (Visa, Mastercard, Amex, Google Pay, Apple Pay).',
              },
              {
                q: 'Is there a free trial for paid plans?',
                a: 'Start with our Free plan to test signals. We offer a 7-day money-back guarantee on all paid subscriptions.',
              },
              {
                q: 'How do signals work?',
                a: 'Our AI analyzes market data 24/7 and generates signals with entry, stop-loss, and take-profit levels. You receive instant Discord notifications.',
              },
              {
                q: 'What\'s your refund policy?',
                a: '7-day full refund for Pro/Elite plans, no questions asked. Cancel anytime via dashboard or Discord.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="glass-card-hover rounded-xl p-6 border border-border">
                <h3 className="text-lg font-semibold text-text mb-3">{faq.q}</h3>
                <p className="text-sm text-text2 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          className="text-center glass-card rounded-2xl p-12 border-accent/30"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-text mb-4">
            Ready to Start Trading Smarter?
          </h2>
          <p className="text-lg text-text2 mb-8 max-w-2xl mx-auto">
            Join thousands of traders using AI-powered signals to make better trading decisions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handleTierSelect('free')}
              className="px-8 py-4 bg-surface text-text border-2 border-border rounded-xl font-semibold hover:border-accent hover:bg-elev transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-accent/50"
            >
              Start Free
            </button>
            <button
              onClick={() => handleTierSelect('pro')}
              className="px-8 py-4 bg-gradient-brand text-white rounded-xl font-semibold shadow-soft hover:shadow-glow transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-accent/50"
            >
              Subscribe to Pro
            </button>
          </div>

          <p className="text-xs text-dim mt-6">
            No credit card required for Free plan • Cancel anytime • Secure checkout via Stripe
          </p>
        </motion.div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-sm text-dim mb-6">Trusted by traders worldwide</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
            <div className="text-xs text-dim">🔒 SSL Encrypted</div>
            <div className="text-xs text-dim">💳 Stripe Secure</div>
            <div className="text-xs text-dim">📊 Real-time Data</div>
            <div className="text-xs text-dim">🚀 99.9% Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <PageErrorBoundary pageName="Pricing" fallbackType="pricing">
      <PricingPageContent />
    </PageErrorBoundary>
  );
}
