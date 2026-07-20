import Logo from "./logo";
import NavLinks from "./nav-links";
import { Heart, ShoppingCart, User } from "lucide-react";
import ThemeToggle from "./theme-toggle";
import Container from "../ui/container";
import Button from "../ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <Container className="flex h-16 items-center justify-between">
        <Logo />
        <NavLinks />
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button
            aria-label="wishlist"
            variant="ghost"
            size="md"
            className="transition hover:scale-110"
          >
            <Heart size={22} />
          </Button>
          <Button
            aria-label="shopping cart"
            variant="ghost"
            size="md"
            className="transition hover:scale-110"
          >
            <ShoppingCart size={22} />
          </Button>
          <Button
            aria-label="User menu"
            variant="ghost"
            size="md"
            className="transition hover:scale-110"
          >
            <User size={22} />
          </Button>
        </div>
      </Container>
    </header>
  );
}
