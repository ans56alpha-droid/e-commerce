"use client";

import { useState, useCallback, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { useRouter } from "next/navigation";

export default function MobileSearch() {
  const [isSearchMode, setIsSearchMode] = useState(false);
  const router = useRouter();

  const openSearch = useCallback(() => {
    setIsSearchMode(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchMode(false);
  }, []);

  useEffect(() => {
    if (!isSearchMode) return;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") closeSearch();
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isSearchMode, closeSearch]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const value = (formData.get("search") as string)?.trim() ?? "";
    if (value) {
      router.push(`/products?search=${encodeURIComponent(value)}`);
    } else {
      router.push("/products");
    }
    closeSearch();
  }

  return (
    <>
      {/* Search icon - visible when NOT in search mode */}
      <Button
        aria-label="Search products"
        variant="ghost"
        size="icon"
        className={cn(
          "transition hover:scale-110 lg:hidden",
          isSearchMode && "invisible",
        )}
        onClick={openSearch}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </Button>

      {/* Expanding search bar - slides in from right when clicked */}
      <div
        className={cn(
          "absolute right-0 top-0 z-20 flex h-full items-center gap-1 bg-background px-1 lg:hidden",
          isSearchMode
            ? "w-full opacity-100"
            : "w-0 opacity-0 pointer-events-none",
          "transition-all duration-300 ease-in-out",
        )}
      >
        <Button
          aria-label="Close search"
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={closeSearch}
        >
          <ArrowLeft size={20} />
        </Button>
        <form onSubmit={handleSubmit} className="flex flex-1 items-center gap-1">
          <div className="relative flex-1">
            {isSearchMode && (
              <Input
                key="mobile-search-input"
                name="search"
                autoFocus
                placeholder="Search products..."
                className="w-full pr-2 pl-3"
                aria-label="Search products"
              />
            )}
          </div>
        </form>
      </div>
    </>
  );
}
