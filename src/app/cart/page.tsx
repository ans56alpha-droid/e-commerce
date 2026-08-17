import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { auth } from "@/auth";
import { getCart } from "@/services/cart";

import { CartEmpty, CartList, CartSummary } from "@/components/cart";

export const metadata: Metadata = {
  title: "Shopping Cart | alphaShop",
  description: "Review your items before checkout.",
};

export default async function CartPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/cart");
  }

  const cart = await getCart(session.user.id);

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Cart</h1>

        <p className="mt-2 text-muted-foreground">Review your items before checkout.</p>
      </div>

      {!cart || cart.items.length === 0 ? (
        <CartEmpty />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <CartList cart={cart} />

          <div className="lg:sticky lg:top-24 lg:self-start">
            <CartSummary cart={cart} />
          </div>
        </div>
      )}
    </main>
  );
}
