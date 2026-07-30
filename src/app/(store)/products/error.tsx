"use client";

import Container from "@/components/ui/container";
import ErrorState from "@/components/shared/error-state";

interface ProductsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProductsError({ reset }: ProductsErrorProps) {
  return (
    <section className="py-16">
      <Container>
        <ErrorState
          title="Failed to load products"
          message="Something went wrong while loading products. Please try again."
          onRetry={reset}
        />
      </Container>
    </section>
  );
}
