import { auth } from "@/auth";

import { getWishlistItemCount } from "@/services/wishlist";

export default async function WishlistCount() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const count = await getWishlistItemCount(session.user.id);

  if (count === 0) {
    return null;
  }

  return (
    <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-medium text-primary-foreground">
      {count > 99 ? "99+" : count}
    </span>
  );
}
