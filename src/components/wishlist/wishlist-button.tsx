"use client";

import { useOptimistic, useTransition, type MouseEvent } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/button";
import { cn } from "@/lib/cn";

import { toggleWishlist } from "@/actions/wishlist";

interface WishlistButtonProps {
  productId: string;
  isWishlisted: boolean;
  isAuthenticated: boolean;
}

export default function WishlistButton({
  productId,
  isWishlisted,
  isAuthenticated,
}: WishlistButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticWishlisted, setOptimisticWishlisted] = useOptimistic(isWishlisted);

  const router = useRouter();

  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);

      return;
    }

    const nextState = !optimisticWishlisted;

    setOptimisticWishlisted(nextState);

    startTransition(async () => {
      const result = await toggleWishlist(productId);

      if (!result.success) {
        router.refresh();
        return;
      }

      router.refresh();
    });
  };

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      className="absolute rounded-full bg-background/80 backdrop-blur"
      aria-label={optimisticWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={optimisticWishlisted}
      disabled={isPending}
      onClick={handleToggle}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-all",
          optimisticWishlisted && "fill-current text-red-500",
        )}
      />
    </Button>
  );
}
