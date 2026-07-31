"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useTransition } from "react";
import Button from "@/components/ui/button";
import { cn } from "@/lib/cn";

interface ProductPaginationProps {
  page: number;
  totalPages: number;
}

function buildPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (current > 3) {
    pages.push("...");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("...");
  }

  pages.push(total);

  return pages;
}

export default function ProductPagination({
  page,
  totalPages,
}: ProductPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function goToPage(target: number) {
    if (target < 1 || target > totalPages || target === page || isPending) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(target));

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  const pages = buildPageNumbers(page, totalPages);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav aria-label="Pagination" className="mt-10">
      {/* Desktop */}
      <div className="hidden items-center justify-center gap-1 md:flex">
        <Button
          aria-label="Go to previous page"
          variant="outline"
          size="icon"
          disabled={!hasPrev || isPending}
          onClick={() => goToPage(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <Button
              key={p}
              aria-label={`Go to page ${p}`}
              aria-current={p === page ? "page" : undefined}
              variant={p === page ? "primary" : "outline"}
              size="icon"
              disabled={isPending}
              className={cn(
                "text-sm",
                p === page && "pointer-events-none",
              )}
              onClick={() => goToPage(p)}
            >
              {isPending && p === page ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                p
              )}
            </Button>
          ),
        )}

        <Button
          aria-label="Go to next page"
          variant="outline"
          size="icon"
          disabled={!hasNext || isPending}
          onClick={() => goToPage(page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile */}
      <div className="flex items-center justify-between md:hidden">
        <Button
          aria-label="Go to previous page"
          variant="outline"
          size="sm"
          disabled={!hasPrev || isPending}
          onClick={() => goToPage(page - 1)}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>

        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Page {page} of {totalPages}
        </span>

        <Button
          aria-label="Go to next page"
          variant="outline"
          size="sm"
          disabled={!hasNext || isPending}
          onClick={() => goToPage(page + 1)}
        >
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}
