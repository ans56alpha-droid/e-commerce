"use client";

import Container from "@/components/ui/container";
import ErrorState from "@/components/shared/error-state";

interface CategoriesErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CategoriesError({ reset }: CategoriesErrorProps) {
  return (
    <section className="py-16">
      <Container>
        <ErrorState
          title="Failed to load categories"
          message="Something went wrong while loading categories. Please try again."
          onRetry={reset}
        />
      </Container>
    </section>
  );
}
