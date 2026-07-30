import SearchBox from "./search-box";
import SortSelect from "./sort-select";
import CategoryFilter from "./category-filter";
import BrandFilter from "./brand-filter";
import PriceFilter from "./price-filter";

import type { CategoryOption } from "@/types/category";

interface ProductToolbarProps {
  categories: CategoryOption[];
  brands: string[];
}

export default function ProductToolbar({ categories, brands }: ProductToolbarProps) {
  return (
    <div className="mb-10 flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center">
      <SearchBox />
      <CategoryFilter categories={categories} />
      <BrandFilter brands={brands} />
      <PriceFilter />
      <SortSelect />
    </div>
  );
}
