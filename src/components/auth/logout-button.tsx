"use client";

import { useTransition } from "react";

import { logout } from "@/actions/auth/logout";
import Button from "@/components/ui/button";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      onClick={() =>
        startTransition(async () => {
          await logout();
        })
      }
      disabled={isPending}
    >
      {isPending ? "Signing out..." : "Logout"}
    </Button>
  );
}
