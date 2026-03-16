import { db } from "../src/lib/db";
import { categories } from "../src/lib/schema";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const googleTrends = require("google-trends-api");

// Shopping-related trend keywords to monitor
const TREND_SEEDS = [
  "best kitchen gadgets",
  "amazon home finds",
  "amazon must haves",
  "best tech gifts",
  "home organization amazon",
  "amazon fitness equipment",
  "amazon beauty finds",
  "best outdoor products",
  "amazon pet products",
  "best baby products amazon",
];

interface TrendResult {
  keyword: string;
  score: number;
}

async function loadExistingCategorySlugs(): Promise<Set<string>> {
  const rows = await db.select({ slug: categories.slug }).from(categories);
  return new Set(rows.map((r) => r.slug));
}

function keywordToSlug(keyword: string): string {
  return keyword
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

async function fetchRelatedQueries(keyword: string): Promise<TrendResult[]> {
  try {
    const result = await googleTrends.relatedQueries({
      keyword,
      startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      geo: "US",
    });

    const parsed = JSON.parse(result);
    const risingQueries =
      parsed?.default?.rankedList?.[1]?.rankedKeyword ?? [];

    return risingQueries.slice(0, 5).map(
      (item: { query: string; value: number }) => ({
        keyword: item.query,
        score: item.value || 0,
      })
    );
  } catch {
    return [];
  }
}

async function detectNewCategories(): Promise<string[]> {
  const existingSlugs = await loadExistingCategorySlugs();
  const newCandidates: string[] = [];

  console.log(
    `Checking trends against ${existingSlugs.size} existing categories...`
  );

  for (const seed of TREND_SEEDS) {
    try {
      const related = await fetchRelatedQueries(seed);
      for (const trend of related) {
        const slug = keywordToSlug(trend.keyword);
        if (!existingSlugs.has(slug) && slug.length > 3) {
          newCandidates.push(trend.keyword);
          console.log(
            `  New trend candidate: "${trend.keyword}" (score: ${trend.score})`
          );
        }
      }
      await new Promise((r) => setTimeout(r, 2000));
    } catch (err) {
      console.warn(`Failed to fetch trends for "${seed}":`, err);
    }
  }

  return [...new Set(newCandidates)];
}

export { detectNewCategories };
