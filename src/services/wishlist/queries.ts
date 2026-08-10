import { Types } from "mongoose";

import { connectDB } from "@/db";

import Wishlist from "@/models/Wishlist";

export async function getWishlistProductIds(
  userId: string
): Promise<string[]> {
  await connectDB();

  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const wishlist = await Wishlist.findOne({
    user: userId,
  })
    .select("products")
    .lean();

  if (!wishlist) {
    return [];
  }

  return wishlist.products.map((productId: Types.ObjectId) =>
    productId.toString()
  );
}