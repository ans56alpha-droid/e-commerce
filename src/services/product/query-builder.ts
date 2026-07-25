import { PRODUCT_STATUS } from "@/constants/product";
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
    query.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        shortDescription: {
          $regex: search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: search,
          $options: "i",
        },
      },
      {
        brand: {
          $regex: search,
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
      $regex: brand,
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
