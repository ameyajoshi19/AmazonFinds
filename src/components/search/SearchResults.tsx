import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import type { SearchableProduct } from "@/types";
import { Search } from "lucide-react";

interface SearchResultsProps {
  results: SearchableProduct[];
  query: string;
}

export default function SearchResults({ results, query }: SearchResultsProps) {
  if (!query.trim()) {
    return (
      <div className="text-center py-20">
        <Search className="w-12 h-12 text-gray-700 mx-auto mb-4" />
        <p className="text-gray-500">Start typing to search across all finds</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-20">
        <Search className="w-12 h-12 text-gray-700 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">
          No results for &ldquo;{query}&rdquo;
        </h2>
        <p className="text-gray-500 mb-6">
          Try different keywords or browse categories
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
        >
          Browse Categories
        </Link>
      </div>
    );
  }

  // Group results by category
  const grouped = results.reduce<Record<string, SearchableProduct[]>>(
    (acc, product) => {
      const key = product.categoryName;
      if (!acc[key]) acc[key] = [];
      acc[key].push(product);
      return acc;
    },
    {}
  );

  return (
    <div>
      <p className="text-sm text-gray-500 mb-6">
        Found <span className="text-white font-semibold">{results.length}</span>{" "}
        results for{" "}
        <span className="text-amber-400 font-semibold">&ldquo;{query}&rdquo;</span>
      </p>

      <div className="space-y-10">
        {Object.entries(grouped).map(([categoryName, products]) => (
          <div key={categoryName}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">{categoryName}</h2>
              <Link
                href={`/categories/${products[0].categorySlug}`}
                className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
