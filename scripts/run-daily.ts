/**
 * Daily maintenance script.
 *
 * Run manually:
 *   npx ts-node --project tsconfig.scripts.json scripts/run-daily.ts
 *
 * Or via GitHub Actions (see .github/workflows/daily-trends.yml)
 *
 * What it does:
 * 1. Fetches trending Google search queries to detect new category opportunities
 * 2. Scaffolds JSON files for any newly-trending categories (scaffolded:true)
 * 3. Refreshes product data (price + direct ASIN link) via Amazon PA API
 *    — skipped gracefully if PA API credentials are not configured
 */

import { detectNewCategories } from "./detect-trends";
import { scaffoldNewCategories } from "./scaffold-category";
import { execSync } from "child_process";

async function main() {
  console.log("=".repeat(50));
  console.log("AmazonFinds Daily Run");
  console.log(`Running at: ${new Date().toISOString()}`);
  console.log("=".repeat(50));

  // ── Step 1: Trend detection & category scaffolding ──────────────────────
  try {
    console.log("\n[1/2] Detecting trending categories...");
    const newCandidates = await detectNewCategories();

    if (newCandidates.length === 0) {
      console.log("  No new trending categories detected today.");
    } else {
      console.log(`  Detected ${newCandidates.length} potential new categories:`);
      newCandidates.forEach((k, i) => console.log(`    ${i + 1}. ${k}`));
      scaffoldNewCategories(newCandidates);
    }
  } catch (err) {
    console.warn("\n  Trend detection failed (non-fatal):", err);
  }

  // ── Step 2: Product data refresh (prices + direct links) ────────────────
  const hasCredentials =
    process.env.AMAZON_ACCESS_KEY_ID && process.env.AMAZON_SECRET_ACCESS_KEY;

  if (!hasCredentials) {
    console.log(
      "\n[2/2] Skipping product refresh — AMAZON_ACCESS_KEY_ID / " +
        "AMAZON_SECRET_ACCESS_KEY not set."
    );
    console.log(
      "  Add PA API credentials to enable live prices and direct product links."
    );
  } else {
    console.log("\n[2/2] Refreshing product prices and links via Amazon PA API...");
    try {
      execSync(
        "npx ts-node --project tsconfig.scripts.json scripts/refresh-products.ts",
        { stdio: "inherit" }
      );
    } catch (err) {
      console.error("\n  Product refresh failed:", err);
      // Non-fatal — trend scaffolding may still have produced changes
    }
  }

  console.log("\n✓ Daily run complete.");
}

main().catch((err) => {
  console.error("\n✗ Daily run failed:", err);
  process.exit(1);
});
