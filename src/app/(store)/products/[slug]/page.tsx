import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getProductBySlug, getRelatedProducts } from "@/services/product";

import Container from "@/components/ui/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProductGallery, ProductInfo, ProductSpecifications, RelatedProducts } from "@/components/product";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const primaryImage =
    product.images.find((image) => image.isPrimary) ?? product.images[0];
  const description = product.shortDescription || product.description;

  return {
    title: product.name,
    description,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: product.name,
      description,
      type: "website",
      url: `/products/${product.slug}`,
      images: primaryImage
        ? [{ url: primaryImage.url, alt: primaryImage.alt }]
        : undefined,
    },
    twitter: {
      title: product.name,
      description,
      images: primaryImage ? [primaryImage.url] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts({
    productId: product.id,
    categoryId: product.category.id,
  });

  return (
    <Container className="py-10">
      <Breadcrumb
        className="mb-6"
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          {
            label: product.category.name,
            href: `/categories/${product.category.slug}`,
          },
          { label: product.name },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-2 mb-2">
        {/* Images */}

        <ProductGallery images={product.images} />

        {/* Information */}

        <ProductInfo product={product} />
      </div>

      <ProductSpecifications specifications={product.specifications} />
      <RelatedProducts products={relatedProducts} />
    </Container>
  );
}
