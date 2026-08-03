import { connectDB } from "@/db";

import Review from "@/models/Review";

export async function getProductReviews(productId: string) {
  await connectDB();

  return Review.find({ product: productId })
    .sort({ createdAt: -1 })
    .lean();
}

export async function getUserReview(productId: string, userId: string) {
  await connectDB();

  return Review.findOne({ product: productId, user: userId }).lean();
}

export async function getReviewById(reviewId: string) {
  await connectDB();

  return Review.findById(reviewId).lean();
}
