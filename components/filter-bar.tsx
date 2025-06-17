"use client"

import { Button } from "@/components/ui/button"
import { SlidersHorizontal, X } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { useFilter, type SortOption } from "@/context/filter-context"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useI18n } from "@/context/i18n-context"

export function FilterBar() {
  const {
    isFilterSheetOpen,
    openFilterSheet,
    closeFilterSheet,
    activeFilters,
    clearAllFilters,
    sortOption,
    setSortOption,
    totalActiveFilters,
    removeFilter
  } = useFilter()
  const { t } = useI18n()
  const isMobile = useMediaQuery("(max-width: 768px)")

  const handleSortChange = (value: string) => {
    setSortOption(value as SortOption)
  }

  // Active filter tags component
  const FilterTags = () => {
    if (activeFilters.length === 0) return null

    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {activeFilters.map((filter) => (
          <Badge 
            key={filter.id} 
            variant="secondary" 
            className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full"
          >
            {filter.label}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 ml-1 hover:bg-gray-200 rounded-full"
              onClick={() => removeFilter(filter.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-800 px-2 py-1 h-auto"
          onClick={clearAllFilters}
        >
          {t('filters.clear_all_filters')}
        </Button>
      </div>
    )
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        {isMobile ? (
          // Mobile filter button
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-[#202020] rounded-full border-gray-300"
            onClick={openFilterSheet}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>{t('common.filter_products')}</span>
            {totalActiveFilters > 0 && (
              <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full bg-black text-white text-xs">
                {totalActiveFilters}
              </Badge>
            )}
          </Button>
        ) : (
          // Desktop filter button
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-[#202020] rounded-full border-gray-300"
            onClick={openFilterSheet}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>{t('common.filter_products')}</span>
            {totalActiveFilters > 0 && (
              <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full bg-black text-white text-xs">
                {totalActiveFilters}
              </Badge>
            )}
          </Button>
        )}

        {/* Desktop sort dropdown */}
        {!isMobile && (
          <div className="w-[220px]">
            <Select value={sortOption} onValueChange={handleSortChange}>
              <SelectTrigger className="rounded-full border-gray-300">
                <SelectValue placeholder={t('common.sort_by')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">{t('common.featured')}</SelectItem>
                <SelectItem value="price-low">{t('common.price_low_to_high')}</SelectItem>
                <SelectItem value="price-high">{t('common.price_high_to_low')}</SelectItem>
                <SelectItem value="newest">{t('common.newest')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Filter tags */}
      <FilterTags />

      {/* Filter sheet - simplified placeholder */}
      <Sheet open={isFilterSheetOpen} onOpenChange={closeFilterSheet}>
        <SheetContent side="left" className="w-[400px] sm:w-[500px] p-0">
          <SheetHeader className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg font-semibold">{t('common.filter_products')}</SheetTitle>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>
          
          <div className="px-6 pt-4 h-full">
            <p className="text-gray-600">{t('common.filter_functionality_coming_soon')}</p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
