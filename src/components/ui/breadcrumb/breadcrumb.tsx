import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/cn";

import type { BreadcrumbProps } from "./types";

export default function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-y-2 text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isLink = Boolean(item.href) && !isLast;

          return (
            <li key={index} className="flex min-w-0 items-center">
              {index > 0 && (
                <ChevronRight
                  aria-hidden="true"
                  className="mx-2 h-3.5 w-3.5 shrink-0"
                />
              )}

              {isLink ? (
                <Link
                  href={item.href!}
                  className="truncate rounded transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(
                    "truncate",
                    isLast && "font-medium text-foreground",
                  )}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
