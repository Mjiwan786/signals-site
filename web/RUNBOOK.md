# Signals Site Runbook

## Local Development

### Prerequisites
- Node.js 18+
- Running signals-api on `localhost:8000` (conda env: `signals-api`)

### Quick Start (PowerShell)

```powershell
# Set environment variables
$env:NEXT_PUBLIC_API_BASE="http://localhost:8000"
$env:NEXT_PUBLIC_SIGNALS_MODE="paper"

# Install dependencies and run
cd web
npm install
npm run dev
```

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

### Environment Variables

Create `.env.local` in the `web/` directory:

```env
NEXT_PUBLIC_API_BASE=http://localhost:8000
NEXT_PUBLIC_SIGNALS_MODE=paper
```

## Production Deployment

### Vercel Deployment

1. **Connect Repository to Vercel**
   - Import project from GitHub
   - Set root directory to `web/`

2. **Configure Environment Variables**

   In Vercel project settings, add:
   ```
   NEXT_PUBLIC_API_BASE=https://api.aipredictedsignals.cloud
   NEXT_PUBLIC_SIGNALS_MODE=paper
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

## API Endpoints

The frontend expects these endpoints from signals-api:

- `GET /v1/pnl?n=500` - PnL history (n points)
- `GET /v1/pnl/latest` - Latest PnL point
- `GET /v1/signals?mode=paper|live&pair=&limit=` - Signals list
- `GET /v1/signals/stream?mode=paper` - SSE stream (optional)

## Redis Connection

API backend connects to Redis Cloud:
```bash
redis-cli -u redis://default:inwjuBWkh4rAtGnbQkLBuPkHXSmfokn8@redis-19818.c9.us-east-1-4.ec2.redns.redis-cloud.com:19818 --tls --cacert <path_to_ca_certfile>
```

## Troubleshooting

### Yellow banner "API Configuration Missing"
- Ensure `NEXT_PUBLIC_API_BASE` is set in `.env.local`
- Restart dev server after changing env vars

### "Loading equity..." stuck
- Check signals-api is running on the configured API_BASE
- Verify `/v1/pnl?n=500` endpoint responds

### "No signals yet" in table
- Check signals-api has data in Redis
- Try refreshing with different mode (paper/live)
- Verify `/v1/signals?mode=paper&limit=200` endpoint responds

## Build Commands

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Lint
npm run lint
```
