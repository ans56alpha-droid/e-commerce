"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { createReviewAction } from "@/actions/review/create-review";
import {
  createReviewSchema,
  type CreateReviewInput,
} from "@/lib/validations/review";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import { cn } from "@/lib/cn";

import RatingStars from "./rating-stars";

interface ReviewFormProps {
  productId: string;
  className?: string;
}

const inputStyles =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary";

export default function ReviewForm({
  productId,
  className,
}: ReviewFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateReviewInput>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      rating: 0,
      title: "",
      comment: "",
    },
  });

  const rating = useWatch({ control, name: "rating" });

  const submitting = isPending || isSubmitting;

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      try {
        const result = await createReviewAction(productId, values);

        if (!result.success) {
          if (result.errors) {
            for (const [field, messages] of Object.entries(result.errors)) {
              setError(field as keyof CreateReviewInput, {
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
        setSuccessMessage(
          result.message ?? "Your review has been published. Thank you!"
        );
        router.refresh();
      } catch {
        setServerError("Something went wrong. Please try again.");
      }
    });
  });

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={cn("space-y-5", className)}
    >
      {serverError && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {serverError}
        </div>
      )}

      {successMessage && (
        <p
          role="status"
          className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400"
        >
          {successMessage}
        </p>
      )}

      <fieldset
        aria-describedby={errors.rating ? "review-rating-error" : undefined}
      >
        <legend className="mb-1.5 text-sm font-medium">
          Rating <span className="text-destructive">*</span>
        </legend>

        <RatingStars
          value={rating}
          readOnly={false}
          name="rating"
          size={28}
          onChange={(value) =>
            setValue("rating", value, { shouldValidate: true })
          }
          label="Select your rating"
        />

        {errors.rating && (
          <p
            id="review-rating-error"
            role="alert"
            className="mt-1.5 text-sm text-destructive"
          >
            {errors.rating.message}
          </p>
        )}
      </fieldset>

      <div>
        <label
          htmlFor="review-title"
          className="mb-1.5 block text-sm font-medium"
        >
          Title <span className="text-muted-foreground">(optional)</span>
        </label>

        <Input
          id="review-title"
          type="text"
          placeholder="Summarize your experience"
          maxLength={100}
          disabled={submitting}
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={errors.title ? "review-title-error" : undefined}
          {...register("title")}
        />

        {errors.title && (
          <p
            id="review-title-error"
            role="alert"
            className="mt-1.5 text-sm text-destructive"
          >
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="review-comment"
          className="mb-1.5 block text-sm font-medium"
        >
          Review <span className="text-destructive">*</span>
        </label>

        <textarea
          id="review-comment"
          rows={5}
          required
          maxLength={500}
          placeholder="Share your experience with this product"
          disabled={submitting}
          aria-invalid={errors.comment ? true : undefined}
          aria-describedby={errors.comment ? "review-comment-error" : undefined}
          className={cn(
            inputStyles,
            "min-h-28",
            errors.comment && "border-destructive focus:ring-destructive"
          )}
          {...register("comment")}
        />

        {errors.comment && (
          <p
            id="review-comment-error"
            role="alert"
            className="mt-1.5 text-sm text-destructive"
          >
            {errors.comment.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? (
          <>
            <Spinner />
            <span className="ml-2">Submitting...</span>
          </>
        ) : (
          "Submit Review"
        )}
      </Button>
    </form>
  );
}
