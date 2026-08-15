import Skeleton from "@/components/ui/skeleton";

export default function OrderDetailLoading() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-lg border">
          <div className="border-b p-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="mt-2 h-4 w-44" />

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-20 w-full rounded-md" />
              <Skeleton className="h-20 w-full rounded-md" />
              <Skeleton className="h-20 w-full rounded-md" />
              <Skeleton className="h-20 w-full rounded-md" />
            </div>
          </div>

          <div className="border-b p-6">
            <Skeleton className="h-5 w-24" />

            <div className="mt-4 space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 shrink-0 rounded-md" />

                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-28" />
                  </div>

                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 p-6">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
      </div>
    </main>
  );
}
