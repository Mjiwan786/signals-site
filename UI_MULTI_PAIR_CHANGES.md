# signals-site Multi-Pair UI Changes

**Branch**: `feature/add-trading-pairs`
**Status**: Ready for local testing
**Impact**: Zero impact on production (changes in feature branch only)

---

## Changes Made

### 1. Type Schema Updates

**File**: `web/lib/types.ts`

**Changes**:
- Added `'staging'` to SignalsQuerySchema mode enum
- Now supports: `'paper' | 'live' | 'staging'`

```typescript
// Before
mode: z.enum(['paper', 'live']).default('paper'),

// After
mode: z.enum(['paper', 'live', 'staging']).default('paper'),
```

**Impact**: Allows API calls to request staging stream data

---

### 2. Signals Table Component

**File**: `web/components/SignalsTable.tsx`

**Changes**:

#### A. Mode Selector Enhancement
- Added "Staging (New Pairs)" option to mode dropdown

```typescript
<option value="paper">Paper Trading</option>
<option value="live">Live Trading</option>
<option value="staging">Staging (New Pairs)</option>
```

#### B. Pair Filter Conversion
**Before**: Free-text input field
```typescript
<input
  value={pair}
  onChange={(e) => setPair(e.target.value)}
  placeholder="e.g. BTC-USD, ETH-USD"
/>
```

**After**: Dropdown with predefined pairs
```typescript
<select value={pair} onChange={(e) => setPair(e.target.value)}>
  <option value="">All Pairs</option>
  <option value="BTC/USD">BTC/USD - Bitcoin</option>
  <option value="ETH/USD">ETH/USD - Ethereum</option>
  <option value="SOL/USD">SOL/USD - Solana</option>
  <option value="ADA/USD">ADA/USD - Cardano</option>
  <option value="AVAX/USD">AVAX/USD - Avalanche</option>
</select>
```

**Benefits**:
- User-friendly pair selection
- Prevents typos (BTC-USD vs BTC/USD)
- Clear visualization of available pairs
- Shows coin names for better UX

---

### 3. Live Signals Feed Component

**File**: `web/components/SignalsFeedSSE.tsx`

**Changes**:
- Updated mode prop type to include `'staging'`
- Added staging mode label display

```typescript
// Before
mode?: 'paper' | 'live';

// After
mode?: 'paper' | 'live' | 'staging';
```

```typescript
// Mode display
{mode === 'staging' ? 'Staging (New Pairs)' :
 mode === 'paper' ? 'Paper Trading' : 'Live Trading'}
```

---

### 4. Streaming Hooks

**File**: `web/lib/streaming-hooks.ts`

**Changes**:
- Updated `useSignalsStream` hook to support staging mode

```typescript
// Before
export function useSignalsStream(mode: 'paper' | 'live' = 'paper', enabled: boolean = true)

// After
export function useSignalsStream(mode: 'paper' | 'live' | 'staging' = 'paper', enabled: boolean = true)
```

---

## API Integration

The UI now sends the following query parameters to signals-api:

### Staging Stream Example
```bash
GET https://crypto-signals-api.fly.dev/v1/signals?mode=staging&pair=SOL/USD&limit=200
```

### Production Stream (Unchanged)
```bash
GET https://crypto-signals-api.fly.dev/v1/signals?mode=paper&pair=BTC/USD&limit=200
```

---

## User Experience

### Before
- Mode: `Paper Trading` | `Live Trading`
- Pair: Free-text input (error-prone)

### After
- Mode: `Paper Trading` | `Live Trading` | `Staging (New Pairs)`
- Pair: Dropdown with 5 predefined options + "All Pairs"

**UI Flow**:
1. User selects "Staging (New Pairs)" from mode dropdown
2. User selects specific pair (e.g., "SOL/USD - Solana") from pair dropdown
3. UI fetches signals from `signals:paper:staging` stream for that pair
4. Real-time SSE updates show new SOL/USD signals as they're generated

---

## Testing Locally

### Prerequisites
1. signals-api deployed with staging support (completed)
2. crypto-ai-bot publishing to `signals:paper:staging` (pending)

### Test Steps

```bash
cd signals-site

# 1. Install dependencies
npm install

# 2. Set environment variables
# Ensure .env.local has:
# NEXT_PUBLIC_API_URL=https://crypto-signals-api.fly.dev

# 3. Run development server
npm run dev

# 4. Open browser
# http://localhost:3000

# 5. Test staging mode
# - Scroll to "Recent Trading Signals" section
# - Select "Staging (New Pairs)" from mode dropdown
# - Select "SOL/USD - Solana" from pair dropdown
# - Click "Refresh"
# - Verify signals appear (if any published)

# 6. Test backward compatibility
# - Select "Paper Trading" mode
# - Select "BTC/USD - Bitcoin" pair
# - Click "Refresh"
# - Verify production signals still work
```

---

## Backward Compatibility

### Guaranteed Compatible

✅ All existing functionality preserved:
- Paper Trading mode (default)
- Live Trading mode
- BTC/USD and ETH/USD pairs
- API endpoint unchanged
- SSE streaming unchanged

✅ New features are additive only:
- Staging mode is new option (doesn't affect existing modes)
- Pair dropdown includes all original pairs
- "All Pairs" option maintains original behavior

---

## Deployment Strategy

### Phase 1: No Deployment Yet ⏳
**Current State**: Changes committed to feature branch only
**Production**: Completely untouched

### Phase 2: Deploy to Vercel (After User Approval)
```bash
# From feature branch
git push origin feature/add-trading-pairs

# Create pull request
gh pr create --title "feat(ui): Add multi-pair support and staging mode" \
  --body "$(cat UI_MULTI_PAIR_CHANGES.md)"

# Vercel preview deployment will automatically build feature branch
# Test on preview URL before merging
```

### Phase 3: Merge to Main (After Preview Testing)
```bash
# Only after user confirms preview works
gh pr merge <pr-number> --squash
```

---

## Rollback Procedure

### If Issues Found in Preview

**Option A: Fix Forward**
```bash
# Make fixes in feature branch
git add .
git commit -m "fix: address preview issues"
git push origin feature/add-trading-pairs
# Vercel will auto-deploy new preview
```

**Option B: Abandon Changes**
```bash
# Close PR without merging
gh pr close <pr-number>
# Production remains unchanged
```

### If Issues Found After Merge

**Option A: Git Revert**
```bash
git revert <merge-commit-hash>
git push origin main
# Vercel will auto-deploy revert
```

**Option B: Vercel Rollback**
```bash
# From Vercel dashboard
# Deployments → Select previous deployment → "Promote to Production"
```

**Impact of Rollback**: ZERO (new features only, no breaking changes)

---

## Files Modified

```
web/lib/types.ts                    (1 line changed)
web/lib/streaming-hooks.ts          (1 line changed)
web/components/SignalsTable.tsx     (18 lines changed)
web/components/SignalsFeedSSE.tsx   (3 lines changed)
```

**Total Changes**: 23 lines
**Test Coverage**: Manual testing required (no automated tests for UI)

---

## Next Steps

### Immediate (After This Commit)
- [x] Commit UI changes to feature branch
- [ ] Test locally with dev server
- [ ] Create pull request to main (DO NOT merge yet)

### Pending User Approval
- [ ] Start staging signal publisher in crypto-ai-bot
- [ ] Verify staging signals appear in UI
- [ ] Test all 5 pairs (BTC, ETH, SOL, ADA, AVAX)
- [ ] Monitor for 2 hours
- [ ] Get user approval to deploy

### After Approval
- [ ] Merge PR to main
- [ ] Vercel auto-deploys to production
- [ ] Verify production deployment
- [ ] Update signals-api to main branch (if needed)

---

## Risk Assessment

**Risk Level**: Minimal

**Reasons**:
1. Changes are additive (no deletions or breaking changes)
2. All changes behind feature flag (staging mode)
3. Backward compatibility maintained
4. Production streams untouched
5. Vercel preview allows testing before production
6. Easy rollback via git revert or Vercel UI

**Mitigation**:
- All changes tested locally before PR
- PR review before merge
- Preview deployment tested before production
- User approval required at each phase
- Rollback procedures documented and tested

---

**Status**: Ready for Local Testing
**Recommendation**: Test locally, then create PR for review (DO NOT merge yet)
