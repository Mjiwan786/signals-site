@echo off
echo ========================================
echo Testing UI/UX Deployment
echo ========================================
echo.

cd web

echo [1/5] Checking environment variables...
echo.
findstr /R "STRIPE_SECRET_KEY.*sk_test" .env.local >nul
if %errorlevel% equ 0 (
    echo [OK] Stripe Secret Key configured
) else (
    echo [WARNING] Stripe Secret Key needs configuration
)

findstr /R "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.*pk_test" .env.local >nul
if %errorlevel% equ 0 (
    echo [OK] Stripe Publishable Key configured
) else (
    echo [WARNING] Stripe Publishable Key needs configuration
)

echo.
echo [2/5] Checking node_modules...
if exist "node_modules\" (
    echo [OK] Dependencies installed
) else (
    echo [ERROR] Dependencies not installed. Run: npm install
    goto :end
)

echo.
echo [3/5] Checking new pages...
if exist "app\pricing\page.tsx" (
    echo [OK] Enhanced pricing page exists
) else (
    echo [ERROR] Pricing page not found
)

if exist "app\subscription\page.tsx" (
    echo [OK] Subscription page exists
) else (
    echo [ERROR] Subscription page not found
)

if exist "app\white-label\page.tsx" (
    echo [OK] White-label page exists
) else (
    echo [ERROR] White-label page not found
)

echo.
echo [4/5] Checking API routes...
if exist "app\api\subscription\route.ts" (
    echo [OK] Subscription API exists
) else (
    echo [ERROR] Subscription API not found
)

if exist "app\api\contact\white-label\route.ts" (
    echo [OK] Contact API exists
) else (
    echo [ERROR] Contact API not found
)

echo.
echo [5/5] Checking components...
if exist "components\EnhancedErrorBoundary.tsx" (
    echo [OK] Error boundary component exists
) else (
    echo [ERROR] Error boundary not found
)

echo.
echo ========================================
echo Test Summary Complete
echo ========================================
echo.
echo NEXT STEPS:
echo 1. Complete Stripe setup (see STRIPE_SETUP_GUIDE.md)
echo 2. Run: npm run dev
echo 3. Test pages:
echo    - http://localhost:3000/pricing
echo    - http://localhost:3000/white-label
echo    - http://localhost:3000/subscription
echo.

:end
pause
