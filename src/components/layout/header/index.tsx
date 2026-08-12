import { auth } from "@/auth";
import { getCartItemCount } from "@/services/cart";
import { getWishlistItemCount } from "@/services/wishlist";
import DesktopNav from "./desktop-nav";
import MobileNav from "./mobile-nav";

export default async function Header() {
  const session = await auth();

  const cartCount = session?.user?.id
    ? await getCartItemCount(session.user.id)
    : 0;

  const wishlistCount = session?.user?.id
    ? await getWishlistItemCount(session.user.id)
    : 0;

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <DesktopNav
        isLoggedIn={!!session}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
      />
      <MobileNav
        isLoggedIn={!!session}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
      />
    </header>
  );
}
