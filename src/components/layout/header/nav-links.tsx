"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/constants/navigation";
import { cn } from "@/lib/cn";

interface NavLinksProps {
  direction?: "horizontal" | "vertical";
  onLinkClick?: () => void;
}

export default function NavLinks({ direction = "horizontal", onLinkClick }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <ul
      className={cn(
        "flex gap-6",
        direction === "vertical" ? "flex-col" : "items-center",
      )}
    >
      {navigation.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        return (
          <li key={item.label}>
            <Link
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                "text-sm font-medium transition-colors duration-200",
                isActive
                  ? "text-primary"
                  : "text-foreground hover:text-primary",
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
