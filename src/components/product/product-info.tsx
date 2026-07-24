import { ProductDetails } from "@/types/product";
import Badge from "@/components/ui/badge";

interface ProductInfoProps {
  product: ProductDetails;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{product.name}</h1>

      <p className="text-muted-foreground">{product.brand}</p>

      <div className="flex items-center gap-3">
        <span className="text-2xl font-semibold">${product.price}</span>
        {product.compareAtPrice && (
          <span className="text-lg text-muted-foreground line-through">
            ${product.compareAtPrice}
          </span>
        )}
      </div>

      {product.rating > 0 && (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < Math.round(product.rating) ? "text-yellow-500" : "text-gray-300"}>
              ★
            </span>
          ))}
          <span className="text-sm text-muted-foreground">
            ({product.reviewCount} {product.reviewCount === 1 ? "review" : "reviews"})
          </span>
        </div>
      )}

      <Badge className={product.stock > 0 ? "bg-green-500 text-white" : "bg-red-500 text-white"}>
        {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
      </Badge>

      <p>{product.shortDescription}</p>

      <p className="text-muted-foreground">{product.description}</p>
    </div>
  );
}
