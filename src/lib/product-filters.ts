import { ProductFilters } from "@/services/product";

export function parseProductFilters(
  searchParams: Record<string, string | undefined>
): ProductFilters {
  return {
    search: searchParams.search,
    category: searchParams.category,
    brand: searchParams.brand,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    sortBy: (searchParams.sort as ProductFilters["sortBy"]) ?? "newest",
    page: searchParams.page ? Number(searchParams.page) : 1,
  };
}
