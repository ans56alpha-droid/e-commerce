"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";

import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

export default function PriceFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentMin = searchParams.get("minPrice") ?? "";
  const currentMax = searchParams.get("maxPrice") ?? "";

  const [minValue, setMinValue] = useState(currentMin);
  const [maxValue, setMaxValue] = useState(currentMax);
  const [error, setError] = useState("");

  function validate(min: string, max: string): boolean {
    if (min && Number(min) < 0) {
      setError("Price cannot be negative");
      return false;
    }

    if (max && Number(max) < 0) {
      setError("Price cannot be negative");
      return false;
    }

    if (min && max && Number(min) > Number(max)) {
      setError("Min price must be less than or equal to max price");
      return false;
    }

    setError("");
    return true;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validate(minValue, maxValue)) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (minValue) {
      params.set("minPrice", minValue);
    } else {
      params.delete("minPrice");
    }

    if (maxValue) {
      params.set("maxPrice", maxValue);
    } else {
      params.delete("maxPrice");
    }

    params.set("page", "1");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function handleClear() {
    setMinValue("");
    setMaxValue("");
    setError("");

    const params = new URLSearchParams(searchParams.toString());
    params.delete("minPrice");
    params.delete("maxPrice");
    params.set("page", "1");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="relative flex items-center gap-2">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            name="minPrice"
            value={minValue}
            onChange={(e) => {
              setMinValue(e.target.value);
              if (error) setError("");
            }}
            placeholder="Min"
            min="0"
            className="w-24"
            aria-label="Minimum price"
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            name="maxPrice"
            value={maxValue}
            onChange={(e) => {
              setMaxValue(e.target.value);
              if (error) setError("");
            }}
            placeholder="Max"
            min="0"
            className="w-24"
            aria-label="Maximum price"
          />
        </div>
        <Button type="submit" variant="secondary" disabled={isPending}>
          Apply
        </Button>
        <Button type="button" variant="ghost" onClick={handleClear} disabled={isPending}>
          Clear
        </Button>
      </form>
      {error && (
        <span className="absolute top-full left-0 z-10 mt-1 whitespace-nowrap rounded-md bg-red-800 px-3 py-1.5 text-sm text-destructive text-red-300 shadow-md ring-1 ring-destructive/20">
          {error}
        </span>
      )}
    </div>
  );
}
