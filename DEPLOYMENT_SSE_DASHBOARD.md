# SSE Dashboard Deployment & Testing Guide

**Status**: ✅ Implementation Complete - Ready for Testing
**Date**: 2025-11-06

---

## 🎯 What Was Built

### **New Components Created**

1. **`components/HealthDashboard.tsx`** ✨ NEW
   - Real-time system health monitoring
   - Displays metrics from 3 Redis streams:
     - `system:metrics` → Bot health, Redis lag, last signal time
     - `kraken:health` → Kraken WS latency & circuit breakers
     - `ops:heartbeat` → System heartbeat & uptime
   - Color-coded health indicators
   - Auto-reconnect on connection loss

2. **`components/SignalsFeedSSE.tsx`** ✨ NEW
   - Real-time signal streaming via SSE
   - Replaces polling with WebSocket-like experience
   - Animated signal additions
   - Supports both paper & live modes

### **Updated/Enhanced Files**

3. **`lib/streaming-hooks.ts`**
   - ✅ Added `useSignalsStream()` hook for signals SSE
   - ✅ Added `useHealthStream()` hook for health metrics SSE
   - ✅ Exponential backoff reconnection logic
   - ✅ Connection state management

4. **`app/dashboard/page.tsx`**
   - ✅ Updated to use all SSE components
   - ✅ Layout: Health → PnL → Signals
   - ✅ Dynamic imports to avoid SSR issues

---

## 📦 Files Modified/Created

```
signals-site/web/
├── lib/
│   └── streaming-hooks.ts          [UPDATED] Added useSignalsStream, useHealthStream
├── components/
│   ├── HealthDashboard.tsx          [NEW] System health dashboard
│   └── SignalsFeedSSE.tsx           [NEW] Live signals feed with SSE
└── app/
    └── dashboard/
        └── page.tsx                 [UPDATED] Integrated all SSE components
```

---

## 🚀 Deployment Steps

### 1. Install Dependencies (if needed)

The project should already have the necessary dependencies, but verify:

```bash
cd C:\Users\Maith\OneDrive\Desktop\signals-site\web

# Check if dependencies are installed
npm list framer-motion
npm list lucide-react

# If missing, install them
npm install framer-motion lucide-react
```

### 2. Test Locally

```bash
# Make sure you're in the web directory
cd C:\Users\Maith\OneDrive\Desktop\signals-site\web

# Start the development server
npm run dev

# Open browser to http://localhost:3000/dashboard
```

### 3. Verify API Connection

Check that the environment variable is set correctly:

```bash
# Check .env.local or .env file
cat .env.local | grep API_BASE

# Should contain:
NEXT_PUBLIC_API_BASE=https://crypto-signals-api.fly.dev
```

If not set, create/update `.env.local`:

```bash
echo "NEXT_PUBLIC_API_BASE=https://crypto-signals-api.fly.dev" > .env.local
```

### 4. Deploy to Vercel

```bash
# From the web directory
vercel --prod

# Or push to GitHub (if auto-deploy is configured)
git add .
git commit -m "feat: Add SSE dashboard with real-time health metrics"
git push origin main
```

---

## 🧪 Testing Checklist

### **Test 1: Health Dashboard Connection**

1. Navigate to `/dashboard`
2. ✅ Health Dashboard should show:
   - Green "Live" indicator in top right
   - System metrics updating
   - Kraken metrics updating
   - Heartbeat status

**Expected Values (when bot running):**
- Redis Lag: < 50ms (green)
- Last Signal: < 60s ago (green/yellow)
- Active Agents: >= 1
- Kraken Latency: < 100ms (green)
- Circuit Breakers: "closed" (green)
- Uptime: Increasing

### **Test 2: Signals Feed Connection**

1. On same `/dashboard` page
2. ✅ Signals Feed should show:
   - Green "Live" indicator
   - Signals appearing in real-time (when bot generates signals)
   - Animated additions of new signals

**Trigger Test Signal:**
From crypto-ai-bot repo:
```bash
# Manually trigger a signal for testing
python scripts/publish_sample_signals.py
```

### **Test 3: PnL Chart**

1. ✅ PnL Chart should load historical data
2. ✅ Chart should be responsive
3. ✅ Timeframe toggles should work

### **Test 4: Reconnection Logic**

1. Stop the signals-api temporarily
2. ✅ All SSE connections should show "Disconnected"
3. Restart signals-api
4. ✅ Connections should automatically reconnect within 10 seconds

### **Test 5: Error Handling**

1. With API offline:
   - ✅ Error messages should display
   - ✅ UI should remain functional (no crashes)
   - ✅ Reconnect attempts should be visible in console

### **Test 6: Performance**

1. Leave dashboard open for 10+ minutes
2. ✅ No memory leaks
3. ✅ Smooth animations
4. ✅ No excessive CPU usage

---

## 🐛 Troubleshooting

### Issue: "Connection Failed"

**Check:**
1. API is running: `curl https://crypto-signals-api.fly.dev/health`
2. SSE endpoint exists: `curl -N https://crypto-signals-api.fly.dev/streams/sse/health`
3. Browser console for CORS errors

**Fix:**
```bash
# Verify API_BASE env var
echo $NEXT_PUBLIC_API_BASE

# Should be: https://crypto-signals-api.fly.dev
```

### Issue: "No Data Showing"

**Check:**
1. crypto-ai-bot is running and publishing to Redis
2. Check Redis streams have data:
```bash
redis-cli -u redis://default:****@redis-19818.c9.us-east-1-4.ec2.redns.redis-cloud.com:19818 --tls --cacert config/certs/redis_ca.pem

XLEN system:metrics
XLEN kraken:health
XLEN ops:heartbeat
XREVRANGE system:metrics + - COUNT 1
```

3. signals-api can read from Redis:
```bash
curl https://crypto-signals-api.fly.dev/health
```

### Issue: "TypeScript Errors"

**Fix:**
```bash
cd web
npm run build

# If errors, check imports:
# - lucide-react icons
# - framer-motion
# - All hook imports from @/lib/streaming-hooks
```

### Issue: "SSE Not Connecting in Production"

**Check Vercel Logs:**
```bash
vercel logs

# Look for:
# - EventSource connection attempts
# - CORS errors
# - Network errors
```

**Common Fix:**
Ensure `NEXT_PUBLIC_API_BASE` is set in Vercel environment variables:
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add: `NEXT_PUBLIC_API_BASE` = `https://crypto-signals-api.fly.dev`
3. Redeploy

---

## 📊 Monitoring

### Browser Console Logs

With dashboard open, you should see:
```
Signals SSE connection established
Health SSE connection established
PnL SSE connection established
```

### Expected Network Activity

In browser DevTools → Network → EventStream:
- `/streams/sse?type=signals&mode=paper` → 200 (streaming)
- `/streams/sse/health` → 200 (streaming)
- `heartbeat` messages every 15 seconds

### Performance Metrics

**Acceptable Ranges:**
- Initial load time: < 3s
- SSE connection time: < 1s
- Signal latency (bot → dashboard): < 1s
- Memory usage: < 100MB (after 1 hour)

---

## ✅ Definition of Done - Final Checklist

### Backend (crypto-ai-bot + signals-api) ✅
- [x] Bot publishes signals to Redis
- [x] Bot publishes Kraken WS metrics
- [x] Bot publishes system health metrics
- [x] Bot publishes heartbeat every 15s
- [x] Bot publishes PnL equity every 60s
- [x] API SSE endpoint for signals
- [x] API SSE endpoint for PnL
- [x] API SSE endpoint for health metrics

### Frontend (signals-site) ✅
- [x] HealthDashboard component created
- [x] SignalsFeedSSE component created
- [x] SSE hooks implemented (useSignalsStream, useHealthStream)
- [x] Dashboard page updated with all components
- [x] Auto-reconnect logic implemented
- [x] Error handling implemented
- [x] Responsive design

### Testing ⏳
- [ ] Local testing complete
- [ ] API connections verified
- [ ] Signals streaming verified
- [ ] Health metrics streaming verified
- [ ] Reconnection logic tested
- [ ] Deployed to Vercel
- [ ] End-to-end test (bot → Redis → API → site) verified

---

## 🎉 Success Criteria

**System is considered fully operational when:**

1. ✅ All 3 SSE connections show "Live" (green)
2. ✅ Health metrics update every 30s
3. ✅ Signals appear in real-time when generated
4. ✅ No errors in browser console
5. ✅ Reconnection works after API restart
6. ✅ Dashboard accessible at https://aipredictedsignals.cloud/dashboard

---

## 📞 Support

### Logs to Check

**crypto-ai-bot:**
```bash
# Check if publishing metrics
tail -f logs/crypto_ai_bot.log | grep "system:metrics"
tail -f logs/crypto_ai_bot.log | grep "kraken:health"
```

**signals-api:**
```bash
# Check SSE connections
fly logs -a crypto-signals-api | grep "SSE"
```

**signals-site:**
```bash
# Check Vercel logs
vercel logs --follow
```

### Quick Health Check

```bash
# 1. Check bot is running
curl http://localhost:8080/health

# 2. Check API is running
curl https://crypto-signals-api.fly.dev/health

# 3. Check Redis has data
redis-cli -u redis://... XLEN system:metrics

# 4. Check SSE endpoints
curl -N https://crypto-signals-api.fly.dev/streams/sse/health

# 5. Check site is deployed
curl https://aipredictedsignals.cloud/dashboard
```

---

**Next Step**: Run `npm run dev` and test the dashboard locally!
