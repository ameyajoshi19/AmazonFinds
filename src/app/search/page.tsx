"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/components/search/SearchBar";
import SearchResults from "@/components/search/SearchResults";
import { searchProducts } from "@/lib/search";
import type { SearchableProduct } from "@/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchableProduct[]>([]);
  const [products, setProducts] = useState<SearchableProduct[]>([]);

  useEffect(() => {
    // Load all products client-side from the JSON files via API
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: SearchableProduct[]) => {
        setProducts(data);
        if (initialQuery) {
          setResults(searchProducts(initialQuery, data));
        }
      })
      .catch(() => {});
  }, [initialQuery]);

  useEffect(() => {
    if (products.length === 0) return;
    setResults(searchProducts(query, products));
  }, [query, products]);

  return (
    <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-6">Search Finds</h1>
        <SearchBar
          initialQuery={query}
          onSearch={setQuery}
          placeholder="Search products, categories, keywords..."
          autoFocus
          className="max-w-2xl"
        />
      </div>
      <SearchResults results={results} query={query} />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="pt-24 px-4 text-gray-500">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
