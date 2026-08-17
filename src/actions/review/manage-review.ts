"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import {
  updateReview,
  deleteReview,
} from "@/services/review/mutations";

import type { ActionResult } from "@/types/action";

export async function updateReviewAction(
  reviewId: string,
  values: { rating: number; title: string; comment: string }
): Promise<ActionResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const existing = await import("@/services/review/queries").then(
      (m) => m.getReviewById(reviewId)
    );

    if (!existing || existing.user.toString() !== session.user.id) {
      return {
        success: false,
        message: "You can only edit your own reviews",
      };
    }

    await updateReview(reviewId, values);

    revalidatePath("/products");

    return { success: true, message: "Review updated" };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update review",
    };
  }
}

export async function deleteReviewAction(
  reviewId: string
): Promise<ActionResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const existing = await import("@/services/review/queries").then(
      (m) => m.getReviewById(reviewId)
    );

    if (!existing || existing.user.toString() !== session.user.id) {
      return {
        success: false,
        message: "You can only delete your own reviews",
      };
    }

    await deleteReview(reviewId);

    const Review = (await import("@/models/Review")).default;
    const Product = (await import("@/models/Product")).default;

    const stats = await Review.aggregate([
      { $match: { product: existing.product } },
      {
        $group: {
          _id: null,
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    await Product.findByIdAndUpdate(existing.product, {
      $set: {
        averageRating: stats[0]?.avg ?? 0,
        reviewCount: stats[0]?.count ?? 0,
      },
    });

    revalidatePath("/products");

    return { success: true, message: "Review deleted" };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete review",
    };
  }
}
