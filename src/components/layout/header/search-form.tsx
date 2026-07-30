"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { FormEvent } from "react";

import Input from "@/components/ui/input";

interface SearchFormProps {
  placeholder?: string;
  autoFocus?: boolean;
  onSubmitComplete?: () => void;
}

export default function SearchForm({
  placeholder = "Search products...",
  autoFocus,
  onSubmitComplete,
}: SearchFormProps) {
  const router = useRouter();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const value = (formData.get("search") as string)?.trim() ?? "";

    if (value) {
      router.push(`/products?search=${encodeURIComponent(value)}`);
    } else {
      router.push("/products");
    }

    onSubmitComplete?.();
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          name="search"
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-9"
          aria-label="Search products"
        />
      </div>
    </form>
  );
}
