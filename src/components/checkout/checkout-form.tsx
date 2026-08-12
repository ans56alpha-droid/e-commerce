"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { checkoutSchema, type CheckoutInput } from "@/lib/validations/checkout";

import { checkoutAction } from "@/actions/checkout";

export default function CheckoutForm() {
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Pakistan",
    },
  });

  async function onSubmit(data: CheckoutInput) {
    setServerError("");

    const result = await checkoutAction({
      name: data.name,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country,
    });

    if (!result.success) {
      setServerError(result.message);
      return;
    }

    if (result.orderId) {
      router.push(`/orders/${result.orderId}`);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Shipping Information</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Enter the address where you want your order delivered.
        </p>
      </div>

      {serverError && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {serverError}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Full Name
          </label>

          <input
            id="name"
            {...register("name")}
            className="w-full rounded-md border px-3 py-2"
            placeholder="John Doe"
          />

          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>

          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full rounded-md border px-3 py-2"
            placeholder="john@example.com"
          />

          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">
          Phone
        </label>

        <input
          id="phone"
          type="tel"
          {...register("phone")}
          className="w-full rounded-md border px-3 py-2"
          placeholder="+92 300 1234567"
        />

        {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="address" className="text-sm font-medium">
          Address
        </label>

        <textarea
          id="address"
          {...register("address")}
          rows={3}
          className="w-full rounded-md border px-3 py-2"
          placeholder="Street address, house number..."
        />

        {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="city" className="text-sm font-medium">
            City
          </label>

          <input
            id="city"
            {...register("city")}
            className="w-full rounded-md border px-3 py-2"
            placeholder="Lahore"
          />

          {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="state" className="text-sm font-medium">
            State / Province
          </label>

          <input
            id="state"
            {...register("state")}
            className="w-full rounded-md border px-3 py-2"
            placeholder="Punjab"
          />

          {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="postalCode" className="text-sm font-medium">
            Postal Code
          </label>

          <input
            id="postalCode"
            {...register("postalCode")}
            className="w-full rounded-md border px-3 py-2"
            placeholder="54000"
          />

          {errors.postalCode && (
            <p className="text-sm text-destructive">{errors.postalCode.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="country" className="text-sm font-medium">
            Country
          </label>

          <input
            id="country"
            {...register("country")}
            className="w-full rounded-md border px-3 py-2"
          />

          {errors.country && <p className="text-sm text-destructive">{errors.country.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-primary px-4 py-3 font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Processing..." : "Place Order"}
      </button>
    </form>
  );
}
