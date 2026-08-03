import { Types } from "mongoose";

import { connectDB } from "@/db";

import Review from "@/models/Review";
import Product from "@/models/Product";

export interface CreateReviewInput {
  user: string;
  product: string;
  rating: number;
  title?: string;
  comment: string;
}

export type UpdateReviewInput = Partial<
  Omit<CreateReviewInput, "user" | "product">
>;

async function recalculateProductRating(productId: string) {
  await connectDB();

  const [result] = await Review.aggregate<{
    averageRating: number;
    reviewCount: number;
  }>([
    {
      $match: {
        product: new Types.ObjectId(productId),
      },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  await Product.findByIdAndUpdate(productId, {
    averageRating: result ? Math.round(result.averageRating * 10) / 10 : 0,
    reviewCount: result ? result.reviewCount : 0,
  });
}

export async function createReview(data: CreateReviewInput) {
  await connectDB();

  const existingReview = await Review.findOne({
    user: data.user,
    product: data.product,
  });

  if (existingReview) {
    throw new Error("You have already reviewed this product.");
  }

  const review = new Review({
    user: new Types.ObjectId(data.user),
    product: new Types.ObjectId(data.product),
    rating: data.rating,
    title: data.title,
    comment: data.comment,
  });

  await review.save();

  await recalculateProductRating(data.product);

  return review;
}

export async function updateReview(
  reviewId: string,
  data: UpdateReviewInput
) {
  await connectDB();

  const review = await Review.findByIdAndUpdate(reviewId, data, {
    new: true,
    runValidators: true,
  });

  if (review) {
    await recalculateProductRating(review.product.toString());
  }

  return review;
}

export async function deleteReview(reviewId: string) {
  await connectDB();

  const review = await Review.findByIdAndDelete(reviewId);

  if (review) {
    await recalculateProductRating(review.product.toString());
  }

  return review;
}
