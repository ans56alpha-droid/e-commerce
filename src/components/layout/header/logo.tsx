import Link from "next/link";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={className ?? "text-2xl font-bold"}>
      AlphaShop
    </Link>
  );
}
