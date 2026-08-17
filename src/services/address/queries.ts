import { Types } from "mongoose";

import { connectDB } from "@/db";
import Address from "@/models/Address";

import type { AddressType } from "@/models/Address";

export type LeanAddress = AddressType & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export async function getUserAddresses(
  userId: string
): Promise<LeanAddress[]> {
  await connectDB();

  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  return Address.find({
    user: new Types.ObjectId(userId),
  })
    .sort({ isDefault: -1, createdAt: -1 })
    .lean();
}

export async function getAddressById(
  userId: string,
  addressId: string
): Promise<LeanAddress> {
  await connectDB();

  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  if (!Types.ObjectId.isValid(addressId)) {
    throw new Error("Invalid address ID");
  }

  const address = await Address.findOne({
    _id: new Types.ObjectId(addressId),
    user: new Types.ObjectId(userId),
  }).lean();

  if (!address) {
    throw new Error("Address not found");
  }

  return address;
}
