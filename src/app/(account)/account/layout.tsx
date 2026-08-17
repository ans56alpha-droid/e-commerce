import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "My Account | alphaShop",
  description: "Manage your account settings, addresses, and notifications.",
};

export default function AccountSubLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
