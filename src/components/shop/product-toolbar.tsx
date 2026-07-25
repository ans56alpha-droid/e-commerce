import SearchBox from "./search-box";
import SortSelect from "./sort-select";
import CategoryFilter from "./category-filter";
import BrandFilter from "./brand-filter";
import PriceFilter from "./price-filter";

import type { CategoryOption } from "@/types/category";

interface ProductToolbarProps {
  categories: CategoryOption[];
}

export default function ProductToolbar({ categories }: ProductToolbarProps) {
  return (
    <div className="mb-10 flex flex-wrap items-center gap-4">
      <SearchBox />
      <CategoryFilter categories={categories} />
      <BrandFilter />
      <PriceFilter />
      <SortSelect />
    </div>
  );
}
