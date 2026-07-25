"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChangeEvent } from "react";

interface BrandFilterProps {
  brands: string[];
}

export default function BrandFilter({ brands }: BrandFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeBrand = searchParams.get("brand") ?? "";

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;

    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("brand", value);
    } else {
      params.delete("brand");
    }

    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <select
      value={activeBrand}
      onChange={handleChange}
      className="flex h-10 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
      aria-label="Filter by brand"
    >
      <option value="">All Brands</option>
      {brands.map((brand) => (
        <option key={brand} value={brand}>
          {brand}
        </option>
      ))}
    </select>
  );
}
