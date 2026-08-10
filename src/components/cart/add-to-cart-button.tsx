"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Check, Loader2, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/button";
import { cn } from "@/lib/cn";

import { addToCart } from "@/actions/cart";

interface AddToCartButtonProps {
  productId: string;
  stock: number;
  isAuthenticated: boolean;
}

type ButtonState = "idle" | "added" | "error";

export default function AddToCartButton({
  productId,
  stock,
  isAuthenticated,
}: AddToCartButtonProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<ButtonState>("idle");

  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);

      return;
    }

    startTransition(async () => {
      try {
        const result = await addToCart(productId, 1);

        if (!result.success) {
          setState("error");
          return;
        }

        setState("added");

        resetTimerRef.current = setTimeout(() => {
          setState("idle");
        }, 2000);
      } catch {
        setState("error");

        resetTimerRef.current = setTimeout(() => {
          setState("idle");
        }, 2000);
      }
    });
  };

  if (stock <= 0) {
    return (
      <Button type="button" disabled className="w-full">
        Out of Stock
      </Button>
    );
  }

  const isAdded = state === "added";
  const isError = state === "error";

  return (
    <Button
      type="button"
      className={cn(
        "w-full transition-all",
        isAdded && "bg-green-600 text-white hover:bg-green-600",
        isError && "bg-destructive text-destructive-foreground",
      )}
      disabled={isPending}
      onClick={handleAddToCart}
    >
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : isAdded ? (
        <Check className="mr-2 h-4 w-4" />
      ) : (
        <ShoppingCart className="mr-2 h-4 w-4" />
      )}

      {isPending ? "Adding..." : isAdded ? "Added to Cart" : isError ? "Try Again" : "Add to Cart"}
    </Button>
  );
}
