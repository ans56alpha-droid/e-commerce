import type { Types } from "mongoose";

import type { ProductType } from "@/models/Product";

export interface WishlistProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  stock: number;
  rating: number;
  reviewCount: number;
  isNew: boolean;
}

export type PopulatedWishlistProduct = ProductType & {
  _id: Types.ObjectId;
};

export function mapWishlistProducts(
  products: PopulatedWishlistProduct[]
): WishlistProduct[] {
  return products.map((product) => ({
    id: product._id.toString(),
    name: product.name,
    slug: product.slug ?? "",
    price: product.price,
    compareAtPrice: product.compareAtPrice ?? undefined,
    image:
      product.images.find((image) => image.isPrimary)?.url ??
      product.images[0]?.url ??
      "",
    stock: product.stock,
    rating: product.averageRating,
    reviewCount: product.reviewCount,
    isNew: false,
  }));
}