interface CartBadgeProps {
  count: number;
}

export default function CartBadge({ count }: CartBadgeProps) {
  if (count <= 0) {
    return null;
  }

  return (
    <span className="absolute -right-2 -top-3 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-primary px-0.5 text-[9px] font-medium leading-none text-primary-foreground sm:-right-0.5 sm:-top-0.5 sm:h-4 sm:min-w-4 sm:px-1 sm:text-xs">
      {count > 99 ? "99+" : count}
    </span>
  );
}
