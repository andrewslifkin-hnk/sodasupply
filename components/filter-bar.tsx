"use client"

import { Button } from "@/components/ui/button"
import { SlidersHorizontal, X, ChevronUp, ChevronDown } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useFilter, type FilterOption, type SortOption } from "@/context/filter-context"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"

export function FilterBar() {
  const {
    activeFilters,
    sortOption,
    toggleFilter,
    clearAllFilters,
    setSortOption,
    isFilterSheetOpen,
    openFilterSheet,
    closeFilterSheet,
    searchQuery,
    totalActiveFilters,
    filteredProductCount,
    isFilterActiveById,
    removeFilter,
  } = useFilter()

  const isMobile = useMediaQuery("(max-width: 768px)")

  // Use local state for sort option to prevent infinite updates
  const [localSortOption, setLocalSortOption] = useState<SortOption>(sortOption)

  // Update local sort option when context sort option changes
  useEffect(() => {
    setLocalSortOption(sortOption)
  }, [sortOption])

  // Handle sort option change
  const handleSortChange = (value: string) => {
    setLocalSortOption(value as SortOption)
    setSortOption(value as SortOption)
  }

  // Filter options based on actual product attributes
  const typeOptions = [
    { id: "type-carbonated", label: "Carbonated", category: "type", value: "Carbonated" },
    { id: "type-water", label: "Water", category: "type", value: "Water" },
    { id: "type-energy", label: "Energy", category: "type", value: "Energy" },
    { id: "type-tea", label: "Tea", category: "type", value: "Tea" },
    { id: "type-beer", label: "Beer", category: "type", value: "Beer" },
  ]

  const packageOptions = [
    { id: "package-bottle", label: "Bottle", category: "package", value: "Bottle" },
    { id: "package-pack", label: "Pack", category: "package", value: "Pack" },
    { id: "package-cans", label: "Cans", category: "package", value: "Cans" },
    { id: "package-case", label: "Case", category: "package", value: "Case" },
    { id: "package-crate", label: "Crate", category: "package", value: "Crate" },
  ]

  const sizeOptions = [
    { id: "size-330ml", label: "330ml", category: "size", value: "330ml" },
    { id: "size-500ml", label: "500ml", category: "size", value: "500ml" },
    { id: "size-1.5l", label: "1.5L", category: "size", value: "1.5L" },
    { id: "size-2l", label: "2L", category: "size", value: "2L" },
    { id: "size-6-x", label: "6-Pack", category: "size", value: "6 x" },
    { id: "size-12-x", label: "12-Pack", category: "size", value: "12 x" },
    { id: "size-24-x", label: "24-Pack", category: "size", value: "24 x" },
  ]

  const brandOptions = [
    { id: "brand-heineken", label: "Heineken®", category: "brand", value: "Heineken" },
    { id: "brand-cola", label: "Cola", category: "brand", value: "Cola" },
    { id: "brand-sprite", label: "Sprite", category: "brand", value: "Sprite" },
    { id: "brand-fanta", label: "Fanta", category: "brand", value: "Fanta" },
    { id: "brand-energy", label: "Energy", category: "brand", value: "Energy" },
    { id: "brand-water", label: "Water", category: "brand", value: "Water" },
    { id: "brand-tea", label: "Tea", category: "brand", value: "Tea" },
    { id: "brand-ginger", label: "Ginger", category: "brand", value: "Ginger" },
  ]

  const availabilityOptions = [
    { id: "availability-instock", label: "In stock", category: "availability", value: "instock" },
    { id: "availability-returnable", label: "Returnable", category: "availability", value: "returnable" },
  ]

  // Render filter tags
  const renderFilterTags = () => {
    const filtersToRender = [...activeFilters]

    // Add search query as a filter tag if it exists
    if (searchQuery) {
      filtersToRender.unshift({
        id: `search-${searchQuery}`,
        label: `"${searchQuery}"`,
        category: "search" as any,
        value: searchQuery,
      })
    }

    if (filtersToRender.length === 0) {
      return null
    }

    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {filtersToRender.map((filter) => (
          <Badge
            key={filter.id}
            variant="outline"
            className="rounded-full py-1 px-3 flex items-center gap-1 bg-white border-gray-300"
          >
            {filter.label}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => (filter.category === "search" ? clearAllFilters() : removeFilter(filter.id))}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {filter.label} filter</span>
            </Button>
          </Badge>
        ))}

        {filtersToRender.length > 0 && (
          <Button variant="link" className="text-sm font-normal h-7 px-2" onClick={clearAllFilters}>
            Clear all
          </Button>
        )}
      </div>
    )
  }

  // Create a checkbox component with consistent behavior
  const FilterCheckbox = ({ option }: { option: FilterOption }) => {
    const isActive = isFilterActiveById(option.id)

    return (
      <div className="flex items-center space-x-2">
        <Checkbox
          id={option.id}
          checked={isActive}
          onCheckedChange={() => toggleFilter(option)}
          className="h-5 w-5 rounded-sm border-gray-300 data-[state=checked]:bg-black data-[state=checked]:border-black cursor-pointer"
        />
        <Label htmlFor={option.id} className="text-base cursor-pointer" onClick={() => toggleFilter(option)}>
          {option.label}
        </Label>
      </div>
    )
  }

  // Filter sheet content
  const filterContent = (
    <div className="flex flex-col h-full">
      <div className="overflow-y-auto flex-1">
        {/* Sort by section */}
        <div className="py-4 border-b border-gray-200">
          <div className="flex items-center justify-between px-1 mb-4">
            <h3 className="text-lg font-medium">Sort by</h3>
            <ChevronDown className="h-5 w-5 text-gray-500" />
          </div>
          <RadioGroup value={localSortOption} onValueChange={(value) => handleSortChange(value)}>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="featured" id="featured" />
                <Label htmlFor="featured">Featured</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price-low" id="price-low" />
                <Label htmlFor="price-low">Price: Low to High</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price-high" id="price-high" />
                <Label htmlFor="price-high">Price: High to Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="newest" id="newest" />
                <Label htmlFor="newest">Newest</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Brand section */}
        <div className="py-4 border-b border-gray-200">
          <div className="flex items-center justify-between px-1 mb-4">
            <h3 className="text-lg font-medium">Brand</h3>
            <ChevronUp className="h-5 w-5 text-gray-500" />
          </div>
          <div className="space-y-3">
            {brandOptions.map((option) => (
              <FilterCheckbox key={option.id} option={option} />
            ))}
          </div>
        </div>

        {/* Type section */}
        <div className="py-4 border-b border-gray-200">
          <div className="flex items-center justify-between px-1 mb-4">
            <h3 className="text-lg font-medium">Type</h3>
            <ChevronUp className="h-5 w-5 text-gray-500" />
          </div>
          <div className="space-y-3">
            {typeOptions.map((option) => (
              <FilterCheckbox key={option.id} option={option} />
            ))}
          </div>
        </div>

        {/* Package type section */}
        <div className="py-4 border-b border-gray-200">
          <div className="flex items-center justify-between px-1 mb-4">
            <h3 className="text-lg font-medium">Package type</h3>
            <ChevronUp className="h-5 w-5 text-gray-500" />
          </div>
          <div className="space-y-3">
            {packageOptions.map((option) => (
              <FilterCheckbox key={option.id} option={option} />
            ))}
          </div>
        </div>

        {/* Size section */}
        <div className="py-4 border-b border-gray-200">
          <div className="flex items-center justify-between px-1 mb-4">
            <h3 className="text-lg font-medium">Size</h3>
            <ChevronUp className="h-5 w-5 text-gray-500" />
          </div>
          <div className="space-y-3">
            {sizeOptions.map((option) => (
              <FilterCheckbox key={option.id} option={option} />
            ))}
          </div>
        </div>

        {/* Availability section */}
        <div className="py-4 border-b border-gray-200">
          <div className="flex items-center justify-between px-1 mb-4">
            <h3 className="text-lg font-medium">Availability</h3>
            <ChevronUp className="h-5 w-5 text-gray-500" />
          </div>
          <div className="space-y-3">
            {availabilityOptions.map((option) => (
              <FilterCheckbox key={option.id} option={option} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )

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
            <span>Filter products</span>
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
            <span>Filter products</span>
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
            <Select value={localSortOption} onValueChange={handleSortChange}>
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
      {renderFilterTags()}

      {/* Filter sheet */}
      <Sheet open={isFilterSheetOpen} onOpenChange={closeFilterSheet}>
        <SheetContent
          side={isMobile ? "bottom" : "right"}
          className={isMobile ? "h-[90vh] rounded-t-xl p-0" : "w-[400px] p-0"}
        >
          <div className="flex flex-col h-full">
            <SheetHeader className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-xl">Filter</SheetTitle>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <X className="h-5 w-5" />
                  </Button>
                </SheetClose>
              </div>
            </SheetHeader>

            <div className="px-6 flex-1 overflow-auto">{filterContent}</div>

            <div className="p-4 border-t border-gray-200 mt-auto">
              <div className="space-y-3">
                <Button
                  className="w-full bg-[#004851] hover:bg-[#004851]/90 text-white rounded-full py-6"
                  onClick={() => {
                    closeFilterSheet()
                  }}
                >
                  {activeFilters.length > 0
                    ? `View ${filteredProductCount} filtered product${filteredProductCount !== 1 ? "s" : ""}`
                    : "View all products"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-full py-6"
                  onClick={() => {
                    clearAllFilters()
                    closeFilterSheet()
                  }}
                >
                  Clear all
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
