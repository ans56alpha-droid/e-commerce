import { notFound } from "next/navigation";

import { getProductBySlug, getRelatedProducts } from "@/services/product";

import Container from "@/components/ui/container";
import { ProductGallery, ProductInfo, ProductSpecifications, RelatedProducts } from "@/components/product";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
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
