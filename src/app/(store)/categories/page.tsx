import type { Metadata } from "next";

import Container from "@/components/ui/container";
import CategoryGrid from "@/components/category/category-grid";
import { getCategories } from "@/services/category";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse products by category.",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <section className="py-16">
      <Container>
        <div className="mb-10">
          <h1 className="text-3xl font-bold">Shop by Category</h1>

          <p className="mt-2 text-muted-foreground">
            Browse our complete collection of categories.
          </p>
        </div>

        <CategoryGrid categories={categories} />
      </Container>
    </section>
  );
}
