import Link from "next/link";
import { PackageSearch } from "lucide-react";

import Button from "@/components/ui/button";

interface NotFoundStateProps {
  title?: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}

export default function NotFoundState({
  title = "Page not found",
  description = "The page you are looking for doesn't exist or has been removed.",
  actionHref = "/products",
  actionLabel = "Back to Shop",
}: NotFoundStateProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <PackageSearch className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
      </div>

      <h1 className="mt-6 text-3xl font-bold">{title}</h1>
      <p className="mt-2 max-w-md text-muted-foreground">{description}</p>

      <Button asChild size="lg" className="mt-8">
        <Link href={actionHref}>{actionLabel}</Link>
      </Button>
    </div>
  );
}
