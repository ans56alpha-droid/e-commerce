"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { login } from "@/actions/auth/login";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import PasswordInput from "./password-input";
import TextField from "./text-field";

export default function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register: registerField,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submitting = isPending || isSubmitting;

  const onSubmit = handleSubmit((values) => {
    setServerError(null);

    startTransition(async () => {
      try {
        const result = await login(values);

        if (!result.success) {
          if (result.errors) {
            for (const [field, messages] of Object.entries(result.errors)) {
              setError(field as keyof LoginInput, {
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

        router.push("/");
        router.refresh();
      } catch {
        setServerError("Something went wrong. Please try again.");
      }
    });
  });

  return (
    <Card>
      <div className="mb-6 space-y-1.5 text-center sm:text-left">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground">Sign in to continue shopping.</p>
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
          placeholder="Enter your password"
          autoComplete="current-password"
          disabled={submitting}
        />

        <div className="flex justify-end">
          <Link
            href="#"
            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? (
            <>
              <Spinner />
              <span className="ml-2">Signing In...</span>
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Register
        </Link>
      </p>
    </Card>
  );
}
