# signals-site: Performance Metrics UI Components

Live metrics display with sparkline charts for P&L optimization tracking.

## Components to Create

### 1. Performance Metrics Card Component (`web/components/PerformanceMetricsCard.tsx`)

```tsx
'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Sparklines, SparklinesLine } from 'react-sparklines';

interface PerformanceMetrics {
  aggressive_mode_score: number;
  velocity_to_target_pct: number;
  days_remaining: number | null;
  daily_rate_usd: number;
  win_rate_pct: number;
  total_trades: number;
  timestamp: number;
}

export function PerformanceMetricsCard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [history, setHistory] = useState<PerformanceMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initial fetch
    fetchMetrics();

    // Subscribe to SSE stream
    const eventSource = new EventSource(
      'https://crypto-signals-api.fly.dev/api/metrics/performance/stream'
    );

    eventSource.addEventListener('performance_update', (event) => {
      const data = JSON.parse(event.data);
      setMetrics(data);
      setLoading(false);

      // Keep last 50 data points for sparkline
      setHistory((prev) => [...prev, data].slice(-50));
    });

    eventSource.addEventListener('error', (event) => {
      console.error('SSE error:', event);
      setError('Connection error');
    });

    return () => eventSource.close();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('https://crypto-signals-api.fly.dev/api/metrics/performance');
      const data = await res.json();
      setMetrics(data);
      setHistory([data]);
      setLoading(false);
    } catch (err) {
      setError('Failed to load metrics');
      setLoading(false);
    }
  };

  if (loading) return <Card className="p-6">Loading metrics...</Card>;
  if (error) return <Card className="p-6 text-red-500">{error}</Card>;
  if (!metrics) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Aggressive Mode Score */}
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Aggressive Mode Score</p>
            <p className="text-3xl font-bold mt-2">
              {metrics.aggressive_mode_score.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {interpretScore(metrics.aggressive_mode_score)}
            </p>
          </div>
          <div className="w-24 h-12">
            <Sparklines data={history.map((m) => m.aggressive_mode_score)} limit={50}>
              <SparklinesLine color="#10b981" />
            </Sparklines>
          </div>
        </div>
      </Card>

      {/* Velocity to Target */}
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Progress to +$10k</p>
            <p className="text-3xl font-bold mt-2">
              {metrics.velocity_to_target_pct.toFixed(1)}%
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(metrics.velocity_to_target_pct, 100)}%` }}
              />
            </div>
          </div>
          <div className="w-24 h-12">
            <Sparklines data={history.map((m) => m.velocity_to_target_pct)} limit={50}>
              <SparklinesLine color="#3b82f6" />
            </Sparklines>
          </div>
        </div>
      </Card>

      {/* Days Remaining */}
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Est. Days to Target</p>
            <p className="text-3xl font-bold mt-2">
              {metrics.days_remaining ? Math.round(metrics.days_remaining) : '∞'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              ${metrics.daily_rate_usd.toFixed(2)}/day
            </p>
          </div>
          <div className="w-24 h-12">
            <Sparklines data={history.map((m) => m.daily_rate_usd)} limit={50}>
              <SparklinesLine color="#f59e0b" />
            </Sparklines>
          </div>
        </div>
      </Card>

      {/* Trading Stats */}
      <Card className="p-6 md:col-span-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Win Rate</p>
            <p className="text-2xl font-bold mt-1">{metrics.win_rate_pct.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Trades</p>
            <p className="text-2xl font-bold mt-1">{metrics.total_trades}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Daily Rate</p>
            <p className="text-2xl font-bold mt-1 text-green-600">
              +${metrics.daily_rate_usd.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Update</p>
            <p className="text-sm mt-1">
              {new Date(metrics.timestamp * 1000).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function interpretScore(score: number): string {
  if (score >= 2.0) return 'Excellent';
  if (score >= 1.5) return 'Very Good';
  if (score >= 1.0) return 'Good';
  if (score >= 0.5) return 'Fair';
  return 'Poor';
}
```

### 2. Add to Dashboard (`web/app/dashboard/page.tsx`)

```tsx
import { PerformanceMetricsCard } from '@/components/PerformanceMetricsCard';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">P&L Optimization Progress</h1>

      {/* Performance Metrics */}
      <PerformanceMetricsCard />

      {/* Existing dashboard components */}
      {/* ... */}
    </div>
  );
}
```

### 3. Install Dependencies

```bash
cd web
npm install react-sparklines @types/react-sparklines
```

### 4. Deploy

```bash
git add .
git commit -m "feat: add performance metrics UI with live SSE updates"
git push origin main
```

Vercel will auto-deploy.

## Features

- **Real-time Updates**: SSE connection for live data
- **Sparkline Charts**: Visual trend indicators
- **Progress Bar**: Visual velocity indicator
- **Responsive Grid**: Mobile-friendly layout
- **Auto-reconnect**: Handles connection failures

## Testing

Visit: https://aipredictedsignals.cloud/dashboard

---

**Status**: Ready to implement
**Time**: ~20 minutes
**Risk**: Low (UI only, no backend changes)
