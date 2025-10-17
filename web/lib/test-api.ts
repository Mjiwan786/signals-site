/**
 * Test script to verify API helpers work correctly
 * Run: npx tsx lib/test-api.ts (requires API running on port 8000)
 */

import { getPnL, getSignals } from "./api";
import { num, dateFmt } from "./ui";

async function testAPI() {
  try {
    console.log("Testing getPnL(5)...");
    const pnlData = await getPnL(5);
    console.log(`✓ Fetched ${pnlData.length} PnL points`);

    if (pnlData.length > 0) {
      const latest = pnlData[0];
      console.log(`  Latest: equity=${num(latest.equity)}, pnl=${num(latest.daily_pnl)}, ts=${dateFmt(latest.ts)}`);
    }

    console.log("\nTesting getSignals({limit: 5})...");
    const signals = await getSignals({ limit: 5 });
    console.log(`✓ Fetched ${signals.length} signals`);

    if (signals.length > 0) {
      const latest = signals[0];
      console.log(`  Latest: ${latest.pair} ${latest.side} @ ${num(latest.entry, 4)} (${latest.strategy})`);
    }

    console.log("\n✓ All API tests passed!");
  } catch (error) {
    console.error("✗ API test failed:", error instanceof Error ? error.message : error);
    console.log("\nNote: Make sure the API is running on http://localhost:8000");
  }
}

testAPI();
