import { Heart, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/button";
import LoginButton from "@/components/auth/login-button";
import LogoutButton from "@/components/auth/logout-button";
import { CartBadge } from "@/components/cart";
import { WishlistBadge } from "@/components/wishlist";

interface HeaderActionsProps {
  isLoggedIn: boolean;
  cartCount: number;
  wishlistCount: number;
  className?: string;
}

export default function HeaderActions({ isLoggedIn, cartCount, wishlistCount, className }: HeaderActionsProps) {
  return (
    <div className={className ?? "flex items-center gap-4"}>
      <Button
        aria-label="Wishlist"
        variant="ghost"
        size="icon"
        className="transition hover:scale-110"
      >
        <Link href="/wishlist" className="relative" aria-label="Wishlist">
          <Heart className="h-5 w-5" />

          <WishlistBadge count={wishlistCount} />
        </Link>
      </Button>
      <Button
        asChild
        aria-label="Shopping cart"
        variant="ghost"
        size="icon"
        className="relative transition hover:scale-110"
      >
        <Link href="/cart" className="relative" aria-label="Shopping cart">
          <ShoppingCart className="h-5 w-5" />
          <CartBadge count={cartCount} />
        </Link>
      </Button>
      <Button
        aria-label="User account"
        variant="ghost"
        size="icon"
        className="transition hover:scale-110"
      >
        <User size={22} />
      </Button>
      {isLoggedIn ? <LogoutButton /> : <LoginButton />}
    </div>
  );
}
