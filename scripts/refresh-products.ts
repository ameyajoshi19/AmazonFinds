/**
 * Product data refresh script.
 *
 * For each product in the database, searches Amazon PA API by product name
 * to find the real ASIN. Updates:
 *   - affiliateUrl  → direct /dp/ASIN link (replaces search-page URL)
 *   - price         → live price from Amazon
 *   - imageUrl      → high-quality image from Amazon (for placeholder/Unsplash images)
 *   - asin          → the Amazon product identifier
 *   - lastRefreshedAt → timestamp of the last successful refresh
 *
 * Run manually:
 *   npx ts-node --project tsconfig.scripts.json scripts/refresh-products.ts
 *
 * Or run a single category:
 *   npx ts-node --project tsconfig.scripts.json scripts/refresh-products.ts bedroom
 *
 * Requires env vars:
 *   DATABASE_URL
 *   AMAZON_ACCESS_KEY_ID
 *   AMAZON_SECRET_ACCESS_KEY
 *   NEXT_PUBLIC_AFFILIATE_TAG  (optional, defaults to "amazonfinds-20")
 */

import { db } from "../src/lib/db";
import { categories, products } from "../src/lib/schema";
import { eq, asc } from "drizzle-orm";
import {
  searchAmazonProducts,
  CATEGORY_SEARCH_INDEX,
} from "../src/lib/amazon-pa-api";

const RATE_LIMIT_MS = 1100;

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function refreshCategory(
  categorySlug: string,
  categoryName: string
): Promise<void> {
  const searchIndex = CATEGORY_SEARCH_INDEX[categorySlug] ?? "All";
  const productRows = await db
    .select()
    .from(products)
    .where(eq(products.categorySlug, categorySlug))
    .orderBy(asc(products.rank));

  if (productRows.length === 0) {
    console.log(`  Skipping ${categorySlug} — no products`);
    return;
  }

  let updated = 0;
  let failed = 0;

  for (let i = 0; i < productRows.length; i++) {
    const product = productRows[i];
    const label = `[${i + 1}/${productRows.length}] "${product.name.substring(0, 50)}"`;

    try {
      const results = await searchAmazonProducts(product.name, searchIndex, 1);

      if (results.length === 0) {
        console.log(`  ${label} → no results, skipping`);
        failed++;
      } else {
        const match = results[0];
        const isSearchUrl =
          product.affiliateUrl.includes("/s?k=") ||
          !product.affiliateUrl.includes("/dp/");
        const isPlaceholderImage =
          !product.imageUrl ||
          product.imageUrl.includes("placehold.co") ||
          product.imageUrl.includes("unsplash.com");

        await db
          .update(products)
          .set({
            affiliateUrl: match.affiliateUrl,
            price: match.price !== null ? String(match.price) : product.price,
            imageUrl:
              match.imageUrl && isPlaceholderImage
                ? match.imageUrl
                : product.imageUrl,
            asin: match.asin || product.asin,
            lastRefreshedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(products.id, product.id));

        console.log(
          `  ${label} → ASIN ${match.asin}` +
            (match.price !== null ? ` $${match.price}` : "") +
            (isSearchUrl ? " (fixed link)" : "")
        );
        updated++;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("Missing AMAZON_ACCESS_KEY_ID")) throw err;
      console.warn(`  ${label} → API error: ${msg}`);
      failed++;
    }

    if (i < productRows.length - 1) {
      await sleep(RATE_LIMIT_MS);
    }
  }

  console.log(
    `  ${categoryName}: ${updated} updated, ${failed} failed / ${productRows.length} total`
  );
}

async function main(): Promise<void> {
  console.log("=".repeat(60));
  console.log("AmazonFinds — Product Refresh");
  console.log(`Started: ${new Date().toISOString()}`);
  console.log("=".repeat(60));

  const targetSlug = process.argv[2];

  const allCategories = await db
    .select({ slug: categories.slug, name: categories.name })
    .from(categories)
    .where(eq(categories.scaffolded, false));

  const toRefresh = targetSlug
    ? allCategories.filter((c) => c.slug === targetSlug)
    : allCategories;

  if (toRefresh.length === 0) {
    console.error(
      targetSlug ? `Category "${targetSlug}" not found.` : "No categories."
    );
    process.exit(1);
  }

  const productCount = await db.$count(
    products,
    targetSlug ? eq(products.categorySlug, targetSlug) : undefined
  );
  console.log(
    `\nRefreshing ${toRefresh.length} categor${toRefresh.length === 1 ? "y" : "ies"} ` +
      `(~${productCount} products, ~${Math.ceil((productCount * RATE_LIMIT_MS) / 60000)} min)\n`
  );

  for (const category of toRefresh) {
    console.log(`\n▸ ${category.name} (${category.slug})`);
    try {
      await refreshCategory(category.slug, category.name);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("Missing AMAZON_ACCESS_KEY_ID")) {
        console.error("\n✗ " + msg);
        console.error(
          "\nTo get PA API credentials:\n" +
            "  1. Log in to Amazon Associates (affiliate-program.amazon.com)\n" +
            "  2. Go to Tools → Product Advertising API → Create access keys\n" +
            "  3. Add to .env.local:\n" +
            "       AMAZON_ACCESS_KEY_ID=your_key\n" +
            "       AMAZON_SECRET_ACCESS_KEY=your_secret\n" +
            "  4. Add the same vars to GitHub Secrets for CI"
        );
        process.exit(1);
      }
      console.error(`  Error refreshing ${category.slug}: ${msg}`);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log(`Done. Finished: ${new Date().toISOString()}`);
  console.log("=".repeat(60));
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
