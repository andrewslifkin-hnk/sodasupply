import { FilterTags } from "./filter-tags"

export function PLPQuickFiltersRow() {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-2 px-1 min-h-[40px]">
      <div className="flex-1 min-w-0">
        <FilterTags />
      </div>
      <div className="ml-4 whitespace-nowrap text-sm text-[#202020]/80">
        Distributor: <span className="font-medium underline underline-offset-4 decoration-black/30 hover:decoration-black transition-all cursor-pointer">Atlas Beverages</span>
      </div>
    </div>
  )
} 