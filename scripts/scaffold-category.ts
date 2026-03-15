import fs from "fs";
import path from "path";
import type { Category } from "../src/types";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json");

// Default icon and color assignments for new scaffolded categories
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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function toTitleCase(text: string): string {
  return text
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function scaffoldCategory(keyword: string): Category {
  const slug = slugify(keyword);
  const name = toTitleCase(keyword);

  return {
    slug,
    name,
    description: `Trending finds for ${name.toLowerCase()}. Products selected based on Amazon ratings and trending searches. Add products to activate this category.`,
    icon: getNextIcon(),
    accentColor: getNextColor(),
    scaffolded: true,
  };
}

function scaffoldProductFile(slug: string): void {
  const filePath = path.join(DATA_DIR, `${slug}.json`);
  if (fs.existsSync(filePath)) {
    console.log(`  Skipping ${slug}.json — already exists`);
    return;
  }

  const content = {
    products: [],
    _note: `This category was auto-scaffolded from trending searches. Add 10 products and set scaffolded:false in categories.json to activate.`,
  };

  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), "utf-8");
  console.log(`  Created ${slug}.json (empty scaffold)`);
}

function addCategoryToList(category: Category): void {
  let categories: Category[] = [];
  try {
    const raw = fs.readFileSync(CATEGORIES_FILE, "utf-8");
    categories = JSON.parse(raw);
  } catch {
    categories = [];
  }

  // Don't add duplicates
  if (categories.some((c) => c.slug === category.slug)) {
    console.log(`  Category "${category.slug}" already in categories.json`);
    return;
  }

  categories.push(category);
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2), "utf-8");
  console.log(`  Added "${category.slug}" to categories.json`);
}

function scaffoldNewCategories(keywords: string[]): void {
  if (keywords.length === 0) {
    console.log("No new categories to scaffold.");
    return;
  }

  console.log(`\nScaffolding ${keywords.length} new categories...`);

  for (const keyword of keywords) {
    console.log(`\nProcessing: "${keyword}"`);
    const category = scaffoldCategory(keyword);
    addCategoryToList(category);
    scaffoldProductFile(category.slug);
  }
}

export { scaffoldNewCategories, scaffoldCategory };
