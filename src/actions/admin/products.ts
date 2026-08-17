"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/services/admin/auth";
import Product from "@/models/Product";
import { connectDB } from "@/db";
import { Types } from "mongoose";
import { PRODUCT_STATUS } from "@/constants/product";
import { escapeRegex } from "@/lib/escape-regex";

import type { ActionResult } from "@/types/action";

const PRODUCTS_PER_PAGE = 20;

export async function getAdminProductsAction(
  page = 1,
  filters: { search?: string; status?: string; category?: string } = {}
) {
  await requireAdmin();
  await connectDB();

  const query: Record<string, unknown> = { isDeleted: false };

  if (filters.search) {
    const safe = escapeRegex(filters.search);
    query.$or = [
      { name: { $regex: safe, $options: "i" } },
      { sku: { $regex: safe, $options: "i" } },
    ];
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.category && Types.ObjectId.isValid(filters.category)) {
    query.category = new Types.ObjectId(filters.category);
  }

  const total = await Product.countDocuments(query);
  const totalPages = Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const products = await Product.find(query)
    .select("name slug sku price stock status isFeatured category brand images averageRating reviewCount")
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .skip((safePage - 1) * PRODUCTS_PER_PAGE)
    .limit(PRODUCTS_PER_PAGE)
    .lean();

  return { products, page: safePage, totalPages, total };
}

export async function createProductAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await connectDB();

    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const sku = formData.get("sku") as string;
    const categoryId = formData.get("category") as string;
    const description = (formData.get("description") as string) || "";
    const shortDescription = (formData.get("shortDescription") as string) || "";
    const brand = (formData.get("brand") as string) || "";
    const status = (formData.get("status") as string) || "draft";

    if (!name || !price || !sku || !categoryId) {
      return { success: false, message: "Required fields missing" };
    }

    if (price < 0 || stock < 0) {
      return { success: false, message: "Price and stock must be positive" };
    }

    const existing = await Product.findOne({ sku: sku.toUpperCase() });
    if (existing) {
      return { success: false, message: "A product with this SKU exists" };
    }

    await Product.create({
      name,
      price,
      stock,
      sku: sku.toUpperCase(),
      category: categoryId,
      description,
      shortDescription,
      brand,
      status: status as typeof PRODUCT_STATUS[keyof typeof PRODUCT_STATUS],
    });

    revalidatePath("/admin/products");

    return { success: true, message: "Product created" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create product",
    };
  }
}

export async function updateProductAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await connectDB();

    const productId = formData.get("productId") as string;

    if (!productId || !Types.ObjectId.isValid(productId)) {
      return { success: false, message: "Invalid product ID" };
    }

    const updateData: Record<string, unknown> = {};

    const name = formData.get("name") as string;
    const price = formData.get("price");
    const stock = formData.get("stock");
    const sku = formData.get("sku") as string;
    const categoryId = formData.get("category") as string;
    const description = formData.get("description") as string;
    const shortDescription = formData.get("shortDescription") as string;
    const brand = formData.get("brand") as string;
    const status = formData.get("status") as string;
    const isFeatured = formData.get("isFeatured");

    if (name) updateData.name = name;
    if (price !== null) updateData.price = Number(price);
    if (stock !== null) updateData.stock = Number(stock);
    if (sku) updateData.sku = sku.toUpperCase();
    if (categoryId) updateData.category = categoryId;
    if (description !== null) updateData.description = description;
    if (shortDescription !== null) updateData.shortDescription = shortDescription;
    if (brand !== null) updateData.brand = brand;
    if (status) updateData.status = status as typeof PRODUCT_STATUS[keyof typeof PRODUCT_STATUS];
    if (isFeatured !== null) updateData.isFeatured = isFeatured === "true";

    const product = await Product.findByIdAndUpdate(
      new Types.ObjectId(productId),
      { $set: updateData },
      { new: true }
    );

    if (!product) {
      return { success: false, message: "Product not found" };
    }

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}/edit`);

    return { success: true, message: "Product updated" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update product",
    };
  }
}

export async function deleteProductAction(
  productId: string
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await connectDB();

    if (!Types.ObjectId.isValid(productId)) {
      return { success: false, message: "Invalid product ID" };
    }

    const product = await Product.findByIdAndUpdate(
      new Types.ObjectId(productId),
      { $set: { isDeleted: true } }
    );

    if (!product) {
      return { success: false, message: "Product not found" };
    }

    revalidatePath("/admin/products");

    return { success: true, message: "Product deleted" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete product",
    };
  }
}
