import Container from "@/components/ui/container";
import { ProductGridSkeleton } from "@/components/shared/loading-state";

export default function CategoryDetailLoading() {
  return (
    <section className="py-16">
      <Container>
        <div className="mb-6 flex items-center gap-2">
          <div className="h-4 w-10 animate-pulse rounded bg-muted" />
          <span className="text-muted-foreground">/</span>
          <div className="h-4 w-16 animate-pulse rounded bg-muted" />
          <span className="text-muted-foreground">/</span>
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
        </div>

        <div className="mb-10 space-y-2">
          <div className="h-9 w-48 animate-pulse rounded bg-muted" />
          <div className="h-5 w-96 animate-pulse rounded bg-muted" />
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </div>

        <div className="mb-10 flex flex-col gap-4 md:flex-row">
          <div className="h-10 w-full animate-pulse rounded-lg bg-muted md:w-64" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-muted md:w-40" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-muted md:w-40" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-muted md:w-40" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-muted md:w-40" />
        </div>

        <ProductGridSkeleton />
      </Container>
    </section>
  );
}
