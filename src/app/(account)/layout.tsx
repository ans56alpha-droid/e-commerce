import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import Container from "@/components/ui/container";
import AccountSidebar from "@/components/layout/account-sidebar";

export default async function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/account");
  }

  return (
    <main className="py-10">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <AccountSidebar />
          </aside>

          <div>{children}</div>
        </div>
      </Container>
    </main>
  );
}
