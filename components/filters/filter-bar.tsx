"use client"

import { SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFilter } from "@/context/filter-context"
import { FilterTags } from "./filter-tags"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { SortOption } from "@/types/filter-types"

/**
 * Filter bar component
 * Displays filter button, sort dropdown, and active filter tags
 */
export function FilterBar() {
  const { sortOption, setSortOption, openFilterSheet, totalActiveFilters } = useFilter()

  const isMobile = useMediaQuery("(max-width: 768px)")

  // Handle sort option change
  const handleSortChange = (value: string) => {
    setSortOption(value as SortOption)
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        {/* Filter button */}
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-[#202020] rounded-full border-gray-300"
          onClick={openFilterSheet}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filter products</span>
          {totalActiveFilters > 0 && (
            <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full bg-black text-white text-xs">
              {totalActiveFilters}
            </Badge>
          )}
        </Button>

        {/* Sort dropdown (desktop only) */}
        {!isMobile && (
          <div className="w-[220px]">
            <Select value={sortOption} onValueChange={handleSortChange}>
              <SelectTrigger className="rounded-full border-gray-300">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
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
