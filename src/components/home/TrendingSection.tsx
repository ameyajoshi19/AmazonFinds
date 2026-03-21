import { TrendingUp } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types";

interface TrendingSectionProps {
  products: Product[];
}

export default function TrendingSection({ products }: TrendingSectionProps) {
  if (products.length === 0) return null;

  // Prepend a synthetic "trending" tag so ProductCard renders the trending badge
  const taggedProducts = products.map((p) => ({
    ...p,
    tags: ["trending", ...(p.tags ?? [])],
  }));

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-400" />
            <h2 className="text-2xl font-bold text-white">Trending Now</h2>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Most popular picks this week
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" aria-label="Trending products">
        {taggedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
