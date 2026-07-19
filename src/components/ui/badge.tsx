import { cn } from "@/lib/cn";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
