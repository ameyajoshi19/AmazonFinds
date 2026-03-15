import ProductCard from "./ProductCard";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  showRank?: boolean;
}

export default function ProductGrid({
  products,
  showRank = true,
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          rank={showRank ? product.rank : undefined}
        />
      ))}
    </div>
  );
}
