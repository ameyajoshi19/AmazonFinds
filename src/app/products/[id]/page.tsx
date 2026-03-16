import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllCategories,
  getProductById,
  getCategoryBySlug,
  getProductsByCategory,
} from "@/data/loader";
import ProductDetail from "@/components/product/ProductDetail";
import PageViewTracker from "@/components/analytics/PageViewTracker";
import type { Product } from "@/types";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const categories = await getAllCategories();
  const allProducts: Product[] = (
    await Promise.all(categories.map((c) => getProductsByCategory(c.slug)))
  ).flat();
  return allProducts.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return {};

  return {
    title: product.name,
    description: product.whyTopFind,
    openGraph: {
      title: product.name,
      description: product.whyTopFind,
      images: [{ url: product.imageUrl }],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  const category = await getCategoryBySlug(product.categorySlug);
  if (!category) notFound();

  return (
    <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <PageViewTracker entityType="product" entityId={id} />
      <ProductDetail product={product} category={category} />
    </div>
  );
}
