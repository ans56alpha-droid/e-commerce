import type { Types } from "mongoose";

import { connectDB } from "@/db";

import Review, { type ReviewType } from "@/models/Review";
import { buildPagination } from "@/services/product/pagination";

export interface ProductReview {
  id: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    image: string;
  };
}

export interface GetProductReviewsParams {
  productId: string;
  page?: number;
  limit?: number;
}

export interface PaginatedReviews {
  reviews: ProductReview[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

type PopulatedReview =  ReviewType & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    _id: Types.ObjectId;
    name: string;
    image: string;
  };
};

export async function getProductReviews({
  productId,
  page,
  limit,
}: GetProductReviewsParams): Promise<PaginatedReviews> {
  await connectDB();

  const { page: resolvedPage, limit: resolvedLimit, skip } = buildPagination(page, limit);

  const [reviews, total] = await Promise.all([
    Review.find({ product: productId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(resolvedLimit)
      .populate("user", "name image")
      .lean(),
    Review.countDocuments({ product: productId }),
  ]);

  return {
    reviews: (reviews as unknown as PopulatedReview[]).map((review) => ({
      id: review._id.toString(),
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
      user: {
        name: review.user?.name ?? "Anonymous",
        image: review.user?.image ?? "",
      },
    })),
    total,
    page: resolvedPage,
    totalPages: Math.ceil(total / resolvedLimit),
    limit: resolvedLimit,
  };
}

export async function getUserReview(productId: string, userId: string) {
  await connectDB();

  return Review.findOne({ product: productId, user: userId }).lean();
}

export async function getReviewById(reviewId: string) {
  await connectDB();

  return Review.findById(reviewId).lean();
}
