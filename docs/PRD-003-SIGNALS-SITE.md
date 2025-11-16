# PRD-003: Signals-Site Front-End SaaS Portal
**Product Requirements Document**

**Version:** 1.0
**Last Updated:** 2025-01-14
**Status:** Authoritative Reference
**Owner:** Engineering, UX, Product, DevOps

---

## 1. Executive Summary

### Overview
**Signals-Site** is a Next.js 15-based front-end portal that serves as the public-facing SaaS interface for a cryptocurrency trading signals platform. It operates as the final presentation layer in a 3-tier architecture:

```
crypto-ai-bot → Redis Cloud Streams → signals-api (Fly.io) → signals-site (Vercel)
```

The platform markets and delivers real-time AI-generated trading signals to retail and professional traders through tiered subscription plans, integrating Stripe for billing and Discord for signal delivery.

### Current State Assessment
A comprehensive end-to-end system evaluation has revealed **critical functional, data integrity, and UX gaps** that prevent the platform from being investor-ready or production-viable:

#### Data & Integration Issues
- **Empty Metrics Across All Pages**: ROI, win rate, profit factor, Sharpe ratio, and drawdown fields display zeros or placeholder values
- **Non-Functional SSE Integration**: EventSource connections fail silently; live signals page shows no data
- **Broken API Communication**: REST endpoints return errors or are not properly integrated
- **Missing Fallback States**: No graceful degradation when API is unavailable

#### Content & Messaging Inconsistencies
- **Contradictory Signal Frequency Claims**: Homepage states "2 signals per day" while marketing copy claims "120+ signals per day"
- **Duplicate Trading Pairs**: BTC/USD, ETH/USD, SOL/USD appear 2-3 times in supported pairs list
- **Unclear Tier Differentiation**: Free vs Premium vs Elite features overlap or contradict
- **Inconsistent Performance Claims**: Different pages cite different historical returns

#### Navigation & Link Integrity Failures
- **404 Errors**: `/methodology` page returns not found
- **Broken External Links**: Runbook GitHub URL is invalid
- **Unreachable Status Page**: Site health monitoring not implemented
- **Non-Functional CTAs**: "Subscribe Now" and "Start Free Trial" buttons lead nowhere

#### Subscription & Billing Flow Breakdown
- **Stripe Integration Non-Functional**: Checkout buttons do not create sessions or redirect
- **Duplicate Discord Role Definitions**: Same tier descriptions repeated across pricing cards
- **Missing Trial/Refund Policies**: No clear explanation of trial period or cancellation terms
- **No Payment Confirmation Flow**: Users have no success/failure feedback after checkout

#### UX/UI Quality Gaps
- **No Interactive Demos**: Charts and signals cannot be explored without account
- **Missing Mobile Optimization**: Charts and tables break on small screens
- **Absent Tooltips**: Technical metrics (Sharpe, drawdown, confidence) unexplained
- **Accessibility Violations**: Missing ARIA labels, poor keyboard navigation, insufficient contrast
- **Charts Missing Data**: TradingView widgets show empty candles or error states

#### Documentation Gaps
- **Missing Methodology Page**: Core algorithm explanation unavailable
- **No API Reference**: Developers cannot integrate programmatically
- **Incomplete Architecture Diagram**: System flow not documented
- **No User Onboarding**: New subscribers have no guide to getting started

#### SEO & Trust Deficiencies
- **Missing Meta Tags**: Pages lack proper title, description, OG tags
- **No Structured Data**: JSON-LD markup absent for search engines
- **Missing Alt Text**: Images not accessible or SEO-optimized
- **No Uptime Transparency**: No public status page or SLA reporting
- **Zero Social Proof**: No testimonials, case studies, or trust signals
- **Poor Lighthouse Scores**: Performance, accessibility, SEO below 70/100

### Strategic Impact
These issues collectively render the platform **unsuitable for investor presentation, user acquisition, or production operation**. This PRD defines the complete remediation roadmap to achieve:
- Real-time, data-driven signal delivery
- Functional end-to-end subscription flow
- Production-grade reliability and observability
- Investor-grade presentation quality
- SEO and accessibility compliance

---

## 2. Problem Analysis (Based on System Review Findings)

### A. Data Loading Issues

#### Observed Problems
1. **PnL Dashboard Shows Zeros**
   - `totalPnL`, `winRate`, `profitFactor`, `sharpeRatio`, `maxDrawdown` fields all display `0` or `--`
   - Equity curve chart renders but shows flat line
   - Monthly return table is empty

2. **Home Page Metrics Empty**
   - "Total ROI" widget: `0%`
   - "Win Rate" widget: `0%`
   - "Profit Factor" widget: `0`
   - "Active Signals" widget: `0`

3. **SSE Connection Failures**
   - `/api/live-signals` endpoint establishes connection but emits no events
   - EventSource `readyState` shows OPEN but `onmessage` never fires
   - No reconnection logic on failure
   - Browser console shows no errors (silent failure)

4. **API Integration Errors**
   - `NEXT_PUBLIC_API_BASE` environment variable may be undefined or incorrect
   - Fetch requests to `/performance`, `/signals/latest`, `/pnl` return 404 or 500
   - CORS issues between Vercel and Fly.io deployments
   - No retry logic for transient failures

#### Root Causes
- **signals-api** may not be returning data correctly
- **Redis Stream** may be empty or not being consumed
- **crypto-ai-bot** may not be publishing to streams
- Frontend components may have incorrect API endpoint paths
- Environment variables not properly configured in Vercel

#### Required Fixes
- Verify full data pipeline: bot → Redis → API → frontend
- Implement robust error handling and logging at each integration point
- Add loading skeletons and error boundary components
- Display meaningful error messages when data unavailable
- Implement retry logic with exponential backoff
- Add health check endpoints for each service

---

### B. Content & Messaging Inconsistencies

#### Observed Problems
1. **Signal Frequency Contradictions**
   - Hero section: "Receive 2 high-confidence signals daily"
   - Features section: "120+ signals per day across 15 pairs"
   - Pricing page: "Up to 50 signals per week"
   - Footer: "Real-time signal alerts 24/7"

2. **Duplicate Trading Pairs**
   - Supported pairs list shows:
     ```
     BTC/USD, ETH/USD, SOL/USD, ADA/USD, BTC/USD, ETH/USD, MATIC/USD,
     AVAX/USD, DOT/USD, SOL/USD, LINK/USD, UNI/USD
     ```
   - BTC/USD appears twice
   - ETH/USD appears twice
   - SOL/USD appears twice

3. **Performance Claims Vary**
   - Homepage: "78% average win rate"
   - Pricing page: "Historical win rate: 65-72%"
   - Methodology (before 404): "Backtested at 81% accuracy"

4. **Tier Confusion**
   - Free tier description duplicated in Premium card
   - Elite tier features listed as "All Premium features" without specifics
   - Discord role names inconsistent with tier names

#### Root Causes
- Multiple developers/writers editing copy without central reference
- No single source of truth for marketing claims
- Lack of data-driven validation of performance metrics
- No QA process for content consistency

#### Required Fixes
- Establish **single source of truth** for all performance metrics (pull from actual `/performance` API endpoint)
- Deduplicate trading pairs list to unique symbols only
- Align signal frequency claim with actual bot output (measure average signals/day over 30 days)
- Create content style guide defining tone, claims, and terminology
- Implement CMS or content validation layer to prevent contradictions

---

### C. Broken Navigation & Links

#### Observed Problems
1. **404 Errors**
   - `/methodology` → "Page Not Found"
   - `/docs/architecture` → "Page Not Found"
   - `/docs/api-reference` → "Page Not Found"
   - `/status` → "Page Not Found"

2. **Broken External Links**
   - Footer "Runbook" link → `https://github.com/username/crypto-ai-bot/RUNBOOK.md` (invalid repo URL)
   - "View Source" → points to private repo (403 Forbidden)

3. **Non-Functional CTAs**
   - "Subscribe Now" button → `onClick` handler undefined
   - "Start Free Trial" → redirects to `/pricing` but no action occurs
   - "View Live Signals" → requires login but auth not implemented

4. **Mobile Navigation Broken**
   - Hamburger menu does not toggle
   - Dropdown menus overlap content
   - Footer links not accessible on mobile

#### Root Causes
- Pages deleted or never created
- Hardcoded URLs not updated after repo rename
- Incomplete Next.js routing configuration
- Missing responsive CSS for navigation components

#### Required Fixes
- Create all missing documentation pages (see Section 9)
- Update all external links to valid public URLs
- Implement proper Next.js Link components with href validation
- Add link integrity tests in CI/CD
- Fix mobile navigation with proper z-index and toggle state management
- Implement authentication flow for gated content

---

### D. Subscription & Billing Flow Issues

#### Observed Problems
1. **Stripe Checkout Not Functional**
   - Clicking "Subscribe" does nothing
   - No Stripe session created
   - No redirect to checkout
   - Console errors: "Stripe not defined" or "publishableKey missing"

2. **Duplicate Discord Role Info**
   - Premium card shows: "Access to #premium-signals Discord channel"
   - Elite card shows: "Access to #premium-signals Discord channel" (should be #elite-signals)
   - Free tier shows same role as Premium

3. **Missing Trial/Refund Policy**
   - No mention of 7-day trial period
   - Refund policy link returns 404
   - Cancellation process not explained

4. **No Payment Confirmation**
   - After successful payment, user sees blank page
   - No email confirmation sent
   - Discord role not automatically assigned
   - No redirect to dashboard or welcome page

#### Root Causes
- Stripe webhook integration incomplete
- Discord bot OAuth flow not implemented
- Environment variables for Stripe keys missing in Vercel
- No success/cancel URLs configured in Stripe session creation
- Lack of server-side session management

#### Required Fixes
- Implement full Stripe checkout flow:
  ```typescript
  // /api/create-checkout-session
  - Create Stripe session with correct price IDs
  - Set success_url and cancel_url
  - Include metadata (userId, tier)
  ```
- Create Stripe webhook handler at `/api/webhooks/stripe`:
  - Handle `checkout.session.completed`
  - Update user tier in database
  - Trigger Discord role assignment via API
- Create success page at `/subscribe/success`
- Create cancel page at `/subscribe/cancel`
- Add trial period badge to pricing cards
- Link to clear refund policy page (`/policies/refunds`)
- Implement Discord OAuth flow to link user accounts
- Send transactional email on successful subscription

---

### E. UX/UI Gaps

#### Observed Problems
1. **No Interactive Demos**
   - Cannot explore signal format without account
   - No sample signal data visible
   - Charts require login to view

2. **Mobile Responsiveness Failures**
   - PnL dashboard table scrolls horizontally off-screen
   - Charts do not resize for mobile viewports
   - Pricing cards stack incorrectly on small screens
   - Navigation menu overlaps hero section on tablet

3. **Missing Tooltips/Help Text**
   - "Sharpe Ratio" metric has no explanation
   - "Confidence Score" meaning unclear
   - "Max Drawdown" shown without context
   - Technical jargon used without glossary

4. **Accessibility Violations**
   - Missing alt text on hero image
   - Insufficient color contrast (WCAG AA fails)
   - Keyboard navigation broken (cannot tab through pricing cards)
   - No skip-to-content link
   - Chart data not accessible to screen readers

5. **Charts Missing Data/Context**
   - TradingView widget shows "No data available"
   - Equity curve chart lacks axis labels
   - Monthly return heatmap missing legend
   - No date range selector for historical data

6. **Loading States Absent**
   - Components show raw JSON or undefined during load
   - No skeletons or spinners
   - "Flash of unstyled content" on page transitions

7. **Error States Non-Existent**
   - API failures show blank page
   - No retry button when data load fails
   - Generic error messages like "Something went wrong"

#### Root Causes
- Development prioritized functionality over UX polish
- No dedicated UX designer involved in implementation
- No accessibility audit conducted
- Responsive design tested only on desktop
- Lack of error boundary components
- Missing loading state management

#### Required Fixes
- Create sample signal gallery visible without login
- Implement mobile-first responsive design:
  - Use CSS Grid/Flexbox with breakpoints
  - Test on iPhone SE, iPad, desktop widths
  - Ensure touch targets ≥ 44x44px
- Add tooltip component library (e.g., Radix UI Tooltip):
  ```jsx
  <Tooltip content="Sharpe Ratio measures risk-adjusted returns">
    <InfoIcon />
  </Tooltip>
  ```
- Conduct WCAG 2.1 AA accessibility audit and remediate:
  - Add ARIA labels to all interactive elements
  - Ensure color contrast ≥ 4.5:1
  - Implement keyboard navigation
  - Add alt text to all images
  - Provide text alternatives for charts
- Implement loading skeletons for all async components
- Create error boundary with retry functionality:
  ```jsx
  <ErrorBoundary fallback={<ErrorState onRetry={refetch} />}>
    <PnLDashboard />
  </ErrorBoundary>
  ```
- Add Recharts or Chart.js with proper labels, legends, and responsive config
- Create design system documenting spacing, colors, typography

---

### F. Documentation Gaps

#### Missing Pages
1. **`/methodology`** (Currently 404)
   - Should explain:
     - Algorithm overview (bar reaction, momentum, multi-timeframe)
     - Signal generation logic
     - Backtesting methodology
     - Risk management approach
     - Performance validation process

2. **`/docs/api-reference`** (Currently 404)
   - Should provide:
     - REST API endpoints documentation
     - Authentication (API key usage)
     - Request/response schemas
     - Rate limiting details
     - Example cURL commands
     - WebSocket/SSE connection guide

3. **`/docs/architecture`** (Currently 404)
   - Should diagram:
     - 3-tier system flow (bot → Redis → API → frontend)
     - Data pipeline (Kraken → feature engineering → model inference → Redis Stream)
     - Deployment architecture (Fly.io, Vercel, Redis Cloud)
     - Security boundaries
     - Scalability considerations

4. **`/docs/runbook`** (Broken link)
   - Should cover:
     - Operational procedures
     - Incident response playbook
     - Deployment process
     - Rollback procedures
     - Monitoring and alerting setup
     - Common troubleshooting scenarios

5. **`/docs/signal-format`** (Not created)
   - Should define:
     - Signal schema (JSON structure)
     - Field definitions (pair, side, confidence, timestamp, etc.)
     - Sentiment encoding
     - Timeframe specifications
     - How to interpret signals for trading

6. **User Onboarding Guide** (Not created)
   - Should provide:
     - Getting started tutorial
     - Discord setup instructions
     - How to interpret signals
     - Risk disclaimer
     - FAQ section

#### Root Causes
- Documentation treated as low priority
- Developers assumed code is self-explanatory
- No technical writer assigned
- Documentation not part of definition of done

#### Required Fixes
- Create all missing documentation pages (detailed requirements in Section 9)
- Implement documentation site using Next.js MDX support
- Add search functionality to docs
- Create table of contents navigation
- Include code examples and diagrams
- Establish documentation review process
- Link to docs from all relevant UI locations

---

### G. SEO & Trust Issues

#### Observed Problems
1. **Missing Meta Tags**
   - No `<title>` tags on most pages (defaults to "Next.js App")
   - Missing `<meta name="description">`
   - No Open Graph tags (`og:title`, `og:image`, `og:description`)
   - Missing Twitter Card tags

2. **No Structured Data**
   - JSON-LD schema markup absent
   - No `Organization` schema
   - No `Product` schema for pricing
   - No `Review` or `AggregateRating` schema

3. **Missing Alt Text & Image Optimization**
   - Hero images lack alt attributes
   - Images not optimized (large file sizes)
   - No Next.js Image component usage

4. **No Uptime Transparency**
   - No public status page
   - No SLA documentation
   - No historical uptime metrics
   - No incident history

5. **Zero Social Proof**
   - No customer testimonials
   - No case studies
   - No trust badges (security, uptime)
   - No social media links or follower counts

6. **Poor Lighthouse Scores**
   - Performance: 62/100
   - Accessibility: 71/100
   - Best Practices: 78/100
   - SEO: 68/100

7. **Missing Technical SEO**
   - No `sitemap.xml`
   - No `robots.txt`
   - No canonical URLs
   - Missing structured navigation breadcrumbs

#### Root Causes
- SEO not considered in initial development
- No SEO specialist consulted
- Lack of marketing focus on search visibility
- Trust-building elements deprioritized

#### Required Fixes
- Implement comprehensive SEO strategy:
  ```jsx
  // app/layout.tsx
  export const metadata = {
    title: 'Crypto Trading Signals | AI-Powered BTC/ETH Alerts',
    description: 'Get real-time cryptocurrency trading signals...',
    openGraph: {
      title: '...',
      description: '...',
      images: ['/og-image.png'],
    },
  };
  ```
- Add JSON-LD structured data to all pages:
  ```json
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Signals-Site",
    "applicationCategory": "FinanceApplication",
    "offers": { ... }
  }
  ```
- Create public status page using Uptime Robot API or custom dashboard
- Add testimonials section to homepage with real user quotes (with permission)
- Optimize all images with Next.js Image component:
  ```jsx
  <Image src="/hero.png" alt="Trading signals dashboard" width={1200} height={630} />
  ```
- Generate `sitemap.xml` dynamically
- Create `robots.txt` allowing all pages
- Implement canonical URLs
- Achieve Lighthouse score ≥ 90 across all metrics

---

## 3. Goals & Success Criteria

### Primary Goals
1. **Achieve Full Data Pipeline Functionality**
   - Real-time signals flow from crypto-ai-bot → Redis → signals-api → signals-site without data loss
   - SSE connection stable with automatic reconnection on failure
   - All performance metrics display actual values (not zeros)

2. **Enable End-to-End Subscription Flow**
   - User can complete Stripe checkout and receive payment confirmation
   - Discord roles automatically assigned upon successful subscription
   - User can access tier-appropriate content immediately after payment

3. **Eliminate All Broken Links and 404 Errors**
   - All navigation items lead to valid pages
   - All documentation pages exist and are complete
   - External links verified and functional

4. **Establish Consistent Product Messaging**
   - Single source of truth for performance metrics
   - Deduplicated trading pairs list
   - Aligned signal frequency claims across all pages

5. **Achieve Production-Grade Reliability**
   - Graceful degradation when API unavailable
   - Comprehensive error handling and user feedback
   - Monitoring and alerting for downtime
   - Public status page showing uptime

6. **Meet Investor Presentation Standards**
   - Professional UI/UX with no obvious bugs
   - Complete documentation demonstrating technical depth
   - SEO-optimized for discoverability
   - Trust signals (testimonials, uptime, security badges)

### Success Metrics

| Category | Metric | Current | Target |
|----------|--------|---------|--------|
| **Functionality** | API integration success rate | 0% | 99.9% |
| **Functionality** | SSE connection uptime | 0% | 99.5% |
| **Functionality** | Stripe checkout completion rate | 0% | 95% |
| **Data Integrity** | Non-zero metric fields | 0% | 100% |
| **Content Quality** | Duplicate symbols | 3 | 0 |
| **Content Quality** | 404 errors | 4+ | 0 |
| **UX** | Mobile responsiveness issues | 5+ | 0 |
| **UX** | Accessibility violations (critical) | 8+ | 0 |
| **Performance** | Lighthouse Performance score | 62 | 90+ |
| **Performance** | Lighthouse Accessibility score | 71 | 90+ |
| **Performance** | Lighthouse SEO score | 68 | 90+ |
| **SEO** | Pages with meta descriptions | 0% | 100% |
| **SEO** | Images with alt text | 20% | 100% |
| **Documentation** | Missing core doc pages | 5 | 0 |
| **Reliability** | Error boundary coverage | 0% | 100% |
| **Trust** | Public uptime visibility | No | Yes |

### Acceptance Criteria
- [ ] User can view real-time signals on `/live-signals` page
- [ ] PnL dashboard displays actual equity curve and returns
- [ ] Home page metrics show non-zero ROI, win rate, Sharpe ratio
- [ ] User can complete Stripe checkout and receive Discord invite
- [ ] All navigation links return 200 status codes
- [ ] Trading pairs list contains no duplicates
- [ ] Signal frequency messaging consistent across site
- [ ] All pages have unique meta titles and descriptions
- [ ] Site achieves Lighthouse score ≥ 90 on all metrics
- [ ] Browser console shows zero errors on any page
- [ ] Site is fully responsive on mobile, tablet, desktop
- [ ] All interactive elements keyboard-accessible
- [ ] Status page displays current system health
- [ ] Methodology page explains algorithm in detail
- [ ] API reference page documents all endpoints

---

## 4. Core Functional Requirements

### A. Home Page (`/`)

#### Hero Section
- **Headline**: Clear value proposition (e.g., "AI-Powered Crypto Trading Signals")
- **Subheadline**: Concise explanation of service
- **CTA Button**: "Start Free Trial" → `/pricing` with trial info
- **Hero Image**: Optimized screenshot of dashboard (using Next.js Image)
- **Social Proof**: Display user count or win rate (pull from API)

#### Performance Metrics Section
**Replace all zeros with actual values from `/api/performance` endpoint:**

```typescript
interface PerformanceMetrics {
  totalROI: number;        // Display as percentage
  winRate: number;         // Display as percentage
  profitFactor: number;    // Display as 2 decimal places
  sharpeRatio: number;     // Display as 2 decimal places
  maxDrawdown: number;     // Display as percentage
  totalSignals: number;    // Display as integer
  activeSignals: number;   // Display as integer (signals in last 24h)
}
```

**Widget Layout:**
- 4-column grid on desktop, 2-column on tablet, 1-column on mobile
- Each metric card has:
  - Icon (relevant to metric)
  - Metric name
  - Large value display
  - Tooltip explaining meaning
  - Small chart or trend indicator

**Loading State:**
```jsx
<PerformanceWidget loading={true}>
  <Skeleton className="h-24 w-full" />
</PerformanceWidget>
```

**Error State:**
```jsx
<PerformanceWidget error={error}>
  <ErrorMessage>
    Unable to load metrics. <button onClick={retry}>Retry</button>
  </ErrorMessage>
</PerformanceWidget>
```

#### Supported Trading Pairs
**Deduplicate and display unique symbols:**
```
BTC/USD, ETH/USD, SOL/USD, ADA/USD, MATIC/USD, AVAX/USD, DOT/USD, LINK/USD, UNI/USD
```
- Source from `/api/config/pairs` endpoint (not hardcoded)
- Display as badge grid with coin icons
- Show "and more" if list exceeds 12 pairs

#### Signal Frequency Messaging
**Establish single source of truth:**
- Measure actual average signals/day over last 30 days via API call
- Display: "Delivering [X] signals per day on average"
- Subtext: "Across [Y] trading pairs, 24/7"
- Link to `/methodology` for algorithm details

#### Features Section
- Real-time signal delivery
- Multi-timeframe analysis
- Risk-adjusted position sizing
- Discord integration
- Backtested strategies
- (Each feature has icon, title, description)

#### Recent Signals Preview
- Show last 3-5 signals from `/api/signals/latest`
- Display: pair, side (BUY/SELL), confidence, timestamp
- "View All Live Signals" CTA → `/live-signals`

#### CTA Section
- "Ready to start?" headline
- "Start Free Trial" button → `/pricing`
- Trust badges (SSL, uptime, etc.)

#### Technical Requirements
- Server-side render (SSR) for initial metrics load
- Client-side refresh every 60 seconds
- Error boundaries around all API-dependent sections
- Responsive grid layouts with Tailwind breakpoints
- Lazy load images below fold
- Prefetch `/pricing` and `/live-signals` routes

---

### B. Live Signals Page (`/live-signals`)

#### Real-Time Signal Feed (SSE Integration)

**EventSource Connection:**
```typescript
// components/LiveSignalFeed.tsx
const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_BASE}/live-signals`);

eventSource.addEventListener('signal', (event) => {
  const signal = JSON.parse(event.data);
  setSignals(prev => [signal, ...prev].slice(0, 20)); // Keep latest 20
});

eventSource.onerror = (error) => {
  console.error('SSE connection failed:', error);
  setConnectionStatus('disconnected');
  // Reconnect logic
  setTimeout(() => {
    eventSource.close();
    connectToSSE(); // Retry connection
  }, 5000);
};
```

**Reconnection Logic:**
- Exponential backoff: 1s, 2s, 4s, 8s, 16s, 30s (max)
- Display connection status indicator: 🟢 Connected | 🟡 Reconnecting | 🔴 Disconnected
- Auto-reconnect on page visibility change (user returns to tab)

**Signal Display:**
- Table view with columns:
  - Timestamp (relative: "2 minutes ago")
  - Trading Pair (with icon)
  - Side (BUY in green, SELL in red)
  - Confidence (0-100 with progress bar)
  - Timeframe (e.g., "5m", "1h")
  - Sentiment (icon: bullish/bearish)
- Color-coded rows: green for BUY, red for SELL
- Smooth animation when new signal arrives (fade in from top)

**Fallback State (No Data):**
```jsx
{signals.length === 0 && (
  <EmptyState>
    <WaveIcon className="animate-pulse" />
    <p>Waiting for live signals...</p>
    <p className="text-sm text-gray-500">
      Signals are generated when market conditions meet our criteria.
    </p>
  </EmptyState>
)}
```

**Historical View Toggle:**
- Tab switcher: "Live" | "Last 24h" | "Last 7 days"
- Historical data fetched from `/api/signals/history?range=24h`

**Filters:**
- Filter by pair (dropdown: All, BTC/USD, ETH/USD, etc.)
- Filter by side (All, BUY, SELL)
- Filter by confidence (slider: 50-100)

**Export Functionality:**
- "Export to CSV" button
- Download signals from current view

**Mobile Optimizations:**
- Card view instead of table on small screens
- Swipe to refresh
- Infinite scroll for historical view

#### Technical Requirements
- SSE connection in React useEffect with cleanup
- Connection status persisted in React Context
- Pagination for historical view (load more button)
- Skeleton loaders while fetching
- Toast notification when new signal arrives (optional, user preference)

---

### C. PnL Dashboard (`/pnl`)

#### Equity Curve Chart
**Data Source:** `GET /api/pnl/equity-curve`

**Expected Response:**
```json
{
  "equityCurve": [
    { "date": "2025-01-01", "equity": 10000 },
    { "date": "2025-01-02", "equity": 10150 },
    ...
  ],
  "startingCapital": 10000,
  "currentEquity": 12500,
  "totalReturn": 25.0
}
```

**Chart Implementation (Recharts):**
```tsx
<ResponsiveContainer width="100%" height={400}>
  <LineChart data={equityCurve}>
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="equity" stroke="#8884d8" />
  </LineChart>
</ResponsiveContainer>
```

**Features:**
- Zoom controls (1M, 3M, 6M, 1Y, All)
- Hover tooltip showing exact equity value
- Gradient fill under line
- Drawdown regions highlighted in red

#### Summary Statistics
**Display in cards above chart:**
- **Total PnL**: `$2,500 (+25%)`
- **Win Rate**: `72%`
- **Profit Factor**: `2.1`
- **Sharpe Ratio**: `1.8`
- **Max Drawdown**: `-8.5%`

**Data Source:** `GET /api/pnl/summary`

#### Monthly Returns Table
**Data Source:** `GET /api/pnl/monthly-returns`

**Expected Response:**
```json
{
  "monthlyReturns": [
    { "month": "2025-01", "return": 5.2, "trades": 45 },
    { "month": "2024-12", "return": 3.8, "trades": 52 },
    ...
  ]
}
```

**Table Layout:**
- Columns: Month, Return (%), Trades, Win Rate (%)
- Color-coded returns: green (positive), red (negative)
- Sortable by column
- Responsive: horizontal scroll on mobile

#### Drawdown Chart
**Data Source:** `GET /api/pnl/drawdown`

**Expected Response:**
```json
{
  "drawdownSeries": [
    { "date": "2025-01-01", "drawdown": 0 },
    { "date": "2025-01-15", "drawdown": -5.2 },
    ...
  ]
}
```

**Chart Implementation:**
- Area chart showing drawdown over time
- Highlight max drawdown point
- Tooltip explaining drawdown concept

#### Trade History Table
**Data Source:** `GET /api/pnl/trades?limit=50`

**Columns:**
- Date, Pair, Side, Entry Price, Exit Price, PnL ($), PnL (%), Duration

**Features:**
- Pagination (50 trades per page)
- Filter by: Pair, Side, Date Range
- Export to CSV

#### Loading States
```tsx
{loading && (
  <>
    <Skeleton className="h-64 w-full mb-4" /> {/* Chart skeleton */}
    <div className="grid grid-cols-5 gap-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-24" /> {/* Stat card skeleton */}
      ))}
    </div>
  </>
)}
```

#### Error States
```tsx
{error && (
  <ErrorBoundary>
    <Alert variant="destructive">
      <AlertTitle>Failed to load PnL data</AlertTitle>
      <AlertDescription>
        {error.message}
        <Button onClick={refetch} variant="outline" className="mt-2">
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  </ErrorBoundary>
)}
```

#### Technical Requirements
- All data fetched server-side on initial load (SSR)
- Client-side refetch on date range change
- Charts responsive with `ResponsiveContainer`
- CSV export uses `json2csv` library
- Implement React Query for caching and refetching

---

### D. Pricing Page (`/pricing`)

#### Tier Structure
Define three clear tiers with **distinct, non-overlapping features**:

**Free Tier** (Freemium)
- Price: $0/month
- Features:
  - 2 signals per day (top confidence only)
  - Access to #free-signals Discord channel
  - 7-day historical signal archive
  - Community support
  - Educational resources
- CTA: "Start Free" → `/auth/signup`

**Premium Tier**
- Price: $49/month or $470/year (20% discount)
- Features:
  - All Free features, plus:
  - Unlimited signals (all confidence levels)
  - Access to #premium-signals Discord channel
  - 90-day historical signal archive
  - Priority support (24h response)
  - API access (1000 requests/day)
  - Real-time alerts
- CTA: "Subscribe Now" → Stripe checkout

**Elite Tier**
- Price: $149/month or $1,430/year (20% discount)
- Features:
  - All Premium features, plus:
  - Access to #elite-signals Discord channel (early signals, 30s head start)
  - Unlimited historical data
  - Dedicated support (4h response)
  - API access (10,000 requests/day)
  - Weekly strategy webinars
  - Custom alert settings
- CTA: "Subscribe Now" → Stripe checkout

#### Discord Role Mapping
**Ensure non-duplicate, tier-specific roles:**
- Free → `@Free-Tier` role → access to `#free-signals`
- Premium → `@Premium-Tier` role → access to `#premium-signals`
- Elite → `@Elite-Tier` role → access to `#elite-signals`

**Implementation:**
- Discord bot assigns role upon webhook from Stripe
- User must link Discord account via OAuth after signup

#### Stripe Integration

**Stripe Product & Price IDs (Environment Variables):**
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Price IDs
STRIPE_PRICE_PREMIUM_MONTHLY=price_...
STRIPE_PRICE_PREMIUM_YEARLY=price_...
STRIPE_PRICE_ELITE_MONTHLY=price_...
STRIPE_PRICE_ELITE_YEARLY=price_...
```

**Checkout Flow:**
1. User clicks "Subscribe Now" on Premium or Elite card
2. Frontend calls `POST /api/create-checkout-session`:
   ```typescript
   const response = await fetch('/api/create-checkout-session', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       priceId: 'price_premium_monthly',
       tier: 'premium',
     }),
   });
   const { sessionId } = await response.json();
   const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
   await stripe.redirectToCheckout({ sessionId });
   ```
3. Server creates Stripe session:
   ```typescript
   // app/api/create-checkout-session/route.ts
   const session = await stripe.checkout.sessions.create({
     payment_method_types: ['card'],
     line_items: [{ price: priceId, quantity: 1 }],
     mode: 'subscription',
     success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
     cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
     metadata: { userId, tier },
   });
   ```
4. User completes payment on Stripe-hosted page
5. Stripe webhook fires `checkout.session.completed`
6. Webhook handler updates user tier and triggers Discord role assignment

**Webhook Handler:**
```typescript
// app/api/webhooks/stripe/route.ts
export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  const event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, tier } = session.metadata;

    // Update user in database
    await db.user.update({ where: { id: userId }, data: { tier } });

    // Assign Discord role
    await fetch(`${DISCORD_BOT_URL}/assign-role`, {
      method: 'POST',
      body: JSON.stringify({ userId, tier }),
    });
  }

  return new Response(null, { status: 200 });
}
```

**Success Page (`/subscribe/success`):**
- Display confirmation message
- Show next steps:
  1. Link Discord account (OAuth button)
  2. Join Discord server (invite link)
  3. Check #premium-signals channel for signals
- Send confirmation email (using SendGrid or Resend)

**Cancel Page (`/subscribe/cancel`):**
- "Checkout canceled" message
- "Return to Pricing" button

#### Trial & Refund Policy

**Trial Period:**
- Premium and Elite tiers include 7-day free trial
- Display clearly on pricing cards: "7-day free trial included"
- User not charged until trial ends
- Can cancel anytime during trial with no charge

**Refund Policy:**
- 30-day money-back guarantee
- Link to `/policies/refunds` page
- Process: email support or self-service cancellation

**Cancellation:**
- User can cancel from `/account/billing` page
- Calls Stripe API to cancel subscription at period end
- User retains access until end of billing period

#### Visual Design
- 3-column layout on desktop
- Highlight "Most Popular" tier (Premium) with border/badge
- Toggle for Monthly/Yearly billing with savings badge
- Feature comparison table below cards
- FAQ section addressing common questions

#### Technical Requirements
- Implement with Stripe SDK (`stripe` npm package)
- Use Next.js Server Actions for checkout session creation
- Secure webhook endpoint with signature verification
- Store Stripe customer ID in user database
- Implement idempotency for webhook handlers (prevent duplicate role assignments)
- Add loading spinner on "Subscribe Now" button during checkout redirect

---

### E. Documentation Hub (`/docs`)

Create comprehensive documentation site with the following pages:

#### `/docs/methodology`

**Purpose:** Explain the AI/ML algorithm and trading strategy in detail.

**Required Sections:**

1. **Overview**
   - High-level explanation of the signal generation process
   - Problem being solved (crypto market volatility, timing entries)

2. **Data Pipeline**
   - Data sources (Kraken OHLCV, order book, funding rates)
   - Feature engineering (bar reaction, RSI, MACD, volatility, volume)
   - Normalization and preprocessing

3. **Model Architecture**
   - Algorithm type (if ML-based: Random Forest, LSTM, etc.; if rule-based: describe logic)
   - Training process (if applicable)
   - Backtesting methodology
   - Walk-forward validation

4. **Signal Generation Logic**
   - Entry conditions
   - Confidence scoring mechanism
   - Multi-timeframe confluence
   - Risk management integration

5. **Performance Validation**
   - Backtesting period (e.g., 2022-2025)
   - Out-of-sample testing
   - Win rate calculation
   - Sharpe ratio and other metrics

6. **Limitations & Disclaimers**
   - Market conditions where strategy underperforms
   - Risk warnings
   - Not financial advice disclaimer

**Format:**
- Use diagrams (Mermaid.js or images)
- Include code snippets if applicable
- Link to research papers or sources

---

#### `/docs/api-reference`

**Purpose:** Enable developers to integrate programmatically.

**Required Sections:**

1. **Authentication**
   - How to obtain API key (from account dashboard)
   - Including API key in requests:
     ```bash
     curl -H "Authorization: Bearer YOUR_API_KEY" \
          https://signals-api.fly.dev/api/signals/latest
     ```

2. **Rate Limiting**
   - Free tier: 100 requests/day
   - Premium tier: 1,000 requests/day
   - Elite tier: 10,000 requests/day
   - Response headers: `X-RateLimit-Remaining`, `X-RateLimit-Reset`

3. **Endpoints**

   **GET `/api/signals/latest`**
   - Description: Retrieve last 20 signals
   - Parameters: `limit` (default 20, max 100)
   - Response:
     ```json
     {
       "signals": [
         {
           "id": "sig_123",
           "timestamp": "2025-01-14T12:34:56Z",
           "pair": "BTC/USD",
           "side": "BUY",
           "confidence": 85,
           "timeframe": "5m",
           "entryPrice": 45000,
           "stopLoss": 44500,
           "takeProfit": 46000
         }
       ]
     }
     ```

   **GET `/api/signals/history`**
   - Description: Historical signals with filters
   - Parameters: `pair`, `startDate`, `endDate`, `limit`, `offset`
   - Response: Array of signals

   **GET `/api/performance`**
   - Description: Overall performance metrics
   - Response:
     ```json
     {
       "totalROI": 45.2,
       "winRate": 72.5,
       "profitFactor": 2.1,
       "sharpeRatio": 1.8,
       "maxDrawdown": -8.5
     }
     ```

   **GET `/api/pnl/equity-curve`**
   - Description: Daily equity values
   - Parameters: `startDate`, `endDate`
   - Response: Array of `{ date, equity }`

   **SSE `/api/live-signals`**
   - Description: Real-time signal stream
   - Connection:
     ```javascript
     const eventSource = new EventSource('https://signals-api.fly.dev/api/live-signals');
     eventSource.addEventListener('signal', (event) => {
       const signal = JSON.parse(event.data);
       console.log(signal);
     });
     ```

4. **Error Codes**
   - 400: Bad Request (invalid parameters)
   - 401: Unauthorized (missing or invalid API key)
   - 429: Too Many Requests (rate limit exceeded)
   - 500: Internal Server Error

5. **Webhooks** (if implemented)
   - How to register webhook URL
   - Payload format for signal notifications

**Format:**
- Interactive API explorer (consider Swagger/OpenAPI)
- Copy-paste code examples in multiple languages (cURL, JavaScript, Python)

---

#### `/docs/architecture`

**Purpose:** Document the 3-tier system for technical stakeholders.

**Required Sections:**

1. **System Overview Diagram**
   ```
   [Kraken API] → [crypto-ai-bot] → [Redis Cloud Streams] → [signals-api] → [signals-site]
                                                                ↓
                                                         [PostgreSQL]
   ```

2. **Component Descriptions**

   **crypto-ai-bot (Python)**
   - Deployed on: Fly.io
   - Responsibilities:
     - Fetch OHLCV data from Kraken
     - Feature engineering
     - Model inference
     - Publish signals to Redis Streams
   - Technology: Python, pandas, scikit-learn
   - Repo: (link if public)

   **Redis Cloud**
   - Service: Redis Enterprise Cloud
   - Connection: `rediss://default:***@redis-19818.c9.us-east-1-4.ec2.redns.redis-cloud.com:19818`
   - TLS: Required (CA cert at `C:\Users\Maith\OneDrive\Desktop\signals-site\redis-ca.crt`)
   - Streams:
     - `signals:live` → Real-time signal events
     - `signals:archive` → Historical signals
   - Consumer groups for scalability

   **signals-api (Node.js/Express)**
   - Deployed on: Fly.io
   - Responsibilities:
     - Consume Redis streams
     - Expose REST API
     - Serve SSE connections
     - Handle Stripe webhooks
     - Store user data in PostgreSQL
   - Technology: Node.js, Express, ioredis, Stripe SDK
   - Repo: (link if public)

   **signals-site (Next.js)**
   - Deployed on: Vercel
   - Responsibilities:
     - Public marketing site
     - User dashboard
     - Stripe checkout UI
     - Real-time signal display (SSE client)
   - Technology: Next.js 15, React, TailwindCSS, Recharts
   - Repo: (link if public)

3. **Data Flow**
   - Signal generation flow (diagram)
   - Subscription flow (user → Stripe → webhook → Discord)
   - Real-time signal delivery (Redis → SSE → browser)

4. **Deployment Architecture**
   - Hosting providers and regions
   - CDN configuration (Vercel Edge)
   - Database hosting (PostgreSQL on Fly.io or Supabase)
   - Redis Cloud region

5. **Security Boundaries**
   - API authentication (JWT or API keys)
   - TLS encryption (all connections)
   - Stripe webhook signature verification
   - Environment variable management (Vercel secrets, Fly.io secrets)

6. **Scalability Considerations**
   - Redis consumer groups for horizontal scaling
   - API rate limiting
   - Database indexing strategy
   - Caching layer (Redis for API responses)

**Format:**
- Diagrams using Mermaid.js or Lucidchart
- Code snippets for key configurations

---

#### `/docs/runbook`

**Purpose:** Operational playbook for maintaining the system.

**Required Sections:**

1. **Deployment Procedures**

   **signals-site (Vercel):**
   ```bash
   git push origin main  # Auto-deploys to production
   # Or manual:
   vercel --prod
   ```

   **signals-api (Fly.io):**
   ```bash
   fly deploy
   ```

   **crypto-ai-bot (Fly.io):**
   ```bash
   fly deploy
   ```

2. **Environment Variables**
   - List all required env vars for each service
   - Where to configure (Vercel dashboard, Fly.io secrets)

3. **Monitoring & Alerting**
   - Uptime monitoring: (tool used, e.g., Uptime Robot)
   - Error tracking: (e.g., Sentry)
   - Performance monitoring: (e.g., Vercel Analytics)
   - Alerts sent to: (Slack, email, PagerDuty)

4. **Common Issues & Troubleshooting**

   **Issue: SSE connection not receiving signals**
   - Check: signals-api logs (`fly logs -a signals-api`)
   - Verify: Redis stream has data (`redis-cli XREAD STREAMS signals:live 0`)
   - Fix: Restart signals-api or crypto-ai-bot

   **Issue: Stripe webhook not firing**
   - Check: Stripe dashboard webhook logs
   - Verify: Webhook secret matches env var
   - Test: Use Stripe CLI (`stripe trigger checkout.session.completed`)

   **Issue: Performance metrics showing zeros**
   - Check: signals-api `/api/performance` endpoint
   - Verify: PostgreSQL database has PnL records
   - Fix: Re-run PnL calculation script

5. **Rollback Procedures**
   - Vercel: Redeploy previous deployment from dashboard
   - Fly.io: `fly releases` → `fly deploy --image <previous-image>`

6. **Incident Response**
   - Severity levels (P0, P1, P2)
   - Escalation path
   - Communication templates

7. **Backup & Recovery**
   - Database backup schedule (daily snapshots)
   - Redis data persistence (AOF enabled)
   - Restoration procedure

**Format:**
- Step-by-step checklists
- Command snippets ready to copy-paste

---

#### `/docs/signal-format`

**Purpose:** Define signal schema for users and developers.

**Required Sections:**

1. **Signal Schema**
   ```typescript
   interface Signal {
     id: string;                  // Unique identifier (e.g., "sig_1705234567_BTC")
     timestamp: string;           // ISO 8601 format (e.g., "2025-01-14T12:34:56Z")
     pair: string;                // Trading pair (e.g., "BTC/USD")
     side: "BUY" | "SELL";        // Direction
     confidence: number;          // 0-100 (higher = more confident)
     timeframe: string;           // Timeframe analyzed (e.g., "5m", "1h")
     entryPrice: number;          // Suggested entry price
     stopLoss: number | null;     // Suggested stop loss (null if not provided)
     takeProfit: number | null;   // Suggested take profit (null if not provided)
     sentiment: "BULLISH" | "BEARISH" | "NEUTRAL"; // Market sentiment
     indicators: {                // Supporting indicators
       rsi: number;
       macd: number;
       volume: number;
     };
   }
   ```

2. **Field Definitions**

   - **id**: Unique identifier for signal, format: `sig_<timestamp>_<pair>`
   - **timestamp**: UTC time when signal was generated
   - **pair**: Trading pair following Kraken notation (e.g., "BTC/USD", "ETH/USD")
   - **side**:
     - `BUY`: Indicates bullish signal, suggest opening long position
     - `SELL`: Indicates bearish signal, suggest opening short position
   - **confidence**: Score from 0-100 indicating model's confidence in signal
     - 90-100: Very high confidence
     - 75-89: High confidence
     - 60-74: Moderate confidence
     - Below 60: Low confidence (typically not sent to Free tier)
   - **timeframe**: Chart timeframe used for analysis (e.g., "5m" = 5 minutes, "1h" = 1 hour)
   - **entryPrice**: Suggested entry price based on current market conditions
   - **stopLoss**: Suggested stop loss price to limit downside risk (may be null)
   - **takeProfit**: Suggested take profit price to secure gains (may be null)
   - **sentiment**: Overall market sentiment assessment
   - **indicators**: Supporting technical indicator values used in signal generation

3. **How to Interpret Signals**

   **Example Signal:**
   ```json
   {
     "id": "sig_1705234567_BTC",
     "timestamp": "2025-01-14T15:30:00Z",
     "pair": "BTC/USD",
     "side": "BUY",
     "confidence": 85,
     "timeframe": "5m",
     "entryPrice": 45000,
     "stopLoss": 44500,
     "takeProfit": 46000,
     "sentiment": "BULLISH",
     "indicators": {
       "rsi": 45,
       "macd": 120,
       "volume": 1500000
     }
   }
   ```

   **Interpretation:**
   - **Action**: Consider opening a long (buy) position on BTC/USD
   - **Confidence**: 85/100 indicates high confidence
   - **Entry**: Around $45,000
   - **Risk Management**: Set stop loss at $44,500 (1.1% downside)
   - **Profit Target**: Take profit at $46,000 (2.2% upside)
   - **Risk/Reward Ratio**: ~2:1

4. **Risk Disclaimer**
   - Signals are for informational purposes only
   - Not financial advice
   - Users should conduct own analysis
   - Past performance does not guarantee future results
   - Cryptocurrency trading carries significant risk

**Format:**
- JSON schema documentation
- Example signals with annotations
- Visual diagrams showing signal flow

---

#### `/docs/user-guide`

**Purpose:** Onboarding guide for new subscribers.

**Required Sections:**

1. **Getting Started**
   - Create account
   - Choose subscription tier
   - Complete payment
   - Link Discord account

2. **Accessing Signals**
   - Discord setup (join server, verify role)
   - Using the web dashboard
   - API access (for Premium/Elite)

3. **Understanding Signals**
   - How to read signal fields
   - When to act on signals
   - Risk management best practices

4. **Frequently Asked Questions**
   - How often are signals sent?
   - Can I cancel anytime?
   - What if I miss a signal?
   - Do you provide investment advice?

**Format:**
- Step-by-step screenshots
- Video tutorials (embedded YouTube)

---

### F. Status Page (`/status`)

**Purpose:** Provide real-time system health and uptime transparency.

**Required Sections:**

1. **Current Status**
   - Overall system status: 🟢 Operational | 🟡 Degraded | 🔴 Outage
   - Component statuses:
     - signals-site (Vercel): 🟢 Operational
     - signals-api (Fly.io): 🟢 Operational
     - crypto-ai-bot (Fly.io): 🟢 Operational
     - Redis Cloud: 🟢 Operational
     - Stripe Payments: 🟢 Operational

2. **Uptime Statistics (Last 90 Days)**
   - Overall uptime: 99.95%
   - Chart showing daily uptime percentage

3. **Recent Incidents**
   - List of past incidents with:
     - Date/time
     - Affected components
     - Duration
     - Root cause
     - Resolution
   - Example:
     ```
     2025-01-10 14:30 UTC - Resolved
     signals-api intermittent 502 errors
     Duration: 15 minutes
     Cause: Redis connection pool exhaustion
     Resolution: Increased connection pool size and restarted service
     ```

4. **Scheduled Maintenance**
   - Upcoming maintenance windows (if any)
   - Expected downtime

5. **Subscribe to Updates**
   - Email notification signup for incident alerts

**Data Sources:**
- Uptime Robot API (or similar monitoring service)
- Manual incident log (stored in database or CMS)
- Health check endpoints:
  - `GET /api/health` → signals-api
  - `GET /api/status` → crypto-ai-bot

**Implementation:**
```typescript
// app/status/page.tsx
async function fetchStatus() {
  const response = await fetch('https://signals-api.fly.dev/api/health');
  const { status, components } = await response.json();
  return { status, components };
}

export default async function StatusPage() {
  const { status, components } = await fetchStatus();

  return (
    <div>
      <h1>System Status</h1>
      <StatusBadge status={status} />
      {components.map(comp => (
        <ComponentStatus key={comp.name} {...comp} />
      ))}
    </div>
  );
}
```

**Technical Requirements:**
- Server-side rendered (SSR) for fast load
- Auto-refresh every 60 seconds (client-side)
- Historical uptime data cached
- Incident data stored in database or fetched from external status tool

---

### G. Navigation & Site Structure

**Primary Navigation (Desktop Header):**
- Logo (links to `/`)
- Home
- Live Signals
- PnL Dashboard
- Pricing
- Docs (dropdown):
  - Methodology
  - API Reference
  - Architecture
  - Runbook
  - User Guide
- Status
- Login / Account (if authenticated)

**Mobile Navigation:**
- Hamburger menu
- Same links as desktop
- Properly styled z-index to avoid overlaps
- Close button visible
- Smooth slide-in animation

**Footer Links:**
- Company:
  - About
  - Contact
  - Careers (if applicable)
- Resources:
  - Documentation
  - API Reference
  - Status Page
- Legal:
  - Terms of Service (`/policies/terms`)
  - Privacy Policy (`/policies/privacy`)
  - Refund Policy (`/policies/refunds`)
- Social:
  - Discord (invite link)
  - Twitter/X (if applicable)
  - GitHub (if public)

**Technical Requirements:**
- Use Next.js `<Link>` component for all internal links
- Implement active link highlighting
- Prefetch critical routes (pricing, live-signals)
- Ensure all links return 200 status (no 404s)
- Add link integrity tests in CI/CD:
  ```typescript
  // tests/links.test.ts
  test('all navigation links are valid', async () => {
    const links = await extractLinks('/');
    for (const link of links) {
      const response = await fetch(link);
      expect(response.status).toBe(200);
    }
  });
  ```

---

## 5. API Integration Requirements

### Environment Variables

**Required in Vercel:**
```bash
# API
NEXT_PUBLIC_API_BASE=https://signals-api.fly.dev

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs
STRIPE_PRICE_PREMIUM_MONTHLY=price_...
STRIPE_PRICE_PREMIUM_YEARLY=price_...
STRIPE_PRICE_ELITE_MONTHLY=price_...
STRIPE_PRICE_ELITE_YEARLY=price_...

# Database (if used directly)
DATABASE_URL=postgresql://...

# Discord (for OAuth)
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
DISCORD_REDIRECT_URI=https://signals-site.vercel.app/auth/discord/callback

# Email (for transactional emails)
SENDGRID_API_KEY=SG...
# or
RESEND_API_KEY=re_...

# Analytics (optional)
NEXT_PUBLIC_GA_TRACKING_ID=G-...
```

### API Client Wrapper

**Create centralized API client:**
```typescript
// lib/api-client.ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok && response.status >= 500 && i < retries - 1) {
        // Retry on 5xx errors
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Max retries reached');
}

export const apiClient = {
  async getPerformanceMetrics() {
    const response = await fetchWithRetry(`${API_BASE}/api/performance`);
    if (!response.ok) throw new APIError(response.status, 'Failed to fetch metrics');
    return response.json();
  },

  async getLatestSignals(limit = 20) {
    const response = await fetchWithRetry(`${API_BASE}/api/signals/latest?limit=${limit}`);
    if (!response.ok) throw new APIError(response.status, 'Failed to fetch signals');
    return response.json();
  },

  async getEquityCurve() {
    const response = await fetchWithRetry(`${API_BASE}/api/pnl/equity-curve`);
    if (!response.ok) throw new APIError(response.status, 'Failed to fetch equity curve');
    return response.json();
  },

  createSSEConnection(url: string) {
    return new EventSource(`${API_BASE}${url}`);
  },
};
```

### Retry Logic

**Exponential Backoff Strategy:**
- Initial delay: 1 second
- Max retries: 3
- Retry on: 500, 502, 503, 504 status codes
- Do NOT retry on: 400, 401, 403, 404 (client errors)

### Graceful Degradation

**When API is unavailable:**
```typescript
// components/PerformanceMetrics.tsx
function PerformanceMetrics() {
  const { data, error, isLoading } = useQuery('performance', apiClient.getPerformanceMetrics);

  if (isLoading) return <MetricsSkeleton />;

  if (error) {
    return (
      <Alert variant="warning">
        <AlertTitle>Unable to load live data</AlertTitle>
        <AlertDescription>
          Displaying cached metrics from [last update time].
          <Button onClick={refetch} variant="link">Retry</Button>
        </AlertDescription>
      </Alert>
    );
  }

  return <MetricsDisplay data={data} />;
}
```

### SSE Handling

**Robust SSE Connection Management:**
```typescript
// hooks/useSSE.ts
export function useSSE(url: string) {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    function connect() {
      setStatus('connecting');
      const eventSource = new EventSource(url);

      eventSource.onopen = () => {
        setStatus('connected');
      };

      eventSource.addEventListener('signal', (event) => {
        const signal = JSON.parse(event.data);
        setData(prev => [signal, ...prev].slice(0, 20));
      });

      eventSource.onerror = () => {
        setStatus('disconnected');
        eventSource.close();
        // Reconnect after 5 seconds
        setTimeout(connect, 5000);
      };

      eventSourceRef.current = eventSource;
    }

    connect();

    return () => {
      eventSourceRef.current?.close();
    };
  }, [url]);

  return { data, status };
}
```

### Normalized Schema

**Ensure consistent data shapes:**
```typescript
// types/signal.ts
export interface Signal {
  id: string;
  timestamp: string; // ISO 8601
  pair: string;
  side: 'BUY' | 'SELL';
  confidence: number;
  timeframe: string;
  entryPrice: number;
  stopLoss: number | null;
  takeProfit: number | null;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  indicators: {
    rsi: number;
    macd: number;
    volume: number;
  };
}

// Adapter for API responses
export function normalizeSignal(rawSignal: any): Signal {
  return {
    id: rawSignal.id || `sig_${rawSignal.timestamp}_${rawSignal.pair}`,
    timestamp: rawSignal.timestamp,
    pair: rawSignal.pair,
    side: rawSignal.side.toUpperCase(),
    confidence: rawSignal.confidence,
    timeframe: rawSignal.timeframe || '5m',
    entryPrice: rawSignal.entry_price || rawSignal.entryPrice,
    stopLoss: rawSignal.stop_loss || rawSignal.stopLoss || null,
    takeProfit: rawSignal.take_profit || rawSignal.takeProfit || null,
    sentiment: rawSignal.sentiment || 'NEUTRAL',
    indicators: rawSignal.indicators || {},
  };
}
```

### Error Boundaries

**Wrap all API-dependent components:**
```typescript
// components/ErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## 6. UI/UX & Accessibility Requirements

### Mobile-First Responsive Design

**Breakpoints (Tailwind CSS):**
- `sm`: 640px (mobile landscape)
- `md`: 768px (tablet portrait)
- `lg`: 1024px (tablet landscape / small desktop)
- `xl`: 1280px (desktop)
- `2xl`: 1536px (large desktop)

**Design Principles:**
- Design for mobile first, enhance for larger screens
- Touch targets ≥ 44x44px (iOS HIG standard)
- Readable font sizes (≥ 16px body text to prevent zoom on iOS)
- Avoid horizontal scrolling
- Collapsible navigation on mobile

**Testing Requirements:**
- Test on real devices:
  - iPhone SE (375px width)
  - iPhone 14 Pro (393px width)
  - iPad (768px width)
  - Desktop (1920px width)
- Use Chrome DevTools responsive mode
- Test landscape and portrait orientations

### Keyboard Navigation

**Requirements:**
- All interactive elements focusable via Tab key
- Focus indicators visible (outline or custom ring)
- Logical tab order (matches visual flow)
- Skip-to-content link for screen readers:
  ```jsx
  <a href="#main-content" className="sr-only focus:not-sr-only">
    Skip to content
  </a>
  ```
- Dropdown menus accessible with arrow keys
- Modals trappable focus (cannot tab outside)

### High-Contrast Theme

**Color Contrast Requirements (WCAG 2.1 AA):**
- Normal text: ≥ 4.5:1 contrast ratio
- Large text (≥ 18px or bold ≥ 14px): ≥ 3:1
- Interactive elements: ≥ 3:1

**Testing:**
- Use WebAIM Contrast Checker
- Chrome DevTools Lighthouse accessibility audit
- axe DevTools browser extension

**Implementation:**
```css
/* Ensure sufficient contrast */
:root {
  --text-primary: #000000;    /* Black on white: 21:1 */
  --text-secondary: #4B5563;  /* Gray 600: 7.5:1 on white */
  --bg-primary: #FFFFFF;
  --accent: #2563EB;          /* Blue 600: 4.5:1 on white */
}

/* Focus visible indicator */
*:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

### Chart Responsiveness

**Requirements:**
- Charts resize based on container width
- Use `ResponsiveContainer` from Recharts
- Adjust labels/ticks for small screens (reduce tick count)
- Provide data table alternative for accessibility

**Implementation:**
```jsx
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={equityCurve}>
    <XAxis
      dataKey="date"
      tick={{ fontSize: 12 }}
      tickFormatter={(date) => new Date(date).toLocaleDateString()}
    />
    <YAxis tick={{ fontSize: 12 }} />
    <Tooltip />
    <Line type="monotone" dataKey="equity" stroke="#2563EB" />
  </LineChart>
</ResponsiveContainer>
```

### Tooltips for Technical Metrics

**Required Tooltips:**
- **Sharpe Ratio**: "Measures risk-adjusted return. Higher is better. Above 1.0 is good, above 2.0 is excellent."
- **Drawdown**: "Maximum peak-to-trough decline in portfolio value. Lower is better."
- **Profit Factor**: "Ratio of gross profit to gross loss. Above 2.0 indicates strong performance."
- **Confidence**: "Model's certainty in the signal, from 0-100. Higher means more confident."
- **Win Rate**: "Percentage of profitable trades. Above 60% is strong."

**Implementation (using Radix UI):**
```jsx
import * as Tooltip from '@radix-ui/react-tooltip';

<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger asChild>
      <button className="inline-flex items-center">
        Sharpe Ratio
        <InfoIcon className="ml-1 h-4 w-4" />
      </button>
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content className="bg-gray-900 text-white px-3 py-2 rounded text-sm max-w-xs">
        Measures risk-adjusted return. Higher is better. Above 1.0 is good, above 2.0 is excellent.
        <Tooltip.Arrow className="fill-gray-900" />
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>
```

### Clear CTA Hierarchy

**Button Priorities:**
1. **Primary CTA** (most important action):
   - "Start Free Trial"
   - "Subscribe Now"
   - Style: Solid color, high contrast, large size
2. **Secondary CTA**:
   - "View Live Signals"
   - "Learn More"
   - Style: Outline or subtle background
3. **Tertiary CTA**:
   - "Read Documentation"
   - Style: Link style (underline on hover)

**Visual Hierarchy:**
```jsx
// Primary
<Button variant="primary" size="lg">Start Free Trial</Button>

// Secondary
<Button variant="outline" size="md">Learn More</Button>

// Tertiary
<Button variant="link" size="sm">Read Documentation</Button>
```

### ARIA Labels & Screen Reader Support

**Requirements:**
- All images have alt text
- Icon-only buttons have aria-label:
  ```jsx
  <button aria-label="Close menu">
    <XIcon />
  </button>
  ```
- Form inputs have associated labels:
  ```jsx
  <label htmlFor="email">Email</label>
  <input id="email" type="email" />
  ```
- Live regions for dynamic content:
  ```jsx
  <div aria-live="polite" aria-atomic="true">
    New signal received: BTC/USD BUY
  </div>
  ```
- Skip links for navigation
- Landmark roles (header, nav, main, footer)

### Loading & Error States

**Loading States:**
```jsx
// Skeleton components
<Skeleton className="h-24 w-full mb-4" />

// Spinner
<Spinner className="h-8 w-8 animate-spin" />

// Loading text
<p className="text-gray-500">Loading signals...</p>
```

**Error States:**
```jsx
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Failed to load signals. Please try again.
    <Button onClick={retry} variant="outline" className="mt-2">
      Retry
    </Button>
  </AlertDescription>
</Alert>
```

**Empty States:**
```jsx
<div className="text-center py-12">
  <InboxIcon className="mx-auto h-12 w-12 text-gray-400" />
  <h3 className="mt-2 text-lg font-semibold">No signals yet</h3>
  <p className="mt-1 text-gray-500">Waiting for market conditions to align.</p>
</div>
```

---

## 7. SEO & Performance Requirements

### Meta Tags (Per Page)

**Template:**
```jsx
// app/layout.tsx or page-specific metadata
export const metadata = {
  title: 'Crypto Trading Signals | AI-Powered BTC/ETH Alerts',
  description: 'Get real-time cryptocurrency trading signals powered by AI. 78% win rate, 2.1 profit factor. Subscribe for instant Discord alerts.',
  keywords: 'crypto signals, bitcoin trading, ethereum alerts, AI trading, trading bot',

  openGraph: {
    type: 'website',
    url: 'https://signals-site.vercel.app',
    title: 'Crypto Trading Signals | AI-Powered BTC/ETH Alerts',
    description: 'Real-time crypto trading signals with 78% win rate',
    images: [
      {
        url: 'https://signals-site.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Signals-Site Dashboard',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Crypto Trading Signals',
    description: 'AI-powered trading signals for BTC, ETH, and more',
    images: ['https://signals-site.vercel.app/twitter-image.png'],
  },

  robots: {
    index: true,
    follow: true,
  },

  verification: {
    google: 'your-google-verification-code',
  },
};
```

**Per-Page Customization:**
```jsx
// app/live-signals/page.tsx
export const metadata = {
  title: 'Live Crypto Signals | Real-Time Trading Alerts',
  description: 'Watch live cryptocurrency trading signals as they are generated by our AI algorithm.',
};
```

### JSON-LD Structured Data

**Organization Schema:**
```jsx
// components/StructuredData.tsx
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Signals-Site",
    "url": "https://signals-site.vercel.app",
    "logo": "https://signals-site.vercel.app/logo.png",
    "description": "AI-powered cryptocurrency trading signals platform",
    "sameAs": [
      "https://twitter.com/signals-site",
      "https://discord.gg/your-invite"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

**Product Schema (for Pricing Page):**
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Premium Crypto Signals Subscription",
  "description": "Unlimited AI-powered cryptocurrency trading signals",
  "offers": {
    "@type": "Offer",
    "price": "49.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://signals-site.vercel.app/pricing"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127"
  }
}
```

### Sitemap Generation

**Dynamic Sitemap:**
```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://signals-site.vercel.app';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/live-signals`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pnl`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/docs/methodology`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Add all other pages
  ];
}
```

### Robots.txt

```typescript
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: 'https://signals-site.vercel.app/sitemap.xml',
  };
}
```

### Image Optimization

**Requirements:**
- Use Next.js `<Image>` component for all images
- Serve images in WebP format
- Implement lazy loading (below-fold images)
- Proper width/height to prevent CLS (Cumulative Layout Shift)
- Alt text on all images

**Example:**
```jsx
import Image from 'next/image';

<Image
  src="/hero-dashboard.png"
  alt="Signals-Site dashboard showing real-time crypto trading signals"
  width={1200}
  height={630}
  priority // For above-fold images
  placeholder="blur"
  blurDataURL="data:image/png;base64,..."
/>
```

### Lighthouse Score Targets

**Minimum Acceptable Scores:**
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

**Optimization Strategies:**

**Performance:**
- Code splitting (Next.js automatic)
- Lazy load components below fold
- Minimize JavaScript bundle size
- Use CDN for static assets (Vercel Edge Network)
- Implement caching headers
- Optimize images (WebP, proper sizing)
- Minimize third-party scripts (load async/defer)

**Accessibility:**
- ARIA labels
- Keyboard navigation
- Color contrast
- Alt text
- Semantic HTML

**Best Practices:**
- HTTPS everywhere
- No console errors
- Secure cookies
- CSP headers
- No deprecated APIs

**SEO:**
- Meta tags on all pages
- Structured data
- Sitemap
- Robots.txt
- Mobile-friendly
- Fast page load

### Performance Monitoring

**Tools:**
- Vercel Analytics (built-in)
- Google Analytics 4
- Sentry (error tracking)
- Lighthouse CI (automated audits in CI/CD)

**Metrics to Track:**
- Largest Contentful Paint (LCP): < 2.5s
- First Input Delay (FID): < 100ms
- Cumulative Layout Shift (CLS): < 0.1
- Time to First Byte (TTFB): < 600ms

---

## 8. Testing Requirements

### Cypress End-to-End Tests

**Setup:**
```bash
npm install --save-dev cypress
npx cypress open
```

**Test Scenarios:**

**Navigation Test:**
```typescript
// cypress/e2e/navigation.cy.ts
describe('Navigation', () => {
  it('should navigate to all main pages without 404', () => {
    cy.visit('/');
    cy.contains('Live Signals').click();
    cy.url().should('include', '/live-signals');
    cy.get('h1').should('be.visible');

    cy.contains('PnL Dashboard').click();
    cy.url().should('include', '/pnl');

    cy.contains('Pricing').click();
    cy.url().should('include', '/pricing');

    cy.contains('Methodology').click();
    cy.url().should('include', '/docs/methodology');
    cy.get('h1').should('exist'); // Page loaded, not 404
  });
});
```

**SSE Connection Test:**
```typescript
// cypress/e2e/live-signals.cy.ts
describe('Live Signals SSE', () => {
  it('should establish SSE connection and receive signals', () => {
    cy.visit('/live-signals');
    cy.get('[data-testid="connection-status"]').should('contain', 'Connected');

    // Wait for signal to arrive (may need to mock for reliable testing)
    cy.get('[data-testid="signal-list"]', { timeout: 10000 })
      .find('[data-testid="signal-item"]')
      .should('have.length.greaterThan', 0);
  });

  it('should show reconnecting state on connection loss', () => {
    cy.visit('/live-signals');
    // Simulate network failure
    cy.window().then(win => {
      const eventSource = win.EventSource;
      eventSource.prototype.close();
    });
    cy.get('[data-testid="connection-status"]').should('contain', 'Reconnecting');
  });
});
```

**API Fallback Test:**
```typescript
// cypress/e2e/api-fallback.cy.ts
describe('API Fallback', () => {
  it('should show error message when API is down', () => {
    // Intercept API call and force failure
    cy.intercept('GET', '**/api/performance', {
      statusCode: 500,
      body: { error: 'Internal Server Error' },
    });

    cy.visit('/');
    cy.get('[data-testid="performance-metrics"]')
      .should('contain', 'Unable to load');
    cy.get('[data-testid="retry-button"]').should('be.visible');
  });

  it('should retry and succeed on retry button click', () => {
    cy.intercept('GET', '**/api/performance', {
      statusCode: 500,
    }).as('failedRequest');

    cy.visit('/');
    cy.wait('@failedRequest');

    // Now intercept with success
    cy.intercept('GET', '**/api/performance', {
      statusCode: 200,
      body: { totalROI: 45.2, winRate: 72.5 },
    }).as('successRequest');

    cy.get('[data-testid="retry-button"]').click();
    cy.wait('@successRequest');
    cy.get('[data-testid="performance-metrics"]').should('contain', '45.2');
  });
});
```

**Stripe Checkout Test:**
```typescript
// cypress/e2e/stripe-checkout.cy.ts
describe('Stripe Checkout', () => {
  it('should create checkout session and redirect', () => {
    cy.visit('/pricing');

    // Mock Stripe session creation
    cy.intercept('POST', '/api/create-checkout-session', {
      statusCode: 200,
      body: { sessionId: 'cs_test_123' },
    }).as('createSession');

    cy.get('[data-testid="subscribe-premium"]').click();
    cy.wait('@createSession');

    // In real test, would redirect to Stripe (mock for now)
    cy.url().should('include', 'checkout.stripe.com');
  });
});
```

**Documentation Pages Test:**
```typescript
// cypress/e2e/documentation.cy.ts
describe('Documentation', () => {
  const docPages = [
    '/docs/methodology',
    '/docs/api-reference',
    '/docs/architecture',
    '/docs/runbook',
    '/docs/signal-format',
  ];

  docPages.forEach(page => {
    it(`should load ${page} without errors`, () => {
      cy.visit(page);
      cy.get('h1').should('be.visible');
      cy.get('body').should('not.contain', '404');
    });
  });
});
```

### Jest / React Testing Library Tests

**Setup:**
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

**Component Tests:**

**Performance Metrics Component:**
```typescript
// components/__tests__/PerformanceMetrics.test.tsx
import { render, screen } from '@testing-library/react';
import { PerformanceMetrics } from '../PerformanceMetrics';

describe('PerformanceMetrics', () => {
  it('should display metrics when data is loaded', () => {
    const mockData = {
      totalROI: 45.2,
      winRate: 72.5,
      profitFactor: 2.1,
      sharpeRatio: 1.8,
      maxDrawdown: -8.5,
    };

    render(<PerformanceMetrics data={mockData} loading={false} error={null} />);

    expect(screen.getByText('45.2%')).toBeInTheDocument();
    expect(screen.getByText('72.5%')).toBeInTheDocument();
    expect(screen.getByText('2.1')).toBeInTheDocument();
  });

  it('should show skeleton when loading', () => {
    render(<PerformanceMetrics data={null} loading={true} error={null} />);
    expect(screen.getAllByTestId('skeleton')).toHaveLength(5);
  });

  it('should show error message when error occurs', () => {
    const mockError = new Error('API Error');
    render(<PerformanceMetrics data={null} loading={false} error={mockError} />);

    expect(screen.getByText(/unable to load/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });
});
```

**Chart Component Test:**
```typescript
// components/__tests__/EquityCurveChart.test.tsx
import { render } from '@testing-library/react';
import { EquityCurveChart } from '../EquityCurveChart';

describe('EquityCurveChart', () => {
  const mockData = [
    { date: '2025-01-01', equity: 10000 },
    { date: '2025-01-02', equity: 10150 },
    { date: '2025-01-03', equity: 10300 },
  ];

  it('should render chart with data', () => {
    const { container } = render(<EquityCurveChart data={mockData} />);
    expect(container.querySelector('.recharts-wrapper')).toBeInTheDocument();
  });

  it('should show empty state when no data', () => {
    const { getByText } = render(<EquityCurveChart data={[]} />);
    expect(getByText(/no data available/i)).toBeInTheDocument();
  });
});
```

**Error Boundary Test:**
```typescript
// components/__tests__/ErrorBoundary.test.tsx
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';

function ThrowError() {
  throw new Error('Test error');
}

describe('ErrorBoundary', () => {
  it('should catch errors and display fallback', () => {
    // Suppress console.error for this test
    const spy = jest.spyOn(console, 'error').mockImplementation();

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    spy.mockRestore();
  });
});
```

### Link Integrity Tests

**Automated Link Checker:**
```typescript
// tests/links.test.ts
import { chromium } from '@playwright/test';

describe('Link Integrity', () => {
  it('should verify all internal links are valid', async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');

    const links = await page.$$eval('a[href^="/"]', anchors =>
      anchors.map(a => a.getAttribute('href'))
    );

    for (const link of links) {
      const response = await page.goto(`http://localhost:3000${link}`);
      expect(response?.status()).toBe(200);
    }

    await browser.close();
  });
});
```

### CI/CD Integration

**GitHub Actions Workflow:**
```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run Jest tests
        run: npm run test

      - name: Run Cypress E2E tests
        uses: cypress-io/github-action@v5
        with:
          start: npm run dev
          wait-on: 'http://localhost:3000'

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
```

---

## 9. Documentation Requirements

Create the following documentation files:

### `docs/methodology.md`
- **Word Count:** 1500-2000 words
- **Sections:** Overview, Data Pipeline, Model Architecture, Signal Generation, Backtesting, Limitations
- **Assets:** Include architecture diagram (`.png` or Mermaid)
- **Code Examples:** Signal generation pseudocode
- **Deadline:** Required before production launch

### `docs/architecture.md`
- **Word Count:** 1000-1500 words
- **Sections:** System Overview, Components (bot/API/frontend), Data Flow, Deployment, Security, Scalability
- **Assets:** System architecture diagram, data flow diagram
- **Technical Details:** Redis connection string (redacted), TLS cert path, deployment commands

### `docs/runbook.md`
- **Word Count:** 800-1200 words
- **Sections:** Deployment, Environment Variables, Monitoring, Troubleshooting, Rollback, Incidents, Backups
- **Format:** Checklists and command snippets
- **Audience:** DevOps engineers, on-call personnel

### `docs/api-reference.md`
- **Word Count:** 1200-1800 words
- **Sections:** Authentication, Rate Limiting, Endpoints (GET/POST with examples), SSE, Error Codes, Webhooks
- **Format:** OpenAPI-style documentation
- **Code Examples:** cURL, JavaScript, Python for each endpoint

### `docs/signal-format.md`
- **Word Count:** 600-800 words
- **Sections:** Schema Definition, Field Descriptions, Interpretation Guide, Risk Disclaimer
- **Format:** JSON schema with annotated examples

### `docs/user-guide.md`
- **Word Count:** 800-1200 words
- **Sections:** Getting Started, Accessing Signals (Discord/Web/API), Understanding Signals, FAQ
- **Assets:** Screenshots, video embeds (optional)
- **Audience:** End users (traders)

### Additional Documentation Files

**`/policies/terms.md`** (Terms of Service)
**`/policies/privacy.md`** (Privacy Policy)
**`/policies/refunds.md`** (Refund Policy)

---

## 10. Deliverables for Claude Code

This section provides a **comprehensive, prioritized checklist** for Claude Code to implement. Each item is actionable and specific.

### Phase 1: Critical Data & API Integration (Priority: P0)

- [ ] **Fix API Environment Variable**
  - Verify `NEXT_PUBLIC_API_BASE` is set in Vercel environment
  - Value should be: `https://signals-api.fly.dev` (or correct production URL)
  - Test API connectivity from frontend

- [ ] **Implement Performance Metrics Integration**
  - Create API client in `lib/api-client.ts` with retry logic
  - Fetch real metrics from `/api/performance` endpoint
  - Replace all hardcoded zeros on home page
  - Add loading skeletons and error states
  - File: `app/page.tsx`, `components/PerformanceMetrics.tsx`

- [ ] **Implement SSE Signal Feed**
  - Create `useSSE` hook in `hooks/useSSE.ts`
  - Establish EventSource connection to `/api/live-signals`
  - Add reconnection logic with exponential backoff
  - Display connection status indicator (🟢🟡🔴)
  - Render signals in table/card view
  - Add fallback for "No signals yet"
  - File: `app/live-signals/page.tsx`, `components/LiveSignalFeed.tsx`

- [ ] **Build PnL Dashboard**
  - Fetch equity curve from `/api/pnl/equity-curve`
  - Implement Recharts LineChart for equity curve
  - Fetch summary stats from `/api/pnl/summary`
  - Display: Total PnL, Win Rate, Profit Factor, Sharpe, Max Drawdown
  - Fetch monthly returns from `/api/pnl/monthly-returns`
  - Create table with sortable columns
  - Add loading skeletons and error states
  - File: `app/pnl/page.tsx`, `components/EquityCurveChart.tsx`, `components/MonthlyReturnsTable.tsx`

### Phase 2: Content & Messaging Fixes (Priority: P0)

- [ ] **Deduplicate Trading Pairs**
  - Remove duplicate BTC/USD, ETH/USD, SOL/USD from pairs list
  - Fetch pairs from `/api/config/pairs` API endpoint (create if doesn't exist)
  - Display unique list on home page
  - File: `app/page.tsx`

- [ ] **Align Signal Frequency Messaging**
  - Measure actual average signals/day from API
  - Update all pages to use consistent claim (e.g., "15-20 signals/day on average")
  - Files: `app/page.tsx`, `app/pricing/page.tsx`, footer component

- [ ] **Standardize Performance Claims**
  - Pull all performance metrics from single source of truth (`/api/performance`)
  - Ensure homepage, pricing page, and methodology use same values
  - Files: `app/page.tsx`, `app/pricing/page.tsx`

### Phase 3: Navigation & Link Fixes (Priority: P0)

- [ ] **Create Missing Documentation Pages**
  - Create `/app/docs/methodology/page.tsx` and `docs/methodology.md`
  - Create `/app/docs/api-reference/page.tsx` and `docs/api-reference.md`
  - Create `/app/docs/architecture/page.tsx` and `docs/architecture.md`
  - Create `/app/docs/runbook/page.tsx` (link to GitHub or create `docs/runbook.md`)
  - Create `/app/docs/signal-format/page.tsx` and `docs/signal-format.md`
  - Create `/app/docs/user-guide/page.tsx` and `docs/user-guide.md`
  - Follow content requirements from Section 9

- [ ] **Fix Broken Links**
  - Update runbook link to valid URL (or create page)
  - Update GitHub source link to correct repo
  - Remove or fix any 404-returning links
  - Verify all footer links are valid

- [ ] **Create Status Page**
  - Create `/app/status/page.tsx`
  - Fetch status from `/api/health` endpoint (or Uptime Robot API)
  - Display component statuses (site, API, bot, Redis, Stripe)
  - Show uptime percentage (last 90 days)
  - List recent incidents
  - File: `app/status/page.tsx`, `components/StatusDashboard.tsx`

- [ ] **Fix Mobile Navigation**
  - Ensure hamburger menu toggles correctly
  - Fix z-index issues (menu should overlay content)
  - Test on mobile viewport (375px width)
  - File: `components/Navigation.tsx` or `app/layout.tsx`

### Phase 4: Stripe & Subscription Flow (Priority: P1)

- [ ] **Implement Stripe Checkout**
  - Install Stripe SDK: `npm install stripe @stripe/stripe-js`
  - Add Stripe environment variables to Vercel (keys, webhook secret, price IDs)
  - Create `/app/api/create-checkout-session/route.ts`:
    - Accept `priceId` and `tier` in request body
    - Create Stripe checkout session
    - Set success_url and cancel_url
    - Return sessionId
  - Update pricing page buttons to call API and redirect to Stripe
  - File: `app/pricing/page.tsx`, `app/api/create-checkout-session/route.ts`

- [ ] **Implement Stripe Webhook Handler**
  - Create `/app/api/webhooks/stripe/route.ts`
  - Verify webhook signature
  - Handle `checkout.session.completed` event
  - Update user tier in database (or trigger downstream service)
  - Trigger Discord role assignment (call Discord bot API)
  - File: `app/api/webhooks/stripe/route.ts`

- [ ] **Create Success/Cancel Pages**
  - Create `/app/subscribe/success/page.tsx`:
    - Thank you message
    - Next steps (link Discord, join server)
    - CTA to dashboard
  - Create `/app/subscribe/cancel/page.tsx`:
    - "Checkout canceled" message
    - Return to pricing button

- [ ] **Fix Pricing Page Tier Descriptions**
  - Ensure Free, Premium, Elite tiers have distinct features (no duplicates)
  - Update Discord role names to match tiers
  - Add trial period badge ("7-day free trial")
  - Link to refund policy
  - File: `app/pricing/page.tsx`

### Phase 5: UX/UI Improvements (Priority: P1)

- [ ] **Add Loading Skeletons**
  - Create reusable Skeleton component
  - Add to: PerformanceMetrics, LiveSignalFeed, PnLDashboard
  - File: `components/ui/Skeleton.tsx`

- [ ] **Implement Error Boundaries**
  - Create ErrorBoundary component
  - Wrap all API-dependent components
  - Add retry button in error fallback
  - File: `components/ErrorBoundary.tsx`

- [ ] **Add Tooltips for Metrics**
  - Install Radix UI Tooltip: `npm install @radix-ui/react-tooltip`
  - Add tooltips to: Sharpe Ratio, Drawdown, Profit Factor, Confidence, Win Rate
  - Use definitions from Section 6
  - File: `components/ui/Tooltip.tsx`, apply in metric components

- [ ] **Responsive Design Audit**
  - Test all pages on mobile (375px), tablet (768px), desktop (1920px)
  - Fix horizontal scrolling issues
  - Ensure charts resize with ResponsiveContainer
  - Fix pricing cards stacking on mobile
  - Ensure touch targets ≥ 44x44px

- [ ] **Accessibility Improvements**
  - Add alt text to all images
  - Add ARIA labels to icon-only buttons
  - Ensure all forms have associated labels
  - Verify keyboard navigation works (tab through all interactive elements)
  - Add skip-to-content link
  - Run axe DevTools and fix violations

### Phase 6: SEO & Performance (Priority: P1)

- [ ] **Add Meta Tags to All Pages**
  - Add unique title and description to each page
  - Add Open Graph and Twitter Card tags
  - Files: `app/layout.tsx`, `app/page.tsx`, `app/live-signals/page.tsx`, etc.

- [ ] **Implement Structured Data**
  - Add Organization schema to home page
  - Add Product schema to pricing page
  - File: `components/StructuredData.tsx`

- [ ] **Generate Sitemap**
  - Create `app/sitemap.ts`
  - Include all pages with appropriate change frequency

- [ ] **Create Robots.txt**
  - Create `app/robots.ts`
  - Allow all pages except `/api/` and `/admin/`

- [ ] **Optimize Images**
  - Replace all `<img>` tags with Next.js `<Image>`
  - Add proper width, height, alt text
  - Use `priority` for above-fold images
  - Files: All components with images

- [ ] **Run Lighthouse Audit**
  - Run on all major pages (home, live-signals, pnl, pricing)
  - Fix issues until all scores ≥ 90
  - Document results

### Phase 7: Documentation (Priority: P2)

- [ ] **Write docs/methodology.md**
  - Follow structure from Section 9
  - Include algorithm overview, backtesting, limitations
  - 1500-2000 words

- [ ] **Write docs/api-reference.md**
  - Document all endpoints with examples
  - Include authentication, rate limiting, error codes
  - 1200-1800 words

- [ ] **Write docs/architecture.md**
  - System diagram (bot → Redis → API → frontend)
  - Component descriptions, deployment architecture
  - Include Redis connection details (redacted password)
  - 1000-1500 words

- [ ] **Write docs/runbook.md**
  - Deployment procedures, troubleshooting, incident response
  - 800-1200 words

- [ ] **Write docs/signal-format.md**
  - JSON schema, field definitions, interpretation guide
  - 600-800 words

- [ ] **Write docs/user-guide.md**
  - Getting started, accessing signals, FAQ
  - 800-1200 words

### Phase 8: Testing (Priority: P2)

- [ ] **Setup Cypress**
  - Install: `npm install --save-dev cypress`
  - Create navigation test (`cypress/e2e/navigation.cy.ts`)
  - Create SSE test (`cypress/e2e/live-signals.cy.ts`)
  - Create API fallback test (`cypress/e2e/api-fallback.cy.ts`)
  - Create Stripe checkout test (`cypress/e2e/stripe-checkout.cy.ts`)
  - Create documentation pages test (`cypress/e2e/documentation.cy.ts`)

- [ ] **Setup Jest & React Testing Library**
  - Install: `npm install --save-dev jest @testing-library/react @testing-library/jest-dom`
  - Create component tests:
    - PerformanceMetrics
    - EquityCurveChart
    - ErrorBoundary
  - Create link integrity test

- [ ] **Add CI/CD Workflow**
  - Create `.github/workflows/test.yml`
  - Run Jest and Cypress on every push
  - Run Lighthouse CI

### Phase 9: Final Polish (Priority: P3)

- [ ] **Add Sample Signal Gallery**
  - Create component showing example signals (no auth required)
  - Display on home page
  - File: `components/SampleSignals.tsx`

- [ ] **Add Testimonials Section**
  - Create testimonials component with real user quotes (with permission)
  - Display on home page
  - File: `components/Testimonials.tsx`

- [ ] **Add FAQ Section**
  - Create FAQ component answering common questions
  - Display on pricing page and/or dedicated FAQ page
  - File: `components/FAQ.tsx` or `app/faq/page.tsx`

- [ ] **Create Policy Pages**
  - `/app/policies/terms/page.tsx` (Terms of Service)
  - `/app/policies/privacy/page.tsx` (Privacy Policy)
  - `/app/policies/refunds/page.tsx` (Refund Policy)

- [ ] **Setup Analytics**
  - Add Google Analytics 4 (if desired)
  - Add Vercel Analytics (built-in)
  - File: `app/layout.tsx`

- [ ] **Setup Error Tracking**
  - Install Sentry: `npm install @sentry/nextjs`
  - Configure in `sentry.client.config.ts` and `sentry.server.config.ts`

### Phase 10: Pre-Launch Validation (Priority: P0)

- [ ] **End-to-End Manual Testing**
  - Complete full user journey: Landing → Pricing → Checkout → Success → Discord
  - Verify all metrics show real data (not zeros)
  - Verify SSE connection stable for 10+ minutes
  - Test on mobile device (real phone, not just DevTools)

- [ ] **Browser Compatibility**
  - Test on Chrome, Firefox, Safari, Edge
  - Ensure no console errors

- [ ] **Performance Audit**
  - Run Lighthouse on production URL
  - Ensure all scores ≥ 90
  - Fix any remaining issues

- [ ] **Security Audit**
  - Verify all environment variables are secrets (not committed to git)
  - Verify Stripe webhook signature validation
  - Ensure no API keys exposed in client-side code
  - Check for XSS vulnerabilities (sanitize user input)
  - Verify HTTPS everywhere

- [ ] **Content Review**
  - Proofread all copy for typos/grammar
  - Verify all links work (no 404s)
  - Verify all images have alt text
  - Verify consistent branding/tone

- [ ] **Legal Compliance**
  - Ensure Terms of Service, Privacy Policy, Refund Policy are complete
  - Add risk disclaimers to signal pages
  - Verify GDPR compliance (if applicable)

---

## Appendix A: Redis Cloud Connection Details

**Connection String (TLS Required):**
```
rediss://default:[PASSWORD]@redis-19818.c9.us-east-1-4.ec2.redns.redis-cloud.com:19818
```

**URL-Encoded (for environment variables):**
```
rediss://default:Salam78614%2A%2A%24%24@redis-19818.c9.us-east-1-4.ec2.redns.redis-cloud.com:19818
```

**CLI Connection:**
```bash
redis-cli -u redis://default:[PASSWORD]@redis-19818.c9.us-east-1-4.ec2.redns.redis-cloud.com:19818 \
  --tls \
  --cacert C:\Users\Maith\OneDrive\Desktop\signals-site\redis-ca.crt
```

**CA Certificate Path:**
```
C:\Users\Maith\OneDrive\Desktop\signals-site\redis-ca.crt
```

**CA Certificate Zip (Downloaded):**
```
C:\Users\Maith\Downloads\redis_ca (4).zip
```

**Usage in Code:**
```typescript
// For signals-api (Node.js)
import Redis from 'ioredis';

const redis = new Redis({
  host: 'redis-19818.c9.us-east-1-4.ec2.redns.redis-cloud.com',
  port: 19818,
  password: process.env.REDIS_PASSWORD,
  tls: {
    ca: fs.readFileSync('/path/to/redis-ca.crt'),
  },
});
```

---

## Appendix B: Success Metrics Dashboard

After completing all deliverables, the following should be measurable:

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| API Integration Success Rate | 0% | 99.9% | 🔴 |
| SSE Connection Uptime | 0% | 99.5% | 🔴 |
| Stripe Checkout Completion | 0% | 95% | 🔴 |
| Non-Zero Metrics Fields | 0/5 | 5/5 | 🔴 |
| Duplicate Symbols | 3 | 0 | 🔴 |
| 404 Errors | 4+ | 0 | 🔴 |
| Mobile Responsiveness Issues | 5+ | 0 | 🔴 |
| Accessibility Violations (Critical) | 8+ | 0 | 🔴 |
| Lighthouse Performance | 62 | 90+ | 🔴 |
| Lighthouse Accessibility | 71 | 90+ | 🔴 |
| Lighthouse SEO | 68 | 90+ | 🔴 |
| Pages with Meta Descriptions | 0/8 | 8/8 | 🔴 |
| Images with Alt Text | 20% | 100% | 🔴 |
| Missing Doc Pages | 5 | 0 | 🔴 |
| Error Boundary Coverage | 0% | 100% | 🔴 |
| Console Errors in Production | 5+ | 0 | 🔴 |

**Final Acceptance Criteria:**
All metrics must be green (🟢) before declaring the project investor-ready and production-viable.

---

## Conclusion

This PRD defines a comprehensive, investor-grade roadmap for the **signals-site** repository. It addresses every gap identified in the system evaluation, from broken data pipelines to missing documentation, from inconsistent messaging to inaccessible UI.

By following the deliverables checklist in Section 10, Claude Code (or any engineering team) can systematically transform the current incomplete prototype into a production-ready SaaS platform that:
- Delivers real-time signals reliably
- Processes subscriptions seamlessly
- Presents professional, data-driven UX
- Ranks well in search engines
- Meets accessibility standards
- Inspires investor confidence

This document is the **single source of truth** for all front-end development. All future features, bug fixes, and enhancements must align with the standards and architecture defined herein.

**Next Steps:**
1. Review and approve this PRD with stakeholders
2. Begin implementation starting with Phase 1 (Critical Data & API Integration)
3. Track progress against the checklist in Section 10
4. Conduct sprint reviews every 2 weeks
5. Launch when all P0 and P1 deliverables are complete and tested

**Document Version Control:**
- Version 1.0 (2025-01-14): Initial comprehensive PRD

**Approvals Required:**
- [ ] Engineering Lead
- [ ] Product Manager
- [ ] UX Designer
- [ ] DevOps Lead
- [ ] CEO / Founder (for investor readiness sign-off)

---

**End of PRD-003: Signals-Site Front-End SaaS Portal**
