import { db } from "@/lib/db";
import {
  categories as categoriesTable,
  products as productsTable,
  affiliateClicks as affiliateClicksTable,
  pageViews as pageViewsTable,
} from "@/lib/schema";
import { eq, asc, sql, desc, gte, and } from "drizzle-orm";
import type { Product, Category, CategoryData, SearchableProduct } from "@/types";

// ── Type mappers ──────────────────────────────────────────────────────────────
// Drizzle returns `numeric` columns as strings; cast them back to numbers here.

function mapCategory(row: typeof categoriesTable.$inferSelect): Category {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    icon: row.icon ?? "",
    accentColor: row.accentColor ?? "",
    coverImageUrl: row.coverImageUrl ?? undefined,
    scaffolded: row.scaffolded,
  };
}

function mapProduct(row: typeof productsTable.$inferSelect): Product {
  return {
    id: row.id,
    categorySlug: row.categorySlug,
    rank: row.rank,
    featured: row.featured ?? false,
    name: row.name,
    description: row.description ?? "",
    whyTopFind: row.whyTopFind ?? "",
    price: Number(row.price),
    originalPrice: row.originalPrice != null ? Number(row.originalPrice) : undefined,
    rating: row.rating != null ? Number(row.rating) : 0,
    reviewCount: row.reviewCount ?? undefined,
    imageUrl: row.imageUrl ?? "",
    affiliateUrl: row.affiliateUrl,
    youtubeVideoId: row.youtubeVideoId ?? undefined,
    tags: row.tags ?? [],
    asin: row.asin ?? undefined,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  const rows = await db
    .select()
    .from(categoriesTable)
    .where(eq(categoriesTable.scaffolded, false));
  return rows.map(mapCategory);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const rows = await db
    .select()
    .from(categoriesTable)
    .where(eq(categoriesTable.slug, slug));
  return rows[0] ? mapCategory(rows[0]) : null;
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const rows = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.categorySlug, slug))
    .orderBy(asc(productsTable.rank));
  return rows.map(mapProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const rows = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, id));
  return rows[0] ? mapProduct(rows[0]) : null;
}

export async function getAllProducts(): Promise<Product[]> {
  const rows = await db
    .select()
    .from(productsTable)
    .orderBy(asc(productsTable.rank));
  return rows.map(mapProduct);
}

export async function getAllSearchableProducts(): Promise<SearchableProduct[]> {
  const rows = await db
    .select({
      product: productsTable,
      categoryName: categoriesTable.name,
    })
    .from(productsTable)
    .innerJoin(
      categoriesTable,
      eq(productsTable.categorySlug, categoriesTable.slug)
    )
    .where(eq(categoriesTable.scaffolded, false))
    .orderBy(asc(productsTable.rank));

  return rows.map(({ product, categoryName }) => ({
    ...mapProduct(product),
    categoryName,
  }));
}

/**
 * Returns product counts per category slug in a single query.
 * Used by the home page to render category badges without N+1 queries.
 */
export async function getProductCountsByCategory(): Promise<Record<string, number>> {
  const rows = await db
    .select({
      slug: productsTable.categorySlug,
      count: sql<number>`count(*)::int`,
    })
    .from(productsTable)
    .innerJoin(categoriesTable, eq(productsTable.categorySlug, categoriesTable.slug))
    .where(eq(categoriesTable.scaffolded, false))
    .groupBy(productsTable.categorySlug);

  return Object.fromEntries(rows.map((r) => [r.slug, r.count]));
}

export async function getCategoryData(slug: string): Promise<CategoryData | null> {
  const category = await getCategoryBySlug(slug);
  if (!category) return null;
  const prods = await getProductsByCategory(slug);
  return { category, products: prods };
}

const TRENDING_MIN_CLICKS = 3;

/**
 * Returns the most-clicked products over the last 7 days.
 * Falls back to top-ranked products if fewer than `limit`
 * products have sufficient click data.
 */
export async function getTrendingProducts(limit = 8): Promise<Product[]> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Find products with the most affiliate clicks in the last 7 days
  const trendingRows = await db
    .select({
      product: productsTable,
      clickCount: sql<number>`count(*)::int`.as("click_count"),
    })
    .from(affiliateClicksTable)
    .innerJoin(productsTable, eq(affiliateClicksTable.productId, productsTable.id))
    .innerJoin(categoriesTable, eq(productsTable.categorySlug, categoriesTable.slug))
    .where(gte(affiliateClicksTable.clickedAt, sevenDaysAgo))
    .groupBy(productsTable.id)
    .having(gte(sql<number>`count(*)::int`, TRENDING_MIN_CLICKS))
    .orderBy(desc(sql`count(*)`))
    .limit(limit);

  const trending = trendingRows.map((r) => mapProduct(r.product));

  // Fall back to top-ranked products if not enough trending data
  if (trending.length < limit) {
    const existingIds = new Set(trending.map((p) => p.id));
    const fillCount = limit - trending.length;

    const fallbackRows = await db
      .select()
      .from(productsTable)
      .innerJoin(categoriesTable, eq(productsTable.categorySlug, categoriesTable.slug))
      .where(eq(categoriesTable.scaffolded, false))
      .orderBy(asc(productsTable.rank))
      .limit(fillCount + existingIds.size);

    for (const row of fallbackRows) {
      if (trending.length >= limit) break;
      if (!existingIds.has(row.products.id)) {
        trending.push(mapProduct(row.products));
        existingIds.add(row.products.id);
      }
    }
  }

  return trending;
}

/**
 * Returns the total number of page views for a given product.
 */
export async function getProductViewCount(productId: string): Promise<number> {
  const rows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(pageViewsTable)
    .where(
      and(
        eq(pageViewsTable.entityType, "product"),
        eq(pageViewsTable.entityId, productId)
      )
    );
  return rows[0]?.count ?? 0;
}
