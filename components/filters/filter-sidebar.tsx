import React from "react"
import { useFilter } from "@/context/filter-context"
import { FilterCategory } from "./filter-category"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { FilterType } from "@/types/filter-types"

export function FilterSidebar() {
  const {
    categories,
    activeFilters,
    clearAllFilters,
    filteredProductCount,
    sortOption,
    setSortOption,
  } = useFilter()
  const isMobile = useMediaQuery("(max-width: 768px)")

  // --- Filter options logic (copied from FilterSheet) ---
  const getBrandOptions = () => [
    { id: "brand-olipop", label: "Olipop", category: "brand", type: FilterType.CHECKBOX, value: "Olipop" },
    { id: "brand-poppi", label: "Poppi", category: "brand", type: FilterType.CHECKBOX, value: "Poppi" },
    { id: "brand-cocacola", label: "Coca-Cola", category: "brand", type: FilterType.CHECKBOX, value: "Coca-Cola" },
    { id: "brand-sprite", label: "Sprite", category: "brand", type: FilterType.CHECKBOX, value: "Sprite" },
    { id: "brand-assorted", label: "Assorted", category: "brand", type: FilterType.CHECKBOX, value: "Assorted" },
    { id: "brand-citrus", label: "Citrus", category: "brand", type: FilterType.CHECKBOX, value: "Citrus" },
    { id: "brand-cherry", label: "Cherry", category: "brand", type: FilterType.CHECKBOX, value: "Cherry" },
    { id: "brand-orange", label: "Orange", category: "brand", type: FilterType.CHECKBOX, value: "Orange" },
    { id: "brand-raspberry", label: "Raspberry", category: "brand", type: FilterType.CHECKBOX, value: "Raspberry" },
    { id: "brand-energy", label: "Energy", category: "brand", type: FilterType.CHECKBOX, value: "Energy" },
    { id: "brand-gatorade", label: "Gatorade", category: "brand", type: FilterType.CHECKBOX, value: "Gatorade" },
    { id: "brand-bodyarmor", label: "BODYARMOR", category: "brand", type: FilterType.CHECKBOX, value: "BODYARMOR" },
    { id: "brand-powerade", label: "POWERADE", category: "brand", type: FilterType.CHECKBOX, value: "POWERADE" },
    { id: "brand-vitaminwater", label: "vitaminwater", category: "brand", type: FilterType.CHECKBOX, value: "vitaminwater" },
    { id: "brand-propel", label: "Propel", category: "brand", type: FilterType.CHECKBOX, value: "Propel" },
  ]
  const getTypeOptions = () => [
    { id: "type-prebiotic", label: "Prebiotic", category: "type", type: FilterType.CHECKBOX, value: "Prebiotic" },
    { id: "type-soda", label: "Soda", category: "type", type: FilterType.CHECKBOX, value: "Soda" },
    { id: "type-sparklingwater", label: "Sparkling Water", category: "type", type: FilterType.CHECKBOX, value: "Sparkling Water" },
    { id: "type-energydrink", label: "Energy Drink", category: "type", type: FilterType.CHECKBOX, value: "Energy Drink" },
    { id: "type-sportsdrink", label: "Sports Drink", category: "type", type: FilterType.CHECKBOX, value: "Sports Drink" },
    { id: "type-enhancedwater", label: "Enhanced Water", category: "type", type: FilterType.CHECKBOX, value: "Enhanced Water" },
    { id: "type-fitnesswater", label: "Fitness Water", category: "type", type: FilterType.CHECKBOX, value: "Fitness Water" },
  ]
  const getPackageOptions = () => [
    { id: "package-bottle", label: "Bottle", category: "package", type: FilterType.CHECKBOX, value: "Bottle" },
    { id: "package-pack", label: "Pack", category: "package", type: FilterType.CHECKBOX, value: "Pack" },
    { id: "package-cans", label: "Cans", category: "package", type: FilterType.CHECKBOX, value: "Cans" },
    { id: "package-case", label: "Case", category: "package", type: FilterType.CHECKBOX, value: "Case" },
    { id: "package-crate", label: "Crate", category: "package", type: FilterType.CHECKBOX, value: "Crate" },
  ]
  const getSizeOptions = () => [
    { id: "size-330ml", label: "330ml", category: "size", type: FilterType.CHECKBOX, value: "330ml" },
    { id: "size-500ml", label: "500ml", category: "size", type: FilterType.CHECKBOX, value: "500ml" },
    { id: "size-1.5l", label: "1.5L", category: "size", type: FilterType.CHECKBOX, value: "1.5L" },
    { id: "size-2l", label: "2L", category: "size", type: FilterType.CHECKBOX, value: "2L" },
    { id: "size-6-x", label: "6-Pack", category: "size", type: FilterType.CHECKBOX, value: "6 x" },
    { id: "size-12-x", label: "12-Pack", category: "size", type: FilterType.CHECKBOX, value: "12 x" },
    { id: "size-24-x", label: "24-Pack", category: "size", type: FilterType.CHECKBOX, value: "24 x" },
    { id: "size-8-x", label: "8-Pack", category: "size", type: FilterType.CHECKBOX, value: "8 x" },
    { id: "size-18-x", label: "18-Pack", category: "size", type: FilterType.CHECKBOX, value: "18 x" },
    { id: "size-16-fl-oz", label: "16 fl oz", category: "size", type: FilterType.CHECKBOX, value: "16 fl oz" },
    { id: "size-20-fl-oz", label: "20 fl oz", category: "size", type: FilterType.CHECKBOX, value: "20 fl oz" },
    { id: "size-28-fl-oz", label: "28 fl oz", category: "size", type: FilterType.CHECKBOX, value: "28 fl oz" },
  ]
  const getPriceOptions = () => [
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
  const getAvailabilityOptions = () => [
    { id: "availability-instock", label: "In stock", category: "availability", type: FilterType.TOGGLE, value: false },
    { id: "availability-returnable", label: "Returnable", category: "availability", type: FilterType.TOGGLE, value: false },
  ]

  // Add options to each category
  const categoriesWithOptions = categories.map((category) => {
    switch (category.id) {
      case "brand":
        return { ...category, options: getBrandOptions() }
      case "type":
        return { ...category, options: getTypeOptions() }
      case "package":
        return { ...category, options: getPackageOptions() }
      case "size":
        return { ...category, options: getSizeOptions() }
      case "price":
        return { ...category, options: getPriceOptions() }
      case "availability":
        return { ...category, options: getAvailabilityOptions() }
      default:
        return category
    }
  })

  if (isMobile) return null

  return (
    <aside className="w-72 min-w-[16rem] max-w-xs bg-white border-r border-gray-200 p-6 flex flex-col h-full sticky top-0 overflow-y-auto">
      {/* Sort by section */}
      <div className="py-4 border-b border-gray-200">
        <div className="flex items-center justify-between px-1 mb-4">
          <h3 className="text-lg font-medium">Sort by</h3>
        </div>
        <RadioGroup value={sortOption} onValueChange={(value) => setSortOption(value as any)}>
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
      {/* All filter categories, all expanded by default */}
      <div className="flex-1 overflow-y-auto space-y-6 mt-4">
        {categoriesWithOptions.map((category) => (
          <FilterCategory key={category.id} category={{ ...category, isExpanded: true } as any} />
        ))}
      </div>
      <div className="mt-6 text-sm text-gray-500">
        {filteredProductCount} products found
      </div>
    </aside>
  )
} 