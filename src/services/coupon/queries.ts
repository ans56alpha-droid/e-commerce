import { Types } from "mongoose";

import { connectDB } from "@/db";
import Coupon from "@/models/Coupon";
import { escapeRegex } from "@/lib/escape-regex";

import type { CouponType } from "@/models/Coupon";

type LeanCoupon = CouponType & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export async function getCouponByCode(
  code: string
): Promise<LeanCoupon | null> {
  await connectDB();

  return Coupon.findOne({
    code: code.toUpperCase().trim(),
    isActive: true,
  }).lean();
}

export async function validateCoupon(
  code: string,
  orderAmount: number,
  userId: string,
  productIds?: string[],
  categoryIds?: string[]
) {
  const coupon = await getCouponByCode(code);

  if (!coupon) {
    throw new Error("Invalid coupon code");
  }

  const now = new Date();

  if (coupon.startDate > now) {
    throw new Error("This coupon is not yet active");
  }

  if (coupon.endDate < now) {
    throw new Error("This coupon has expired");
  }

  if (
    coupon.usageLimit > 0 &&
    coupon.usedCount >= coupon.usageLimit
  ) {
    throw new Error(
      "This coupon has reached its usage limit"
    );
  }

  if (coupon.minOrderAmount > 0 && orderAmount < coupon.minOrderAmount) {
    throw new Error(
      `Minimum order amount is ${coupon.minOrderAmount}`
    );
  }

  if (
    coupon.discountType === "percentage" &&
    coupon.discountValue > 100
  ) {
    throw new Error("Invalid coupon configuration");
  }

  if (coupon.applicableProducts.length > 0 && productIds) {
    const hasApplicable = productIds.some((id) =>
      coupon.applicableProducts.some(
        (p) => p.toString() === id
      )
    );
    if (!hasApplicable) {
      throw new Error(
        "This coupon does not apply to any items in your cart"
      );
    }
  }

  if (coupon.applicableCategories.length > 0 && categoryIds) {
    const hasApplicable = categoryIds.some((id) =>
      coupon.applicableCategories.some(
        (c) => c.toString() === id
      )
    );
    if (!hasApplicable) {
      throw new Error(
        "This coupon does not apply to any items in your cart"
      );
    }
  }

  let discount = 0;

  if (coupon.discountType === "percentage") {
    discount = (orderAmount * coupon.discountValue) / 100;

    if (
      coupon.maxDiscount > 0 &&
      discount > coupon.maxDiscount
    ) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = Math.min(coupon.discountValue, orderAmount);
  }

  return {
    coupon,
    discount: Math.round(discount * 100) / 100,
  };
}

export async function getAllCoupons(
  page = 1,
  search?: string
) {
  await connectDB();

  const safePage =
    Number.isInteger(page) && page > 0 ? page : 1;

  const query: Record<string, unknown> = {};

  if (search) {
    query.code = { $regex: escapeRegex(search), $options: "i" };
  }

  const total = await Coupon.countDocuments(query);
  const limit = 20;
  const totalPages = Math.max(
    1,
    Math.ceil(total / limit)
  );
  const resolvedPage = Math.min(safePage, totalPages);

  const coupons = await Coupon.find(query)
    .sort({ createdAt: -1 })
    .skip((resolvedPage - 1) * limit)
    .limit(limit)
    .lean();

  return {
    coupons,
    page: resolvedPage,
    limit,
    totalPages,
    total,
  };
}
