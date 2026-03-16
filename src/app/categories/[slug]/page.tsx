import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllCategories, getCategoryData } from "@/data/loader";
import CategoryHero from "@/components/category/CategoryHero";
import ProductGrid from "@/components/product/ProductGrid";
import PageViewTracker from "@/components/analytics/PageViewTracker";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCategoryData(slug);
  if (!data) return {};

  return {
    title: `${data.category.name} — Top 10 Amazon Finds`,
    description: data.category.description,
    openGraph: {
      title: `${data.category.name} — Top 10 Amazon Finds`,
      description: data.category.description,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getCategoryData(slug);

  if (!data || data.category.scaffolded) {
    notFound();
  }

  return (
    <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <PageViewTracker entityType="category" entityId={slug} />
      <CategoryHero
        category={data.category}
        productCount={data.products.length}
      />
      {data.products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500">No products yet in this category.</p>
        </div>
      ) : (
        <ProductGrid products={data.products} />
      )}
    </div>
  );
}
