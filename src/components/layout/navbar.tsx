import Logo from "./logo";
import NavLinks from "./nav-links";
import { Heart, ShoppingCart, User } from "lucide-react";
import ThemeToggle from "./theme-toggle";
import Container from "../ui/container";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <Container className="flex h-16 items-center justify-between">
        <Logo />
        <NavLinks />
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button aria-label="wishlist" className="transition hover:scale-110">
            <Heart size={22} />
          </button>
          <button aria-label="shopping cart" className="transition hover:scale-110">
            <ShoppingCart size={22} />
          </button>
          <button aria-label="User menu" className="transition hover:scale-110">
            <User size={22} />
          </button>
        </div>
      </Container>
    </header>
  );
}
