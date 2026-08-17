import Image from "next/image";
import Link from "next/link";
import WishlistButtonServer from "../wishlist/wishlist-button-server";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { AddToCart } from "@/components/cart";

import Price from "./price";
import Rating from "./rating";

import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden p-0">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
          />

          {product.isNew && (
            <div className="absolute left-3 top-3">
              <Badge>New</Badge>
            </div>
          )}

          <Button
            size="icon"
            variant="ghost"
            className="absolute right-3 top-3 rounded-full bg-background/80 backdrop-blur"
            aria-label="Add to wishlist"
          >
            <WishlistButtonServer productId={product.id} />
          </Button>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <Link href={`/shop/${product.slug}`}>
          <h3 className="line-clamp-2 font-semibold hover:text-primary">{product.name}</h3>
        </Link>

        <Rating rating={product.rating} reviewCount={product.reviewCount} />

        <Price price={product.price} compareAtPrice={product.compareAtPrice} />

        <div className="mt-auto">
          <AddToCart productId={product.id} stock={product.stock} />
        </div>
      </div>
    </Card>
  );
}
