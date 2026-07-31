import { Suspense } from "react";
import type { Metadata } from "next";

import Container from "@/components/ui/container";
import { ProductList } from "@/components/shop";
import { ProductListSkeleton } from "@/components/skeletons";
import { getProducts, getAvailableBrands } from "@/services/product";
import { getActiveCategories } from "@/services/category";
import { parseProductFilters } from "@/lib/product-filters";

export const metadata: Metadata = {
  title: "Shop Products",
  description: "Browse our complete product catalog.",
};

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <section className="py-16">
      <Container>
        <div className="mb-10">
          <h1 className="text-3xl font-bold">All Products</h1>
          <p className="mt-2 text-muted-foreground">
            Browse our full collection of products.
          </p>
        </div>

        <Suspense fallback={<ProductListSkeleton />}>
          <ProductsResult searchParams={searchParams} />
        </Suspense>
      </Container>
    </section>
  );
}

async function ProductsResult({ searchParams }: ProductsPageProps) {
  const filters = parseProductFilters(await searchParams);
  const [{ products, page, totalPages }, categories, brands] = await Promise.all([
    getProducts(filters),
    getActiveCategories(),
    getAvailableBrands(),
  ]);

  const emptyMessage = filters.search
    ? `No products found for "${filters.search}".`
    : "No products found.";

  return (
    <ProductList
      products={products}
      categories={categories}
      brands={brands}
      page={page}
      totalPages={totalPages}
      emptyMessage={emptyMessage}
    />
  );
}
