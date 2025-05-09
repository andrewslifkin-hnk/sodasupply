"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

export type SortOption = "featured" | "price-low" | "price-high" | "newest"
export type FilterCategory = "type" | "package" | "size" | "availability" | "brand"

export interface FilterOption {
  id: string
  label: string
  category: FilterCategory
  value: string
}

interface FilterContextType {
  activeFilters: FilterOption[]
  sortOption: SortOption
  addFilter: (filter: FilterOption) => void
  removeFilter: (filterId: string) => void
  clearAllFilters: () => void
  setSortOption: (option: SortOption) => void
  isFilterSheetOpen: boolean
  openFilterSheet: () => void
  closeFilterSheet: () => void
  searchQuery: string | null
  totalActiveFilters: number
  filteredProductCount: number
  setFilteredProductCount: (count: number) => void
  isFilterActiveByValue: (category: FilterCategory, value: string) => boolean
  isFilterActiveById: (filterId: string) => boolean
  toggleFilter: (filter: FilterOption) => void
  getActiveFiltersByCategory: (category: FilterCategory) => FilterOption[]
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([])
  const [sortOption, setSortOption] = useState<SortOption>("featured")
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)
  const [filteredProductCount, setFilteredProductCount] = useState(0)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const searchQuery = searchParams.get("q")

  // Use a ref to track if we're currently updating from URL
  const isUpdatingFromUrl = useRef(false)
  // Use a ref to track if we need to update the URL
  const needsUrlUpdate = useRef(false)

  // Helper function to normalize filter values for consistent IDs
  const normalizeValue = (value: string): string => {
    return value.toLowerCase().replace(/\s+/g, "-")
  }

  // Helper function to create a filter ID
  const createFilterId = (category: string, value: string): string => {
    return `${category}-${normalizeValue(value)}`
  }

  // Initialize filters from URL on mount or when URL changes
  useEffect(() => {
    // Skip if we're in the middle of updating the URL ourselves
    if (needsUrlUpdate.current) {
      needsUrlUpdate.current = false
      return
    }

    isUpdatingFromUrl.current = true
    const urlFilters: FilterOption[] = []

    // Parse type filters
    const types = searchParams.getAll("type")
    types.forEach((type) => {
      urlFilters.push({
        id: createFilterId("type", type),
        label: type,
        category: "type",
        value: type,
      })
    })

    // Parse package filters
    const packages = searchParams.getAll("package")
    packages.forEach((pkg) => {
      urlFilters.push({
        id: createFilterId("package", pkg),
        label: pkg,
        category: "package",
        value: pkg,
      })
    })

    // Parse size filters
    const sizes = searchParams.getAll("size")
    sizes.forEach((size) => {
      urlFilters.push({
        id: createFilterId("size", size),
        label: size,
        category: "size",
        value: size,
      })
    })

    // Parse availability filters
    if (searchParams.get("instock") === "true") {
      urlFilters.push({
        id: "availability-instock",
        label: "In stock",
        category: "availability",
        value: "instock",
      })
    }

    if (searchParams.get("returnable") === "true") {
      urlFilters.push({
        id: "availability-returnable",
        label: "Returnable",
        category: "availability",
        value: "returnable",
      })
    }

    // Parse brand filters
    const brands = searchParams.getAll("brand")
    brands.forEach((brand) => {
      urlFilters.push({
        id: createFilterId("brand", brand),
        label: brand,
        category: "brand",
        value: brand,
      })
    })

    // Parse sort option
    const sort = searchParams.get("sort") as SortOption
    if (sort) {
      setSortOption(sort)
    } else {
      setSortOption("featured")
    }

    setActiveFilters(urlFilters)
    isUpdatingFromUrl.current = false
  }, [searchParams])

  // Update URL when filters change, but only if not updating from URL
  useEffect(() => {
    // Skip if we're currently updating from URL changes
    if (isUpdatingFromUrl.current) return

    // Mark that we need to update the URL
    needsUrlUpdate.current = true

    const params = new URLSearchParams()

    // Add search query if exists
    if (searchQuery) {
      params.set("q", searchQuery)
    }

    // Add sort option if not default
    if (sortOption !== "featured") {
      params.set("sort", sortOption)
    }

    // Group filters by category for cleaner URL
    const filtersByCategory: Record<string, string[]> = {}

    activeFilters.forEach((filter) => {
      if (filter.category === "availability") {
        if (filter.value === "instock") {
          params.set("instock", "true")
        } else if (filter.value === "returnable") {
          params.set("returnable", "true")
        }
      } else {
        if (!filtersByCategory[filter.category]) {
          filtersByCategory[filter.category] = []
        }
        filtersByCategory[filter.category].push(filter.value)
      }
    })

    // Add each category's filters to the URL
    Object.entries(filtersByCategory).forEach(([category, values]) => {
      values.forEach((value) => {
        params.append(category, value)
      })
    })

    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.push(newUrl, { scroll: false })
  }, [activeFilters, sortOption, pathname, router, searchQuery])

  // Check if a filter is active by its ID
  const isFilterActiveById = (filterId: string): boolean => {
    return activeFilters.some((filter) => filter.id === filterId)
  }

  // Check if a filter is active by its category and value
  const isFilterActiveByValue = (category: FilterCategory, value: string): boolean => {
    return activeFilters.some((filter) => filter.category === category && filter.value === value)
  }

  // Get all active filters for a specific category
  const getActiveFiltersByCategory = (category: FilterCategory): FilterOption[] => {
    return activeFilters.filter((filter) => filter.category === category)
  }

  const addFilter = (filter: FilterOption) => {
    if (!isFilterActiveById(filter.id)) {
      setActiveFilters((prev) => [...prev, filter])
    }
  }

  const removeFilter = (filterId: string) => {
    setActiveFilters((prev) => prev.filter((filter) => filter.id !== filterId))
  }

  // Toggle a filter (add if not active, remove if active)
  const toggleFilter = (filter: FilterOption) => {
    if (isFilterActiveById(filter.id)) {
      removeFilter(filter.id)
    } else {
      addFilter(filter)
    }
  }

  const clearAllFilters = () => {
    setActiveFilters([])
    setSortOption("featured")

    // Update URL immediately
    needsUrlUpdate.current = true
    const newUrl = searchQuery ? `${pathname}?q=${searchQuery}` : pathname
    router.push(newUrl, { scroll: false })
  }

  const handleSetSortOption = (option: SortOption) => {
    setSortOption(option)
  }

  const openFilterSheet = () => setIsFilterSheetOpen(true)
  const closeFilterSheet = () => setIsFilterSheetOpen(false)

  // Calculate total active filters (including search query)
  const totalActiveFilters = activeFilters.length + (searchQuery ? 1 : 0)

  return (
    <FilterContext.Provider
      value={{
        activeFilters,
        sortOption,
        addFilter,
        removeFilter,
        clearAllFilters,
        setSortOption: handleSetSortOption,
        isFilterSheetOpen,
        openFilterSheet,
        closeFilterSheet,
        searchQuery,
        totalActiveFilters,
        filteredProductCount,
        setFilteredProductCount,
        isFilterActiveByValue,
        isFilterActiveById,
        toggleFilter,
        getActiveFiltersByCategory,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider")
  }
  return context
}
