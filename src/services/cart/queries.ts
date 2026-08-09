import { Types } from "mongoose";

import { connectDB } from "@/db";
import CartModel from "@/models/Cart";

import { toCart, type Cart, type PopulatedCart } from "@/mappers/cart";

export async function getCart(userId: string): Promise<Cart | null> {
  await connectDB();

  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const cart = await CartModel.findOne({
    user: userId,
  })
    .populate(
      "items.product",
      "name slug price compareAtPrice images stock averageRating reviewCount"
    )
    .lean();

  if (!cart) {
    return null;
  }

  return toCart(cart as unknown as PopulatedCart);
}