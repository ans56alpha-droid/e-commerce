"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useTransition } from "react";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Price from "@/components/shared/price";

import { removeFromCart, updateCartItem } from "@/actions/cart";

import type { CartLineItem } from "@/mappers/cart";

interface CartItemProps {
  item: CartLineItem;
}

export default function CartItem({ item }: CartItemProps) {
  const [isPending, startTransition] = useTransition();

  const decreaseQuantity = () => {
    if (item.quantity <= 1) {
      return;
    }

    startTransition(async () => {
      await updateCartItem(item.productId, item.quantity - 1);
    });
  };

  const increaseQuantity = () => {
    if (item.quantity >= item.stock) {
      return;
    }

    startTransition(async () => {
      await updateCartItem(item.productId, item.quantity + 1);
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      await removeFromCart(item.productId);
    });
  };

  return (
    <Card className="flex gap-4 p-4">
      <Link
        href={`/products/${item.slug}`}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-muted"
      >
        {item.image ? (
          <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/products/${item.slug}`}>
              <h3 className="line-clamp-2 font-medium hover:text-primary">{item.name}</h3>
            </Link>

            <Price price={item.price} compareAtPrice={item.compareAtPrice} />
          </div>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleRemove}
            disabled={isPending}
            aria-label={`Remove ${item.name} from cart`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center rounded-md border">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={decreaseQuantity}
              disabled={isPending || item.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </Button>

            <span className="min-w-10 text-center text-sm font-medium">{item.quantity}</span>

            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={increaseQuantity}
              disabled={isPending || item.quantity >= item.stock}
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <p className="font-semibold">${item.lineTotal.toFixed(2)}</p>
        </div>
      </div>
    </Card>
  );
}
