import SearchBox from "./search-box";
import SortSelect from "./sort-select";
import CategoryFilter from "./category-filter";
import BrandFilter from "./brand-filter";
import PriceFilter from "./price-filter";

export default function ProductToolbar() {
  return (
    <div className="mb-10 flex flex-wrap items-center gap-4">
      <SearchBox />
      <CategoryFilter />
      <BrandFilter />
      <PriceFilter />
      <SortSelect />
    </div>
  );
}
