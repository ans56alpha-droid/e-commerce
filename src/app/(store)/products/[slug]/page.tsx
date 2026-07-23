import { notFound } from "next/navigation";

import { getProductBySlug } from "@/services/product";

import Container from "@/components/ui/container";

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
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Images */}

        <div>
          <img src={product.images[0]?.url} alt={product.name} />
        </div>

        {/* Information */}

        <div>
          <h1>{product.name}</h1>

          <p>{product.brand}</p>

          <p>{product.shortDescription}</p>

          <p>${product.price}</p>

          <p>
            Stock:
            {product.stock}
          </p>
        </div>
      </div>
    </Container>
  );
}
