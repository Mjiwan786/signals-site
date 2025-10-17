import { CheckIcon } from '@radix-ui/react-icons';
import { DISCORD_INVITE } from '@/lib/env';

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      description: 'Perfect for beginners exploring AI signals',
      features: [
        'Up to 10 signals per day',
        'Basic market analysis',
        'Discord community access',
        'Email notifications',
        'Mobile-responsive dashboard',
        '7-day money-back guarantee'
      ],
      popular: false,
    },
    {
      name: 'Pro',
      price: '$79',
      period: '/month',
      description: 'Most popular for serious traders',
      features: [
        'Unlimited AI signals',
        'Advanced market analysis',
        'Real-time Discord alerts',
        'Priority support',
        'API access',
        'Custom risk parameters',
        'Advanced charting tools',
        'Private Discord channels'
      ],
      popular: true,
    },
    {
      name: 'Team',
      price: '$199',
      period: '/month',
      description: 'For professional trading teams',
      features: [
        'Everything in Pro',
        'Up to 5 team members',
        'Dedicated account manager',
        'Custom integrations',
        'Advanced analytics dashboard',
        'Multi-user management',
        'SLA guarantee (99.9%)',
        'Private Discord server'
      ],
      popular: false,
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-elev to-bg py-16 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-text2 max-w-2xl mx-auto mb-8">
            Select the perfect plan for your trading needs. All plans include AI-powered signals with transparent performance tracking.
          </p>

          {/* Stripe Coming Soon Notice */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-lg text-sm text-accent mb-8">
            <span className="font-semibold">Stripe checkout via signals-api</span>
            <span className="text-dim">•</span>
            <span className="text-text2">Coming Soon</span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 bg-surface border rounded-xl transition-all duration-300 hover:shadow-glow ${
                plan.popular
                  ? 'border-accent shadow-glow scale-105'
                  : 'border-border hover:border-accent/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-gradient-brand text-white text-xs font-semibold rounded-full shadow-glow">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-text mb-2">{plan.name}</h3>
                <p className="text-sm text-text2 mb-6">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-text">{plan.price}</span>
                  <span className="text-text2 ml-2">{plan.period}</span>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-text2">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <a
                href={DISCORD_INVITE}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full py-3 px-6 rounded-lg font-semibold text-center transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-accent/50 ${
                  plan.popular
                    ? 'bg-gradient-brand text-white shadow-soft hover:shadow-glow'
                    : 'bg-elev text-text border-2 border-border hover:border-accent hover:bg-surface'
                }`}
              >
                Join Discord
              </a>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-text text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-surface border border-border rounded-lg">
              <h3 className="text-lg font-semibold text-text mb-3">How do I get started?</h3>
              <p className="text-sm text-text2">
                Click "Join Discord" on any plan to join our community. Once verified, you'll get immediate access to your tier's channels and signals.
              </p>
            </div>
            <div className="p-6 bg-surface border border-border rounded-lg">
              <h3 className="text-lg font-semibold text-text mb-3">Can I upgrade later?</h3>
              <p className="text-sm text-text2">
                Yes! You can upgrade your plan anytime via Discord. Contact our support team and we'll handle the transition seamlessly.
              </p>
            </div>
            <div className="p-6 bg-surface border border-border rounded-lg">
              <h3 className="text-lg font-semibold text-text mb-3">What payment methods do you accept?</h3>
              <p className="text-sm text-text2">
                Currently, subscriptions are managed through Discord. Stripe checkout integration is coming soon for credit/debit cards and more options.
              </p>
            </div>
            <div className="p-6 bg-surface border border-border rounded-lg">
              <h3 className="text-lg font-semibold text-text mb-3">Is there a free trial?</h3>
              <p className="text-sm text-text2">
                We offer limited free signals in our public Discord channels. Join to see our signals in action before committing to a paid plan.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center p-12 bg-gradient-to-br from-surface via-elev to-surface border border-border rounded-2xl shadow-glow">
          <h2 className="text-3xl font-bold text-text mb-4">
            Ready to Start Trading Smarter?
          </h2>
          <p className="text-lg text-text2 mb-8 max-w-2xl mx-auto">
            Join our Discord community to access AI-powered signals and connect with thousands of traders.
          </p>
          <a
            href={DISCORD_INVITE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-brand rounded-lg shadow-soft hover:shadow-glow transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-accent/50"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Join Discord Community
          </a>
          <p className="text-xs text-dim mt-6">
            No credit card required • Instant access • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
