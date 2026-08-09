"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/button";

import { clearCart } from "@/actions/cart";

export default function ClearCartButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClear = () => {
    startTransition(async () => {
      const result = await clearCart();

      if (result.success) {
        router.refresh();
      }
    });
  };

  return (
    <Button
      type="button"
      variant="ghost"
      className="text-destructive hover:text-destructive"
      disabled={isPending}
      onClick={handleClear}
    >
      <Trash2 className="mr-2 h-4 w-4" />

      {isPending ? "Clearing..." : "Clear Cart"}
    </Button>
  );
}
