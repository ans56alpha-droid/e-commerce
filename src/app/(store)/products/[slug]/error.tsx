"use client";

import Container from "@/components/ui/container";
import ErrorState from "@/components/shared/error-state";

interface ProductErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProductError({ error, reset }: ProductErrorProps) {
  console.error(error);

  return (
    <section className="py-16">
      <Container>
        <ErrorState onRetry={reset} />
      </Container>
    </section>
  );
}
