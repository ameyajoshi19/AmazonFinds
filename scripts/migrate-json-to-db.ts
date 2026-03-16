/**
 * One-time migration: imports all JSON data files into the Neon database.
 *
 * Safe to run multiple times — uses ON CONFLICT DO NOTHING so existing rows
 * are never overwritten.
 *
 * Run:
 *   npx ts-node --project tsconfig.scripts.json scripts/migrate-json-to-db.ts
 *
 * Requires env var:
 *   DATABASE_URL  — your Neon connection string
 */

import fs from "fs";
import path from "path";
import { db } from "../src/lib/db";
import { categories, products } from "../src/lib/schema";
import type { NewCategory, NewProduct } from "../src/lib/schema";

const DATA_DIR = path.join(process.cwd(), "src", "data");

interface RawCategory {
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  accentColor?: string;
  coverImageUrl?: string;
  scaffolded?: boolean;
}

interface RawProduct {
  id: string;
  categorySlug: string;
  rank: number;
  featured?: boolean;
  name: string;
  description?: string;
  whyTopFind?: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  imageUrl?: string;
  affiliateUrl: string;
  youtubeVideoId?: string | null;
  tags?: string[];
  asin?: string;
}

/** Extract ASIN from affiliateUrl if it's a /dp/ link */
function extractAsin(affiliateUrl: string): string | null {
  const match = affiliateUrl.match(/\/dp\/([A-Z0-9]{10})/);
  return match ? match[1] : null;
}

async function migrateCategories(): Promise<string[]> {
  const filePath = path.join(DATA_DIR, "categories.json");
  const raw: RawCategory[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  console.log(`\nMigrating ${raw.length} categories...`);

  const toInsert: NewCategory[] = raw.map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.description ?? null,
    icon: c.icon ?? null,
    accentColor: c.accentColor ?? null,
    coverImageUrl: c.coverImageUrl ?? null,
    scaffolded: c.scaffolded ?? false,
  }));

  const result = await db
    .insert(categories)
    .values(toInsert)
    .onConflictDoNothing()
    .returning({ slug: categories.slug });

  console.log(
    `  Inserted ${result.length} new categories (${raw.length - result.length} already existed)`
  );

  return raw.map((c) => c.slug);
}

async function migrateProducts(categorySlugs: string[]): Promise<void> {
  let totalInserted = 0;
  let totalSkipped = 0;

  for (const slug of categorySlugs) {
    const filePath = path.join(DATA_DIR, `${slug}.json`);
    if (!fs.existsSync(filePath)) {
      console.log(`  Skipping ${slug}.json — file not found`);
      continue;
    }

    let raw: { products?: RawProduct[] };
    try {
      raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } catch {
      console.warn(`  Could not parse ${slug}.json, skipping`);
      continue;
    }

    const rawProducts: RawProduct[] = raw.products ?? [];
    if (rawProducts.length === 0) {
      console.log(`  ${slug}: 0 products (empty)`);
      continue;
    }

    const toInsert: NewProduct[] = rawProducts.map((p) => {
      const asinFromUrl = extractAsin(p.affiliateUrl);
      return {
        id: p.id,
        categorySlug: p.categorySlug,
        rank: p.rank,
        featured: p.featured ?? false,
        name: p.name,
        description: p.description ?? null,
        whyTopFind: p.whyTopFind ?? null,
        price: String(p.price),
        originalPrice: p.originalPrice != null ? String(p.originalPrice) : null,
        rating: p.rating != null ? String(p.rating) : null,
        reviewCount: p.reviewCount ?? null,
        imageUrl: p.imageUrl ?? null,
        affiliateUrl: p.affiliateUrl,
        youtubeVideoId: p.youtubeVideoId ?? null,
        tags: p.tags ?? null,
        asin: p.asin ?? asinFromUrl ?? null,
      };
    });

    const result = await db
      .insert(products)
      .values(toInsert)
      .onConflictDoNothing()
      .returning({ id: products.id });

    const inserted = result.length;
    const skipped = rawProducts.length - inserted;
    totalInserted += inserted;
    totalSkipped += skipped;

    console.log(
      `  ${slug}: ${inserted} inserted${skipped > 0 ? `, ${skipped} already existed` : ""}`
    );
  }

  console.log(
    `\nProducts: ${totalInserted} inserted, ${totalSkipped} skipped (already existed)`
  );
}

async function main(): Promise<void> {
  console.log("=".repeat(60));
  console.log("AmazonFinds — JSON → Neon DB Migration");
  console.log(`Started: ${new Date().toISOString()}`);
  console.log("=".repeat(60));

  const slugs = await migrateCategories();

  console.log(`\nMigrating products for ${slugs.length} categories...`);
  await migrateProducts(slugs);

  console.log("\n" + "=".repeat(60));
  console.log("Migration complete.");
  console.log("\nNext steps:");
  console.log("  1. Verify data in Neon console");
  console.log("  2. Run: npm run refresh-products  (to get real prices + ASIN links)");
  console.log("  3. Deploy to Fly.io: fly deploy");
  console.log("=".repeat(60));
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
