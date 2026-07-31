import Container from "@/components/ui/container";
import Skeleton from "@/components/ui/skeleton";
import ProductGridSkeleton from "./product-grid-skeleton";

export default function ProductDetailsSkeleton() {
  return (
    <Container className="py-10">
      <div className="mb-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-20 rounded-lg" />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-4 w-1/3" />
          <div className="space-y-2 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>

      <div className="mb-10 space-y-4">
        <Skeleton className="h-7 w-40" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-4 border-b border-border py-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        ))}
      </div>

      <div className="mb-10">
        <Skeleton className="mb-6 h-7 w-48" />
        <ProductGridSkeleton count={4} />
      </div>
    </Container>
  );
}
