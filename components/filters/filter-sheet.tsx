"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose, SheetFooter } from "@/components/ui/sheet"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useFilter } from "@/context/filter-context"
import { FilterCategory } from "./filter-category"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  type SortOption,
  FilterType,
  type CheckboxFilterOption,
  type RangeFilterOption,
  type ToggleFilterOption,
} from "@/types/filter-types"

/**
 * Filter sheet component
 * Displays all filter options in a slide-out sheet
 */
export function FilterSheet() {
  const {
    isFilterSheetOpen,
    closeFilterSheet,
    categories,
    activeFilters,
    sortOption,
    setSortOption,
    clearAllFilters,
    filteredProductCount,
  } = useFilter()

  const isMobile = useMediaQuery("(max-width: 768px)")

  // Define filter options for each category
  // Note: Brand, size, and type options are now handled dynamically by the FilterContext
  // to avoid duplicates and ensure consistency with actual product data

  const getPackageOptions = (): CheckboxFilterOption[] => [
    { id: "package-bottle", label: "Bottle", category: "package", type: FilterType.CHECKBOX, value: "Bottle" },
    { id: "package-pack", label: "Pack", category: "package", type: FilterType.CHECKBOX, value: "Pack" },
    { id: "package-cans", label: "Cans", category: "package", type: FilterType.CHECKBOX, value: "Cans" },
    { id: "package-case", label: "Case", category: "package", type: FilterType.CHECKBOX, value: "Case" },
    { id: "package-crate", label: "Crate", category: "package", type: FilterType.CHECKBOX, value: "Crate" },
  ]

  const getPriceOptions = (): RangeFilterOption[] => [
    {
      id: "price-range",
      label: "Price Range",
      category: "price",
      type: FilterType.RANGE,
      min: 0,
      max: 100,
      step: 1,
    },
  ]

  const getAvailabilityOptions = (): ToggleFilterOption[] => [
    { id: "availability-instock", label: "In stock", category: "availability", type: FilterType.TOGGLE, value: false },
    {
      id: "availability-returnable",
      label: "Returnable",
      category: "availability",
      type: FilterType.TOGGLE,
      value: false,
    },
  ]

  // Add options to each category - only for static options
  // Dynamic options (brand, size, type) are already provided by the FilterContext
  const categoriesWithOptions = categories.map((category) => {
    switch (category.id) {
      case "package":
        return { ...category, options: getPackageOptions() }
      case "price":
        return { ...category, options: getPriceOptions() }
      case "availability":
        return { ...category, options: getAvailabilityOptions() }
      default:
        // For brand, size, and type categories, use the options already provided by FilterContext
        return category
    }
  })

  return (
    <Sheet open={isFilterSheetOpen} onOpenChange={closeFilterSheet}>
      <SheetContent side="left" className="w-[400px] sm:w-[500px] p-0 flex flex-col h-full">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg font-semibold">Filter Products</SheetTitle>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>

          <div className="px-6 flex-1 overflow-auto">
            <div className="flex flex-col h-full">
              <div className="overflow-y-auto flex-1">
                {/* Sort by section */}
                <div className="py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between px-1 mb-4">
                    <h3 className="text-lg font-medium">Sort by</h3>
                  </div>
                  <RadioGroup value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
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

                {/* Filter categories */}
                {categoriesWithOptions.map((category) => (
                  <FilterCategory key={category.id} category={category} />
                ))}
              </div>
            </div>
          </div>

          <SheetFooter className="p-4 border-t border-gray-200 mt-auto">
            <div className="space-y-3 w-full">
              <Button
                className="w-full bg-[#004851] hover:bg-[#004851]/90 text-white rounded-full py-6"
                onClick={closeFilterSheet}
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
  )
}
