import ProductGrid from "./product-grid";
import ProductToolbar from "./product-toolbar";
import ProductPagination from "./product-pagination";

import type { Product } from "@/types/product";
import type { CategoryOption } from "@/types/category";

interface ProductListProps {
  products: Product[];
  categories: CategoryOption[];
  brands: string[];
  page: number;
  totalPages: number;
  emptyMessage: string;
}

export default function ProductList({
  products,
  categories,
  brands,
  page,
  totalPages,
  emptyMessage,
}: ProductListProps) {
  return (
    <>
      <ProductToolbar categories={categories} brands={brands} />

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="flex justify-center py-20">
          <p className="text-lg text-muted-foreground">{emptyMessage}</p>
        </div>
      )}

      {totalPages > 1 && (
        <ProductPagination page={page} totalPages={totalPages} />
      )}
    </>
  );
}
