import { auth } from "@/auth";

import { getWishlistProductIds } from "@/services/wishlist";

import WishlistButton from "./wishlist-button";

interface WishlistButtonServerProps {
  productId: string;
}

export default async function WishlistButtonServer({ productId }: WishlistButtonServerProps) {
  const session = await auth();

  if (!session?.user?.id) {
    return <WishlistButton productId={productId} isWishlisted={false} isAuthenticated={false} />;
  }

  const productIds = await getWishlistProductIds(session.user.id);

  return (
    <WishlistButton
      productId={productId}
      isWishlisted={productIds.includes(productId)}
      isAuthenticated
    />
  );
}
