import Container from "@/components/ui/container";
import ProductCard from "@/components/shared/product-card";

import { products } from "@/data/products";

export default function NewArrivals() {
  const newProducts = products.filter((product) => product.isNew);

  return (
    <section className="py-16">
      <Container>
        <div className="mb-10">
          <h2 className="text-3xl font-bold">New Arrivals</h2>

          <p className="mt-2 text-muted-foreground">Fresh products added to our store.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
