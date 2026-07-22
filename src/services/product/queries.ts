import { connectDB } from "@/db";
import Product from "@/models/Product";
import { PRODUCT_STATUS } from "@/constants/product";
import "@/models/Category"
import { toProductCard } from "@/mappers/product";

export async function getFeaturedProducts(limit = 8) {
  await connectDB();

  const products = await Product.find({
    status: PRODUCT_STATUS.PUBLISHED,
    isFeatured: true,
    isDeleted: false,
  })
    .populate("category")
    .sort({ createdAt: -1 })
    .limit(limit);

    return products.map(toProductCard);

}

export async function getNewArrivals(limit = 8) {
  await connectDB();

  const products = await Product.find({
    status: PRODUCT_STATUS.PUBLISHED,
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .limit(limit);

    return products.map(toProductCard);
}

export async function getProducts() {
  await connectDB();

  const products = await Product.find({
    status: PRODUCT_STATUS.PUBLISHED,
    isDeleted: false,
  })
    .sort({ createdAt: -1 });
  
  return products.map(toProductCard);
}

export async function getProductsByCategory(categoryId: string) {
  await connectDB();

  const products = await Product.find({
    category: categoryId,
    status: PRODUCT_STATUS.PUBLISHED,
    isDeleted: false,
  })
    .sort({ createdAt: -1 });
  
  return products.map(toProductCard);
}