"use client";

import Fuse from "fuse.js";
import type { SearchableProduct } from "@/types";

let fuseInstance: Fuse<SearchableProduct> | null = null;

export function createSearchIndex(products: SearchableProduct[]) {
  fuseInstance = new Fuse(products, {
    keys: [
      { name: "name", weight: 2.0 },
      { name: "whyTopFind", weight: 1.5 },
      { name: "description", weight: 1.0 },
      { name: "categoryName", weight: 1.0 },
      { name: "tags", weight: 0.8 },
    ],
    threshold: 0.4,
    includeScore: true,
    minMatchCharLength: 2,
  });
  return fuseInstance;
}

export function searchProducts(
  query: string,
  products: SearchableProduct[]
): SearchableProduct[] {
  if (!query.trim()) return [];

  const fuse = new Fuse(products, {
    keys: [
      { name: "name", weight: 2.0 },
      { name: "whyTopFind", weight: 1.5 },
      { name: "description", weight: 1.0 },
      { name: "categoryName", weight: 1.0 },
      { name: "tags", weight: 0.8 },
    ],
    threshold: 0.4,
    includeScore: true,
    minMatchCharLength: 2,
  });

  return fuse.search(query).map((result) => result.item);
}
