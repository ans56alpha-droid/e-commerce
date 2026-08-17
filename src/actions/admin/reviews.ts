"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/services/admin/auth";
import Review from "@/models/Review";
import { connectDB } from "@/db";
import { Types } from "mongoose";
import { escapeRegex } from "@/lib/escape-regex";

const REVIEWS_PER_PAGE = 20;

export async function getAdminReviewsAction(
  page = 1,
  search?: string
) {
  await requireAdmin();
  await connectDB();

  const query: Record<string, unknown> = {};

  if (search) {
    const Product = (await import("@/models/Product")).default;
    const matchingProducts = await Product.find({
      name: { $regex: escapeRegex(search), $options: "i" },
    }).select("_id");

    query.$or = [
      { product: { $in: matchingProducts.map((p) => p._id) } },
    ];
  }

  const total = await Review.countDocuments(query);
  const totalPages = Math.max(1, Math.ceil(total / REVIEWS_PER_PAGE));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const reviews = await Review.find(query)
    .populate("user", "name email")
    .populate("product", "name slug")
    .sort({ createdAt: -1 })
    .skip((safePage - 1) * REVIEWS_PER_PAGE)
    .limit(REVIEWS_PER_PAGE)
    .lean();

  return { reviews, page: safePage, totalPages, total };
}

export async function deleteReviewAction(
  reviewId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    await requireAdmin();
    await connectDB();

    if (!Types.ObjectId.isValid(reviewId)) {
      return { success: false, message: "Invalid review ID" };
    }

    const review = await Review.findByIdAndDelete(
      new Types.ObjectId(reviewId)
    );

    if (!review) {
      return { success: false, message: "Review not found" };
    }

    const Product = (await import("@/models/Product")).default;

    const stats = await Review.aggregate([
      { $match: { product: review.product } },
      {
        $group: {
          _id: null,
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    await Product.findByIdAndUpdate(review.product, {
      $set: {
        averageRating: stats[0]?.avg ?? 0,
        reviewCount: stats[0]?.count ?? 0,
      },
    });

    revalidatePath("/admin/reviews");

    return { success: true, message: "Review deleted" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete review",
    };
  }
}
