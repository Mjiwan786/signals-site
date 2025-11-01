# Vercel Deployment Setup for signals-site Project

## Current Situation
The code is deployed successfully but to the wrong Vercel project ("web" instead of "signals-site").

## Solution: Configure Root Directory in Vercel Dashboard

Since the `rootDirectory` property cannot be set via `vercel.json`, you need to configure it through the Vercel dashboard:

### Steps:

1. **Go to Vercel Dashboard:**
   - Navigate to: https://vercel.com/ai-predicted-signals-projects/signals-site

2. **Open Project Settings:**
   - Click on "Settings" tab
   - Go to "General" section

3. **Set Root Directory:**
   - Scroll to "Root Directory"
   - Click "Edit"
   - Enter: `web`
   - Click "Save"

4. **Trigger Redeploy:**
   ```bash
   # From the signals-site root directory
   git commit --allow-empty -m "trigger: Redeploy after root directory config"
   git push origin main
   ```

5. **Or Deploy via CLI:**
   ```bash
   vercel --prod
   ```

### Expected Result:
- Project: signals-site
- URL: https://www.aipredictedsignals.cloud
- Domain: aipredictedsignals.cloud
- Root: web/
- Build: npm run build (in web/ directory)

---

## Alternative: Use Vercel API (Advanced)

If you have a Vercel API token, you can configure programmatically:

```bash
curl -X PATCH \
  "https://api.vercel.com/v9/projects/prj_4qguFATdOKPAJyAb9DVlCCVHEVS3" \
  -H "Authorization: Bearer YOUR_VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rootDirectory": "web"
  }'
```

---

## Current Deployment Status

### ✅ Successfully Deployed (Wrong Project):
- Project: `ai-predicted-signals-projects/web`
- URL: https://web-qxgkzdpko-ai-predicted-signals-projects.vercel.app
- Status: ● Ready
- Build: Successful

### 🎯 Target Project:
- Project: `ai-predicted-signals-projects/signals-site`
- URL: https://www.aipredictedsignals.cloud
- Domain: aipredictedsignals.cloud
- Status: Needs root directory configuration

---

## Quick Fix (Do This Now):

1. Open: https://vercel.com/ai-predicted-signals-projects/signals-site/settings
2. Set Root Directory to: `web`
3. Save
4. Run: `git push origin main` (to trigger auto-deploy)

OR manually redeploy:
```bash
vercel --prod
```

The deployment will then use the correct domain: **www.aipredictedsignals.cloud**
