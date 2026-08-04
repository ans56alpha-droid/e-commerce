import type { ProductReview } from "@/services/review/queries";

import Card from "@/components/ui/card";
import { cn } from "@/lib/cn";

import RatingStars from "./rating-stars";

interface ReviewCardProps {
  review: ProductReview;
  className?: string;
}

function formatDate(createdAt: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(createdAt));
}

function ReviewAvatar({ name, image }: { name: string; image: string }) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name}
        className="h-10 w-10 shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground"
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function ReviewCard({ review, className }: ReviewCardProps) {
  return (
    <Card className={cn("p-5", className)}>
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <ReviewAvatar name={review.user.name} image={review.user.image} />

          <div className="space-y-1">
            <p className="font-medium leading-none">{review.user.name}</p>

            <RatingStars value={review.rating} size={14} />
          </div>
        </div>

        <time
          dateTime={review.createdAt}
          className="shrink-0 text-sm text-muted-foreground"
        >
          {formatDate(review.createdAt)}
        </time>
      </header>

      {review.title && <h4 className="mt-3 font-semibold">{review.title}</h4>}

      <p className="mt-1 text-muted-foreground">{review.comment}</p>
    </Card>
  );
}
