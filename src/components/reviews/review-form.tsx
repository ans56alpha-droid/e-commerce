"use client";

import { useState, type FormEvent } from "react";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { cn } from "@/lib/cn";

import RatingStars from "./rating-stars";

export interface ReviewFormValues {
  rating: number;
  title: string;
  comment: string;
}

interface ReviewFormProps {
  className?: string;
}

const inputStyles =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary";

export default function ReviewForm({ className }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof ReviewFormValues, string>>
  >({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Partial<Record<keyof ReviewFormValues, string>> = {};

    if (rating < 1) {
      nextErrors.rating = "Please select a rating.";
    }

    if (!comment.trim()) {
      nextErrors.comment = "Please write a review.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    // Submission logic (React Hook Form + server action) will be wired here.
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn("space-y-5", className)}
    >
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
          onChange={setRating}
          label="Select your rating"
        />

        {errors.rating && (
          <p
            id="review-rating-error"
            role="alert"
            className="mt-1.5 text-sm text-destructive"
          >
            {errors.rating}
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
          name="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={100}
          placeholder="Summarize your experience"
        />
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
          name="comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={5}
          required
          maxLength={500}
          aria-invalid={errors.comment ? true : undefined}
          aria-describedby={errors.comment ? "review-comment-error" : undefined}
          placeholder="Share your experience with this product"
          className={cn(
            inputStyles,
            "min-h-28",
            errors.comment && "border-destructive focus:ring-destructive"
          )}
        />

        {errors.comment && (
          <p
            id="review-comment-error"
            role="alert"
            className="mt-1.5 text-sm text-destructive"
          >
            {errors.comment}
          </p>
        )}
      </div>

      <Button type="submit">Submit Review</Button>
    </form>
  );
}
