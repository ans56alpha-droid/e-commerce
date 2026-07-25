import Container from "@/components/ui/container";
import { getProducts } from "@/services/product";
import { ProductToolbar, ProductGrid, Pagination } from "@/components/shop";

export default async function ProductsPage() {
  const { products } = await getProducts();

  return (
    <section className="py-16">
      <Container>
        <div className="mb-10">
          <h1 className="text-3xl font-bold">All Products</h1>
          <p className="mt-2 text-muted-foreground">
            Browse our full collection of products.
          </p>
        </div>

        <ProductToolbar />

        <ProductGrid products={products} />

        <Pagination />
      </Container>
    </section>
  );
}
