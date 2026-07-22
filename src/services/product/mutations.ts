import { connectDB } from "@/db";
import Product from "@/models/Product";
import { CreateProductInput } from "./types";

export async function createProduct(data: CreateProductInput) {
  await connectDB();

  const product = new Product(data);

  await product.save();

  return product;
}