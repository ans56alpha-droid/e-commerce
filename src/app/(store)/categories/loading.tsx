import Container from "@/components/ui/container";
import { CategoryGridSkeleton } from "@/components/shared/loading-state";

export default function CategoriesLoading() {
  return (
    <section className="py-16">
      <Container>
        <div className="mb-10 space-y-2">
          <div className="h-9 w-56 animate-pulse rounded bg-muted" />
          <div className="h-5 w-72 animate-pulse rounded bg-muted" />
        </div>

        <CategoryGridSkeleton />
      </Container>
    </section>
  );
}
