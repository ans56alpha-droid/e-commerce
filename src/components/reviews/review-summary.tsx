import { cn } from "@/lib/cn";

import RatingStars from "./rating-stars";

interface ReviewSummaryProps {
  rating: number;
  reviewCount: number;
  className?: string;
}

export default function ReviewSummary({
  rating,
  reviewCount,
  className,
}: ReviewSummaryProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <p className="text-4xl font-bold leading-none">{rating}</p>

      <div className="space-y-1.5">
        <RatingStars value={rating} size={18} />

        <p className="text-sm text-muted-foreground">
          {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
        </p>
      </div>
    </div>
  );
}
