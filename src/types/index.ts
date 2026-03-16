export interface Product {
  id: string;
  categorySlug: string;
  rank: number;
  featured?: boolean;
  name: string;
  description: string;
  whyTopFind: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount?: number;
  imageUrl: string;
  affiliateUrl: string;
  youtubeVideoId?: string;
  tags?: string[];
  asin?: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
  accentColor: string;
  coverImageUrl?: string;
  scaffolded?: boolean;
}

export interface SearchableProduct extends Product {
  categoryName: string;
}

export interface SearchResult {
  item: SearchableProduct;
  score?: number;
  refIndex: number;
}

export interface CategoryData {
  category: Category;
  products: Product[];
}
