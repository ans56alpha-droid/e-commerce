"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useController, type Control, type FieldValues, type Path } from "react-hook-form";

import { cn } from "@/lib/cn";
import Input from "@/components/ui/input";

interface PasswordInputProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
  error?: string;
}

export default function PasswordInput<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  disabled,
  autoComplete,
  error,
}: PasswordInputProps<TFieldValues>) {
  const [showPassword, setShowPassword] = useState(false);
  const { field, fieldState } = useController({ name, control });
  const errorMessage = error ?? fieldState.error?.message;

  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>

      <div className="relative">
        <Input
          {...field}
          id={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={fieldState.invalid}
          aria-describedby={errorMessage ? `${name}-error` : undefined}
          className={cn("pr-10", errorMessage && "border-destructive focus:ring-destructive")}
        />

        <button
          type="button"
          onClick={() => setShowPassword((show) => !show)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {errorMessage && (
        <p id={`${name}-error`} role="alert" className="mt-1.5 text-sm text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
