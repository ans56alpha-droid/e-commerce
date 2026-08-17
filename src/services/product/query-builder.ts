import { PRODUCT_STATUS } from "@/constants/product";
import { escapeRegex } from "@/lib/escape-regex";
import { ProductFilters } from "./types";

export function buildProductQuery({
  search,
  category,
  brand,
  minPrice,
  maxPrice,
  featured,
  status,
}: ProductFilters): Record<string, unknown> {
  const query: Record<string, unknown> = {
    status: status ?? PRODUCT_STATUS.PUBLISHED,
    isDeleted: false,
  };

  if (search) {
    const safe = escapeRegex(search);
    query.$or = [
      {
        name: {
          $regex: safe,
          $options: "i",
        },
      },
      {
        shortDescription: {
          $regex: safe,
          $options: "i",
        },
      },
      {
        description: {
          $regex: safe,
          $options: "i",
        },
      },
      {
        brand: {
          $regex: safe,
          $options: "i",
        },
      },
    ];
  }

  if (category) {
    query.category = category;
  }

  if (brand) {
    query.brand = {
      $regex: escapeRegex(brand),
      $options: "i",
    };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    const price: Record<string, number> = {};

    if (minPrice !== undefined) {
      price.$gte = minPrice;
    }

    if (maxPrice !== undefined) {
      price.$lte = maxPrice;
    }

    query.price = price;
  }

  if (featured !== undefined) {
    query.isFeatured = featured;
  }

  return query;
}
