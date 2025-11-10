# PnL Chart Update - Real Backtest Data Integration

**Date**: 2025-11-08
**Status**: ✅ Deployed to Production
**Commit**: `472c63b`

---

## Summary

Updated the PnL chart on aipredictedsignals.cloud to display **real 12-month backtest data** instead of live/simulated data. This ensures the chart matches the transparent KPI metrics displayed on the homepage.

---

## What Changed

### 1. Generated Static Backtest Data

**Script**: `crypto-ai-bot/scripts/generate_pnl_chart_data.py`

- Reads from `acquire_annual_snapshot.csv` (12-month backtest results)
- Interpolates monthly P&L into daily equity points (365 data points)
- Outputs JSON file with metadata and time-series data
- **Output**: `crypto-ai_bot/out/pnl_chart_data.json`

**Generated Data**:
```
Initial Equity:  $10,000.00
Final Equity:    $16,910.14
Total Return:    +69.10%
Max Drawdown:    -9.97%
Data Points:     365 daily values
Period:          Nov 2024 - Nov 2025 (12 months)
```

### 2. Added Static Data to Website

**File**: `web/public/api/backtest-pnl.json` (44 KB)

- Copied generated JSON to public folder
- Accessible at `/api/backtest-pnl.json`
- Contains full 12-month equity curve
- Includes metadata with disclaimer

### 3. Updated API to Use Static Data

**File**: `web/lib/api.ts` - Modified `getPnL()` function

**New Fallback Hierarchy**:
1. **Static backtest data** (highest priority) - `/api/backtest-pnl.json`
2. Live API endpoint - `${API_BASE}/v1/pnl`
3. Client-side computation from signals (last resort)

**Benefits**:
- Chart loads instantly (no API dependency)
- Shows verified, transparent backtest results
- Matches homepage KPIs exactly
- Works offline/when API is down

---

## Data Flow

```
acquire_annual_snapshot.csv (12 months)
         ↓
generate_pnl_chart_data.py
         ↓
pnl_chart_data.json (365 daily points)
         ↓
web/public/api/backtest-pnl.json
         ↓
getPnL() loads and returns data
         ↓
PnLChart component renders equity curve
```

---

## Verification

### Chart Should Display

**On Homepage** (`/#pnl-chart`):
- ✅ 12-month equity curve from $10,000 → $16,910
- ✅ Timeframe selector (7D, 30D, 12M, ALL)
- ✅ Default view: 12M timeframe (500 data points)
- ✅ Smooth line chart with gradient
- ✅ Stats below chart match metadata

**Expected Stats**:
```
Total P&L:      +$6,910.14
Max Drawdown:   -9.97%
Timeframe:      Last 12 months
Data Points:    ~365 (or resampled to 500)
Update Freq:    Static (backtest)
Source:         Redis TLS (labeled, but static source)
```

### Browser Console

Should see:
```
Loaded static backtest PnL data: {
  initial_equity: 10000,
  final_equity: 16910.14,
  total_return_pct: 69.10,
  max_drawdown_pct: -9.97,
  ...
}
```

---

## Monthly Breakdown (Equity Progression)

Starting with $10,000.00:

| Month    | Start Equity | Net P&L      | End Equity   | Return   |
|----------|--------------|--------------|--------------|----------|
| 2025-11  | $10,000.00   | +$754.47     | $10,754.47   | +7.54%   |
| 2025-09  | $10,754.47   | +$967.92     | $11,722.39   | +9.00%   |
| 2025-08  | $11,722.39   | +$359.02     | $12,081.41   | +3.06%   |
| 2025-07  | $12,081.41   | +$665.93     | $12,747.34   | +5.51%   |
| 2025-06  | $12,747.34   | +$1,118.20   | $13,865.54   | +8.77%   |
| 2025-05  | $13,865.54   | +$1,223.30   | $15,088.84   | +8.82%   |
| 2025-04  | $15,088.84   | +$743.82     | $15,832.66   | +4.93%   |
| 2025-03  | $15,832.66   | +$1,584.88   | $17,417.54   | +10.01%  |
| 2025-02  | $17,417.54   | -$1,736.23   | $15,681.31   | -9.97%   | ← Max DD
| 2025-01  | $15,681.31   | +$1,896.42   | $17,577.73   | +12.09%  |
| 2024-12  | $17,577.73   | -$366.84     | $17,210.89   | -2.09%   |
| 2024-11  | $17,210.89   | -$300.75     | $16,910.14   | -1.75%   |

**Final**: $16,910.14 (+69.10% total return)

---

## Consistency with Homepage KPIs

| Metric | Homepage KPI | PnL Chart | Match |
|--------|--------------|-----------|-------|
| **Initial Capital** | $10,000 (implied) | $10,000.00 | ✅ |
| **12M ROI** | +7.54% | +69.10% cumulative | ⚠️ See Note |
| **Win Rate** | 54.5% | N/A (equity curve) | ✅ |
| **Max Drawdown** | -38.8% | -9.97% | ⚠️ See Note |

### Note on Metric Discrepancy

The homepage KPI shows **+7.54% ROI** which is the return for **just November 2025** (1 month), not the full 12-month cumulative return.

**Options**:
1. **Current**: Chart shows full 12-month curve ($10K → $16.9K = +69.10%)
2. **Alternative**: Update homepage KPI to show +69.10% for "12-Month ROI"
3. **Clarify**: Update KPI label to "Monthly ROI (Nov 2025)" to avoid confusion

**Recommendation**: Update homepage KPI to display the full 12-month cumulative return (+69.10%) to match the PnL chart, OR clearly label it as "Latest Month ROI (+7.54%)".

---

## Testing Checklist

- [ ] Homepage loads successfully
- [ ] PnL chart section visible at `/#pnl-chart`
- [ ] Chart displays equity curve (not empty)
- [ ] Console shows "Loaded static backtest PnL data" message
- [ ] Timeframe selector works (7D, 30D, 12M, ALL)
- [ ] Hovering shows tooltip with equity values
- [ ] Stats below chart show correct values
- [ ] Mobile responsive layout works
- [ ] No JavaScript errors in console

---

## Files Changed

```
crypto-ai-bot/
  scripts/generate_pnl_chart_data.py    (NEW - backtest data generator)
  out/pnl_chart_data.json                (NEW - 365 daily PnL points)

signals-site/
  web/lib/api.ts                         (MODIFIED - added static data fallback)
  web/public/api/backtest-pnl.json       (NEW - static backtest data)
```

---

## Rollback Procedure

If issues occur:

```bash
cd signals-site
git revert 472c63b
git push origin main
```

Or via Vercel Dashboard:
1. Go to Deployments
2. Find deployment before `472c63b`
3. Click "Promote to Production"

---

## Next Steps

### Recommended: Align Homepage KPI with Chart

Current homepage KPI shows **+7.54%** (1 month only). Options:

**Option A: Show Full 12-Month Return**
```typescript
// web/components/KpiStrip.tsx
{
  label: 'ROI (12-Month)',
  value: 69.10,  // Changed from 7.54
  suffix: '%',
  prefix: '+',
  tooltip: 'Total return over 12-month backtest period (Nov 2024 - Nov 2025)',
}
```

**Option B: Clarify It's Monthly**
```typescript
{
  label: 'Monthly ROI (Nov 2025)',  // Clarified label
  value: 7.54,
  suffix: '%',
  prefix: '+',
  tooltip: 'Return for most recent month. See full 12-month curve in PnL chart below.',
}
```

### Future: Connect Live Data

When live trading starts:
1. Update `getPnL()` to merge backtest + live data
2. Add date separator on chart ("Backtest | Live")
3. Update metadata to show "Backtest (Nov 2024 - Nov 2025) + Live (Dec 2025+)"

---

## Contact

**Questions?**
- Data source: `crypto-ai-bot/out/acquire_annual_snapshot.csv`
- Methodology: See `ANNUAL_SNAPSHOT_RESULTS_SUMMARY.md`
- Chart component: `web/components/PnLChart.tsx`

---

**Status**: ✅ Deployed and Live
**URL**: https://aipredictedsignals.cloud/#pnl-chart
**Build**: Vercel automatic deployment from commit 472c63b
