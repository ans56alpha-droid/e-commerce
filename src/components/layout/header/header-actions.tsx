import { Heart, ShoppingCart, User } from "lucide-react";
import Button from "@/components/ui/button";

export default function HeaderActions({ className }: { className?: string }) {
  return (
    <div className={className ?? "flex items-center gap-4"}>
      <Button
        aria-label="Wishlist"
        variant="ghost"
        size="icon"
        className="transition hover:scale-110"
      >
        <Heart size={22} />
      </Button>
      <Button
        aria-label="Shopping cart"
        variant="ghost"
        size="icon"
        className="relative transition hover:scale-110"
      >
        <ShoppingCart size={22} />
      </Button>
      <Button
        aria-label="User account"
        variant="ghost"
        size="icon"
        className="transition hover:scale-110"
      >
        <User size={22} />
      </Button>
    </div>
  );
}
