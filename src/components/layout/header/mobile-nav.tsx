"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart, Menu, ShoppingCart, User, X } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/button";
import Logo from "./logo";
import NavLinks from "./nav-links";
import MobileSearch from "./mobile-search";
import ThemeToggle from "../theme-toggle";
import LoginButton from "@/components/auth/login-button";
import LogoutButton from "@/components/auth/logout-button";
import { cn } from "@/lib/cn";
import { CartBadge } from "@/components/cart";
import { WishlistBadge } from "@/components/wishlist";

interface MobileNavProps {
  isLoggedIn: boolean;
  cartCount: number;
  wishlistCount: number;
}

export default function MobileNav({ isLoggedIn, cartCount, wishlistCount }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, close]);

  return (
    <div className="relative lg:hidden">
      {/* Header row */}
      <div className="relative flex h-16 items-center justify-between px-4">
        <Button aria-label="Open menu" variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
          <Menu size={24} />
        </Button>

        <Logo className="text-xl font-bold" />

        <div className="flex items-center gap-1">
          <MobileSearch />
          <Button
            aria-label="Shopping cart"
            variant="ghost"
            size="icon"
            className="transition hover:scale-110"
          >
            <Link href="/cart" className="relative" aria-label="Shopping cart">
              <ShoppingCart className="h-5 w-5" />
              <CartBadge count={cartCount} />
            </Link>
          </Button>
        </div>
      </div>

      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={close}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-background shadow-xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Logo className="text-xl font-bold" />
          <Button aria-label="Close menu" variant="ghost" size="icon" onClick={close}>
            <X size={24} />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6" aria-label="Mobile navigation">
          <NavLinks direction="vertical" onLinkClick={close} />
        </nav>

        <div className="border-t border-border px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
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
              aria-label="User account"
              variant="ghost"
              size="icon"
              className="transition hover:scale-110"
            >
              <User size={22} />
            </Button>
            {isLoggedIn ? <LogoutButton /> : <LoginButton />}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
