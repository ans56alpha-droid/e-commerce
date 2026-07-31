import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";

import Container from "@/components/ui/container";
import { ProductList } from "@/components/shop";
import { ProductListSkeleton } from "@/components/skeletons";
import { getProducts, getAvailableBrands } from "@/services/product";
import { getCategoryBySlug, getActiveCategories } from "@/services/category";
import { parseProductFilters } from "@/lib/product-filters";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

interface CategoryProductsProps {
  categoryId: string;
  searchParams: Promise<Record<string, string | undefined>>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const description =
    category.description ?? `Browse products in ${category.name}`;

  return {
    title: category.name,
    description,
    alternates: {
      canonical: `/categories/${category.slug}`,
    },
    openGraph: {
      title: category.name,
      description,
      type: "website",
      url: `/categories/${category.slug}`,
    },
    twitter: {
      title: category.name,
      description,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) notFound();

  return (
    <section className="py-16">
      <Container>
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="transition-colors hover:text-foreground">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/categories"
                className="transition-colors hover:text-foreground"
              >
                Categories
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-foreground" aria-current="page">
              {category.name}
            </li>
          </ol>
        </nav>

        <div className="mb-10">
          <h1 className="text-3xl font-bold">{category.name}</h1>

          {category.description && (
            <p className="mt-2 text-muted-foreground">{category.description}</p>
          )}
        </div>

        <Suspense fallback={<ProductListSkeleton />}>
          <CategoryProducts categoryId={category.id} searchParams={searchParams} />
        </Suspense>
      </Container>
    </section>
  );
}

async function CategoryProducts({ categoryId, searchParams }: CategoryProductsProps) {
  const filters = { ...parseProductFilters(await searchParams), category: categoryId };
  const [{ products, page, totalPages, total }, categories, brands] = await Promise.all([
    getProducts(filters),
    getActiveCategories(),
    getAvailableBrands(),
  ]);

  return (
    <>
      <p className="mb-6 text-sm text-muted-foreground">
        {total} {total === 1 ? "product" : "products"}
      </p>

      <ProductList
        products={products}
        categories={categories}
        brands={brands}
        page={page}
        totalPages={totalPages}
        emptyMessage="No products found in this category."
      />
    </>
  );
}
