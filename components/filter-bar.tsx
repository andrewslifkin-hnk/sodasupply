"use client"

import { Button } from "@/components/ui/button"
import { SlidersHorizontal, X, ChevronUp, ChevronDown, RefreshCw } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose, SheetFooter } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useFilter, FilterType, type FilterOption, type SortOption, type FilterCategory } from "@/context/filter-context"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect, useRef } from "react"

export function FilterBar() {
  const {
    activeFilters,
    sortOption,
    toggleFilter,
    clearAllFilters,
    clearCategoryFilters,
    setSortOption,
    isFilterSheetOpen,
    openFilterSheet,
    closeFilterSheet,
    searchQuery,
    totalActiveFilters,
    filteredProductCount,
    isFilterActiveById,
    removeFilter,
    getActiveFiltersByCategory,
  } = useFilter()

  const isMobile = useMediaQuery("(max-width: 768px)")

  // Use local state for sort option to prevent infinite updates
  const [localSortOption, setLocalSortOption] = useState<SortOption>(sortOption)
  const isInitialRender = useRef(true)

  // Update local sort option when context sort option changes, but only on initial render
  // or when the sort option changes from outside this component
  useEffect(() => {
    if (isInitialRender.current) {
      setLocalSortOption(sortOption)
      isInitialRender.current = false
    } else if (sortOption !== localSortOption) {
      setLocalSortOption(sortOption)
    }
  }, [sortOption, localSortOption])

  // Handle sort option change
  const handleSortChange = (value: string) => {
    const newSortOption = value as SortOption
    setLocalSortOption(newSortOption)

    // Only update the context if the value actually changed
    if (newSortOption !== sortOption) {
      setSortOption(newSortOption)
    }
  }

  // Filter options based on actual product attributes
  const typeOptions = [
    { id: "type-prebiotic", label: "Prebiotic", category: "type", type: FilterType.CHECKBOX, value: "Prebiotic" },
    { id: "type-probiotic", label: "Probiotic", category: "type", type: FilterType.CHECKBOX, value: "Probiotic" },
    { id: "type-soda", label: "Soda", category: "type", type: FilterType.CHECKBOX, value: "Soda" },
    { id: "type-functional", label: "Functional", category: "type", type: FilterType.CHECKBOX, value: "Functional" },
    { id: "type-adaptogenic", label: "Adaptogenic", category: "type", type: FilterType.CHECKBOX, value: "Adaptogenic" },
    { id: "type-lowsugar", label: "Low Sugar", category: "type", type: FilterType.CHECKBOX, value: "Low Sugar" },
    { id: "type-sparklingwater", label: "Sparkling Water", category: "type", type: FilterType.CHECKBOX, value: "Sparkling Water" },
    { id: "type-energydrink", label: "Energy Drink", category: "type", type: FilterType.CHECKBOX, value: "Energy Drink" },
  ]

  const packageOptions = [
    { id: "package-bottle", label: "Bottle", category: "package", type: FilterType.CHECKBOX, value: "Bottle" },
    { id: "package-pack", label: "Pack", category: "package", type: FilterType.CHECKBOX, value: "Pack" },
    { id: "package-cans", label: "Cans", category: "package", type: FilterType.CHECKBOX, value: "Cans" },
    { id: "package-case", label: "Case", category: "package", type: FilterType.CHECKBOX, value: "Case" },
    { id: "package-crate", label: "Crate", category: "package", type: FilterType.CHECKBOX, value: "Crate" },
  ]

  const sizeOptions = [
    { id: "size-250ml", label: "250ml", category: "size", type: FilterType.CHECKBOX, value: "250ml" },
    { id: "size-355ml", label: "355ml", category: "size", type: FilterType.CHECKBOX, value: "355ml" },
    { id: "size-4-x", label: "4-Pack", category: "size", type: FilterType.CHECKBOX, value: "4 x" },
    { id: "size-6-x", label: "6-Pack", category: "size", type: FilterType.CHECKBOX, value: "6 x" },
    { id: "size-8-x", label: "8-Pack", category: "size", type: FilterType.CHECKBOX, value: "8 x" },
    { id: "size-12-x", label: "12-Pack", category: "size", type: FilterType.CHECKBOX, value: "12 x" },
    { id: "size-24-x", label: "24-Pack", category: "size", type: FilterType.CHECKBOX, value: "24 x" },
    { id: "size-2l", label: "2 Liter", category: "size", type: FilterType.CHECKBOX, value: "2 Liter" },
  ]

  const brandOptions = [
    { id: "brand-olipop", label: "Olipop", category: "brand", type: FilterType.CHECKBOX, value: "Olipop" },
    { id: "brand-poppi", label: "Poppi", category: "brand", type: FilterType.CHECKBOX, value: "Poppi" },
    { id: "brand-cocacola", label: "Coca-Cola", category: "brand", type: FilterType.CHECKBOX, value: "Coca-Cola" },
    { id: "brand-sprite", label: "Sprite", category: "brand", type: FilterType.CHECKBOX, value: "Sprite" },
    { id: "brand-recess", label: "Recess", category: "brand", type: FilterType.CHECKBOX, value: "Recess" },
    { id: "brand-dram", label: "DRAM", category: "brand", type: FilterType.CHECKBOX, value: "DRAM" },
    { id: "brand-unitedsodas", label: "United Sodas", category: "brand", type: FilterType.CHECKBOX, value: "United Sodas" },
    { id: "brand-culturepop", label: "Culture Pop", category: "brand", type: FilterType.CHECKBOX, value: "Culture Pop" },
    { id: "brand-sanzo", label: "Sanzo", category: "brand", type: FilterType.CHECKBOX, value: "Sanzo" },
    { id: "brand-ghia", label: "Ghia", category: "brand", type: FilterType.CHECKBOX, value: "Ghia" },
    { id: "brand-assorted", label: "Assorted", category: "brand", type: FilterType.CHECKBOX, value: "Assorted" },
  ]

  const availabilityOptions = [
    { id: "availability-instock", label: "In stock", category: "availability", type: FilterType.TOGGLE, value: false },
    { id: "availability-returnable", label: "Returnable", category: "availability", type: FilterType.TOGGLE, value: false },
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
          <Button
            variant="outline"
            size="sm"
            className="rounded-full flex items-center gap-1 text-sm font-normal h-7 px-3"
            onClick={clearAllFilters}
          >
            <RefreshCw className="h-3 w-3" />
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

  // Render a filter section with title and clear button
  const FilterSection = ({
    title,
    options,
    category,
  }: {
    title: string
    options: FilterOption[]
    category: FilterCategory
  }) => {
    const activeCount = getActiveFiltersByCategory(category).length

    return (
      <div className="py-4 border-b border-gray-200">
        <div className="flex items-center justify-between px-1 mb-4">
          <h3 className="text-lg font-medium">{title}</h3>
          <div className="flex items-center gap-2">
            {activeCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-gray-500 hover:text-black"
                onClick={() => clearCategoryFilters(category)}
              >
                Clear {activeCount}
              </Button>
            )}
            <ChevronUp className="h-5 w-5 text-gray-500" />
          </div>
        </div>
        <div className="space-y-3">
          {options.map((option) => (
            <FilterCheckbox key={option.id} option={option} />
          ))}
        </div>
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
          <RadioGroup value={localSortOption} onValueChange={handleSortChange}>
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
        <FilterSection title="Brand" options={brandOptions} category="brand" />

        {/* Type section */}
        <FilterSection title="Type" options={typeOptions} category="type" />

        {/* Package type section */}
        <FilterSection title="Package type" options={packageOptions} category="package" />

        {/* Size section */}
        <FilterSection title="Size" options={sizeOptions} category="size" />

        {/* Availability section */}
        <FilterSection title="Availability" options={availabilityOptions} category="availability" />
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
                <div className="flex items-center gap-2">
                  {activeFilters.length > 0 && (
                    <Button variant="outline" size="sm" className="h-8 text-sm" onClick={clearAllFilters}>
                      Reset all
                    </Button>
                  )}
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetHeader>

            <div className="px-6 flex-1 overflow-auto">{filterContent}</div>

            <SheetFooter className="p-4 border-t border-gray-200 mt-auto">
              <div className="space-y-3 w-full">
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
                {activeFilters.length > 0 && (
                  <Button
                    variant="outline"
                    className="w-full rounded-full py-6"
                    onClick={() => {
                      clearAllFilters()
                      closeFilterSheet()
                    }}
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
