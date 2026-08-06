"use server";

import { auth } from "@/auth";
import { connectDB } from "@/db";
import { createReviewSchema } from "@/lib/validations/review";
import { createReview } from "@/services/review";
import type { AuthActionState } from "@/types/auth";

export async function createReviewAction(
  productId: string,
  values: unknown
): Promise<AuthActionState> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be signed in to write a review.",
    };
  }

  const parsed = createReviewSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await connectDB();

    await createReview({
      user: session.user.id,
      product: productId,
      rating: parsed.data.rating,
      title: parsed.data.title,
      comment: parsed.data.comment,
    });

    return {
      success: true,
      message: "Your review has been published. Thank you!",
    };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "You have already reviewed this product."
    ) {
      return {
        success: false,
        message: "You have already reviewed this product.",
      };
    }

    console.error("Create review error:", error);

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
