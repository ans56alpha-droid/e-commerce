"use server";

import { auth } from "@/auth";

import AddToCartButton from "./add-to-cart-button";

interface AddToCartProps {
  productId: string;
  stock: number;
}

export default async function AddToCart({ productId, stock }: AddToCartProps) {
  const session = await auth();

  return (
    <AddToCartButton
      productId={productId}
      stock={stock}
      isAuthenticated={Boolean(session?.user?.id)}
    />
  );
}
