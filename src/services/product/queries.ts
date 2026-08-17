import { connectDB } from "@/db";

import Product from "@/models/Product";
import { PRODUCT_STATUS } from "@/constants/product";

// Register category model before populate()
import "@/models/Category"
import { toProductCard, toProductDetails } from "@/mappers/product";
import { PaginatedProducts, ProductFilters } from "./types";
import { buildProductQuery } from "./query-builder";
import { buildProductSort } from "./sort-builder";
import { buildPagination } from "./pagination";

export async function getFeaturedProducts(limit = 8): Promise<PaginatedProducts> {
  return getProducts({ featured: true, limit, sortBy: "newest" });
}

export async function getNewArrivals(limit = 8): Promise<PaginatedProducts> {
  return getProducts({ limit, sortBy: "newest" });
}

export async function getProductsByCategory(categoryId: string) {
  return getProducts({ category: categoryId, sortBy: "newest" });
}

export async function getProducts(
  filters: ProductFilters = {}
): Promise<PaginatedProducts> {
  await connectDB();

  const { page, limit, skip } = buildPagination(filters.page, filters.limit);
  const query = buildProductQuery(filters);
  const sort = buildProductSort(filters.sortBy);

  const [products, total] = await Promise.all([
    Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(query),
  ]);

  return {
    products: products.map((p) => toProductCard(p as never)),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProductBySlug(slug: string) {
  await connectDB();

  const product = await Product.findOne({
     slug,
     isDeleted: false,
     status: PRODUCT_STATUS.PUBLISHED,
    }).populate("category");

  return product ? toProductDetails(product) : null;
}

export async function getAvailableBrands(): Promise<string[]> {
  await connectDB();

  const brands = await Product.distinct("brand", {
    status: PRODUCT_STATUS.PUBLISHED,
    isDeleted: false,
    brand: { $exists: true, $ne: "" },
  });

  return (brands as string[]).sort((a, b) => a.localeCompare(b));
}

export async function getRelatedProducts({
  productId,
  categoryId,
  limit = 4
}: {
  productId: string;
  categoryId: string;
  limit?: number;
}) {

  await connectDB();

  const products = await Product.find({
    category: categoryId,
    _id: {
      $ne: productId,
    },
    isDeleted: false,
    status: PRODUCT_STATUS.PUBLISHED,
  }).sort({ createdAt: -1 }).limit(limit);

  return products.map(toProductCard);
}

export { buildProductSort } from "./sort-builder";
