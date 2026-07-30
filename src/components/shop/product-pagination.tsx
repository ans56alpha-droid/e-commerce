"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

  function goToPage(target: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(target));
    router.push(`${pathname}?${params.toString()}`);
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
          disabled={!hasPrev}
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
              className={cn(
                "text-sm",
                p === page && "pointer-events-none",
              )}
              onClick={() => goToPage(p)}
            >
              {p}
            </Button>
          ),
        )}

        <Button
          aria-label="Go to next page"
          variant="outline"
          size="icon"
          disabled={!hasNext}
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
          disabled={!hasPrev}
          onClick={() => goToPage(page - 1)}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>

        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>

        <Button
          aria-label="Go to next page"
          variant="outline"
          size="sm"
          disabled={!hasNext}
          onClick={() => goToPage(page + 1)}
        >
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}
