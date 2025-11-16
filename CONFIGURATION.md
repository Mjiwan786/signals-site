# Signals Site - Configuration Reference

Complete environment variable reference for Next.js frontend.

**PRD Reference**: `docs/PRD-003-SIGNALS-SITE.md`

---

## Environment Variable Types

Next.js has two types of environment variables:

1. **`NEXT_PUBLIC_*`**: Exposed to browser (client-side)
2. **No prefix**: Server-side only (more secure)

**Security Rule**: Secrets (API keys, passwords) must NEVER have `NEXT_PUBLIC_` prefix.

---

## Critical Configuration (Required)

### API Integration

| Variable | Purpose | Example | Type |
|----------|---------|---------|------|
| `NEXT_PUBLIC_API_BASE` | Signals API base URL | `http://localhost:8000` (dev), `https://api.yourdomain.com` (prod) | Client |
| `NEXT_PUBLIC_API_URL` | API URL (alias) | Same as `API_BASE` | Client |
| `NEXT_PUBLIC_SIGNALS_MODE` | Trading mode | `paper` or `live` | Client |

### NextAuth (Authentication)

| Variable | Purpose | Example | Type |
|----------|---------|---------|------|
| `NEXTAUTH_URL` | Auth callback URL | `http://localhost:3000` (dev), `https://yourdomain.com` (prod) | Server |
| `NEXTAUTH_SECRET` | JWT signing secret | Generate with `openssl rand -base64 32` | **Server** |

**Fail-Fast**: NextAuth will not start without `NEXTAUTH_SECRET` in production.

### Redis (Optional - if using Redis sessions)

| Variable | Purpose | Example | Type |
|----------|---------|---------|------|
| `REDIS_URL` | Redis Cloud connection | `rediss://default:PASSWORD@redis-19818...com:19818` | **Server** |

---

## Optional Configuration

### Discord OAuth2

| Variable | Purpose | How to Get | Type |
|----------|---------|------------|------|
| `DISCORD_CLIENT_ID` | Discord OAuth app ID | Discord Developer Portal | **Server** |
| `DISCORD_CLIENT_SECRET` | Discord OAuth secret | Discord Developer Portal | **Server** |
| `DISCORD_BOT_TOKEN` | Discord bot token | Discord Developer Portal | **Server** |
| `NEXT_PUBLIC_DISCORD_INVITE` | Discord server invite link | Your Discord server | Client |

### Supabase (Database)

| Variable | Purpose | How to Get | Type |
|----------|---------|------------|------|
| `SUPABASE_URL` | Supabase project URL | Supabase dashboard | **Server** |
| `SUPABASE_ANON_KEY` | Supabase anon key | Supabase dashboard | **Server** |
| `SUPABASE_SERVICE_KEY` | Supabase service key | Supabase dashboard | **Server** |

### Stripe (Payments)

| Variable | Purpose | Example | Type |
|----------|---------|---------|------|
| `STRIPE_SECRET_KEY` | Stripe API key | `sk_test_...` (dev), `sk_live_...` (prod) | **Server** |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | `whsec_...` | **Server** |
| `STRIPE_PRICE_STARTER` | Stripe price ID (Starter) | `price_...` | **Server** |
| `STRIPE_PRICE_PRO` | Stripe price ID (Pro) | `price_...` | **Server** |
| `STRIPE_PRICE_TEAM` | Stripe price ID (Team) | `price_...` | **Server** |
| `STRIPE_PRICE_LIFETIME` | Stripe price ID (Lifetime) | `price_...` | **Server** |

### Branding

| Variable | Purpose | Default | Type |
|----------|---------|---------|------|
| `SITE_NAME` | Site name (server) | `Signals` | **Server** |
| `NEXT_PUBLIC_SITE_NAME` | Site name (client) | `Signals` | Client |

### Analytics

| Variable | Purpose | Example | Type |
|----------|---------|---------|------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 ID | `G-XXXXXXXXX` | Client |

---

## Environment Examples

### Development (`web/.env.local`)

```bash
# API
NEXT_PUBLIC_API_BASE=http://localhost:8000
NEXT_PUBLIC_SIGNALS_MODE=paper

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate_with_openssl>

# Optional (if needed)
DISCORD_CLIENT_ID=your_dev_client_id
DISCORD_CLIENT_SECRET=your_dev_secret
```

### Production (`web/.env.production.local`)

```bash
# API
NEXT_PUBLIC_API_BASE=https://api.yourdomain.com
NEXT_PUBLIC_SIGNALS_MODE=live

# NextAuth
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<strong_secret_for_production>

# Discord OAuth
DISCORD_CLIENT_ID=your_prod_client_id
DISCORD_CLIENT_SECRET=your_prod_secret
DISCORD_BOT_TOKEN=your_prod_bot_token
NEXT_PUBLIC_DISCORD_INVITE=https://discord.gg/yourinvite

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# Stripe (PRODUCTION - LIVE PAYMENTS)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_TEAM=price_...
STRIPE_PRICE_LIFETIME=price_...

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXX
```

---

## Generating Secrets

### NEXTAUTH_SECRET

```bash
# Method 1: OpenSSL
openssl rand -base64 32

# Method 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Add to .env.local:
NEXTAUTH_SECRET=<generated_secret>
```

### Stripe Webhook Secret

```bash
# Use Stripe CLI or Dashboard
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Output: whsec_...

# Add to .env.local:
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Fail-Fast Validation

Next.js validates environment variables at build time (not runtime).

### Build-Time Checks

```powershell
# Check env vars loaded
npm run build

# Expected errors if missing critical vars:
# - NEXTAUTH_SECRET is required in production
# - NEXT_PUBLIC_API_BASE is required
```

### Runtime Checks (Custom)

Add to `app/layout.tsx` or `app/providers.tsx`:

```typescript
if (process.env.NODE_ENV === 'production') {
  if (!process.env.NEXTAUTH_SECRET) {
    throw new Error('NEXTAUTH_SECRET is required in production');
  }
  if (!process.env.NEXT_PUBLIC_API_BASE) {
    throw new Error('NEXT_PUBLIC_API_BASE is required');
  }
}
```

---

## Security Best Practices

### ✅ DO

1. **Use `NEXT_PUBLIC_` ONLY for non-sensitive data** (API URLs, feature flags)
2. **Keep secrets server-side** (no `NEXT_PUBLIC_` prefix)
3. **Generate strong `NEXTAUTH_SECRET`** (32+ bytes)
4. **Use different Stripe keys** for dev (`sk_test_`) and prod (`sk_live_`)
5. **Restrict Discord OAuth** to specific redirect URIs
6. **Use Supabase RLS** (Row-Level Security) for database
7. **Validate env vars at build time**
8. **Use `.env.local` for development** (gitignored)
9. **Use `.env.production.local` for production** (gitignored)
10. **Set env vars in Vercel dashboard** (not in repo)

### ❌ DON'T

1. **Never commit `.env.local` or `.env.production.local`** (gitignored)
2. **Never use `NEXT_PUBLIC_` for secrets** (exposed to browser!)
3. **Never hardcode API keys in code**
4. **Never share production secrets with development**
5. **Never log sensitive env vars**
6. **Never use weak `NEXTAUTH_SECRET`** (< 32 bytes)

---

## Vercel Deployment

### Adding Environment Variables

1. Go to Vercel dashboard → Project → Settings → Environment Variables
2. Add each variable:
   - **Key**: `NEXTAUTH_SECRET`
   - **Value**: `<your_secret>`
   - **Environment**: Production, Preview, Development

3. Critical vars for Vercel:
   - `NEXTAUTH_URL` (use Vercel domain)
   - `NEXT_PUBLIC_API_BASE` (signals-api URL)
   - All Stripe, Discord, Supabase secrets

### Build Settings

```json
{
  "buildCommand": "cd web && npm run build",
  "outputDirectory": "web/.next",
  "installCommand": "cd web && npm install"
}
```

---

## Troubleshooting

### "NEXTAUTH_SECRET is missing"

```
Error: Please define the NEXTAUTH_SECRET environment variable
```

**Fix**:
```bash
# Generate secret
openssl rand -base64 32

# Add to .env.local
echo "NEXTAUTH_SECRET=<generated_secret>" >> .env.local

# Restart dev server
npm run dev
```

### "API_BASE is undefined" (Client-Side)

```
TypeError: Cannot read property 'data' of undefined
```

**Fix**:
```bash
# Add to .env.local
NEXT_PUBLIC_API_BASE=http://localhost:8000

# Restart (env vars loaded at startup only)
npm run dev
```

### Stripe Webhook Signature Mismatch

```
Error: Webhook signature verification failed
```

**Fix**:
1. Use Stripe CLI for local testing:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
2. Copy webhook secret from CLI output
3. Update `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

---

## References

- **NextAuth Docs**: https://next-auth.js.org/configuration/options
- **Next.js Env Docs**: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
- **Stripe Webhooks**: https://stripe.com/docs/webhooks
- **Supabase Setup**: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
- **PRD**: `docs/PRD-003-SIGNALS-SITE.md` (Authoritative specification)
- **SETUP.md**: Environment recreation guide

---

## Support

For configuration questions:

1. Check `.env.local.example` for template
2. Verify env vars loaded: `console.log(process.env.NEXT_PUBLIC_API_BASE)`
3. Restart dev server after env changes
4. Check Vercel dashboard for production env vars

**Environment Variables Summary**: 20+ variables (5 critical, 15+ optional)
**Security**: Server-side secrets, TLS for Redis, strong NEXTAUTH_SECRET
**Deployment**: Vercel-ready with dashboard env var management
