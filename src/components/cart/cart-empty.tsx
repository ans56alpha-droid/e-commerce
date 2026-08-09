import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";

export default function CartEmpty() {
  return (
    <Card className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <ShoppingCart className="h-8 w-8 text-muted-foreground" />
      </div>

      <h2 className="text-xl font-semibold">Your cart is empty</h2>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Looks like you haven&apos;t added anything to your cart yet. Start Browse our products and
        find something you like.
      </p>

      <Button asChild className="mt-6">
        <Link href="/products">Continue Shopping</Link>
      </Button>
    </Card>
  );
}
