"use client"

import React from "react"
import { useFilter } from "@/context/filter-context"
import { FilterCategory as FilterCategoryComponent } from "./filter-category"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { FilterType, ToggleFilterOption } from "@/types/filter-types"
import type { FilterCategory } from "@/types/filter-types"
import { FilterToggle } from "./filter-toggle"
import { useI18n } from "@/context/i18n-context"

export function FilterSidebar() {
  const {
    categories,
    clearAllFilters,
    filteredProductCount,
    sortOption,
    setSortOption,
  } = useFilter()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { t } = useI18n()

  if (isMobile) return null

  // Extract availability and other categories
  const availabilityCategory = categories.find(c => c.id === "availability")
  const otherCategories = categories.filter(c => c.id !== "availability")
  const availabilityToggles = (availabilityCategory?.options as ToggleFilterOption[]) || []

  return (
    <aside className="w-72 min-w-[16rem] max-w-xs bg-white flex flex-col">
      {/* Sort by section */}
      <div className="py-4 border-b border-gray-200">
        <div className="flex items-center justify-between px-1 mb-4">
          <h3 className="text-lg font-medium">{t('filters.sort_by')}</h3>
        </div>
        <RadioGroup value={sortOption} onValueChange={value => setSortOption(value as any)}>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="featured" id="featured" />
              <Label htmlFor="featured">{t('filters.featured')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="price-low" id="price-low" />
              <Label htmlFor="price-low">{t('filters.price_low_to_high')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="price-high" id="price-high" />
              <Label htmlFor="price-high">{t('filters.price_high_to_low')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="newest" id="newest" />
              <Label htmlFor="newest">{t('filters.newest')}</Label>
            </div>
          </div>
        </RadioGroup>
      </div>
      {/* All filter categories, with compact spacing */}
      <div className="flex-1 overflow-y-auto space-y-3 mt-4">
        {/* Availability toggles next, with h3 for In stock and Returnable */}
        {availabilityToggles.map(option => (
          <div key={option.id} className="py-3 border-b border-gray-200 last:border-b-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium mb-0">{option.label}</h3>
              <FilterToggle option={option} hideLabel={true} />
            </div>
          </div>
        ))}
        {/* The rest of the filter categories */}
        {otherCategories.map(category => (
          <FilterCategoryComponent key={category.id} category={category} />
        ))}
      </div>
    </aside>
  )
} 