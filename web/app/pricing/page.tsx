/**
 * Enhanced Pricing Page
 * WCAG AA compliant with responsive design, feature comparison, and FAQ
 * Features: Annual/monthly toggle, detailed feature list, accessibility
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  X,
  Zap,
  TrendingUp,
  Users,
  Crown,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';

type BillingCycle = 'monthly' | 'annual';

interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  price: {
    monthly: number;
    annual: number;
  };
  priceId: {
    monthly: string;
    annual: string;
  };
  icon: React.ReactNode;
  color: 'cyan' | 'violet' | 'highlight' | 'gradient';
  popular?: boolean;
  features: {
    name: string;
    included: boolean;
    limit?: string;
  }[];
}

const tiers: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Perfect for individual traders',
    price: { monthly: 49, annual: 490 }, // ~15% discount for annual
    priceId: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY || '',
      annual: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_ANNUAL || '',
    },
    icon: <Zap className="w-8 h-8" />,
    color: 'cyan',
    features: [
      { name: 'Real-time trading signals', included: true },
      { name: 'Up to 3 trading pairs', included: true, limit: '3 pairs' },
      { name: 'Basic performance metrics', included: true },
      { name: 'Discord community access', included: true },
      { name: 'Email support', included: true },
      { name: 'Advanced analytics', included: false },
      { name: 'Priority support', included: false },
      { name: 'API access', included: false },
      { name: 'White-label options', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Most popular for serious traders',
    price: { monthly: 99, annual: 990 }, // ~17% discount
    priceId: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY || '',
      annual: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_ANNUAL || '',
    },
    icon: <TrendingUp className="w-8 h-8" />,
    color: 'violet',
    popular: true,
    features: [
      { name: 'Real-time trading signals', included: true },
      { name: 'Unlimited trading pairs', included: true, limit: 'Unlimited' },
      { name: 'Advanced performance metrics', included: true },
      { name: 'Discord community access', included: true },
      { name: 'Priority email support', included: true },
      { name: 'Advanced analytics dashboard', included: true },
      { name: 'Signal confidence scores', included: true },
      { name: 'API access (100 req/min)', included: true, limit: '100/min' },
      { name: 'White-label options', included: false },
    ],
  },
  {
    id: 'team',
    name: 'Team',
    tagline: 'For trading teams and firms',
    price: { monthly: 299, annual: 2990 }, // ~17% discount
    priceId: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_TEAM_MONTHLY || '',
      annual: process.env.NEXT_PUBLIC_STRIPE_PRICE_TEAM_ANNUAL || '',
    },
    icon: <Users className="w-8 h-8" />,
    color: 'highlight',
    features: [
      { name: 'Real-time trading signals', included: true },
      { name: 'Unlimited trading pairs', included: true, limit: 'Unlimited' },
      { name: 'Advanced performance metrics', included: true },
      { name: 'Discord community access', included: true },
      { name: '24/7 priority support', included: true },
      { name: 'Advanced analytics dashboard', included: true },
      { name: 'Signal confidence scores', included: true },
      { name: 'API access (1000 req/min)', included: true, limit: '1000/min' },
      { name: 'Up to 10 team seats', included: true, limit: '10 seats' },
      { name: 'Custom integrations', included: true },
      { name: 'Dedicated account manager', included: true },
      { name: 'White-label options', included: false },
    ],
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    tagline: 'One-time payment, forever access',
    price: { monthly: 1999, annual: 1999 },
    priceId: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_LIFETIME || '',
      annual: process.env.NEXT_PUBLIC_STRIPE_PRICE_LIFETIME || '',
    },
    icon: <Crown className="w-8 h-8" />,
    color: 'gradient',
    features: [
      { name: 'Real-time trading signals', included: true },
      { name: 'Unlimited trading pairs', included: true, limit: 'Unlimited' },
      { name: 'Advanced performance metrics', included: true },
      { name: 'Discord Founder role', included: true },
      { name: '24/7 priority support', included: true },
      { name: 'Advanced analytics dashboard', included: true },
      { name: 'Signal confidence scores', included: true },
      { name: 'API access (unlimited)', included: true, limit: 'Unlimited' },
      { name: 'Lifetime updates', included: true },
      { name: 'Early access to features', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'White-label options available', included: true },
    ],
  },
];

const faqs = [
  {
    question: 'How do trading signals work?',
    answer:
      'Our AI analyzes market data in real-time using machine learning models to generate high-confidence trading signals. Each signal includes entry/exit points, confidence scores, and risk metrics.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      "Yes, you can cancel your subscription at any time. If you cancel, you'll retain access until the end of your current billing period. No refunds for partial months.",
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, MasterCard, Amex) and debit cards through Stripe. Annual plans also support bank transfers for Team tier and above.',
  },
  {
    question: 'Is there a free trial?',
    answer:
      "We offer a 7-day money-back guarantee on all monthly plans. If you're not satisfied within the first week, contact support for a full refund.",
  },
  {
    question: "What's included in white-label options?",
    answer:
      'White-label options allow you to rebrand our signals platform with your logo, colors, and domain. Available for Lifetime tier or as an enterprise add-on. Contact sales for details.',
  },
  {
    question: 'Do you offer enterprise plans?',
    answer:
      'Yes! For larger teams or custom requirements, we offer enterprise plans with dedicated infrastructure, SLA guarantees, and custom integrations. Contact our sales team.',
  },
];

async function createCheckout(priceId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/api/checkout`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ priceId }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Checkout failed: ${res.status} ${text}`);
  }

  const { url } = await res.json();
  return url as string;
}

function PricingCard({ tier, billingCycle }: { tier: PricingTier; billingCycle: BillingCycle }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const priceId = tier.priceId[billingCycle];
      const url = await createCheckout(priceId);
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to create checkout session. Please try again.');
      setIsLoading(false);
    }
  };

  const colorClasses = {
    cyan: 'border-accent/30 hover:border-accent/50',
    violet: 'border-accent-b/30 hover:border-accent-b/50 shadow-glow-violet',
    highlight: 'border-highlight/30 hover:border-highlight/50',
    gradient: 'border-accent/50 shadow-glow',
  };

  const iconColorClasses = {
    cyan: 'bg-accent/10 border-accent/30 text-accent',
    violet: 'bg-accent-b/10 border-accent-b/30 text-accent-b',
    highlight: 'bg-highlight/10 border-highlight/30 text-highlight',
    gradient: 'bg-gradient-brand text-white',
  };

  const buttonClasses = {
    cyan: 'bg-gradient-to-r from-accent to-accent-b',
    violet: 'bg-gradient-to-r from-accent-b to-highlight',
    highlight: 'bg-gradient-to-r from-highlight to-accent',
    gradient: 'bg-gradient-brand',
  };

  const price = tier.id === 'lifetime' ? tier.price.monthly : tier.price[billingCycle];
  const savings =
    tier.id !== 'lifetime' && billingCycle === 'annual'
      ? Math.round(((tier.price.monthly * 12 - tier.price.annual) / (tier.price.monthly * 12)) * 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`
        relative glass-card rounded-2xl p-8 border transition-all duration-300
        ${colorClasses[tier.color]}
        ${tier.popular ? 'ring-2 ring-accent-b/50' : ''}
      `}
    >
      {/* Popular Badge */}
      {tier.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-brand text-white text-sm font-semibold rounded-full shadow-glow">
          Most Popular
        </div>
      )}

      {/* Icon */}
      <div className={`inline-flex p-3 rounded-xl border mb-6 ${iconColorClasses[tier.color]}`}>
        {tier.icon}
      </div>

      {/* Tier Name */}
      <h3 className="text-2xl font-bold text-text mb-2">{tier.name}</h3>
      <p className="text-dim mb-6">{tier.tagline}</p>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-text">${price}</span>
          {tier.id !== 'lifetime' && (
            <span className="text-dim">/ {billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
          )}
          {tier.id === 'lifetime' && (
            <span className="text-dim">one-time</span>
          )}
        </div>
        {savings > 0 && (
          <p className="text-success text-sm mt-2">Save {savings}% with annual billing</p>
        )}
      </div>

      {/* Subscribe Button */}
      <button
        onClick={handleSubscribe}
        disabled={isLoading}
        className={`
          w-full py-3 px-6 rounded-lg font-semibold text-white
          ${buttonClasses[tier.color]}
          hover:shadow-glow transition-all duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
          focus-visible:outline focus-visible:outline-2
          focus-visible:outline-offset-2 focus-visible:outline-accent
        `}
        aria-label={`Subscribe to ${tier.name} plan`}
      >
        {isLoading ? 'Loading...' : tier.id === 'lifetime' ? 'Get Lifetime Access' : 'Get Started'}
      </button>

      {/* Features List */}
      <ul className="mt-8 space-y-3" role="list">
        {tier.features.map((feature) => (
          <li
            key={feature.name}
            className="flex items-start gap-3 text-sm"
          >
            {feature.included ? (
              <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" aria-hidden="true" />
            ) : (
              <X className="w-5 h-5 text-muted flex-shrink-0 mt-0.5" aria-hidden="true" />
            )}
            <span className={feature.included ? 'text-text' : 'text-muted'}>
              {feature.name}
              {feature.limit && (
                <span className="text-dim ml-2">({feature.limit})</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function FAQItem({ faq }: { faq: typeof faqs[0] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="glass-card rounded-xl border border-border overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-surface/50 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <HelpCircle className="w-5 h-5 text-accent flex-shrink-0" aria-hidden="true" />
          <span className="text-text font-semibold">{faq.question}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-dim transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="px-6 pb-4 border-t border-border/50"
        >
          <p className="text-dim pt-4">{faq.answer}</p>
        </motion.div>
      )}
    </div>
  );
}

export default function EnhancedPricingPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('annual');

  return (
    <main className="min-h-screen bg-bg pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text mb-6"
          >
            Simple, <span className="text-gradient">Transparent</span> Pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-dim max-w-2xl mx-auto"
          >
            Choose the plan that fits your trading needs. All plans include
            real-time signals and Discord access.
          </motion.p>
        </div>

        {/* Billing Cycle Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex items-center gap-4 p-2 bg-surface/80 backdrop-blur-sm border border-accent/20 rounded-xl">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`
                px-6 py-2 rounded-lg font-medium transition-all duration-300
                ${
                  billingCycle === 'monthly'
                    ? 'bg-gradient-brand text-white shadow-glow'
                    : 'text-dim hover:text-text'
                }
              `}
              aria-pressed={billingCycle === 'monthly'}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`
                px-6 py-2 rounded-lg font-medium transition-all duration-300 relative
                ${
                  billingCycle === 'annual'
                    ? 'bg-gradient-brand text-white shadow-glow'
                    : 'text-dim hover:text-text'
                }
              `}
              aria-pressed={billingCycle === 'annual'}
            >
              Annual
              <span className="ml-2 text-xs bg-success/20 text-success px-2 py-0.5 rounded-full">
                Save 15%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {tiers.map((tier) => (
            <PricingCard key={tier.id} tier={tier} billingCycle={billingCycle} />
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-text text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <FAQItem key={faq.question} faq={faq} />
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-20"
        >
          <div className="glass-card rounded-2xl p-12 border-accent/30">
            <h3 className="text-2xl font-bold text-text mb-4">
              Still have questions?
            </h3>
            <p className="text-dim mb-6 max-w-lg mx-auto">
              Contact our sales team for enterprise pricing, custom integrations,
              or white-label solutions.
            </p>
            <a
              href="mailto:sales@aipredictedsignals.com"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-brand text-white font-semibold rounded-lg shadow-glow hover:shadow-glow-violet transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Contact Sales
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
