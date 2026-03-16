import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pageViews, affiliateClicks, products, categories } from "@/lib/schema";
import { sql, desc, eq, gte, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const secret = request.headers.get("x-analytics-secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const daysParam = request.nextUrl.searchParams.get("days");
  const days = Math.min(parseInt(daysParam ?? "30", 10), 90);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // Top clicked products
  const topClicked = await db
    .select({
      productId: affiliateClicks.productId,
      productName: products.name,
      categorySlug: products.categorySlug,
      clicks: sql<number>`count(*)::int`,
    })
    .from(affiliateClicks)
    .innerJoin(products, eq(affiliateClicks.productId, products.id))
    .where(gte(affiliateClicks.clickedAt, since))
    .groupBy(affiliateClicks.productId, products.name, products.categorySlug)
    .orderBy(desc(sql`count(*)`))
    .limit(20);

  // Top viewed products
  const topViewedProducts = await db
    .select({
      entityId: pageViews.entityId,
      productName: products.name,
      views: sql<number>`count(*)::int`,
    })
    .from(pageViews)
    .innerJoin(products, eq(pageViews.entityId, products.id))
    .where(
      and(eq(pageViews.entityType, "product"), gte(pageViews.viewedAt, since))
    )
    .groupBy(pageViews.entityId, products.name)
    .orderBy(desc(sql`count(*)`))
    .limit(20);

  // Top viewed categories
  const topViewedCategories = await db
    .select({
      entityId: pageViews.entityId,
      categoryName: categories.name,
      views: sql<number>`count(*)::int`,
    })
    .from(pageViews)
    .innerJoin(categories, eq(pageViews.entityId, categories.slug))
    .where(
      and(eq(pageViews.entityType, "category"), gte(pageViews.viewedAt, since))
    )
    .groupBy(pageViews.entityId, categories.name)
    .orderBy(desc(sql`count(*)`))
    .limit(20);

  // Totals
  const [{ totalViews }] = await db
    .select({ totalViews: sql<number>`count(*)::int` })
    .from(pageViews)
    .where(gte(pageViews.viewedAt, since));

  const [{ totalClicks }] = await db
    .select({ totalClicks: sql<number>`count(*)::int` })
    .from(affiliateClicks)
    .where(gte(affiliateClicks.clickedAt, since));

  return NextResponse.json({
    period: { days, since: since.toISOString() },
    totals: { views: totalViews, clicks: totalClicks },
    topClicked,
    topViewedProducts,
    topViewedCategories,
  });
}
