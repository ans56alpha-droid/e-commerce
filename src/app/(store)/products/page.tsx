import Container from "@/components/ui/container";
import { getProducts } from "@/services/product";
import { getActiveCategories } from "@/services/category";
import { ProductToolbar, ProductGrid, Pagination } from "@/components/shop";
import { parseProductFilters } from "@/lib/product-filters";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const filters = parseProductFilters(await searchParams);
  const [{ products }, categories] = await Promise.all([
    getProducts(filters),
    getActiveCategories(),
  ]);

  return (
    <section className="py-16">
      <Container>
        <div className="mb-10">
          <h1 className="text-3xl font-bold">All Products</h1>
          <p className="mt-2 text-muted-foreground">
            Browse our full collection of products.
          </p>
        </div>

        <ProductToolbar categories={categories} />

        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="flex justify-center py-20">
            <p className="text-lg text-muted-foreground">
              {filters.search
                ? `No products found for "${filters.search}".`
                : "No products found."}
            </p>
          </div>
        )}

        <Pagination />
      </Container>
    </section>
  );
}
