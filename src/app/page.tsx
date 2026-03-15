import { getAllCategories, getProductsByCategory } from "@/data/loader";
import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";

export const revalidate = 3600;

export default function HomePage() {
  const categories = getAllCategories();

  const productCounts: Record<string, number> = {};
  for (const cat of categories) {
    const products = getProductsByCategory(cat.slug);
    productCounts[cat.slug] = products.length;
  }

  return (
    <>
      <Hero />
      <CategoryGrid categories={categories} productCounts={productCounts} />
    </>
  );
}
