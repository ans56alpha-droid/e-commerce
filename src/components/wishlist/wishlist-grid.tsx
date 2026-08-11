import type { WishlistProduct } from "@/mappers/wishlist";

import ProductCard from "@/components/shared/product-card";

interface WishlistGridProps {
  products: WishlistProduct[];
}

export default function WishlistGrid({ products }: WishlistGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
