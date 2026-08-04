import { MessageSquare } from "lucide-react";

import { cn } from "@/lib/cn";

interface ReviewEmptyProps {
  title?: string;
  description?: string;
  className?: string;
}

export default function ReviewEmpty({
  title = "No reviews yet",
  description = "Be the first to share your thoughts on this product.",
  className,
}: ReviewEmptyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-12 text-center",
        className
      )}
    >
      <div className="mb-3 rounded-full bg-muted p-3">
        <MessageSquare
          aria-hidden="true"
          className="h-5 w-5 text-muted-foreground"
        />
      </div>

      <h3 className="font-semibold">{title}</h3>

      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
