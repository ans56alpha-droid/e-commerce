import Container from "@/components/ui/container";
import Skeleton from "@/components/ui/skeleton";
import { CategoryGridSkeleton } from "@/components/skeletons";

export default function CategoriesLoading() {
  return (
    <section className="py-16">
      <Container>
        <div className="mb-10 space-y-2">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-5 w-72" />
        </div>

        <CategoryGridSkeleton />
      </Container>
    </section>
  );
}
