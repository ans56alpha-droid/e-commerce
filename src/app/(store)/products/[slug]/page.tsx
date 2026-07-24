import { notFound } from "next/navigation";

import { getProductBySlug } from "@/services/product";

import Container from "@/components/ui/container";
import { ProductGallery, ProductInfo, ProductSpecifications } from "@/components/product";

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

  return (
    <Container className="py-10">
      <div className="grid gap-10 lg:grid-cols-2 mb-2">
        {/* Images */}

        <ProductGallery images={product.images} />

        {/* Information */}

        <ProductInfo product={product} />
      </div>

      <ProductSpecifications specifications={product.specifications} />
    </Container>
  );
}
