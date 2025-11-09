import { z } from 'zod';

/**
 * Environment variables schema
 * Validates required public environment variables for signals-site
 */
const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url('NEXT_PUBLIC_API_URL must be a valid URL').default('http://localhost:8000'),
  NEXT_PUBLIC_SIGNALS_MODE: z.enum(['paper', 'live']).default('paper'),
  NEXT_PUBLIC_DISCORD_INVITE: z.string().default('#'),
  NEXT_PUBLIC_SITE_NAME: z.string().default('Signals'),
  NEXT_PUBLIC_STRIPE_PRICE_PRO: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PRICE_ELITE: z.string().optional(),
  NEXT_PUBLIC_USE_STAGING_SIGNALS: z.string().transform(v => v === 'true').default('false'),
});

/**
 * Parse and validate environment variables
 * @throws {ZodError} if validation fails
 */
function validateEnv() {
  const rawEnv = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE,
    NEXT_PUBLIC_SIGNALS_MODE: process.env.NEXT_PUBLIC_SIGNALS_MODE,
    NEXT_PUBLIC_DISCORD_INVITE: process.env.NEXT_PUBLIC_DISCORD_INVITE,
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
    NEXT_PUBLIC_STRIPE_PRICE_PRO: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO,
    NEXT_PUBLIC_STRIPE_PRICE_ELITE: process.env.NEXT_PUBLIC_STRIPE_PRICE_ELITE,
    NEXT_PUBLIC_USE_STAGING_SIGNALS: process.env.NEXT_PUBLIC_USE_STAGING_SIGNALS,
  };

  try {
    return envSchema.parse(rawEnv);
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    throw new Error('Environment validation failed. Check your .env.local file.');
  }
}

/**
 * Validated environment variables
 * Safe to use throughout the application
 */
export const env = validateEnv();

// Legacy exports for backward compatibility
export const API_BASE = env.NEXT_PUBLIC_API_URL;
export const DEFAULT_MODE = env.NEXT_PUBLIC_SIGNALS_MODE;
export const DISCORD_INVITE = env.NEXT_PUBLIC_DISCORD_INVITE;
export const SITE_NAME = env.NEXT_PUBLIC_SITE_NAME;
export const USE_STAGING_SIGNALS = env.NEXT_PUBLIC_USE_STAGING_SIGNALS;
