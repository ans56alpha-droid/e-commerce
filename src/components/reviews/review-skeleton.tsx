import Card from "@/components/ui/card";
import Skeleton from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";

interface ReviewSkeletonProps {
  className?: string;
}

export default function ReviewSkeleton({ className }: ReviewSkeletonProps) {
  return (
    <Card className={cn("p-5", className)} aria-hidden="true">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />

            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        <Skeleton className="h-3 w-20" />
      </div>

      <Skeleton className="mt-4 h-4 w-1/2" />

      <div className="mt-2 space-y-1.5">
        <Skeleton className="h-3 w-full" />

        <Skeleton className="h-3 w-4/5" />
      </div>
    </Card>
  );
}
