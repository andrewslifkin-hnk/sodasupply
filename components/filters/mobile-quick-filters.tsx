"use client"

import { Button } from "@/components/ui/button"
import { useFilter } from "@/context/filter-context"
import { useI18n } from "@/context/i18n-context"
import { FilterType, type ActiveFilter } from "@/types/filter-types"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

/**
 * Mobile quick filters component
 * Displays horizontally scrollable quick filter buttons for common filter options
 */
export function MobileQuickFilters() {
  const { activeFilters, addFilter, removeFilter, categories } = useFilter()
  const { t } = useI18n()

  // Define quick filter options for popular brands and types
  const quickFilterOptions = [
    // Popular brands
    { id: "brand-olipop", label: "OLIPOP", category: "brand", value: "OLIPOP" },
    { id: "brand-poppi", label: "Poppi", category: "brand", value: "Poppi" },
    { id: "brand-boylan", label: "Boylan", category: "brand", value: "Boylan Bottling Co" },
    { id: "brand-bodyarmor", label: "BODYARMOR", category: "brand", value: "BODYARMOR" },
    
    // Popular types
    { id: "type-soda", label: t('product_types.Soda'), category: "type", value: "Soda" },
    { id: "type-craft-soda", label: t('product_types.Craft Soda'), category: "type", value: "Craft Soda" },
    { id: "type-sports", label: t('product_types.Sports Drink'), category: "type", value: "Sports Drink" },
    
    // Popular sizes
    { id: "size-12oz", label: "12 oz", category: "size", value: "12 fl oz" },
    { id: "size-16oz", label: "16 oz", category: "size", value: "16 fl oz" },
  ]

  // Check if a filter is active
  const isFilterActive = (option: typeof quickFilterOptions[0]) => {
    return activeFilters.some(
      filter => filter.category === option.category && filter.value === option.value
    )
  }

  // Toggle a quick filter
  const toggleQuickFilter = (option: typeof quickFilterOptions[0]) => {
    const isActive = isFilterActive(option)
    
    if (isActive) {
      // Remove the filter
      const existingFilter = activeFilters.find(
        filter => filter.category === option.category && filter.value === option.value
      )
      if (existingFilter) {
        removeFilter(existingFilter.id)
      }
    } else {
      // Add the filter
      const newFilter: ActiveFilter = {
        id: option.id,
        label: option.label,
        category: option.category,
        type: FilterType.CHECKBOX,
        value: option.value,
      }
      addFilter(newFilter)
    }
  }

  // Filter out quick filter options that don't have corresponding category data
  const availableQuickFilters = quickFilterOptions.filter(option => {
    const category = categories.find(cat => cat.id === option.category)
    if (!category?.options) return false
    
    return category.options.some(opt => opt.value === option.value)
  })

  if (availableQuickFilters.length === 0) {
    return null
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex w-max space-x-2 p-1">
        {availableQuickFilters.map((option) => {
          const isActive = isFilterActive(option)
          return (
            <Button
              key={option.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              className={`rounded-full whitespace-nowrap ${
                isActive 
                  ? "bg-black text-white hover:bg-gray-800" 
                  : "border-gray-300 text-[#202020] hover:bg-gray-50"
              }`}
              onClick={() => toggleQuickFilter(option)}
            >
              {option.label}
            </Button>
          )
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}