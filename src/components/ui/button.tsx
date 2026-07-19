import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { cva, type VariantProps } from "class-variance-authority";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "destructive";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:opacity-90",

        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",

        outline: "border border-border bg-background hover:bg-muted",

        ghost: "hover:bg-muted",

        destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
      },

      size: {
        sm: "h-9 px-3",

        md: "h-10 px-4",

        lg: "h-11 px-8",

        icon: "h-10 w-10",
      },
    },

    defaultVariants: {
      variant: "primary",

      size: "md",
    },
  },
);

export default function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",

        variant === "primary" && "bg-primary text-primary-foreground hover:opacity-90",

        variant === "secondary" && "bg-secondary text-secondary-foreground",

        variant === "outline" && "border border-border",

        variant === "ghost" && "hover:bg-muted",

        variant === "destructive" && "bg-destructive text-destructive-foreground",

        className,
      )}
      {...props}
    />
  );
}
