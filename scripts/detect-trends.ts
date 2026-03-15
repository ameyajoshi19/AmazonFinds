import fs from "fs";
import path from "path";
import type { Category } from "../src/types";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const googleTrends = require("google-trends-api");

const DATA_DIR = path.join(process.cwd(), "src", "data");
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json");

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
  relatedQuery?: string;
  score: number;
}

function loadExistingCategories(): Category[] {
  try {
    const raw = fs.readFileSync(CATEGORIES_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function existingCategorySlugs(categories: Category[]): Set<string> {
  return new Set(categories.map((c) => c.slug));
}

function keywordToSlug(keyword: string): string {
  return keyword
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function keywordToName(keyword: string): string {
  return keyword
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

async function fetchRelatedQueries(keyword: string): Promise<TrendResult[]> {
  try {
    const result = await googleTrends.relatedQueries({
      keyword,
      startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // last 7 days
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
  const categories = loadExistingCategories();
  const existingSlugs = existingCategorySlugs(categories);
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
      // Respect rate limits
      await new Promise((r) => setTimeout(r, 2000));
    } catch (err) {
      console.warn(`Failed to fetch trends for "${seed}":`, err);
    }
  }

  return [...new Set(newCandidates)]; // deduplicate
}

export {
  detectNewCategories,
  loadExistingCategories,
  keywordToSlug,
  keywordToName,
};
