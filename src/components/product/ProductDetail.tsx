"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Play, ArrowLeft, Star, Tag } from "lucide-react";
import StarRating from "./StarRating";
import VideoModal from "./VideoModal";
import Badge from "@/components/ui/Badge";
import AffiliateLink from "@/components/ui/AffiliateLink";
import { formatPrice } from "@/lib/utils";
import type { Product, Category } from "@/types";

interface ProductDetailProps {
  product: Product;
  category: Category;
}

export default function ProductDetail({ product, category }: ProductDetailProps) {
  const [videoOpen, setVideoOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const accentColors: Record<string, string> = {
    orange: "text-orange-400",
    cyan: "text-cyan-400",
    indigo: "text-indigo-400",
    purple: "text-purple-400",
    blue: "text-blue-400",
    sky: "text-sky-400",
    stone: "text-stone-400",
    yellow: "text-yellow-400",
    violet: "text-violet-400",
    rose: "text-rose-400",
    green: "text-green-400",
    red: "text-red-400",
    emerald: "text-emerald-400",
    lime: "text-lime-400",
    teal: "text-teal-400",
    amber: "text-amber-400",
    fuchsia: "text-fuchsia-400",
    zinc: "text-zinc-400",
    pink: "text-pink-400",
  };

  const accentBg: Record<string, string> = {
    orange: "bg-orange-500/10 border-orange-500/20",
    cyan: "bg-cyan-500/10 border-cyan-500/20",
    indigo: "bg-indigo-500/10 border-indigo-500/20",
    purple: "bg-purple-500/10 border-purple-500/20",
    blue: "bg-blue-500/10 border-blue-500/20",
    sky: "bg-sky-500/10 border-sky-500/20",
    stone: "bg-stone-500/10 border-stone-500/20",
    yellow: "bg-yellow-500/10 border-yellow-500/20",
    violet: "bg-violet-500/10 border-violet-500/20",
    rose: "bg-rose-500/10 border-rose-500/20",
    green: "bg-green-500/10 border-green-500/20",
    red: "bg-red-500/10 border-red-500/20",
    emerald: "bg-emerald-500/10 border-emerald-500/20",
    lime: "bg-lime-500/10 border-lime-500/20",
    teal: "bg-teal-500/10 border-teal-500/20",
    amber: "bg-amber-500/10 border-amber-500/20",
    fuchsia: "bg-fuchsia-500/10 border-fuchsia-500/20",
    zinc: "bg-zinc-500/10 border-zinc-500/20",
    pink: "bg-pink-500/10 border-pink-500/20",
  };

  const colorClass = accentColors[category.accentColor] || "text-amber-400";
  const bgClass = accentBg[category.accentColor] || "bg-amber-500/10 border-amber-500/20";

  return (
    <>
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/categories/${category.slug}`}
            className={`hover:text-white transition-colors ${colorClass}`}
          >
            {category.name}
          </Link>
          <span>/</span>
          <span className="text-gray-400 truncate">{product.name}</span>
        </nav>

        {/* Back */}
        <Link
          href={`/categories/${category.slug}`}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to {category.name}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-800 border border-gray-700">
              {product.rank && (
                <div className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-amber-500 rounded-lg">
                  <span className="text-sm font-bold text-gray-950">
                    #{product.rank} in {category.name}
                  </span>
                </div>
              )}
              {imgError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 p-8">
                  <div className="w-16 h-16 mb-4 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                    <span className="text-amber-400 text-3xl">★</span>
                  </div>
                  <p className="text-gray-400 text-sm text-center leading-relaxed">
                    {product.name}
                  </p>
                </div>
              ) : (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  onError={() => setImgError(true)}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              )}
            </div>
            {product.youtubeVideoId && (
              <button
                onClick={() => setVideoOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-sm text-gray-300 hover:text-white transition-colors"
              >
                <Play className="w-4 h-4 fill-current" />
                Watch Product Video
              </button>
            )}
          </div>

          {/* Details */}
          <div className="space-y-5">
            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={
                      tag === "prime"
                        ? "prime"
                        : tag.includes("sale") || tag.includes("deal")
                        ? "sale"
                        : "default"
                    }
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <h1 className="text-2xl font-bold text-white leading-tight">
              {product.name}
            </h1>

            <StarRating
              rating={product.rating}
              reviewCount={product.reviewCount}
              size="md"
            />

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-white">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <Badge variant="sale">
                    Save{" "}
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )}
                    %
                  </Badge>
                </>
              )}
            </div>

            {/* Why top find */}
            <div className={`p-4 rounded-xl border ${bgClass}`}>
              <div className="flex items-center gap-2 mb-2">
                <Star className={`w-4 h-4 fill-current ${colorClass}`} />
                <span className={`text-sm font-semibold ${colorClass}`}>
                  Why It&apos;s a Top Find
                </span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                {product.whyTopFind}
              </p>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                About This Product
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Tags with icon */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <div className="flex flex-wrap gap-1.5">
                  {product.tags.map((tag) => (
                    <span key={tag} className="text-xs text-gray-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <AffiliateLink
              href={product.affiliateUrl}
              productId={product.id}
              className="w-full justify-center text-base py-3.5"
            >
              <ExternalLink className="w-4 h-4" />
              View on Amazon
            </AffiliateLink>

            <p className="text-xs text-gray-600 text-center">
              * As an Amazon affiliate, we may earn a commission from qualifying purchases.
            </p>
          </div>
        </div>
      </div>

      {videoOpen && product.youtubeVideoId && (
        <VideoModal
          videoId={product.youtubeVideoId}
          productName={product.name}
          onClose={() => setVideoOpen(false)}
        />
      )}
    </>
  );
}
