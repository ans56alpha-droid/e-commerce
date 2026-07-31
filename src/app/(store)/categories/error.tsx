"use client";

import Container from "@/components/ui/container";
import ErrorState from "@/components/shared/error-state";

interface CategoriesErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CategoriesError({ error, reset }: CategoriesErrorProps) {
  console.error(error);

  return (
    <section className="py-16">
      <Container>
        <ErrorState onRetry={reset} />
      </Container>
    </section>
  );
}
