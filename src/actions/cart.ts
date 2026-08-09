"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";

import {
  addToCart as addToCartService,
  updateCartItem as updateCartItemService,
  removeFromCart as removeFromCartService,
  clearCart as clearCartService,
} from "@/services/cart";

import type { ActionResult } from "@/types/action";

async function getAuthenticatedUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user.id;
}

export async function addToCart(
  productId: string,
  quantity = 1
): Promise<ActionResult> {
  try {
    const userId = await getAuthenticatedUserId();

    await addToCartService(
      userId,
      productId,
      quantity
    );

    revalidatePath("/cart");
    revalidatePath("/products");

    return {
      success: true,
      message: "Added to cart",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to add item to cart",
    };
  }
}

export async function updateCartItem(
  productId: string,
  quantity: number
): Promise<ActionResult> {
  try {
    const userId = await getAuthenticatedUserId();

    await updateCartItemService(
      userId,
      productId,
      quantity
    );

    revalidatePath("/cart");

    return {
      success: true,
      message: "Cart updated",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update cart",
    };
  }
}

export async function removeFromCart(
  productId: string
): Promise<ActionResult> {
  try {
    const userId = await getAuthenticatedUserId();

    await removeFromCartService(
      userId,
      productId
    );

    revalidatePath("/cart");

    return {
      success: true,
      message: "Item removed",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to remove item",
    };
  }
}

export async function clearCart(): Promise<ActionResult> {
  try {
    const userId = await getAuthenticatedUserId();

    await clearCartService(userId);

    revalidatePath("/cart");

    return {
      success: true,
      message: "Cart cleared",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to clear cart",
    };
  }
}