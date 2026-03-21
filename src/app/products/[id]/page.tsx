import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllCategories,
  getProductById,
  getCategoryBySlug,
  getProductsByCategory,
  getProductViewCount,
} from "@/data/loader";
import ProductDetail from "@/components/product/ProductDetail";
import PageViewTracker from "@/components/analytics/PageViewTracker";
import JsonLd, { breadcrumbSchema, productSchema } from "@/components/seo/JsonLd";
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

  const year = new Date().getFullYear();
  const title = `${product.name} Review (${year})`;

  return {
    title,
    description: product.whyTopFind,
    alternates: { canonical: `/products/${id}` },
    openGraph: {
      title,
      description: product.whyTopFind,
      images: [{ url: product.imageUrl }],
      url: `/products/${id}`,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  const [category, viewCount] = await Promise.all([
    getCategoryBySlug(product.categorySlug),
    getProductViewCount(id),
  ]);
  if (!category) notFound();

  return (
    <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <PageViewTracker entityType="product" entityId={id} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: category.name, path: `/categories/${product.categorySlug}` },
          { name: product.name, path: `/products/${id}` },
        ])}
      />
      <JsonLd data={productSchema(product)} />
      <ProductDetail product={product} category={category} viewCount={viewCount} />
    </div>
  );
}
