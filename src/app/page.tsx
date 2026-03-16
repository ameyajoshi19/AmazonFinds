import { getAllCategories, getProductsByCategory } from "@/data/loader";
import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";

export const revalidate = 3600;

export default async function HomePage() {
  const categories = await getAllCategories();

  const productCounts: Record<string, number> = {};
  for (const cat of categories) {
    const products = await getProductsByCategory(cat.slug);
    productCounts[cat.slug] = products.length;
  }

  return (
    <>
      <Hero />
      <CategoryGrid categories={categories} productCounts={productCounts} />
    </>
  );
}
