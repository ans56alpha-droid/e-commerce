"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

import Input from "@/components/ui/input";
import type { Category } from "@/types/category";

interface ProductFiltersProps {
  categories: Category[];
}

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating", value: "rating" },
] as const;

export default function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeCategory = searchParams.get("category") ?? "";
  const activeSort = searchParams.get("sort") ?? "newest";
  const activeMinPrice = searchParams.get("minPrice") ?? "";
  const activeMaxPrice = searchParams.get("maxPrice") ?? "";
  const activeSearch = searchParams.get("search") ?? "";

  const createQueryString = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      if ("category" in updates || "search" in updates || "minPrice" in updates || "maxPrice" in updates) {
        params.delete("page");
      }
      return params.toString();
    },
    [searchParams]
  );

  const navigate = (updates: Record<string, string>) => {
    startTransition(() => {
      router.push(`/products?${createQueryString(updates)}`);
    });
  };

  return (
    <aside className="space-y-8">
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Search
        </h3>
        <Input
          placeholder="Search products..."
          defaultValue={activeSearch}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              navigate({ search: (e.target as HTMLInputElement).value });
            }
          }}
        />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Categories
        </h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => navigate({ category: "" })}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted ${
                !activeCategory ? "bg-muted font-medium" : ""
              }`}
            >
              All Categories
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => navigate({ category: category.id })}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted ${
                  activeCategory === category.id ? "bg-muted font-medium" : ""
                }`}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Sort By
        </h3>
        <select
          value={activeSort}
          onChange={(e) => navigate({ sort: e.target.value })}
          className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Price Range
        </h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            defaultValue={activeMinPrice}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const min = (e.target as HTMLInputElement).value;
                const max = searchParams.get("maxPrice") ?? "";
                navigate({ minPrice: min, maxPrice: max });
              }
            }}
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="Max"
            defaultValue={activeMaxPrice}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const max = (e.target as HTMLInputElement).value;
                const min = searchParams.get("minPrice") ?? "";
                navigate({ minPrice: min, maxPrice: max });
              }
            }}
          />
        </div>
      </div>

      {isPending && (
        <div className="flex items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </aside>
  );
}
