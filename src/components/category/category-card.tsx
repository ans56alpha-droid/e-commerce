import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Card from "@/components/ui/card";
import type { Category } from "@/types/category";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`}>
      <Card className="group overflow-hidden p-0 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        <div className="space-y-2 p-5">
          <h3 className="text-lg font-semibold">{category.name}</h3>

          {category.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {category.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-muted-foreground">
              {category.productCount}{" "}
              {category.productCount === 1 ? "Product" : "Products"}
            </span>

            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              Shop Now
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
