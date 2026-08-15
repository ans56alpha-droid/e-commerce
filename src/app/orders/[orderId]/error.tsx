"use client";

import Container from "@/components/ui/container";
import ErrorState from "@/components/shared/error-state";

interface OrderErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function OrderError({ error, reset }: OrderErrorProps) {
  console.error(error);

  return (
    <section className="py-16">
      <Container>
        <ErrorState onRetry={reset} />
      </Container>
    </section>
  );
}
