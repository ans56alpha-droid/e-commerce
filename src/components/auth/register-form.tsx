"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { register } from "@/actions/auth/register";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import PasswordInput from "./password-input";
import TextField from "./text-field";

export default function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register: registerField,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const submitting = isPending || isSubmitting;

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const result = await register(values);

      if (!result.success) {
        if (result.errors) {
          for (const [field, messages] of Object.entries(result.errors)) {
            setError(field as keyof RegisterInput, {
              type: "server",
              message: messages?.[0] ?? "Invalid value.",
            });
          }
        }

        if (result.message) {
          setServerError(result.message);
        }
        return;
      }

      reset();
      setSuccessMessage("Your account has been created. Redirecting to the home page...");
    });
  });

  useEffect(() => {
    if (!successMessage) return;

    const timer = window.setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [successMessage, router]);

  return (
    <Card>
      <div className="mb-6 space-y-1.5 text-center sm:text-left">
        <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="text-muted-foreground">Join alphaShop to start shopping.</p>
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {serverError && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {serverError}
          </div>
        )}

        <TextField
          id="name"
          label="Full Name"
          type="text"
          placeholder="John Doe"
          autoComplete="name"
          required
          disabled={submitting}
          error={errors.name?.message}
          registerReturn={registerField("name")}
        />

        <TextField
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          inputMode="email"
          required
          disabled={submitting}
          error={errors.email?.message}
          registerReturn={registerField("email")}
        />

        <PasswordInput
          name="password"
          control={control}
          label="Password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          disabled={submitting}
        />

        <PasswordInput
          name="confirmPassword"
          control={control}
          label="Confirm Password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          disabled={submitting}
        />

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? (
            <>
              <Spinner />
              <span className="ml-2">Creating Account...</span>
            </>
          ) : (
            "Create Account"
          )}
        </Button>

        {successMessage && (
          <p
            role="status"
            className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400"
          >
            {successMessage}
          </p>
        )}
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </Card>
  );
}
