"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  MapPin,
  Package,
  Bell,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/cn";

const navLinks = [
  { href: "/account/profile", label: "Profile", icon: User },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/orders", label: "Orders", icon: Package },
  { href: "/account/notifications", label: "Notifications", icon: Bell },
  { href: "/account/settings", label: "Settings", icon: Settings },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Account navigation">
      <ul className="space-y-1">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive =
            link.href === "/orders"
              ? pathname.startsWith("/orders")
              : pathname.startsWith(link.href);

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
                  isActive && "bg-muted text-foreground",
                  !isActive && "text-muted-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
