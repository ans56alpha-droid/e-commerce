import { Types } from "mongoose";

import { connectDB } from "@/db";
import Address from "@/models/Address";

import type { AddressType } from "@/models/Address";

export type CreateAddressInput = Omit<
  AddressType,
  "_id" | "createdAt" | "updatedAt"
>;

export async function createAddress(
  userId: string,
  data: CreateAddressInput
) {
  await connectDB();

  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const count = await Address.countDocuments({
    user: new Types.ObjectId(userId),
  });

  const isDefault = count === 0;

  const address = await Address.create({
    ...data,
    user: new Types.ObjectId(userId),
    isDefault: data.isDefault ?? isDefault,
  });

  if (address.isDefault) {
    await Address.updateMany(
      {
        user: new Types.ObjectId(userId),
        _id: { $ne: address._id },
      },
      { $set: { isDefault: false } }
    );
  }

  return address;
}

export async function updateAddress(
  userId: string,
  addressId: string,
  data: Partial<CreateAddressInput>
) {
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
  });

  if (!address) {
    throw new Error("Address not found");
  }

  if (data.isDefault) {
    await Address.updateMany(
      {
        user: new Types.ObjectId(userId),
        _id: { $ne: address._id },
      },
      { $set: { isDefault: false } }
    );
  }

  Object.assign(address, data);
  await address.save();

  return address;
}

export async function deleteAddress(
  userId: string,
  addressId: string
) {
  await connectDB();

  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  if (!Types.ObjectId.isValid(addressId)) {
    throw new Error("Invalid address ID");
  }

  const address = await Address.findOneAndDelete({
    _id: new Types.ObjectId(addressId),
    user: new Types.ObjectId(userId),
  });

  if (!address) {
    throw new Error("Address not found");
  }

  if (address.isDefault) {
    const next = await Address.findOne({
      user: new Types.ObjectId(userId),
    }).sort({ createdAt: -1 });

    if (next) {
      next.isDefault = true;
      await next.save();
    }
  }

  return address;
}

export async function setDefaultAddress(
  userId: string,
  addressId: string
) {
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
  });

  if (!address) {
    throw new Error("Address not found");
  }

  await Address.updateMany(
    {
      user: new Types.ObjectId(userId),
    },
    { $set: { isDefault: false } }
  );

  address.isDefault = true;
  await address.save();

  return address;
}
