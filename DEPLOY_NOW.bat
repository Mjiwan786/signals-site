@echo off
echo ========================================
echo  Deploying Signals-Site to Vercel
echo ========================================
echo.

cd /d "C:\Users\Maith\OneDrive\Desktop\signals-site"

echo [1/3] Checking Vercel CLI installation...
vercel --version
if %errorlevel% neq 0 (
    echo ERROR: Vercel CLI not found. Installing now...
    npm install -g vercel
)

echo.
echo [2/3] Starting deployment...
echo Root Directory will be set to: web
echo.

vercel --prod --yes

echo.
echo [3/3] Deployment complete!
echo.
echo Your site should now be live at the URL shown above.
echo.
pause
