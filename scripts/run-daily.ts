/**
 * Daily trend detection and category scaffolding script.
 *
 * Run manually:
 *   npx ts-node --project tsconfig.scripts.json scripts/run-daily.ts
 *
 * Or via GitHub Actions (see .github/workflows/daily-trends.yml)
 *
 * What it does:
 * 1. Fetches trending Google search queries related to shopping/Amazon
 * 2. Compares against existing categories in public/data/categories.json
 * 3. For new trending categories, creates a scaffold JSON file
 * 4. Adds them to categories.json with scaffolded:true
 * 5. New categories won't show on the site until you fill in products and
 *    set scaffolded:false
 */

import { detectNewCategories } from "./detect-trends";
import { scaffoldNewCategories } from "./scaffold-category";

async function main() {
  console.log("=".repeat(50));
  console.log("AmazonFinds Daily Trend Detection");
  console.log(`Running at: ${new Date().toISOString()}`);
  console.log("=".repeat(50));

  try {
    console.log("\n[1/2] Detecting trending categories...");
    const newCandidates = await detectNewCategories();

    if (newCandidates.length === 0) {
      console.log("\nNo new trending categories detected today.");
    } else {
      console.log(
        `\nDetected ${newCandidates.length} potential new categories:`
      );
      newCandidates.forEach((k, i) => console.log(`  ${i + 1}. ${k}`));

      console.log("\n[2/2] Scaffolding new categories...");
      scaffoldNewCategories(newCandidates);
    }

    console.log("\n✓ Daily run complete.");
    console.log("\nNext steps:");
    console.log("  1. Review new scaffolded categories in public/data/");
    console.log("  2. Add 10 products to each new <slug>.json file");
    console.log(
      '  3. Set "scaffolded": false in categories.json to activate'
    );
    console.log("  4. Commit and push — the site will rebuild automatically");
  } catch (err) {
    console.error("\n✗ Daily run failed:", err);
    process.exit(1);
  }
}

main();
