"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import {
  createAddress as createAddressService,
  updateAddress as updateAddressService,
  deleteAddress as deleteAddressService,
  setDefaultAddress as setDefaultAddressService,
  getUserAddresses as getUserAddressesService,
} from "@/services/address";
import { addressSchema } from "@/lib/validations/address";

import type { ActionResult } from "@/types/action";
import type { CreateAddressInput } from "@/services/address";
import type { AddressInput } from "@/lib/validations/address";

export async function getAddressesAction() {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false as const, message: "Unauthorized", addresses: [] };
  }

  try {
    const addresses = await getUserAddressesService(
      session.user.id
    );

    return {
      success: true as const,
      addresses,
    };
  } catch {
    return {
      success: false as const,
      message: "Failed to load addresses",
      addresses: [],
    };
  }
}

export async function createAddressAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  const raw: AddressInput = {
    name: formData.get("name") as string,
    phone: formData.get("phone") as string,
    address: formData.get("address") as string,
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    postalCode: formData.get("postalCode") as string,
    country: formData.get("country") as string,
    isDefault: formData.get("isDefault") === "true",
  };

  const parsed = addressSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid address data",
    };
  }

  try {
    await createAddressService(session.user.id, parsed.data as CreateAddressInput);

    revalidatePath("/account/addresses");

    return { success: true, message: "Address created" };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create address",
    };
  }
}

export async function updateAddressAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  const addressId = formData.get("addressId") as string;

  if (!addressId) {
    return { success: false, message: "Address ID required" };
  }

  const raw: AddressInput = {
    name: formData.get("name") as string,
    phone: formData.get("phone") as string,
    address: formData.get("address") as string,
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    postalCode: formData.get("postalCode") as string,
    country: formData.get("country") as string,
    isDefault: formData.get("isDefault") === "true",
  };

  const parsed = addressSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid address data",
    };
  }

  try {
    await updateAddressService(
      session.user.id,
      addressId,
      parsed.data
    );

    revalidatePath("/account/addresses");

    return { success: true, message: "Address updated" };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update address",
    };
  }
}

export async function deleteAddressAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  const addressId = formData.get("addressId") as string;

  if (!addressId) {
    return { success: false, message: "Address ID required" };
  }

  try {
    await deleteAddressService(session.user.id, addressId);

    revalidatePath("/account/addresses");

    return { success: true, message: "Address deleted" };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete address",
    };
  }
}

export async function setDefaultAddressAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  const addressId = formData.get("addressId") as string;

  if (!addressId) {
    return { success: false, message: "Address ID required" };
  }

  try {
    await setDefaultAddressService(
      session.user.id,
      addressId
    );

    revalidatePath("/account/addresses");

    return { success: true, message: "Default address set" };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to set default address",
    };
  }
}
