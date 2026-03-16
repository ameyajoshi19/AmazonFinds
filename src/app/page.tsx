import { getAllCategories, getProductCountsByCategory } from "@/data/loader";
import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";

export const revalidate = 3600;

export default async function HomePage() {
  // Parallel queries: category list + product counts per category (single DB query each)
  const [categories, productCounts] = await Promise.all([
    getAllCategories(),
    getProductCountsByCategory(),
  ]);

  return (
    <>
      <Hero />
      <CategoryGrid categories={categories} productCounts={productCounts} />
    </>
  );
}
