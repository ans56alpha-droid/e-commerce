"use server";

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

  return addToCartService(userId, productId, quantity);
}

export async function updateCartItem(
  productId: string,
  quantity: number
) {
  const userId = await getAuthenticatedUserId();

  return updateCartItemService(userId, productId, quantity);
}

export async function removeFromCart(productId: string) {
  const userId = await getAuthenticatedUserId();

  return removeFromCartService(userId, productId);
}

export async function clearCart() {
  const userId = await getAuthenticatedUserId();

  return clearCartService(userId);
}