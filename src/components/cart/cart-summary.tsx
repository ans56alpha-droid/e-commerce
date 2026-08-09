import Link from "next/link";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import ClearCartButton from "./clear-cart-button";

import type { Cart } from "@/mappers/cart";

interface CartSummaryProps {
  cart: Cart;
}

export default function CartSummary({ cart }: CartSummaryProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Order Summary</h2>

        <ClearCartButton />
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Items ({cart.totalItems})</span>

          <span>${cart.subtotal.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>

          <span>Calculated at checkout</span>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Subtotal</span>

            <span className="text-lg font-semibold">${cart.subtotal.toFixed(2)}</span>
          </div>
        </div>

        <Button asChild className="w-full" size="lg">
          <Link href="/checkout">Proceed to Checkout</Link>
        </Button>

        <Button asChild variant="outline" className="w-full">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    </Card>
  );
}
