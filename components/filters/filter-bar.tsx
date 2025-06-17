"use client"

import { SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFilter, type SortOption } from "@/context/filter-context"
import { useMediaQuery } from "@/hooks/use-media-query"
import { FilterTags } from "./filter-tags"
import { useI18n } from "@/context/i18n-context"

/**
 * Filter bar component
 * Displays filter button, sort dropdown, and active filter tags
 */
export function FilterBar() {
  const { 
    totalActiveFilters, 
    openFilterSheet, 
    sortOption, 
    setSortOption,
    staticSidebarEnabled 
  } = useFilter()
  const { t } = useI18n()
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Handle sort option change
  const handleSortChange = (value: SortOption) => {
    setSortOption(value)
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        {/* Filter button */}
        {!staticSidebarEnabled && (
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

        {/* Sort dropdown (desktop only) */}
        {!staticSidebarEnabled && !isMobile && (
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
    </div>
  )
}
