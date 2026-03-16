const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

interface JsonLdProps {
  data: object;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function organizationSchema(name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url: SITE_URL,
  };
}

export function breadcrumbSchema(crumbs: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path}`,
    })),
  };
}

export function productSchema(product: {
  name: string;
  description: string;
  whyTopFind: string;
  imageUrl: string;
  price: number;
  rating: number;
  reviewCount?: number;
  affiliateUrl: string;
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.whyTopFind || product.description,
    image: product.imageUrl,
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: product.affiliateUrl,
    },
  };
  if (product.rating > 0 && product.reviewCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating.toFixed(1),
      reviewCount: product.reviewCount,
    };
  }
  return schema;
}

export function itemListSchema(
  category: { name: string; description: string; slug: string },
  items: Array<{ name: string; id: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `10 Best ${category.name} on Amazon`,
    description: category.description,
    url: `${SITE_URL}/categories/${category.slug}`,
    numberOfItems: items.length,
    itemListElement: items.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: `${SITE_URL}/products/${p.id}`,
    })),
  };
}
