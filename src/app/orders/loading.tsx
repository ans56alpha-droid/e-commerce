import Skeleton from "@/components/ui/skeleton";

export default function OrdersLoading() {
  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-72" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-24 w-full rounded-lg"
          />
        ))}
      </div>
    </main>
  );
}
