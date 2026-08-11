"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";

import {
  addToWishlist as addToWishlistService,
  removeFromWishlist as removeFromWishlistService,
  toggleWishlist as toggleWishlistService,
} from "@/services/wishlist";

import type { ActionResult } from "@/types/action";

async function getAuthenticatedUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user.id;
}

export async function addToWishlist(
  productId: string
): Promise<ActionResult> {
  try {
    const userId = await getAuthenticatedUserId();

    await addToWishlistService(userId, productId);

    revalidatePath("/products");
    revalidatePath("/wishlist");

    return {
      success: true,
      message: "Added to wishlist",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to add item to wishlist",
    };
  }
}

export async function removeFromWishlist(
  productId: string
): Promise<ActionResult> {
  try {
    const userId = await getAuthenticatedUserId();

    await removeFromWishlistService(userId, productId);

    revalidatePath("/products");
    revalidatePath("/wishlist");

    return {
      success: true,
      message: "Removed from wishlist",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to remove item from wishlist",
    };
  }
}

export async function toggleWishlist(
  productId: string
): Promise<ActionResult> {
  try {
    const userId = await getAuthenticatedUserId();

    await toggleWishlistService(userId, productId);

    revalidatePath("/products");
    revalidatePath("/wishlist");

    return {
      success: true,
      message: "Wishlist updated",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update wishlist",
    };
  }
}