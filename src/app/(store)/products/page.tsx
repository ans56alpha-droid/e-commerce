import Container from "@/components/ui/container";
import { ProductList } from "@/components/shop";
import { getProducts, getAvailableBrands } from "@/services/product";
import { getActiveCategories } from "@/services/category";
import { parseProductFilters } from "@/lib/product-filters";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
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
    <section className="py-16">
      <Container>
        <div className="mb-10">
          <h1 className="text-3xl font-bold">All Products</h1>
          <p className="mt-2 text-muted-foreground">
            Browse our full collection of products.
          </p>
        </div>

        <ProductList
          products={products}
          categories={categories}
          brands={brands}
          page={page}
          totalPages={totalPages}
          emptyMessage={emptyMessage}
        />
      </Container>
    </section>
  );
}
