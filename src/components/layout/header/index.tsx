import { auth } from "@/auth";
import DesktopNav from "./desktop-nav";
import MobileNav from "./mobile-nav";

export default async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <DesktopNav isLoggedIn={!!session} />
      <MobileNav isLoggedIn={!!session} />
    </header>
  );
}
