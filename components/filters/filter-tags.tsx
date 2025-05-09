"use client"

import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFilter } from "@/context/filter-context"
import { FilterTag } from "./filter-tag"
import type { ActiveFilter } from "@/types/filter-types"

/**
 * Filter tags component
 * Displays all active filters with the ability to remove them
 */
export function FilterTags() {
  const { activeFilters, removeFilter, clearAllFilters, searchQuery } = useFilter()

  if (activeFilters.length === 0 && !searchQuery) {
    return null
  }

  // Create a search filter tag if there's a search query
  const searchFilter: ActiveFilter | null = searchQuery
    ? {
        id: `search-${searchQuery}`,
        label: `"${searchQuery}"`,
        category: "search",
        type: "text" as any,
        value: searchQuery,
      }
    : null

  // Handle clear all button click
  const handleClearAll = () => {
    clearAllFilters()
  }

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {/* Search filter tag */}
      {searchFilter && <FilterTag filter={searchFilter} onRemove={() => clearAllFilters()} />}

      {/* Active filter tags */}
      {activeFilters.map((filter) => (
        <FilterTag key={filter.id} filter={filter} onRemove={removeFilter} />
      ))}

      {/* Clear all button */}
      {(activeFilters.length > 0 || searchQuery) && (
        <Button
          variant="outline"
          size="sm"
          className="rounded-full flex items-center gap-1 text-sm font-normal h-7 px-3"
          onClick={handleClearAll}
        >
          <RefreshCw className="h-3 w-3" />
          Clear all
        </Button>
      )}
    </div>
  )
}
