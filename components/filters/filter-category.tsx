"use client"

import { ChevronUp, ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFilter } from "@/context/filter-context"
import { type FilterCategory as FilterCategoryType, FilterType, CheckboxFilterOption, ToggleFilterOption, RadioFilterOption, RangeFilterOption, FilterOption } from "@/types/filter-types"
import { FilterCheckbox } from "./filter-checkbox"
import { FilterRadioGroup } from "./filter-radio"
import { FilterRange } from "./filter-range"
import { FilterToggle } from "./filter-toggle"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { useI18n } from "@/context/i18n-context"

interface FilterCategoryProps {
  category: FilterCategoryType
}

/**
 * Filter category component
 * Groups related filters and provides expand/collapse functionality
 */
export function FilterCategory({ category }: FilterCategoryProps) {
  const { toggleCategoryExpansion, clearCategoryFilters, getActiveFiltersByCategory } = useFilter()
  const [showAll, setShowAll] = useState(false)
  const [search, setSearch] = useState("")
  const { t } = useI18n()

  const activeCount = getActiveFiltersByCategory(category.id).length

  // Type guards
  function isCheckboxOption(option: FilterOption): option is CheckboxFilterOption {
    return option.type === FilterType.CHECKBOX
  }
  function isToggleOption(option: FilterOption): option is ToggleFilterOption {
    return option.type === FilterType.TOGGLE
  }
  function isRadioOption(option: FilterOption): option is RadioFilterOption {
    return option.type === FilterType.RADIO
  }
  function isRangeOption(option: FilterOption): option is RangeFilterOption {
    return option.type === FilterType.RANGE
  }

  // Filter options based on search
  const filteredOptions = category.options?.filter((option) => {
    if (!search.trim()) return true

    // For brand group, filter by search
    const searchTerm = search.toLowerCase()
    if (category.id === "brand" && search.trim()) {
      return option.label.toLowerCase().includes(searchTerm)
    }

    return option.label.toLowerCase().includes(searchTerm)
  })

  // Get translated label - check if it's a translation key or direct text
  const getTranslatedLabel = (label: string) => {
    if (label.includes('.')) {
      // It's a translation key
      return t(label as any)
    }
    return label
  }

  // Render the appropriate filter components based on category type
  const renderFilterOptions = () => {
    if (!category.options || !category.isExpanded) {
      return null
    }

    const maxToShow = 5
    const visibleOptions = showAll ? filteredOptions : filteredOptions?.slice(0, maxToShow)
    const filteredHasMore = (filteredOptions?.length || 0) > maxToShow

    switch (category.type) {
      case FilterType.CHECKBOX:
        return (
          <div className="space-y-3">
            {/* Brand search input */}
            {category.id === "brand" && (
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={t('filters.search_brands')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-9 text-sm"
                />
              </div>
            )}
            {visibleOptions?.filter(isCheckboxOption).map((option) => (
              <FilterCheckbox key={option.id} option={option} />
            ))}
            {filteredHasMore && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                type="button"
              >
                {showAll ? "View less" : `View ${(filteredOptions?.length || 0) - maxToShow} more`}
              </button>
            )}
          </div>
        )
      case FilterType.TOGGLE:
        return (
          <div className="space-y-3">
            {visibleOptions?.filter(isToggleOption).map((option) => (
              <FilterToggle key={option.id} option={option} />
            ))}
            {filteredHasMore && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                type="button"
              >
                {showAll ? "View less" : `View ${(filteredOptions?.length || 0) - maxToShow} more`}
              </button>
            )}
          </div>
        )
      case FilterType.RADIO:
        // Group radio options by their groupId
        const radioGroups: Record<string, RadioFilterOption[]> = {}
        category.options.filter(isRadioOption).forEach((option) => {
          const groupId = option.groupId || "default"
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
            {category.options.filter(isRangeOption).map((option) => (
              <FilterRange key={option.id} option={option} />
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
        <h3 className="text-lg font-medium">{getTranslatedLabel(category.label)}</h3>
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
