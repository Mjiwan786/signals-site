# Signals Site - Development Environment Setup

## Prerequisites

- **Node.js**: 18+ (Currently using v22.17.1)
- **npm**: 9+ (bundled with Node.js)
- **Git**: For version control
- **Redis Cloud**: Account (shared with backend)
- **Signals API**: Running locally or deployed

## Quick Start (Windows)

### 1. Install Node.js Dependencies

```powershell
# Navigate to web workspace
cd C:\Users\Maith\OneDrive\Desktop\signals-site\web

# Install dependencies
npm install

# Or use yarn
npm install -g yarn
yarn install
```

### 2. Environment Configuration

```powershell
# Copy the example environment file
copy .env.local.example .env.local

# Edit .env.local with your credentials
notepad .env.local
```

**Required Environment Variables:**

| Variable | Description | Example/Notes |
|----------|-------------|---------------|
| `NEXT_PUBLIC_API_BASE` | API base URL | `http://localhost:8000` (dev), `https://api.domain.com` (prod) |
| `NEXT_PUBLIC_API_URL` | API URL (alias) | Same as API_BASE |
| `NEXT_PUBLIC_SIGNALS_MODE` | Trading mode | `paper` (safe), `live` (production) |
| `NEXT_PUBLIC_SITE_NAME` | Site branding | `Signals` |
| `NEXTAUTH_URL` | NextAuth callback URL | `http://localhost:3000` (dev) |
| `NEXTAUTH_SECRET` | NextAuth JWT secret | Generate with: `openssl rand -base64 32` |
| `REDIS_URL` | Redis Cloud connection | `rediss://default:PASSWORD@redis-19818...` |
| `DISCORD_CLIENT_ID` | Discord OAuth app ID | From Discord Developer Portal |
| `DISCORD_CLIENT_SECRET` | Discord OAuth secret | From Discord Developer Portal |
| `SUPABASE_URL` | Supabase project URL | From Supabase dashboard |
| `SUPABASE_ANON_KEY` | Supabase anon key | From Supabase dashboard |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` (test), `sk_live_...` (prod) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | `whsec_...` |

**Public vs. Server-Side Variables:**
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Variables without prefix are server-side only (more secure)

### 3. Generate Secrets

```powershell
# Generate NEXTAUTH_SECRET (Git Bash or WSL)
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Add to .env.local:
# NEXTAUTH_SECRET=<generated_secret>
```

### 4. Verify Installation

```powershell
# Check Node.js version
node --version
# Expected: v18+ (currently v22.17.1)

# Check npm version
npm --version
# Expected: 9+

# Verify dependencies installed
dir node_modules
# Should contain folders like next, react, etc.

# Test Next.js CLI
npx next --version
# Expected: 14.2.10
```

### 5. Local Run Commands

#### Development Server (with hot reload)
```powershell
# Navigate to web workspace
cd C:\Users\Maith\OneDrive\Desktop\signals-site\web

# Start development server
npm run dev

# Server starts at: http://localhost:3000
# Open in browser to see the site
```

#### Production Build
```powershell
# Build for production
npm run build

# Start production server
npm run start

# Or use single command
npm run build && npm run start
```

#### Linting
```powershell
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

#### Type Checking (TypeScript)
```powershell
# Check types
npx tsc --noEmit
```

## Project Structure

```
signals-site/
├── web/                    # Next.js workspace
│   ├── app/                # App router pages (Next.js 14)
│   │   ├── api/            # API routes (NextAuth, webhooks)
│   │   ├── signals/        # Signals page
│   │   ├── pricing/        # Pricing page
│   │   └── page.tsx        # Landing page
│   ├── components/         # React components
│   │   ├── ui/             # UI primitives (buttons, cards, etc.)
│   │   ├── landing/        # Landing page sections
│   │   ├── signals/        # Signals page components
│   │   └── three/          # 3D components (Three.js)
│   ├── lib/                # Utilities and helpers
│   │   ├── redis.ts        # Redis client
│   │   ├── stripe.ts       # Stripe client
│   │   └── utils.ts        # General utilities
│   ├── styles/             # Global styles
│   ├── public/             # Static assets
│   ├── .env.local          # Environment variables (DO NOT COMMIT)
│   ├── .env.local.example  # Example template
│   ├── package.json        # Dependencies and scripts
│   └── next.config.js      # Next.js configuration
├── redis-ca.crt            # Redis Cloud CA certificate
└── SETUP.md                # This file
```

## Key Dependencies

### Core Framework
```json
"next": "14.2.10"              // Next.js framework
"react": "18.2.0"              // React library
"react-dom": "18.2.0"          // React DOM
"typescript": "5.3.3"          // TypeScript
```

### UI & Styling
```json
"tailwindcss": "3.3.6"         // Utility-first CSS
"framer-motion": "11.18.2"     // Animation library
"lucide-react": "^0.546.0"     // Icon library
"@radix-ui/react-icons": "1.3.2" // Radix UI icons
```

### 3D Graphics
```json
"three": "0.160.0"             // Three.js 3D library
"@react-three/fiber": "8.16.3" // React renderer for Three.js
"@react-three/drei": "9.106.0" // Helpers for R3F
```

### Data & State
```json
"swr": "2.3.6"                 // Data fetching
"zod": "3.23.8"                // Schema validation
"ioredis": "^5.8.1"            // Redis client
```

### Auth & Payments
```json
"next-auth": "4.24.5"          // Authentication
"stripe": "^19.1.0"            // Payment processing
```

### Charts
```json
"lightweight-charts": "^5.0.9" // Financial charts
"recharts": "2.12.7"           // General charts
```

## Development Workflow

### Hot Module Replacement (HMR)
Next.js automatically reloads changes. Edit any file and see updates instantly.

### File-Based Routing
- `app/page.tsx` → `/` (landing page)
- `app/signals/page.tsx` → `/signals`
- `app/pricing/page.tsx` → `/pricing`
- `app/api/auth/[...nextauth]/route.ts` → `/api/auth/*`

### Environment Variables Access
```typescript
// Client-side (browser)
const apiUrl = process.env.NEXT_PUBLIC_API_BASE;

// Server-side only
const stripeKey = process.env.STRIPE_SECRET_KEY;
```

## Testing

```powershell
# Run smoke tests (if available)
npm run test

# Or use Jest
npx jest

# E2E tests with Playwright (if configured)
npx playwright test
```

## Troubleshooting

### Port 3000 Already in Use
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace <PID> with actual process ID)
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

### Module Not Found Errors
```powershell
# Delete node_modules and reinstall
rm -r node_modules
npm install

# Or clear cache
npm cache clean --force
npm install
```

### TypeScript Errors
```powershell
# Check for type errors
npx tsc --noEmit

# Update @types packages
npm install --save-dev @types/node@latest @types/react@latest
```

### Build Errors
```powershell
# Clear Next.js cache
rm -r .next

# Rebuild
npm run build
```

### Redis Connection Issues
```powershell
# Check Redis URL in .env.local
cat .env.local | findstr REDIS_URL

# Ensure certificate exists
dir ..\redis-ca.crt

# Test connection from Node.js
node -e "const Redis = require('ioredis'); const r = new Redis(process.env.REDIS_URL, {tls: {ca: require('fs').readFileSync('redis-ca.crt')}}); r.ping().then(console.log);"
```

## Docker Alternative (Optional)

```powershell
# Build Docker image (from signals-site root)
cd C:\Users\Maith\OneDrive\Desktop\signals-site
docker build -t signals-site -f web/Dockerfile web/

# Run container
docker run -d -p 3000:3000 --env-file web/.env.local signals-site

# View logs
docker logs -f <container_id>
```

## Vercel Deployment (Production)

### Prerequisites
```powershell
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login
```

### Deploy to Vercel
```powershell
# Navigate to web directory
cd C:\Users\Maith\OneDrive\Desktop\signals-site\web

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Environment Variables (Vercel Dashboard)
1. Go to: https://vercel.com/your-project/settings/environment-variables
2. Add all variables from `.env.local.example`
3. Set correct values for production (use `live` mode, production API URLs, etc.)
4. Redeploy to apply changes

### Custom Domain
1. Add domain in Vercel dashboard: Settings → Domains
2. Update DNS records as instructed
3. SSL certificates auto-provisioned

## E2E Flow Validation

To verify the full stack: `crypto-ai-bot → Redis → signals-api → signals-site`

```powershell
# Terminal 1: Start crypto-ai-bot
cd C:\Users\Maith\OneDrive\Desktop\crypto_ai_bot
conda activate crypto-bot
python scripts/start_trading_system.py --mode paper

# Terminal 2: Start signals-api
cd C:\Users\Maith\OneDrive\Desktop\signals_api
conda activate signals-api
python main.py

# Terminal 3: Start signals-site
cd C:\Users\Maith\OneDrive\Desktop\signals-site\web
npm run dev

# Browser: Open http://localhost:3000
# Navigate to /signals page
# Expected: Live signals streaming from Redis via API
```

## KPI Monitoring

Key metrics to track (PRD-003 compliance):
- **Page Load Time**: p95 < 2s
- **Time to Interactive (TTI)**: < 3s
- **API Call Latency**: p95 < 200ms
- **SSE Connection Stability**: > 99% uptime
- **Core Web Vitals**:
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1

Monitor in:
- Chrome DevTools (Lighthouse)
- Vercel Analytics
- Google Analytics (GA4)

## Environment Recreation (Clean Slate)

```powershell
# Remove node_modules and lock files
cd C:\Users\Maith\OneDrive\Desktop\signals-site\web
rm -r node_modules
rm package-lock.json

# Reinstall dependencies
npm install

# Reconfigure environment
copy .env.local.example .env.local
notepad .env.local

# Verify
npm run dev
```

## Useful Links

- **Local Dev**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs (signals-api)
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Three.js Docs**: https://threejs.org/docs
- **Vercel Docs**: https://vercel.com/docs

## Next Steps

1. ✅ Install Node.js dependencies
2. ✅ Configure `.env.local` with API URLs and secrets
3. ✅ Start development server
4. ✅ Test landing page loads
5. ✅ Test `/signals` page with live data
6. 🔗 Validate E2E flow with API and bot
7. 🎨 Customize branding and content
8. 🚀 Deploy to Vercel

## Support & References

- **PRD**: `PRD-003 – Signals-Site Front-End SaaS Portal`
- **Deployment Guide**: `DEPLOYMENT_GUIDE.md`
- **Quick Start**: `QUICK_START_REVIEW.md`
- **Design System**: `DESIGN_SYSTEM_PLAN.md`

---

**PRD Compliance**: This setup guide satisfies PRD-003 requirements:
- ✅ Next.js 14 with App Router
- ✅ Tailwind CSS for styling
- ✅ Redis Cloud integration (SSE streams)
- ✅ Signals API integration (REST + SSE)
- ✅ Discord OAuth authentication
- ✅ Stripe payment integration
- ✅ Responsive design (mobile-first)
- ✅ 3D visualizations (Three.js)
- ✅ Real-time signal updates (SWR + SSE)
- ✅ Vercel deployment ready
