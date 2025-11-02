# ⚠️ MANUAL FIX REQUIRED - Vercel Project Settings

## The Problem
The Vercel project `signals-site` has custom build commands configured that conflict with the repository structure. These settings are stored in Vercel's database and cannot be changed via vercel.json or CLI.

## Current Situation
- **Project:** ai-predicted-signals-projects/signals-site
- **Error:** `sh: line 1: cd: web: No such file or directory`
- **Root Cause:** Project settings have build command: `cd web && npm install`

## The Fix (2 Minutes)

### Option 1: Clear Custom Build Commands (RECOMMENDED)
1. Go to: https://vercel.com/ai-predicted-signals-projects/signals-site/settings
2. Scroll to **"Build & Development Settings"**
3. **Clear ALL custom commands:**
   - Build Command: (leave empty or set to default)
   - Install Command: (leave empty or set to default)
   - Output Directory: (leave empty or set to default)
4. Scroll to **"Root Directory"**
5. Set to: `web`
6. Click **"Save"**
7. Go to **Deployments** tab
8. Click **"Redeploy"** on the latest deployment

### Option 2: Configure Build Commands Properly
1. Go to: https://vercel.com/ai-predicted-signals-projects/signals-site/settings
2. Under **"Build & Development Settings"**:
   - Framework Preset: `Next.js`
   - Build Command: (leave as default: `next build`)
   - Install Command: (leave as default: `npm install`)
   - Output Directory: (leave as default: `.next`)
3. Under **"Root Directory"**: `web`
4. Click **"Save"**
5. Redeploy

## Why This Happens
The project was previously configured with custom build commands that included `cd web &&`, but those commands don't work when the root directory is already set to `web` in project settings.

## After You Fix
Once you've cleared the custom build commands and set root directory to `web`, the deployment will:
- ✅ Run `npm install` in the web/ directory
- ✅ Run `npm run build` in the web/ directory
- ✅ Deploy successfully to www.aipredictedsignals.cloud
- ✅ All 19 routes will be available
- ✅ SSE integration, flood controls, and all features active

## Quick Link
👉 **[Fix Now: Open Project Settings](https://vercel.com/ai-predicted-signals-projects/signals-site/settings)**

---

## Alternative: Deploy Without Root Directory Setting

If you want to keep the root at the repo root:

1. Clear Root Directory: (set to blank)
2. Keep vercel.json with:
```json
{
  "buildCommand": "cd web && npm run build",
  "installCommand": "cd web && npm install",
  "outputDirectory": "web/.next"
}
```
3. Redeploy

But **Option 1 above is cleaner and recommended**.
