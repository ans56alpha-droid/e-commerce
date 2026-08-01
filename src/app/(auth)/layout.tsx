import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full items-center justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
