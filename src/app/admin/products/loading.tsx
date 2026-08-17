import Skeleton from "@/components/ui/skeleton";

export default function AdminProductsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-36" />
          <Skeleton className="mt-2 h-4 w-52" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="mb-3 h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
