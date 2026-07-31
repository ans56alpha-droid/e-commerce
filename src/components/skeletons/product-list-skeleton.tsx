import Skeleton from "@/components/ui/skeleton";
import ProductGridSkeleton from "./product-grid-skeleton";

export default function ProductListSkeleton() {
  return (
    <>
      <div className="mb-10 flex flex-col gap-4 md:flex-row">
        <Skeleton className="h-10 w-full md:w-64" />
        <Skeleton className="h-10 w-full md:w-40" />
        <Skeleton className="h-10 w-full md:w-40" />
        <Skeleton className="h-10 w-full md:w-40" />
        <Skeleton className="h-10 w-full md:w-40" />
      </div>
      <ProductGridSkeleton />
    </>
  );
}
