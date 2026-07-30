import DesktopNav from "./desktop-nav";
import MobileNav from "./mobile-nav";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <DesktopNav />
      <MobileNav />
    </header>
  );
}
