import Container from "@/components/ui/container";
import Logo from "./logo";
import NavLinks from "./nav-links";
import HeaderActions from "./header-actions";
import GlobalSearch from "./global-search";
import ThemeToggle from "../theme-toggle";

interface DesktopNavProps {
  isLoggedIn: boolean;
  cartCount: number;
  wishlistCount: number;
}

export default function DesktopNav({ isLoggedIn, cartCount, wishlistCount }: DesktopNavProps) {
  return (
    <div className="hidden lg:flex">
      <Container className="flex h-16 items-center justify-between">
        <Logo />
        <NavLinks />
        <div className="flex items-center gap-2">
          <GlobalSearch />
          <ThemeToggle />
          <HeaderActions
            isLoggedIn={isLoggedIn}
            cartCount={cartCount}
            wishlistCount={wishlistCount}
          />
        </div>
      </Container>
    </div>
  );
}
