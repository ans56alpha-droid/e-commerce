import type { ProductReview } from "@/services/review/queries";

import { cn } from "@/lib/cn";

import ReviewCard from "./review-card";
import ReviewEmpty from "./review-empty";

interface ReviewListProps {
  reviews: ProductReview[];
  className?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

export default function ReviewList({
  reviews,
  className,
  emptyTitle,
  emptyDescription,
}: ReviewListProps) {
  if (reviews.length === 0) {
    return <ReviewEmpty title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <ul className={cn("space-y-4", className)}>
      {reviews.map((review) => (
        <li key={review.id}>
          <ReviewCard review={review} />
        </li>
      ))}
    </ul>
  );
}
