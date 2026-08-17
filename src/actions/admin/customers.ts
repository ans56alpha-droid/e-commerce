"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/services/admin/auth";
import { UserModel } from "@/models/User";
import { connectDB } from "@/db";
import { Types } from "mongoose";
import { escapeRegex } from "@/lib/escape-regex";

import type { ActionResult } from "@/types/action";

const CUSTOMERS_PER_PAGE = 20;

export async function getAdminCustomersAction(
  page = 1,
  search?: string
) {
  await requireAdmin();
  await connectDB();

  const query: Record<string, unknown> = {};

  if (search) {
    const safe = escapeRegex(search);
    query.$or = [
      { name: { $regex: safe, $options: "i" } },
      { email: { $regex: safe, $options: "i" } },
    ];
  }

  const total = await UserModel.countDocuments(query);
  const totalPages = Math.max(1, Math.ceil(total / CUSTOMERS_PER_PAGE));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const customers = await UserModel.find(query)
    .select("name email role isActive createdAt")
    .sort({ createdAt: -1 })
    .skip((safePage - 1) * CUSTOMERS_PER_PAGE)
    .limit(CUSTOMERS_PER_PAGE)
    .lean();

  return { customers, page: safePage, totalPages, total };
}

export async function toggleCustomerStatusAction(
  customerId: string
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await connectDB();

    if (!Types.ObjectId.isValid(customerId)) {
      return { success: false, message: "Invalid customer ID" };
    }

    const customer = await UserModel.findById(new Types.ObjectId(customerId));

    if (!customer) {
      return { success: false, message: "Customer not found" };
    }

    if (customer.role === "ADMIN") {
      return { success: false, message: "Cannot deactivate an admin" };
    }

    customer.isActive = !customer.isActive;
    await customer.save();

    revalidatePath("/admin/customers");
    revalidatePath(`/admin/customers/${customerId}`);

    return {
      success: true,
      message: `Customer ${customer.isActive ? "activated" : "deactivated"}`,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update customer",
    };
  }
}
