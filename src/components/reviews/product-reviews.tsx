import Link from "next/link";

import { auth } from "@/auth";
import type { ProductReview } from "@/services/review/queries";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";

import ReviewForm from "./review-form";
import ReviewList from "./review-list";
import ReviewSummary from "./review-summary";

interface ProductReviewsProps {
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
}

function SignInPrompt() {
  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium">Want to share your experience?</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to write a review for this product.
        </p>
      </div>

      <Button asChild variant="outline">
        <Link href="/login">Sign in</Link>
      </Button>
    </div>
  );
}

export default async function ProductReviews({
  rating,
  reviewCount,
  reviews,
}: ProductReviewsProps) {
  const session = await auth();
  const isAuthenticated = Boolean(session?.user);

  return (
    <section aria-labelledby="reviews-heading" className="mt-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="reviews-heading" className="text-3xl font-bold">
            Customer Reviews
          </h2>

          <p className="mt-2 text-muted-foreground">
            Read what other customers think about this product.
          </p>
        </div>

        <ReviewSummary rating={rating} reviewCount={reviewCount} className="mb-8" />
      </div>

      <ReviewList reviews={reviews} className="mb-8" />

      <Card>
        <h3 className="mb-4 text-lg font-semibold">Write a Review</h3>

        {isAuthenticated ? <ReviewForm /> : <SignInPrompt />}
      </Card>
    </section>
  );
}
