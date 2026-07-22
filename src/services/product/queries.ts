import { connectDB } from "@/db";
import Product from "@/models/Product";
import { PRODUCT_STATUS } from "@/constants/product";
import "@/models/Category"

export async function getFeaturedProducts(limit = 8) {
  await connectDB();

  return Product.find({
    status: PRODUCT_STATUS.PUBLISHED,
    isFeatured: true,
    isDeleted: false,
  })
    .populate("category")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

export async function getNewArrivals(limit = 8) {
  await connectDB();

  return Product.find({
    status: PRODUCT_STATUS.PUBLISHED,
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}