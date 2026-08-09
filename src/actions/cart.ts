"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import {
  addToCart as addToCartService,
  updateCartItem as updateCartItemService,
  removeFromCart as removeFromCartService,
  clearCart as clearCartService,
} from "@/services/cart";

async function getAuthenticatedUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user.id;
}

export async function addToCart(productId: string, quantity = 1) {
  const userId = await getAuthenticatedUserId();

  await addToCartService(userId, productId, quantity);

  revalidatePath("/cart");

  return { success: true };
}

export async function updateCartItem(
  productId: string,
  quantity: number
) {
  const userId = await getAuthenticatedUserId();

  await updateCartItemService(userId, productId, quantity);

  revalidatePath("/cart");

  return { success: true };
}

export async function removeFromCart(productId: string) {
  const userId = await getAuthenticatedUserId();

  await removeFromCartService(userId, productId);

  revalidatePath("/cart");

  return { success: true };
}

export async function clearCart() {
  const userId = await getAuthenticatedUserId();

  await clearCartService(userId);

  revalidatePath("/cart");

  return { success: true };
}