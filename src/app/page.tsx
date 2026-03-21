import { getAllCategories, getProductCountsByCategory, getTrendingProducts } from "@/data/loader";
import Hero from "@/components/home/Hero";
import TrendingSection from "@/components/home/TrendingSection";
import CategoryGrid from "@/components/home/CategoryGrid";

export const revalidate = 3600;

export default async function HomePage() {
  const [categories, productCounts, trendingProducts] = await Promise.all([
    getAllCategories(),
    getProductCountsByCategory(),
    getTrendingProducts(),
  ]);

  return (
    <>
      <Hero />
      {trendingProducts.length > 0 && (
        <TrendingSection products={trendingProducts} />
      )}
      <CategoryGrid categories={categories} productCounts={productCounts} />
    </>
  );
}
