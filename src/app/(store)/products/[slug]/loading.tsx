import Container from "@/components/ui/container";
import { ProductGridSkeleton } from "@/components/shared/loading-state";

export default function ProductDetailLoading() {
  return (
    <Container className="py-10">
      <div className="mb-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="aspect-square animate-pulse rounded-lg bg-muted" />
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 w-20 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-8 w-1/4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
          <div className="space-y-2 pt-4">
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-12 w-full animate-pulse rounded-lg bg-muted" />
        </div>
      </div>

      <div className="mb-10 space-y-4">
        <div className="h-7 w-40 animate-pulse rounded bg-muted" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-4 border-b border-border py-3">
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="h-4 w-48 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>

      <div className="mb-10">
        <div className="mb-6 h-7 w-48 animate-pulse rounded bg-muted" />
        <ProductGridSkeleton count={4} />
      </div>
    </Container>
  );
}
