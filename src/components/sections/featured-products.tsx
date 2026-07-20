import Container from "@/components/ui/container";
import ProductCard from "@/components/shared/product-card";

import { products } from "@/data/products";

export default function FeaturedProducts() {
  const featuredProducts = products.filter((product) => product.featured);

  return (
    <section className="py-16">
      <Container>
        <div className="mb-10">
          <h2 className="text-3xl font-bold">Featured Products</h2>

          <p className="mt-2 text-muted-foreground">Discover our most popular products.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
