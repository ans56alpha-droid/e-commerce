"use client";

import { useState } from "react";
import Image from "next/image";

import { ProductDetails } from "@/types/product";
import { cn } from "@/lib/cn";

interface ProductGalleryProps {
  images: ProductDetails["images"];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const primaryIndex = images.findIndex((img) => img.isPrimary);
  const [activeIndex, setActiveIndex] = useState(
    primaryIndex >= 0 ? primaryIndex : 0,
  );

  const active = images[activeIndex];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-muted">
        {active && (
          <Image
            src={active.url}
            alt={active.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
            priority
          />
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative h-20 w-20 overflow-hidden rounded-lg border-2 transition-colors",
                i === activeIndex
                  ? "border-primary"
                  : "border-border hover:border-muted-foreground/50",
              )}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
