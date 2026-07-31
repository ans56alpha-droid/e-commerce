import Container from "@/components/ui/container";
import Skeleton from "@/components/ui/skeleton";
import { ProductGridSkeleton } from "@/components/skeletons";

export default function CategoryDetailLoading() {
  return (
    <section className="py-16">
      <Container>
        <div className="mb-6 flex items-center gap-2">
          <Skeleton className="h-4 w-10" />
          <span className="text-muted-foreground">/</span>
          <Skeleton className="h-4 w-16" />
          <span className="text-muted-foreground">/</span>
          <Skeleton className="h-4 w-20" />
        </div>

        <div className="mb-10 space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-96" />
          <Skeleton className="h-4 w-24" />
        </div>

        <div className="mb-10 flex flex-col gap-4 md:flex-row">
          <Skeleton className="h-10 w-full md:w-64" />
          <Skeleton className="h-10 w-full md:w-40" />
          <Skeleton className="h-10 w-full md:w-40" />
          <Skeleton className="h-10 w-full md:w-40" />
          <Skeleton className="h-10 w-full md:w-40" />
        </div>

        <ProductGridSkeleton />
      </Container>
    </section>
  );
}
