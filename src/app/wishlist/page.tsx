import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { getWishlistProducts } from "@/services/wishlist";

import { mapWishlistProducts } from "@/mappers/wishlist";

import { WishlistEmpty, WishlistGrid } from "@/components/wishlist";

export default async function WishlistPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/wishlist");
  }

  const products = await getWishlistProducts(session.user.id);

  const wishlistProducts = mapWishlistProducts(products);

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Wishlist</h1>

        <p className="mt-2 text-muted-foreground">Products you&apos;ve saved for later.</p>
      </div>

      {wishlistProducts.length === 0 ? (
        <WishlistEmpty />
      ) : (
        <WishlistGrid products={wishlistProducts} />
      )}
    </main>
  );
}
