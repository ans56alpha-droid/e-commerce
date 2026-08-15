"use client";

import Container from "@/components/ui/container";
import ErrorState from "@/components/shared/error-state";

interface PaymentErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PaymentError({ error, reset }: PaymentErrorProps) {
  console.error(error);

  return (
    <section className="py-16">
      <Container>
        <ErrorState
          title="Unable to start payment"
          description="We couldn't prepare your JazzCash payment. Please try again or check your order."
          onRetry={reset}
        />
      </Container>
    </section>
  );
}
