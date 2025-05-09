"use client"

import { ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFilter } from "@/context/filter-context"
import { type FilterCategory as FilterCategoryType, FilterType } from "@/types/filter-types"
import { FilterCheckbox } from "./filter-checkbox"
import { FilterRadioGroup } from "./filter-radio"
import { FilterRange } from "./filter-range"
import { FilterToggle } from "./filter-toggle"

interface FilterCategoryProps {
  category: FilterCategoryType
}

/**
 * Filter category component
 * Groups related filters and provides expand/collapse functionality
 */
export function FilterCategory({ category }: FilterCategoryProps) {
  const { toggleCategoryExpansion, clearCategoryFilters, getActiveFiltersByCategory } = useFilter()

  const activeCount = getActiveFiltersByCategory(category.id).length

  // Render the appropriate filter components based on category type
  const renderFilterOptions = () => {
    if (!category.options || !category.isExpanded) {
      return null
    }

    switch (category.type) {
      case FilterType.CHECKBOX:
        return (
          <div className="space-y-3">
            {category.options.map((option) => (
              <FilterCheckbox key={option.id} option={option} />
            ))}
          </div>
        )

      case FilterType.RADIO:
        // Group radio options by their groupId
        const radioGroups: Record<string, typeof category.options> = {}
        category.options.forEach((option) => {
          const groupId = (option as any).groupId || "default"
          if (!radioGroups[groupId]) {
            radioGroups[groupId] = []
          }
          radioGroups[groupId].push(option)
        })

        return (
          <div className="space-y-6">
            {Object.entries(radioGroups).map(([groupId, options]) => (
              <FilterRadioGroup
                key={groupId}
                options={options}
                groupId={groupId}
                groupLabel={groupId === "default" ? category.label : groupId}
              />
            ))}
          </div>
        )

      case FilterType.RANGE:
        return (
          <div className="space-y-3">
            {category.options.map((option) => (
              <FilterRange key={option.id} option={option} />
            ))}
          </div>
        )

      case FilterType.TOGGLE:
        return (
          <div className="space-y-3">
            {category.options.map((option) => (
              <FilterToggle key={option.id} option={option} />
            ))}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="py-4 border-b border-gray-200">
      <div className="flex items-center justify-between px-1 mb-4">
        <h3 className="text-lg font-medium">{category.label}</h3>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-gray-500 hover:text-black"
              onClick={() => clearCategoryFilters(category.id)}
            >
              Clear {activeCount}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => toggleCategoryExpansion(category.id)}
          >
            {category.isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </Button>
        </div>
      </div>

      {renderFilterOptions()}
    </div>
  )
}
