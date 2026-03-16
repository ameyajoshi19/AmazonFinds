/**
 * Scaffolds new categories in the database.
 *
 * Creates category rows with scaffolded:true and empty product sets.
 * Categories will NOT appear on the site until:
 *   1. Products are added (run refresh-products or add manually)
 *   2. scaffolded is set to false
 */

import { db } from "../src/lib/db";
import { categories } from "../src/lib/schema";
import type { NewCategory } from "../src/lib/schema";
import { slugify } from "../src/lib/utils";

const DEFAULT_ICONS = [
  "Sparkles", "Star", "TrendingUp", "Zap", "Gift", "Heart",
  "Package", "ShoppingBag", "Crown", "Leaf",
];

const DEFAULT_COLORS = [
  "violet", "teal", "sky", "lime", "fuchsia", "emerald",
  "cyan", "rose", "indigo", "amber",
];

let iconIndex = 0;
let colorIndex = 0;

function getNextIcon(): string {
  return DEFAULT_ICONS[iconIndex++ % DEFAULT_ICONS.length];
}

function getNextColor(): string {
  return DEFAULT_COLORS[colorIndex++ % DEFAULT_COLORS.length];
}

function toTitleCase(text: string): string {
  return text
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

async function scaffoldNewCategories(keywords: string[]): Promise<void> {
  if (keywords.length === 0) {
    console.log("No new categories to scaffold.");
    return;
  }

  console.log(`\nScaffolding ${keywords.length} new categories...`);

  for (const keyword of keywords) {
    const slug = slugify(keyword);
    const name = toTitleCase(keyword);

    const newCategory: NewCategory = {
      slug,
      name,
      description: `Trending finds for ${name.toLowerCase()}. Products selected based on Amazon ratings and trending searches.`,
      icon: getNextIcon(),
      accentColor: getNextColor(),
      scaffolded: true,
    };

    try {
      await db
        .insert(categories)
        .values(newCategory)
        .onConflictDoNothing();
      console.log(`  ✓ Scaffolded: "${slug}"`);
    } catch (err) {
      console.warn(`  ✗ Failed to scaffold "${slug}":`, err);
    }
  }
}

export { scaffoldNewCategories };
