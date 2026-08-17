import Image from "next/image";
import Link from "next/link";

import Card from "@/components/ui/card";
import type { Category } from "@/types/category";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`}>
      <Card className="group overflow-hidden p-0 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg hover:scale-105">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        <div className="space-y-2 p-5">
          <h3 className="text-lg font-semibold">{category.name}</h3>

          <p className="text-sm text-muted-foreground">{category.productCount} Products</p>
        </div>
      </Card>
    </Link>
  );
}
