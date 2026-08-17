import { Types } from "mongoose";

import { connectDB } from "@/db";
import Coupon from "@/models/Coupon";

import type { CouponType } from "@/models/Coupon";

export type CreateCouponInput = Omit<
  CouponType,
  "_id" | "createdAt" | "updatedAt" | "usedCount"
>;

export async function createCoupon(
  data: CreateCouponInput
) {
  await connectDB();

  const existing = await Coupon.findOne({
    code: data.code.toUpperCase().trim(),
  });

  if (existing) {
    throw new Error(
      "A coupon with this code already exists"
    );
  }

  if (data.discountType === "percentage" && data.discountValue > 100) {
    throw new Error(
      "Percentage discount cannot exceed 100%"
    );
  }

  if (data.startDate >= data.endDate) {
    throw new Error(
      "End date must be after start date"
    );
  }

  return Coupon.create({
    ...data,
    code: data.code.toUpperCase().trim(),
  });
}

export async function updateCoupon(
  couponId: string,
  data: Partial<CreateCouponInput>
) {
  await connectDB();

  if (!Types.ObjectId.isValid(couponId)) {
    throw new Error("Invalid coupon ID");
  }

  const coupon = await Coupon.findById(
    new Types.ObjectId(couponId)
  );

  if (!coupon) {
    throw new Error("Coupon not found");
  }

  if (data.code && data.code !== coupon.code) {
    const existing = await Coupon.findOne({
      code: data.code.toUpperCase().trim(),
      _id: { $ne: coupon._id },
    });

    if (existing) {
      throw new Error(
        "A coupon with this code already exists"
      );
    }
  }

  if (
    data.discountType === "percentage" &&
    data.discountValue &&
    data.discountValue > 100
  ) {
    throw new Error(
      "Percentage discount cannot exceed 100%"
    );
  }

  if (data.startDate && data.endDate && data.startDate >= data.endDate) {
    throw new Error(
      "End date must be after start date"
    );
  }

  Object.assign(coupon, data);

  if (data.code) {
    coupon.code = data.code.toUpperCase().trim();
  }

  await coupon.save();

  return coupon;
}

export async function deleteCoupon(couponId: string) {
  await connectDB();

  if (!Types.ObjectId.isValid(couponId)) {
    throw new Error("Invalid coupon ID");
  }

  const coupon = await Coupon.findByIdAndDelete(
    new Types.ObjectId(couponId)
  );

  if (!coupon) {
    throw new Error("Coupon not found");
  }

  return coupon;
}

export async function incrementCouponUsage(
  couponId: string
) {
  await connectDB();

  if (!Types.ObjectId.isValid(couponId)) {
    throw new Error("Invalid coupon ID");
  }

  await Coupon.updateOne(
    { _id: new Types.ObjectId(couponId) },
    { $inc: { usedCount: 1 } }
  );
}
