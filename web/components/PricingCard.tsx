/**
 * PricingCard Component
 * Animated pricing card with Motion hover effects
 * Features: Tier highlighting, feature lists, CTA buttons
 */

'use client';

import { motion } from 'framer-motion';
import { Check, Zap, Star, TrendingUp } from 'lucide-react';
import { fadeInUp } from '@/lib/motion-variants';

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year' | 'once';
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  stripePriceId?: string;
  icon?: 'zap' | 'star' | 'trending';
  discordRole?: string;
  discordRoleColor?: string;
}

interface PricingCardProps {
  tier: PricingTier;
  onSelect: (tierId: string) => void;
  isLoading?: boolean;
  index?: number;
}

const iconMap = {
  zap: Zap,
  star: Star,
  trending: TrendingUp,
};

export default function PricingCard({
  tier,
  onSelect,
  isLoading = false,
  index = 0,
}: PricingCardProps) {
  const Icon = tier.icon ? iconMap[tier.icon] : Zap;
  const isFree = tier.price === 0;
  const isLifetime = tier.period === 'once';

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className={`
        relative h-full flex flex-col
        ${tier.highlighted ? 'z-10' : 'z-0'}
      `}
    >
      {/* Highlighted badge */}
      {tier.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <div className="px-4 py-1.5 bg-gradient-brand text-white text-xs font-bold rounded-full shadow-glow uppercase tracking-wide">
            {tier.badge}
          </div>
        </div>
      )}

      <div
        className={`
          relative h-full flex flex-col p-8 rounded-2xl transition-all duration-300
          ${
            tier.highlighted
              ? 'glass-card border-2 border-accent shadow-glow'
              : 'glass-card-hover border border-border hover:border-accent/50'
          }
        `}
      >
        {/* Background gradient on hover */}
        <div
          className={`
            absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
            ${tier.highlighted ? 'bg-gradient-to-br from-accent/5 to-transparent' : 'bg-gradient-to-br from-accentA/5 to-transparent'}
          `}
        />

        {/* Header */}
        <div className="relative z-10 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div
              className={`
                inline-flex items-center justify-center w-12 h-12 rounded-xl
                ${tier.highlighted ? 'bg-accent/20' : 'bg-accentA/20'}
              `}
            >
              <Icon
                className={`w-6 h-6 ${tier.highlighted ? 'text-accent' : 'text-accentA'}`}
              />
            </div>

            {isFree && (
              <div className="px-3 py-1 bg-success/20 text-success text-xs font-bold rounded-full">
                FREE
              </div>
            )}
          </div>

          <h3 className="text-2xl font-bold text-text mb-2">{tier.name}</h3>
          <p className="text-sm text-dim leading-relaxed mb-3">{tier.description}</p>

          {/* Discord Role Badge */}
          {tier.discordRole && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface/50 border border-border rounded-lg">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: tier.discordRoleColor }}
              />
              <span className="text-xs font-semibold text-text2">
                Discord: {tier.discordRole}
              </span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="relative z-10 mb-8">
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-bold text-text">
              {isFree ? 'Free' : `$${tier.price}`}
            </span>
            {!isFree && (
              <span className="text-text2 text-lg">
                {isLifetime ? '' : `/${tier.period === 'year' ? 'yr' : 'mo'}`}
              </span>
            )}
          </div>
          {isLifetime && (
            <p className="text-xs text-success mt-1 font-semibold">
              One-time payment • Lifetime access
            </p>
          )}
          {tier.period === 'year' && !isFree && (
            <p className="text-xs text-success mt-1">
              Save ${((tier.price / 12) * 12 * 0.2).toFixed(0)}/year
            </p>
          )}
        </div>

        {/* Features */}
        <ul className="relative z-10 space-y-4 mb-8 flex-1">
          {tier.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-success/20 flex items-center justify-center mt-0.5">
                <Check className="w-3 h-3 text-success" />
              </div>
              <span className="text-sm text-text2 leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <div className="relative z-10">
          <button
            onClick={() => onSelect(tier.id)}
            disabled={isLoading}
            className={`
              w-full py-4 px-6 rounded-xl font-semibold text-base transition-all duration-300
              focus:outline-none focus:ring-4 focus:ring-accent/50
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                tier.highlighted
                  ? 'bg-gradient-brand text-white shadow-soft hover:shadow-glow'
                  : isFree
                    ? 'bg-surface text-text border-2 border-border hover:border-accent hover:bg-elev'
                    : 'bg-elev text-text border-2 border-border hover:border-accent hover:bg-surface'
              }
            `}
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : isFree ? (
              'Get Started'
            ) : (
              'Subscribe Now'
            )}
          </button>

          {!isFree && (
            <p className="text-xs text-dim text-center mt-3">
              Cancel anytime • No hidden fees
            </p>
          )}
        </div>

        {/* Glow effect on hover */}
        {tier.highlighted && (
          <div className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none bg-accent" />
        )}
      </div>
    </motion.div>
  );
}
