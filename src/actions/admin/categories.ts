"use server";

import { revalidatePath } from "next/cache";
import { Types } from "mongoose";

import { requireAdmin } from "@/services/admin/auth";
import Category from "@/models/Category";
import { connectDB } from "@/db";
import { slugify } from "@/utils/slugify";

import type { ActionResult } from "@/types/action";

export async function getAdminCategoriesAction() {
  await requireAdmin();
  await connectDB();

  return Category.find()
    .select("name slug description image isActive isFeatured sortOrder")
    .sort({ sortOrder: 1, name: 1 })
    .lean();
}

export async function createCategoryAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await connectDB();

    const name = formData.get("name") as string;
    const description = (formData.get("description") as string) || "";
    const image = (formData.get("image") as string) || "";
    const isActive = formData.get("isActive") !== "false";
    const isFeatured = formData.get("isFeatured") === "true";

    if (!name || name.length < 1) {
      return { success: false, message: "Category name is required" };
    }

    const slug = slugify(name);
    const existing = await Category.findOne({ slug });

    if (existing) {
      return { success: false, message: "A category with this name exists" };
    }

    await Category.create({
      name,
      slug,
      description,
      image,
      isActive,
      isFeatured,
    });

    revalidatePath("/admin/categories");

    return { success: true, message: "Category created" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create category",
    };
  }
}

export async function updateCategoryAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await connectDB();

    const categoryId = formData.get("categoryId") as string;

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return { success: false, message: "Invalid category ID" };
    }

    const updateData: Record<string, unknown> = {};

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as string;
    const isActive = formData.get("isActive");
    const isFeatured = formData.get("isFeatured");

    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name);
    }
    if (description !== null) updateData.description = description;
    if (image !== null) updateData.image = image;
    if (isActive !== null) updateData.isActive = isActive !== "false";
    if (isFeatured !== null) updateData.isFeatured = isFeatured === "true";

    const category = await Category.findByIdAndUpdate(
      new Types.ObjectId(categoryId),
      { $set: updateData },
      { new: true }
    );

    if (!category) {
      return { success: false, message: "Category not found" };
    }

    revalidatePath("/admin/categories");

    return { success: true, message: "Category updated" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update category",
    };
  }
}

export async function deleteCategoryAction(
  categoryId: string
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await connectDB();

    if (!Types.ObjectId.isValid(categoryId)) {
      return { success: false, message: "Invalid category ID" };
    }

    const Product = (await import("@/models/Product")).default;
    const productsInCategory = await Product.countDocuments({
      category: new Types.ObjectId(categoryId),
      isDeleted: false,
    });

    if (productsInCategory > 0) {
      return {
        success: false,
        message: `Cannot delete: ${productsInCategory} products use this category`,
      };
    }

    await Category.findByIdAndDelete(new Types.ObjectId(categoryId));

    revalidatePath("/admin/categories");

    return { success: true, message: "Category deleted" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete category",
    };
  }
}
