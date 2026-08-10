import { Types } from "mongoose";

import { connectDB } from "@/db";

import Wishlist from "@/models/Wishlist";

function validateIds(userId: string, productId: string) {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  if (!Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }
}

export async function addToWishlist(
  userId: string,
  productId: string
) {
  await connectDB();

  validateIds(userId, productId);

  return Wishlist.findOneAndUpdate(
    { user: userId },
    {
      $addToSet: {
        products: new Types.ObjectId(productId),
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );
}

export async function removeFromWishlist(
  userId: string,
  productId: string
) {
  await connectDB();

  validateIds(userId, productId);

  return Wishlist.findOneAndUpdate(
    { user: userId },
    {
      $pull: {
        products: new Types.ObjectId(productId),
      },
    },
    {
      new: true,
    }
  );
}

export async function toggleWishlist(
  userId: string,
  productId: string
) {
  await connectDB();

  validateIds(userId, productId);

  const wishlist = await Wishlist.findOne({
    user: userId,
  });

  if (!wishlist) {
    return Wishlist.create({
      user: userId,
      products: [new Types.ObjectId(productId)],
    });
  }

  const exists = wishlist.products.some(
    (id: Types.ObjectId) => id.toString() === productId
  );

  if (exists) {
    wishlist.products.pull(new Types.ObjectId(productId));
  } else {
    wishlist.products.addToSet(new Types.ObjectId(productId));
  }

  await wishlist.save();

  return wishlist;
}