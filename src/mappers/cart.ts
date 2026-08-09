import type { Types } from "mongoose";

import type { CartType } from "@/models/Cart";
import type { ProductType } from "@/models/Product";

type PopulatedCartItem = Omit<CartType["items"][number], "product"> & {
  product: ProductType & {
    _id: Types.ObjectId;
  };
};

export type PopulatedCart = Omit<CartType, "items"> & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  items: PopulatedCartItem[];
};

export interface CartLineItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  stock: number;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  quantity: number;
  lineTotal: number;
}

export interface Cart {
  id: string;
  items: CartLineItem[];
  totalItems: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}

export function toCart(cart: PopulatedCart): Cart {
  const items: CartLineItem[] = cart.items
    .filter((item) => item.product && item.product.stock > 0)
    .map((item) => {
      const product = item.product;

      const image =
        product.images.find((image) => image.isPrimary)?.url ??
        product.images[0]?.url ??
        "";

      return {
        productId: product._id.toString(),
        name: product.name,
        slug: product.slug ?? "",
        price: product.price,
        compareAtPrice: product.compareAtPrice ?? undefined,
        image,
        stock: product.stock,
        rating: product.averageRating,
        reviewCount: product.reviewCount,
        isNew: false,
        quantity: item.quantity,
        lineTotal: product.price * item.quantity,
      };
    });

  return {
    id: cart._id.toString(),
    items,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.lineTotal, 0),
    createdAt: cart.createdAt.toISOString(),
    updatedAt: cart.updatedAt.toISOString(),
  };
}