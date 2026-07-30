import Container from "@/components/ui/container";
import Logo from "./logo";
import NavLinks from "./nav-links";
import HeaderActions from "./header-actions";
import GlobalSearch from "./global-search";
import ThemeToggle from "../theme-toggle";

export default function DesktopNav() {
  return (
    <div className="hidden lg:flex">
      <Container className="flex h-16 items-center justify-between">
        <Logo />
        <NavLinks />
        <div className="flex items-center gap-2">
          <GlobalSearch />
          <ThemeToggle />
          <HeaderActions />
        </div>
      </Container>
    </div>
  );
}
