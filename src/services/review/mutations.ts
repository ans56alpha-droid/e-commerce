import { Types } from "mongoose";

import { connectDB } from "@/db";

import Review from "@/models/Review";

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

  return review;
}

export async function updateReview(
  reviewId: string,
  data: UpdateReviewInput
) {
  await connectDB();

  return Review.findByIdAndUpdate(reviewId, data, {
    new: true,
    runValidators: true,
  });
}

export async function deleteReview(reviewId: string) {
  await connectDB();

  return Review.findByIdAndDelete(reviewId);
}
