import { Star } from "lucide-react";

interface RatingProps {
  rating: number;
  reviewCount: number;
}

export default function Rating({ rating, reviewCount }: RatingProps) {
  return (
    <div className="flex items-center gap-1 text-sm">
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />

      <span>{rating}</span>

      <span className="text-muted-foreground">({reviewCount})</span>
    </div>
  );
}
