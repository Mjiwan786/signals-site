# Root Directory Fix - Final Solution

## Root Cause Found!
The Vercel project has `web` set as Root Directory, which causes double-pathing when deploying. Vercel looks for `web/web` which doesn't exist.

## The Solution (3 minutes)

### Step 1: Clear Root Directory
1. Go to: https://vercel.com/ai-predicted-signals-projects/signals-site/settings/build-and-deployment
2. Under **"Root Directory"**:
   - Click **"Edit"**
   - **Clear the field** (leave it blank/empty)
   - Click **"Save"**

### Step 2: Configure Build Commands
Since the root directory is now blank, tell Vercel where to build:

1. Still on the same page, under **"Build & Development Settings"**:
   - **Framework Preset:** Next.js
   - **Build Command:** `cd web && npm run build`
   - **Install Command:** `cd web && npm install`
   - **Output Directory:** `web/.next`

2. Click **"Save"**

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. OR just push a commit to trigger auto-deploy

## What Will Happen
- ✅ Build will take 1-2 minutes
- ✅ You'll see "Installing dependencies..."
- ✅ "Running next build..."
- ✅ "Generating static pages (19/19)"
- ✅ Site works at www.aipredictedsignals.cloud

## Why This Works
- Root Directory: (empty) = Deploy from repo root
- Build Command: `cd web &&` = Change into web directory first
- This avoids the double-pathing issue (`web/web`)
