"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Play, ChevronRight } from "lucide-react";
import StarRating from "./StarRating";
import VideoModal from "./VideoModal";
import Badge from "@/components/ui/Badge";
import AffiliateLink from "@/components/ui/AffiliateLink";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  rank?: number;
}

export default function ProductCard({ product, rank }: ProductCardProps) {
  const [videoOpen, setVideoOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <>
      <div className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 hover:shadow-lg hover:shadow-black/40 transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-square bg-gray-800 overflow-hidden">
          {rank && (
            <div className="absolute top-3 left-3 z-10 w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-xs font-bold text-gray-950">{rank}</span>
            </div>
          )}
          {product.youtubeVideoId && (
            <button
              onClick={() => setVideoOpen(true)}
              className="absolute top-3 right-3 z-10 p-2 bg-black/60 backdrop-blur-sm rounded-lg text-white hover:bg-black/80 transition-colors"
              aria-label="Watch video"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
            </button>
          )}
          <Image
            src={imgError ? `https://placehold.co/400x400/1f2937/f59e0b?text=${encodeURIComponent(product.name.slice(0, 20))}` : product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {product.tags.slice(0, 2).map((tag) => (
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

          {/* Name */}
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-white text-sm leading-snug mb-2 line-clamp-2 hover:text-amber-400 transition-colors cursor-pointer">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <StarRating
            rating={product.rating}
            reviewCount={product.reviewCount}
            className="mb-3"
          />

          {/* Why top find */}
          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-3 italic">
            &ldquo;{product.whyTopFind}&rdquo;
          </p>

          {/* Price & CTA */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <AffiliateLink href={product.affiliateUrl} className="flex-shrink-0 text-xs px-3 py-2">
              <ExternalLink className="w-3.5 h-3.5" />
              View on Amazon
            </AffiliateLink>
          </div>

          {/* Detail link */}
          <Link
            href={`/products/${product.id}`}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-amber-400 mt-2 transition-colors"
          >
            See full details <ChevronRight className="w-3 h-3" />
          </Link>
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
