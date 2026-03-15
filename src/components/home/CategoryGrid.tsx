import CategoryCard from "@/components/category/CategoryCard";
import type { Category } from "@/types";

interface CategoryGridProps {
  categories: Category[];
  productCounts: Record<string, number>;
}

export default function CategoryGrid({
  categories,
  productCounts,
}: CategoryGridProps) {
  return (
    <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">All Categories</h2>
          <p className="text-gray-500 text-sm mt-1">
            {categories.length} categories · Top 10 picks each
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.slug}
            category={category}
            productCount={productCounts[category.slug] ?? 10}
          />
        ))}
      </div>
    </section>
  );
}
