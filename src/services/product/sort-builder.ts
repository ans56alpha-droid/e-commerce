import { SortOrder } from "mongoose";
import { ProductFilters } from "./types";

export function buildProductSort(
  sortBy: ProductFilters["sortBy"]
): Record<string, SortOrder> {
  switch (sortBy) {
    case "oldest":
      return { createdAt: 1 };

    case "price-asc":
      return { price: 1 };

    case "price-desc":
      return { price: -1 };

    case "rating":
      return { averageRating: -1 };

    default:
      return { createdAt: -1 };
  }
}
