/**
 * Product data refresh script.
 *
 * For each product in every category JSON file, searches Amazon PA API
 * by product name to find the real ASIN. Updates:
 *   - affiliateUrl  → direct /dp/ASIN link (replaces search-page URL)
 *   - price         → live price from Amazon
 *   - imageUrl      → high-quality image from Amazon (optional)
 *
 * All other fields (name, description, whyTopFind, rating, etc.) are
 * preserved exactly as they are — this script only patches the data
 * that changes frequently or was never accurate.
 *
 * Run manually:
 *   npx ts-node --project tsconfig.scripts.json scripts/refresh-products.ts
 *
 * Or run a single category:
 *   npx ts-node --project tsconfig.scripts.json scripts/refresh-products.ts bedroom
 *
 * Requires env vars:
 *   AMAZON_ACCESS_KEY_ID
 *   AMAZON_SECRET_ACCESS_KEY
 *   NEXT_PUBLIC_AFFILIATE_TAG  (optional, defaults to "amazonfinds-20")
 */

import fs from "fs";
import path from "path";
import type { Product } from "../src/types";
import {
  searchAmazonProducts,
  CATEGORY_SEARCH_INDEX,
} from "../src/lib/amazon-pa-api";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json");

// PA API rate limit: 1 request per second
const RATE_LIMIT_MS = 1100;

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

interface CategoryEntry {
  slug: string;
  name: string;
  scaffolded?: boolean;
}

function loadCategories(): CategoryEntry[] {
  const raw = fs.readFileSync(CATEGORIES_FILE, "utf-8");
  const all: CategoryEntry[] = JSON.parse(raw);
  return all.filter((c) => !c.scaffolded);
}

function loadProducts(slug: string): Product[] {
  const filePath = path.join(DATA_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);
  return data.products ?? [];
}

function saveProducts(slug: string, products: Product[]): void {
  const filePath = path.join(DATA_DIR, `${slug}.json`);
  const existing = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  existing.products = products;
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), "utf-8");
}

async function refreshCategory(slug: string, categoryName: string): Promise<void> {
  const searchIndex = CATEGORY_SEARCH_INDEX[slug] ?? "All";
  const products = loadProducts(slug);

  if (products.length === 0) {
    console.log(`  Skipping ${slug} — no products`);
    return;
  }

  let updated = 0;
  let failed = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const label = `[${i + 1}/${products.length}] "${product.name.substring(0, 50)}"`;

    try {
      const results = await searchAmazonProducts(product.name, searchIndex, 1);

      if (results.length === 0) {
        console.log(`  ${label} → no results, skipping`);
        failed++;
      } else {
        const match = results[0];

        const oldUrl = product.affiliateUrl;
        const isSearchUrl = oldUrl.includes("/s?k=") || !oldUrl.includes("/dp/");

        product.affiliateUrl = match.affiliateUrl;

        if (match.price !== null) {
          product.price = match.price;
        }

        // Only update imageUrl if current one is a placeholder or Unsplash (Amazon
        // images are more accurate product shots)
        const isPlaceholderImage =
          product.imageUrl.includes("placehold.co") ||
          product.imageUrl.includes("unsplash.com");
        if (match.imageUrl && isPlaceholderImage) {
          product.imageUrl = match.imageUrl;
        }

        console.log(
          `  ${label} → ASIN ${match.asin}` +
            (match.price !== null ? ` $${match.price}` : "") +
            (isSearchUrl ? " (fixed link)" : "")
        );
        updated++;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      // If credentials are missing, abort immediately — no point continuing
      if (msg.includes("Missing AMAZON_ACCESS_KEY_ID")) {
        throw err;
      }
      console.warn(`  ${label} → API error: ${msg}`);
      failed++;
    }

    // Respect PA API rate limit between requests
    if (i < products.length - 1) {
      await sleep(RATE_LIMIT_MS);
    }
  }

  saveProducts(slug, products);
  console.log(
    `  ${categoryName}: ${updated} updated, ${failed} failed / ${products.length} total`
  );
}

async function main(): Promise<void> {
  console.log("=".repeat(60));
  console.log("AmazonFinds — Product Refresh");
  console.log(`Started: ${new Date().toISOString()}`);
  console.log("=".repeat(60));

  // Allow running a single category: `ts-node refresh-products.ts bedroom`
  const targetSlug = process.argv[2];

  const categories = loadCategories();
  const toRefresh = targetSlug
    ? categories.filter((c) => c.slug === targetSlug)
    : categories;

  if (toRefresh.length === 0) {
    if (targetSlug) {
      console.error(`Category "${targetSlug}" not found.`);
    } else {
      console.log("No categories to refresh.");
    }
    process.exit(1);
  }

  const estimated = toRefresh.reduce((sum, c) => sum + loadProducts(c.slug).length, 0);
  console.log(
    `\nRefreshing ${toRefresh.length} categor${toRefresh.length === 1 ? "y" : "ies"} ` +
      `(~${estimated} products, ~${Math.ceil((estimated * RATE_LIMIT_MS) / 60000)} min)\n`
  );

  let totalUpdated = 0;
  let totalFailed = 0;

  for (const category of toRefresh) {
    console.log(`\n▸ ${category.name} (${category.slug})`);
    try {
      const before = loadProducts(category.slug).length;
      await refreshCategory(category.slug, category.name);
      totalUpdated += before;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("Missing AMAZON_ACCESS_KEY_ID")) {
        console.error("\n✗ " + msg);
        console.error(
          "\nTo get PA API credentials:\n" +
            "  1. Log in to Amazon Associates (affiliate-program.amazon.com)\n" +
            "  2. Go to Tools → Product Advertising API\n" +
            "  3. Create access keys\n" +
            "  4. Add to .env.local:\n" +
            "       AMAZON_ACCESS_KEY_ID=your_key\n" +
            "       AMAZON_SECRET_ACCESS_KEY=your_secret\n" +
            "  5. Add the same vars to GitHub Secrets for CI"
        );
        process.exit(1);
      }
      console.error(`  Error refreshing ${category.slug}: ${msg}`);
      totalFailed++;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log(`Done. ${toRefresh.length - totalFailed} categories refreshed.`);
  console.log(`Finished: ${new Date().toISOString()}`);
  console.log("=".repeat(60));
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
