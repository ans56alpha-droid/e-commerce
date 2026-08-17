"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import Button from "@/components/ui/button";
import type { ActionResult } from "@/types/action";

type ConfirmActionFn = (
  prevState: ActionResult,
  formData: FormData
) => Promise<ActionResult>;

interface ConfirmActionProps {
  action: ConfirmActionFn;
  fields?: { name: string; value: string }[];
  confirmLabel?: string;
  confirmMessage: string;
  variant?: "primary" | "destructive";
}

export default function ConfirmAction({
  action,
  fields = [],
  confirmLabel = "Yes, confirm",
  confirmMessage,
  variant = "destructive",
}: ConfirmActionProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    { success: false }
  );

  if (state.success) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        {confirmMessage}
      </p>

      <div className="flex gap-2">
        <form action={formAction}>
          {fields.map((f) => (
            <input
              key={f.name}
              type="hidden"
              name={f.name}
              value={f.value}
            />
          ))}

          <Button
            type="submit"
            variant={variant}
            size="sm"
            disabled={isPending}
          >
            {isPending && (
              <Loader2 className="mr-1.5 inline h-4 w-4 animate-spin" />
            )}
            {isPending ? "Processing…" : confirmLabel}
          </Button>
        </form>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
        >
          Go back
        </Button>
      </div>

      {state.message && (
        <p className="text-sm text-destructive">
          {state.message}
        </p>
      )}
    </div>
  );
}
