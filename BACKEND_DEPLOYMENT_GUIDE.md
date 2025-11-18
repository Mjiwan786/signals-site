# Backend Deployment Guide - Signals-API to Fly.dev

## Current Status
✅ **signals-api running locally**: http://localhost:8000
✅ **Frontend deployed**: https://www.aipredictedsignals.cloud
❌ **Backend NOT deployed**: https://api.aipredictedsignals.cloud (404)

## Test Results from Local API

```bash
# ✅ Signals endpoint works
curl "http://localhost:8000/v1/signals?mode=paper&limit=3"
# Returns: [{"id":"test-realtime-...","ts":1762004858500,"pair":"ETH/USD", ...}]

# ✅ PnL endpoint works
curl "http://localhost:8000/v1/pnl"
# Returns: [{"ts":1704067200000,"equity":10100.0,"daily_pnl":100.0}, ...]

# ✅ Health check works
curl "http://localhost:8000/health/live"
# Returns: {"status":"ok"}
```

## Problem
The production frontend expects the API at **https://api.aipredictedsignals.cloud** (configured via `NEXT_PUBLIC_API_URL` environment variable in Vercel), but that domain points to **signals-api.fly.dev** which is returning 404.

## Solution: Deploy signals-api to Fly.dev

### Prerequisites
- Fly.io account (already have app: signals-api.fly.dev)
- Fly CLI installed
- Redis Cloud credentials configured

---

## Step 1: Install Fly CLI

### Windows PowerShell:
```powershell
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

### Verify installation:
```powershell
fly version
```

---

## Step 2: Login to Fly.io

```powershell
fly auth login
```

This will open a browser for authentication.

---

## Step 3: Create fly.toml Configuration

Navigate to signals_api directory and create `fly.toml`:

```powershell
cd C:\Users\Maith\OneDrive\Desktop\signals_api
```

Create **fly.toml** with this content:

```toml
app = "signals-api"
primary_region = "iad"

[build]
  dockerfile = "Dockerfile"

[env]
  APP_NAME = "signals-api"
  APP_ENV = "production"
  APP_HOST = "0.0.0.0"
  APP_PORT = "8000"
  SIGNALS_STREAM_ACTIVE = "signals:paper"
  PROMETHEUS_ENABLED = "true"
  CORS_ALLOW_ORIGINS = "*"

[[services]]
  internal_port = 8000
  protocol = "tcp"
  auto_stop_machines = false
  auto_start_machines = true
  min_machines_running = 1

  [[services.ports]]
    handlers = ["http"]
    port = 80
    force_https = true

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443

  [services.concurrency]
    type = "connections"
    hard_limit = 250
    soft_limit = 200

  [[services.tcp_checks]]
    interval = "15s"
    timeout = "2s"
    grace_period = "10s"

  [[services.http_checks]]
    interval = "30s"
    timeout = "5s"
    grace_period = "10s"
    method = "get"
    path = "/health/live"
    protocol = "http"
```

---

## Step 4: Set Secrets in Fly.io

```powershell
# Redis Cloud connection (replace with your actual credentials)
fly secrets set REDIS_URL="rediss://default:<YOUR_REDIS_PASSWORD>@<YOUR_REDIS_HOST>:<PORT>"

# Redis TLS configuration
fly secrets set REDIS_SSL="true"
fly secrets set REDIS_CA_CERT_USE_CERTIFI="true"

# Other configuration
fly secrets set REDIS_DB="0"
fly secrets set REDIS_POOL_MAX="10"
fly secrets set REDIS_SOCKET_TIMEOUT="30"

# Verify secrets
fly secrets list
```

---

## Step 5: Deploy to Fly.dev

```powershell
fly deploy
```

This will:
1. Build the Docker image from `Dockerfile`
2. Push it to Fly.io registry
3. Start the application
4. Run health checks

Expected output:
```
==> Building image
...
==> Pushing image to fly
...
==> Deploying
 ✔ [app] completed successfully
```

---

## Step 6: Verify Deployment

### Check app status:
```powershell
fly status
```

Expected output:
```
App
  Name     = signals-api? or crypto-signals-api
  Owner    = personal
  Hostname = signals-api.fly.dev
  ...

Machines
  ID        STATE   REGION  ...
  abc123    started iad     ...
```

### Test the deployed API:
```powershell
# Health check
curl https://signals-api.fly.dev/health/live

# Signals endpoint
curl "https://signals-api.fly.dev/v1/signals?mode=paper&limit=5"

# PnL endpoint
curl https://signals-api.fly.dev/v1/pnl
```

### Check logs:
```powershell
fly logs
```

---

## Step 7: Test with Production Frontend

Once deployed, the frontend at **https://www.aipredictedsignals.cloud** should automatically connect because `NEXT_PUBLIC_API_URL` is set to `https://api.aipredictedsignals.cloud`, which is a CNAME for `signals-api.fly.dev`.

### Test checklist:
1. Open https://www.aipredictedsignals.cloud
2. Check browser console for API errors
3. Navigate to https://www.aipredictedsignals.cloud/signals
4. Verify signals are loading
5. Check PnL chart displays on homepage

---

## Troubleshooting

### Issue: "Error: failed to fetch an image or build from source"
**Solution**: Ensure Dockerfile is in the root of signals_api directory

### Issue: "Health check failed"
**Solution**:
- Verify Redis connection works: `fly ssh console -C "curl localhost:8000/health/ready"`
- Check secrets are set: `fly secrets list`
- Check logs: `fly logs`

### Issue: "Could not find App"
**Solution**: Initialize the app first:
```powershell
fly apps create signals-api
```

### Issue: Redis connection timeout
**Solution**:
- Verify Redis Cloud is accessible
- Check SSL certificate is valid (using certifi)
- Test Redis connection locally first

### Issue: CORS errors in frontend
**Solution**: Verify `CORS_ALLOW_ORIGINS` is set to `*` or includes your domain:
```powershell
fly secrets set CORS_ALLOW_ORIGINS="https://aipredictedsignals.cloud,https://www.aipredictedsignals.cloud"
```

---

## Scaling & Monitoring

### Scale machines:
```powershell
# Add more machines
fly scale count 2

# Change machine size
fly scale vm shared-cpu-1x --memory 512
```

### Monitor metrics:
```powershell
# View metrics
fly dashboard

# Stream logs
fly logs

# SSH into machine
fly ssh console
```

---

## Rollback

If deployment fails:
```powershell
# List releases
fly releases

# Rollback to previous
fly releases rollback <version>
```

---

## Next Steps After Deployment

1. ✅ **Verify API is accessible**: Test all endpoints
2. ✅ **Check frontend integration**: Signals load on production site
3. ✅ **Monitor logs**: Watch for errors or performance issues
4. ⏳ **Set up alerts**: Configure Fly.io alerts for downtime
5. ⏳ **Enable auto-scaling**: Configure based on traffic
6. ⏳ **Add custom domain**: Point api.aipredictedsignals.cloud directly to Fly

---

## Alternative: Temporary Public URL with ngrok

If you can't deploy to Fly.dev immediately, you can expose the local API temporarily:

1. **Install ngrok**:
   ```powershell
   choco install ngrok
   ```

2. **Expose localhost:8000**:
   ```powershell
   ngrok http 8000
   ```

3. **Update Vercel environment variable**:
   - Go to: https://vercel.com/ai-predicted-signals-projects/signals-site/settings/environment-variables
   - Edit `NEXT_PUBLIC_API_URL` for **Preview** environment
   - Set to: `https://YOUR_NGROK_URL` (e.g., `https://abc123.ngrok.io`)
   - Redeploy frontend

⚠️ **Warning**: ngrok free tier URLs expire when you close the terminal. Only use for testing!

---

## Files Referenced

- **signals-api code**: `C:\Users\Maith\OneDrive\Desktop\signals_api\`
- **Dockerfile**: `C:\Users\Maith\OneDrive\Desktop\signals_api\Dockerfile`
- **Environment**: `C:\Users\Maith\OneDrive\Desktop\signals_api\.env`
- **Integration guide**: `C:\Users\Maith\OneDrive\Desktop\signals_api\SIGNALS_SITE_INTEGRATION.md`
- **Runbook**: `C:\Users\Maith\OneDrive\Desktop\signals_api\RUNBOOK.md`

---

## Status Summary

| Component | Status | URL |
|-----------|--------|-----|
| Frontend | ✅ Deployed | https://www.aipredictedsignals.cloud |
| Backend (local) | ✅ Running | http://localhost:8000 |
| Backend (Fly.dev) | ❌ NOT deployed | https://signals-api.fly.dev (404) |
| Redis Cloud | ✅ Connected | redis-19818.c9.us-east-1-4.ec2.redns.redis-cloud.com:19818 |

**Action Required**: Deploy signals-api to Fly.dev using the steps above to make the production site functional.
