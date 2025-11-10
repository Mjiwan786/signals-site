# Framework Detection Fix

## The Problem
Vercel built in 99ms and deployed nothing because it didn't detect Next.js.

## The Fix (1 minute)

1. **Go to Build Settings:**
   👉 https://vercel.com/ai-predicted-signals-projects/signals-site/settings/build-and-deployment

2. **Check "Framework Preset":**
   - Should be set to: **Next.js**
   - If it shows "Other" or empty, click "Edit" and select **Next.js**

3. **Verify these are EMPTY or DEFAULT:**
   - Build Command: (should show `next build` or be empty)
   - Install Command: (should show `npm install` or be empty)
   - Output Directory: (should show `.next` or be empty)

4. **Root Directory:**
   - Should be: `web`

5. **Click "Save"**

6. **Go to Deployments tab and Redeploy**

## After This Fix
The build should:
- ✅ Take 1-2 minutes (not 99ms!)
- ✅ Show "Installing dependencies..."
- ✅ Show "next build" running
- ✅ Generate 19 routes
- ✅ Site works at www.aipredictedsignals.cloud
