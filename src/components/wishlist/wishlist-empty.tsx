import Link from "next/link";
import { Heart } from "lucide-react";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";

export default function WishlistEmpty() {
  return (
    <Card className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Heart className="h-8 w-8 text-muted-foreground" />
      </div>

      <h2 className="text-xl font-semibold">Your wishlist is empty</h2>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Save products you love and come back to them later.
      </p>

      <Button asChild className="mt-6">
        <Link href="/products">Browse Products</Link>
      </Button>
    </Card>
  );
}
