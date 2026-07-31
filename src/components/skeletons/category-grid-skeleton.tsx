import CategoryCardSkeleton from "./category-card-skeleton";

interface CategoryGridSkeletonProps {
  count?: number;
}

export default function CategoryGridSkeleton({ count = 4 }: CategoryGridSkeletonProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  );
}
