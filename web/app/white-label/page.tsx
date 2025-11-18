/**
 * White-Label Offering Page
 * WCAG AA compliant B2B sales page for white-label solutions
 * Features: Feature showcase, pricing tiers, contact form
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Palette,
  Globe,
  Shield,
  Zap,
  Code,
  Users,
  BarChart3,
  Headphones,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Clock,
  Award,
  Send,
} from 'lucide-react';

const features = [
  {
    icon: <Palette className="w-6 h-6" />,
    title: 'Full Branding Control',
    description: 'Customize colors, logos, fonts, and UI elements to match your brand identity perfectly.',
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Custom Domain',
    description: 'Host the platform on your own domain with SSL certificates and CDN included.',
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: 'API Access',
    description: 'Full API access to integrate signals into your existing platforms and workflows.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Data Privacy',
    description: 'Your data stays private. Optional dedicated infrastructure for enterprise clients.',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Real-Time Updates',
    description: 'Instant signal delivery via WebSockets with 99.9% uptime SLA guarantee.',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Advanced Analytics',
    description: 'Built-in analytics dashboard with customizable metrics and reporting tools.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Multi-Tenant Support',
    description: 'Manage multiple client accounts with role-based access control.',
  },
  {
    icon: <Headphones className="w-6 h-6" />,
    title: 'Dedicated Support',
    description: '24/7 priority support with dedicated account manager and technical assistance.',
  },
];

const tiers = [
  {
    id: 'basic',
    name: 'Basic White-Label',
    price: '$499/mo',
    setup: '$1,500 one-time',
    icon: <Palette className="w-8 h-8" />,
    color: 'cyan',
    features: [
      'Custom branding (logo, colors)',
      'Your domain hosting',
      'Up to 1,000 monthly users',
      'API access (100 req/min)',
      'Email support (24h response)',
      'Basic analytics dashboard',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '$1,499/mo',
    setup: '$3,000 one-time',
    icon: <Sparkles className="w-8 h-8" />,
    color: 'violet',
    popular: true,
    features: [
      'Everything in Basic, plus:',
      'Advanced UI customization',
      'Up to 10,000 monthly users',
      'API access (1,000 req/min)',
      'Priority support (4h response)',
      'Advanced analytics & reporting',
      'Custom integrations (up to 5)',
      'Multi-tenant management',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    setup: 'Custom',
    icon: <Award className="w-8 h-8" />,
    color: 'gradient',
    features: [
      'Everything in Professional, plus:',
      'Unlimited users',
      'Dedicated infrastructure',
      'Unlimited API requests',
      '24/7 dedicated support',
      'Custom ML model training',
      'Unlimited integrations',
      'SLA guarantees (99.99%)',
      'On-premise deployment option',
      'Dedicated account manager',
    ],
  },
];

const useCases = [
  {
    title: 'Financial Advisors',
    description: 'Offer AI-powered trading signals to your clients under your own brand.',
    icon: <Users className="w-12 h-12" />,
  },
  {
    title: 'Trading Communities',
    description: 'Enhance your Discord/Telegram community with exclusive signal access.',
    icon: <Globe className="w-12 h-12" />,
  },
  {
    title: 'Fintech Platforms',
    description: 'Integrate trading signals into your app to increase user engagement.',
    icon: <Code className="w-12 h-12" />,
  },
  {
    title: 'Hedge Funds',
    description: 'Leverage AI signals for your portfolio with dedicated infrastructure.',
    icon: <BarChart3 className="w-12 h-12" />,
  },
];

export default function WhiteLabelPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    users: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact/white-label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to submit form');
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', company: '', users: '', message: '' });
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Failed to submit form. Please try again or email sales@aipredictedsignals.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <main className="min-h-screen bg-bg pt-24 pb-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text mb-6">
            <span className="text-gradient">White-Label</span> Trading Signals
          </h1>
          <p className="text-xl text-dim mb-8">
            Launch your own AI-powered trading platform in minutes. Fully customizable,
            fully branded, fully yours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-brand text-white font-semibold rounded-lg shadow-glow hover:shadow-glow-violet transition-all duration-300"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-surface/80 text-text font-semibold rounded-lg border border-accent/30 hover:border-accent/50 transition-all duration-300"
            >
              View Pricing
            </a>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-text mb-4">
            Everything You Need to Launch
          </h2>
          <p className="text-dim max-w-2xl mx-auto">
            Our white-label solution includes all the features you need to create
            a professional trading signals platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="glass-card rounded-xl p-6 border-border hover:border-accent/30 transition-all duration-300"
            >
              <div className="p-3 bg-accent/10 rounded-lg border border-accent/30 inline-flex mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-text mb-2">
                {feature.title}
              </h3>
              <p className="text-dim text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-text mb-4">
            Who Benefits from White-Label?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="glass-card rounded-xl p-8 text-center border-border hover:border-accent-b/30 transition-all duration-300"
            >
              <div className="inline-flex p-4 bg-accent-b/10 rounded-full border border-accent-b/30 mb-4">
                {useCase.icon}
              </div>
              <h3 className="text-xl font-semibold text-text mb-2">
                {useCase.title}
              </h3>
              <p className="text-dim text-sm">{useCase.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-text mb-4">
            White-Label Pricing
          </h2>
          <p className="text-dim max-w-2xl mx-auto">
            Choose the tier that matches your business needs. All tiers include
            setup, training, and ongoing support.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => {
            const colorClasses = {
              cyan: 'border-accent/30 hover:border-accent/50',
              violet: 'border-accent-b/30 hover:border-accent-b/50 ring-2 ring-accent-b/50',
              gradient: 'border-accent/50 shadow-glow',
            };

            const iconBgClasses = {
              cyan: 'bg-accent/10 border-accent/30 text-accent',
              violet: 'bg-accent-b/10 border-accent-b/30 text-accent-b',
              gradient: 'bg-gradient-brand text-white',
            };

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`relative glass-card rounded-2xl p-8 border transition-all duration-300 ${colorClasses[tier.color]}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-brand text-white text-sm font-semibold rounded-full shadow-glow">
                    Most Popular
                  </div>
                )}

                <div className={`inline-flex p-3 rounded-xl border mb-6 ${iconBgClasses[tier.color]}`}>
                  {tier.icon}
                </div>

                <h3 className="text-2xl font-bold text-text mb-2">{tier.name}</h3>

                <div className="mb-6">
                  <div className="text-3xl font-bold text-text mb-1">{tier.price}</div>
                  <div className="text-sm text-dim">+ {tier.setup} setup</div>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-text">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`
                    block w-full py-3 px-6 rounded-lg font-semibold text-white text-center
                    ${tier.color === 'gradient' ? 'bg-gradient-brand' : 'bg-gradient-to-r from-accent to-accent-b'}
                    hover:shadow-glow transition-all duration-300
                  `}
                >
                  {tier.id === 'enterprise' ? 'Contact Sales' : 'Get Started'}
                </a>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-3xl mx-auto glass-card rounded-2xl p-8 border-accent/30"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-text mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-dim">
              Fill out the form below and our team will get back to you within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-12">
              <div className="inline-flex p-4 bg-success/10 rounded-full border border-success/30 mb-4">
                <CheckCircle className="w-12 h-12 text-success" />
              </div>
              <h3 className="text-2xl font-bold text-text mb-2">Thank You!</h3>
              <p className="text-dim mb-6">
                We've received your inquiry and will be in touch shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-accent hover:text-accent-b underline"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-surface/80 border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-surface/80 border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-text mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-surface/80 border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="users" className="block text-sm font-medium text-text mb-2">
                    Expected Monthly Users
                  </label>
                  <select
                    id="users"
                    name="users"
                    value={formData.users}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-surface/80 border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="">Select range</option>
                    <option value="0-1000">0 - 1,000</option>
                    <option value="1000-10000">1,000 - 10,000</option>
                    <option value="10000-50000">10,000 - 50,000</option>
                    <option value="50000+">50,000+</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text mb-2">
                  Tell us about your needs
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 bg-surface/80 border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                  placeholder="What are you looking to build? Any specific requirements?"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-brand text-white font-semibold rounded-lg shadow-glow hover:shadow-glow-violet transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Inquiry
                  </>
                )}
              </button>

              <p className="text-xs text-muted text-center">
                By submitting this form, you agree to our privacy policy and terms of service.
              </p>
            </form>
          )}
        </motion.div>
      </section>
    </main>
  );
}
