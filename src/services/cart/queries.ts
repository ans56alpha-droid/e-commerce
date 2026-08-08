import type { Types } from "mongoose";

import { connectDB } from "@/db";

import Cart, { type CartType } from "@/models/Cart";
import type { ProductType } from "@/models/Product";

type PopulatedCartItem = Omit<CartType["items"][number], "product"> & {
  product: ProductType & { _id: Types.ObjectId };
};

type PopulatedCart = Omit<CartType, "items"> & {
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
  image: string;
  stock: number;
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

export async function getCart(userId: string): Promise<Cart | null> {
  await connectDB();

  const cart = await Cart.findOne({ user: userId })
    .populate("items.product", "name slug price images stock")
    .lean();

  if (!cart) {
    return null;
  }

  const populated = cart as unknown as PopulatedCart;

  const items: CartLineItem[] = populated.items
    .filter((item) => item.product && item.product.stock > 0)
    .map((item) => ({
      productId: item.product._id.toString(),
      name: item.product.name,
      slug: item.product.slug ?? "",
      price: item.product.price,
      image:
        item.product.images.find((image) => image.isPrimary)?.url ??
        item.product.images[0]?.url ??
        "",
      stock: item.product.stock,
      quantity: item.quantity,
      lineTotal: item.product.price * item.quantity,
    }));

  return {
    id: populated._id.toString(),
    items,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.lineTotal, 0),
    createdAt: populated.createdAt.toISOString(),
    updatedAt: populated.updatedAt.toISOString(),
  };
}
