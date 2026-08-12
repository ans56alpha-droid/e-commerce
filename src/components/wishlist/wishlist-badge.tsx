interface WishlistBadgeProps {
  count: number;
}

export default function WishlistBadge({ count }: WishlistBadgeProps) {
  if (count <= 0) {
    return null;
  }

  return (
    <span className="absolute -right-2 -top-3 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-xs font-medium text-primary-foreground">
      {count > 99 ? "99+" : count}
    </span>
  );
}
