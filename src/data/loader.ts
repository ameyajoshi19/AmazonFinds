import fs from "fs";
import path from "path";
import type { Product, Category, CategoryData, SearchableProduct } from "@/types";

const dataDir = path.join(process.cwd(), "src", "data");

export function getAllCategories(): Category[] {
  try {
    const filePath = path.join(dataDir, "categories.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const categories: Category[] = JSON.parse(raw);
    return categories.filter((c) => !c.scaffolded);
  } catch {
    return [];
  }
}

export function getAllCategoriesIncludingScaffolded(): Category[] {
  try {
    const filePath = path.join(dataDir, "categories.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getCategoryBySlug(slug: string): Category | null {
  const categories = getAllCategoriesIncludingScaffolded();
  return categories.find((c) => c.slug === slug) ?? null;
}

export function getProductsByCategory(slug: string): Product[] {
  try {
    const filePath = path.join(dataDir, `${slug}.json`);
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    const products: Product[] = data.products ?? [];
    return products.sort((a, b) => a.rank - b.rank);
  } catch {
    return [];
  }
}

export function getProductById(id: string): Product | null {
  const categories = getAllCategories();
  for (const category of categories) {
    const products = getProductsByCategory(category.slug);
    const product = products.find((p) => p.id === id);
    if (product) return product;
  }
  return null;
}

export function getAllProducts(): Product[] {
  const categories = getAllCategories();
  return categories.flatMap((c) => getProductsByCategory(c.slug));
}

export function getAllSearchableProducts(): SearchableProduct[] {
  const categories = getAllCategories();
  return categories.flatMap((c) => {
    const products = getProductsByCategory(c.slug);
    return products.map((p) => ({ ...p, categoryName: c.name }));
  });
}

export function getCategoryData(slug: string): CategoryData | null {
  const category = getCategoryBySlug(slug);
  if (!category) return null;
  const products = getProductsByCategory(slug);
  return { category, products };
}
