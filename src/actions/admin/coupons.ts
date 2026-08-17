"use server";

import { revalidatePath } from "next/cache";
import { Types } from "mongoose";

import { requireAdmin } from "@/services/admin/auth";
import {
  createCoupon as createCouponService,
  updateCoupon as updateCouponService,
  deleteCoupon as deleteCouponService,
  getAllCoupons,
} from "@/services/coupon";
import { couponSchema } from "@/lib/validations/coupon";

import type { ActionResult } from "@/types/action";
import type { CreateCouponInput } from "@/services/coupon";

export async function getAdminCouponsAction(
  page = 1,
  search?: string
) {
  await requireAdmin();
  return getAllCoupons(page, search);
}

export async function createCouponAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const raw = {
      code: formData.get("code") as string,
      description: (formData.get("description") as string) || "",
      discountType: formData.get("discountType") as "percentage" | "fixed",
      discountValue: Number(formData.get("discountValue")),
      minOrderAmount: Number(formData.get("minOrderAmount") || 0),
      maxDiscount: Number(formData.get("maxDiscount") || 0),
      usageLimit: Number(formData.get("usageLimit") || 0),
      perUserLimit: Number(formData.get("perUserLimit") || 1),
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      isActive: formData.get("isActive") !== "false",
    };

    const parsed = couponSchema.safeParse({
      ...raw,
      startDate: new Date(raw.startDate),
      endDate: new Date(raw.endDate),
    });

    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message ?? "Invalid coupon data",
      };
    }

    if (parsed.data.discountType === "percentage" && parsed.data.discountValue > 100) {
      return { success: false, message: "Percentage cannot exceed 100%" };
    }

    await createCouponService(parsed.data as CreateCouponInput);

    revalidatePath("/admin/coupons");

    return { success: true, message: "Coupon created" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create coupon",
    };
  }
}

export async function updateCouponAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const couponId = formData.get("couponId") as string;

    if (!couponId || !Types.ObjectId.isValid(couponId)) {
      return { success: false, message: "Invalid coupon ID" };
    }

    const updateData: Record<string, unknown> = {};

    const code = formData.get("code") as string;
    const description = formData.get("description") as string;
    const discountType = formData.get("discountType") as string;
    const discountValue = formData.get("discountValue");
    const minOrderAmount = formData.get("minOrderAmount");
    const maxDiscount = formData.get("maxDiscount");
    const usageLimit = formData.get("usageLimit");
    const perUserLimit = formData.get("perUserLimit");
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const isActive = formData.get("isActive");

    if (code) updateData.code = code.toUpperCase();
    if (description !== null) updateData.description = description;
    if (discountType) updateData.discountType = discountType;
    if (discountValue !== null) updateData.discountValue = Number(discountValue);
    if (minOrderAmount !== null) updateData.minOrderAmount = Number(minOrderAmount);
    if (maxDiscount !== null) updateData.maxDiscount = Number(maxDiscount);
    if (usageLimit !== null) updateData.usageLimit = Number(usageLimit);
    if (perUserLimit !== null) updateData.perUserLimit = Number(perUserLimit);
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    if (isActive !== null) updateData.isActive = isActive !== "false";

    await updateCouponService(couponId, updateData);

    revalidatePath("/admin/coupons");

    return { success: true, message: "Coupon updated" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update coupon",
    };
  }
}

export async function deleteCouponAction(
  couponId: string
): Promise<ActionResult> {
  try {
    await requireAdmin();

    await deleteCouponService(couponId);

    revalidatePath("/admin/coupons");

    return { success: true, message: "Coupon deleted" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete coupon",
    };
  }
}
