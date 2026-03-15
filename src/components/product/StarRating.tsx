import { Star } from "lucide-react";
import { formatReviewCount } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
  className?: string;
}

export default function StarRating({
  rating,
  reviewCount,
  size = "sm",
  className,
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  const starSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className={cn(starSize, "fill-amber-400 text-amber-400")}
          />
        ))}
        {hasHalf && (
          <div className="relative">
            <Star className={cn(starSize, "text-gray-700")} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={cn(starSize, "fill-amber-400 text-amber-400")} />
            </div>
          </div>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={cn(starSize, "text-gray-700")}
          />
        ))}
      </div>
      <span
        className={cn(
          "font-medium text-amber-400",
          size === "sm" ? "text-xs" : "text-sm"
        )}
      >
        {rating.toFixed(1)}
      </span>
      {reviewCount !== undefined && (
        <span
          className={cn(
            "text-gray-500",
            size === "sm" ? "text-xs" : "text-sm"
          )}
        >
          ({formatReviewCount(reviewCount)})
        </span>
      )}
    </div>
  );
}
