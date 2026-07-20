import Container from "@/components/ui/container";
import CategoryCard from "@/components/shared/category-card";

import { categories } from "@/data/categories";

export default function FeaturedCategories() {
  return (
    <section className="py-16">
      <Container>
        <div className="mb-10">
          <h2 className="text-3xl font-bold">Shop by Category</h2>

          <p className="mt-2 text-muted-foreground">Explore our most popular categories.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </Container>
    </section>
  );
}
