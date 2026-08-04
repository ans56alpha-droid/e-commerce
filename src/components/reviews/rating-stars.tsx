import { Star } from "lucide-react";

import { cn } from "@/lib/cn";

interface RatingStarsProps {
  value: number;
  readOnly?: boolean;
  size?: number;
  name?: string;
  onChange?: (value: number) => void;
  label?: string;
  className?: string;
}

const STAR_COUNT = 5;

export default function RatingStars({
  value,
  readOnly = true,
  size = 16,
  name,
  onChange,
  label,
  className,
}: RatingStarsProps) {
  const filledStars = Math.min(STAR_COUNT, Math.max(0, Math.round(value)));

  const stars = Array.from({ length: STAR_COUNT }, (_, index) => index + 1);

  if (readOnly) {
    return (
      <div
        role="img"
        aria-label={label ?? `${value} out of ${STAR_COUNT} stars`}
        className={cn("flex items-center", className)}
      >
        {stars.map((star) => (
          <Star
            key={star}
            style={{ width: size, height: size }}
            className={cn(
              "shrink-0",
              star <= filledStars
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted"
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center", className)}>
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          name={name}
          value={star}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          aria-pressed={star <= filledStars}
          onClick={() => onChange?.(star)}
          className="rounded p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Star
            style={{ width: size, height: size }}
            className={cn(
              "shrink-0",
              star <= filledStars
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted"
            )}
          />
        </button>
      ))}
    </div>
  );
}
