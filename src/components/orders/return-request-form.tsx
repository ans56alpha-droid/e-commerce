"use client";

import { useState, useActionState } from "react";
import { Loader2 } from "lucide-react";

import { createReturnRequestAction } from "@/actions/return";
import Button from "@/components/ui/button";

interface ReturnRequestFormProps {
  orderId: string;
}

export default function ReturnRequestForm({ orderId }: ReturnRequestFormProps) {
  const [showForm, setShowForm] = useState(false);

  const [state, formAction, isPending] = useActionState(
    createReturnRequestAction,
    { success: false }
  );

  if (state.success) {
    return (
      <div className="rounded-md border border-green-200 bg-green-50 p-4">
        <p className="text-sm font-medium text-green-800">
          Return request submitted successfully.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-dashed border-border p-4">
      {!showForm ? (
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Need to return this order?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              You can request a return for delivered orders.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
            Request Return
          </Button>
        </div>
      ) : (
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="orderId" value={orderId} />

          <div>
            <label htmlFor="reason" className="mb-1.5 block text-sm font-medium">
              Reason for return
            </label>
            <textarea
              id="reason"
              name="reason"
              rows={3}
              required
              minLength={10}
              maxLength={500}
              placeholder="Please describe why you want to return this order..."
              disabled={isPending}
              className="flex w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {state.message && !state.success && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}

          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending && <Loader2 className="mr-1.5 inline h-4 w-4 animate-spin" />}
              {isPending ? "Submitting..." : "Submit Request"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowForm(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
