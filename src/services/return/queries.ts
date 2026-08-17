import { Types } from "mongoose";

import { connectDB } from "@/db";
import ReturnRequest from "@/models/ReturnRequest";

import type { ReturnRequestType } from "@/models/ReturnRequest";

type LeanReturnRequest = ReturnRequestType & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export async function getUserReturnRequests(
  userId: string
): Promise<LeanReturnRequest[]> {
  await connectDB();

  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  return ReturnRequest.find({
    user: new Types.ObjectId(userId),
  })
    .populate("order", "orderNumber total")
    .sort({ createdAt: -1 })
    .lean();
}

export async function getReturnRequestById(
  requestId: string
): Promise<LeanReturnRequest> {
  await connectDB();

  if (!Types.ObjectId.isValid(requestId)) {
    throw new Error("Invalid request ID");
  }

  const request = await ReturnRequest.findById(
    new Types.ObjectId(requestId)
  )
    .populate("order", "orderNumber total items")
    .populate("user", "name email")
    .lean();

  if (!request) {
    throw new Error("Return request not found");
  }

  return request;
}

export async function getAllReturnRequests(
  page = 1,
  status?: string
) {
  await connectDB();

  const safePage =
    Number.isInteger(page) && page > 0 ? page : 1;

  const query: Record<string, unknown> = {};

  if (status) {
    query.status = status;
  }

  const total = await ReturnRequest.countDocuments(query);
  const limit = 20;
  const totalPages = Math.max(
    1,
    Math.ceil(total / limit)
  );
  const resolvedPage = Math.min(safePage, totalPages);

  const requests = await ReturnRequest.find(query)
    .populate("order", "orderNumber total")
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .skip((resolvedPage - 1) * limit)
    .limit(limit)
    .lean();

  return {
    requests,
    page: resolvedPage,
    limit,
    totalPages,
    total,
  };
}
