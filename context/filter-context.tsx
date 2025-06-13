"use client"

import type React from "react"
import { createContext, useContext, useReducer, useCallback, useEffect, useMemo, useState, useRef } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

/**
 * Defines the types of filters supported by the system
 */
export enum FilterType {
  TEXT = "text",
  CHECKBOX = "checkbox",
  RADIO = "radio",
  RANGE = "range",
  TOGGLE = "toggle",
}

/**
 * Base interface for all filter options
 */
export interface BaseFilterOption {
  id: string
  label: string
  type: FilterType
  category: string
}

/**
 * Interface for text-based filter options
 */
export interface TextFilterOption extends BaseFilterOption {
  type: FilterType.TEXT
  value: string
}

/**
 * Interface for checkbox filter options
 */
export interface CheckboxFilterOption extends BaseFilterOption {
  type: FilterType.CHECKBOX
  value: string
}

/**
 * Interface for radio filter options
 */
export interface RadioFilterOption extends BaseFilterOption {
  type: FilterType.RADIO
  value: string
  groupId: string
}

/**
 * Interface for range filter options
 */
export interface RangeFilterOption extends BaseFilterOption {
  type: FilterType.RANGE
  min: number
  max: number
  step?: number
  currentMin?: number
  currentMax?: number
}

/**
 * Interface for toggle filter options
 */
export interface ToggleFilterOption extends BaseFilterOption {
  type: FilterType.TOGGLE
  value: boolean
}

/**
 * Union type for all filter option types
 */
export type FilterOption =
  | TextFilterOption
  | CheckboxFilterOption
  | RadioFilterOption
  | RangeFilterOption
  | ToggleFilterOption

/**
 * Interface for active filter state
 */
export interface ActiveFilter {
  id: string
  label: string
  category: string
  type: FilterType
  value: string | boolean | number | [number, number]
  displayValue?: string
}

/**
 * Sort options for the filter system
 */
export type SortOption = "featured" | "price-low" | "price-high" | "newest"

/**
 * Interface for filter category
 */
export interface FilterCategory {
  id: string
  label: string
  type: FilterType
  options?: FilterOption[]
  isExpanded?: boolean
}

/**
 * Interface for a product to be filtered
 */
export interface FilterableProduct {
  id: number
  [key: string]: any
}

/**
 * Type for filter predicate functions
 */
export type FilterPredicate = (product: FilterableProduct) => boolean

/**
 * Interface for filter state
 */
export interface FilterState {
  activeFilters: ActiveFilter[]
  sortOption: SortOption
  searchQuery: string | null
  categories: FilterCategory[]
}

/**
 * Actions for the filter reducer
 */
type FilterAction =
  | { type: "SET_ACTIVE_FILTERS"; payload: ActiveFilter[] }
  | { type: "ADD_FILTER"; payload: ActiveFilter }
  | { type: "REMOVE_FILTER"; payload: string }
  | { type: "CLEAR_ALL_FILTERS" }
  | { type: "CLEAR_CATEGORY_FILTERS"; payload: string }
  | { type: "SET_SORT_OPTION"; payload: SortOption }
  | { type: "SET_SEARCH_QUERY"; payload: string | null }
  | { type: "SET_FILTER_CATEGORIES"; payload: FilterCategory[] }
  | { type: "TOGGLE_CATEGORY_EXPANSION"; payload: string }
  | {
      type: "SYNC_FROM_URL"
      payload: { activeFilters: ActiveFilter[]; sortOption: SortOption; searchQuery: string | null }
    }

/**
 * Interface for the filter context
 */
interface FilterContextType {
  // State
  activeFilters: ActiveFilter[]
  sortOption: SortOption
  searchQuery: string | null
  categories: FilterCategory[]
  totalActiveFilters: number

  // Filter sheet state
  isFilterSheetOpen: boolean
  openFilterSheet: () => void
  closeFilterSheet: () => void

  // Filter operations
  addFilter: (filter: ActiveFilter) => void
  removeFilter: (filterId: string) => void
  clearAllFilters: () => void
  clearCategoryFilters: (category: string) => void
  setSortOption: (option: SortOption) => void
  setSearchQuery: (query: string | null) => void
  toggleCategoryExpansion: (categoryId: string) => void

  // Filter helpers
  isFilterActive: (filterId: string) => boolean
  getActiveFiltersByCategory: (category: string) => ActiveFilter[]

  // Product filtering
  filterProducts: <T extends FilterableProduct>(products: T[]) => T[]
  filteredProductCount: number
  setFilteredProductCount: (count: number) => void

  // --- Static sidebar ---
  staticSidebarEnabled: boolean
  setStaticSidebarEnabled: (enabled: boolean) => void
}

/**
 * Initial state for the filter reducer
 */
const initialFilterState: FilterState = {
  activeFilters: [],
  sortOption: "featured",
  searchQuery: null,
  categories: [],
}

/**
 * Filter reducer function
 */
function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_ACTIVE_FILTERS":
      return {
        ...state,
        activeFilters: action.payload,
      }
    case "ADD_FILTER":
      return {
        ...state,
        activeFilters: [...state.activeFilters, action.payload],
      }
    case "REMOVE_FILTER":
      return {
        ...state,
        activeFilters: state.activeFilters.filter((filter) => filter.id !== action.payload),
      }
    case "CLEAR_ALL_FILTERS":
      return {
        ...state,
        activeFilters: [],
        sortOption: "featured",
      }
    case "CLEAR_CATEGORY_FILTERS":
      return {
        ...state,
        activeFilters: state.activeFilters.filter((filter) => filter.category !== action.payload),
      }
    case "SET_SORT_OPTION":
      return {
        ...state,
        sortOption: action.payload,
      }
    case "SET_SEARCH_QUERY":
      return {
        ...state,
        searchQuery: action.payload,
      }
    case "SET_FILTER_CATEGORIES":
      return {
        ...state,
        categories: action.payload,
      }
    case "TOGGLE_CATEGORY_EXPANSION":
      return {
        ...state,
        categories: state.categories.map((category) =>
          category.id === action.payload ? { ...category, isExpanded: !category.isExpanded } : category,
        ),
      }
    case "SYNC_FROM_URL":
      return {
        ...state,
        activeFilters: action.payload.activeFilters,
        sortOption: action.payload.sortOption,
        searchQuery: action.payload.searchQuery,
      }
    default:
      return state
  }
}

// Create the context
const FilterContext = createContext<FilterContextType | undefined>(undefined)

/**
 * Provider component for the filter context
 */
export function FilterProvider({ children }: { children: React.ReactNode }) {
  // State management with useReducer
  const [state, dispatch] = useReducer(filterReducer, initialFilterState)

  // Router hooks
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // UI state
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)
  const [filteredProductCount, setFilteredProductCount] = useState(0)

  // Sync flags to prevent infinite loops
  const isUpdatingFromUrl = useRef(false)
  const skipNextUrlUpdate = useRef(false)

  // Calculate total active filters
  const totalActiveFilters = state.activeFilters.length + (state.searchQuery ? 1 : 0)

  // --- Static sidebar state ---
  const [staticSidebarEnabled, setStaticSidebarEnabledState] = useState<boolean>(false)

  // Helper to set and persist static sidebar state
  const setStaticSidebarEnabled = useCallback((enabled: boolean) => {
    setStaticSidebarEnabledState(enabled)
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('filters_static_sidebar', enabled ? 'on' : 'off')
    }
  }, [])

  // On mount: check URL param and sessionStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const urlValue = params.get('filters_static_sidebar')
    const sessionValue = window.sessionStorage.getItem('filters_static_sidebar')
    if (urlValue === 'on' || urlValue === 'off') {
      setStaticSidebarEnabled(urlValue === 'on')
    } else if (sessionValue === 'on' || sessionValue === 'off') {
      setStaticSidebarEnabled(sessionValue === 'on')
    }
    // If neither, default is false
  }, [setStaticSidebarEnabled])

  /**
   * Parse URL parameters into filter state
   */
  useEffect(() => {
    if (skipNextUrlUpdate.current) {
      skipNextUrlUpdate.current = false
      return
    }

    isUpdatingFromUrl.current = true

    try {
      const activeFilters: ActiveFilter[] = []
      let sortOption: SortOption = "featured"
      const searchQuery = searchParams.get("q")

      // Parse checkbox filters (can have multiple values per category)
      for (const category of ["type", "package", "size", "brand"]) {
        const values = searchParams.getAll(category)
        values.forEach((value) => {
          activeFilters.push({
            id: `${category}-${value.toLowerCase().replace(/\s+/g, "-")}`,
            label: value,
            category,
            type: FilterType.CHECKBOX,
            value,
          })
        })
      }

      // Parse toggle filters
      if (searchParams.get("instock") === "true") {
        activeFilters.push({
          id: "availability-instock",
          label: "In stock",
          category: "availability",
          type: FilterType.TOGGLE,
          value: true,
        })
      }

      if (searchParams.get("returnable") === "true") {
        activeFilters.push({
          id: "availability-returnable",
          label: "Returnable",
          category: "availability",
          type: FilterType.TOGGLE,
          value: true,
        })
      }

      // Parse range filters
      const minPrice = searchParams.get("minPrice")
      const maxPrice = searchParams.get("maxPrice")
      if (minPrice || maxPrice) {
        activeFilters.push({
          id: "price-range",
          label: "Price",
          category: "price",
          type: FilterType.RANGE,
          value: [minPrice ? Number.parseFloat(minPrice) : 0, maxPrice ? Number.parseFloat(maxPrice) : 100],
          displayValue: `€${minPrice || "0"} - €${maxPrice || "100+"}`,
        })
      }

      // Parse sort option
      const sort = searchParams.get("sort") as SortOption
      if (sort && ["featured", "price-low", "price-high", "newest"].includes(sort)) {
        sortOption = sort
      }

      // Update state from URL
      dispatch({
        type: "SYNC_FROM_URL",
        payload: { activeFilters, sortOption, searchQuery },
      })
    } catch (error) {
      console.error("Error parsing URL parameters:", error)
    } finally {
      isUpdatingFromUrl.current = false
    }
  }, [searchParams])

  /**
   * Update URL based on current filter state
   */
  const updateURL = useCallback(() => {
    if (isUpdatingFromUrl.current) return

    skipNextUrlUpdate.current = true

    const params = new URLSearchParams()

    // Add search query if exists
    if (state.searchQuery) {
      params.set("q", state.searchQuery)
    }

    // Add sort option if not default
    if (state.sortOption !== "featured") {
      params.set("sort", state.sortOption)
    }

    // Group filters by category for cleaner URL
    const filtersByCategory: Record<string, string[]> = {}

    state.activeFilters.forEach((filter) => {
      if (filter.type === FilterType.TOGGLE) {
        // Handle toggle filters
        if (filter.category === "availability") {
          if (filter.id === "availability-instock") {
            params.set("instock", "true")
          } else if (filter.id === "availability-returnable") {
            params.set("returnable", "true")
          }
        }
      } else if (filter.type === FilterType.RANGE) {
        // Handle range filters
        if (filter.category === "price") {
          const [min, max] = filter.value as [number, number]
          params.set("minPrice", min.toString())
          params.set("maxPrice", max.toString())
        }
      } else {
        // Handle checkbox and radio filters
        if (!filtersByCategory[filter.category]) {
          filtersByCategory[filter.category] = []
        }
        filtersByCategory[filter.category].push(filter.value as string)
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
  }, [state.activeFilters, state.sortOption, state.searchQuery, pathname, router])

  // Update URL when filter state changes
  useEffect(() => {
    updateURL()
  }, [state.activeFilters, state.sortOption, state.searchQuery, updateURL])

  /**
   * Filter operations
   */
  const openFilterSheet = useCallback(() => setIsFilterSheetOpen(true), [])
  const closeFilterSheet = useCallback(() => setIsFilterSheetOpen(false), [])

  const addFilter = useCallback((filter: ActiveFilter) => {
    dispatch({ type: "ADD_FILTER", payload: filter })
    if (typeof window !== 'undefined' && window.umami) {
      window.umami.track('filter_change', { action: 'add', filter })
    }
  }, [])

  const removeFilter = useCallback((filterId: string) => {
    dispatch({ type: "REMOVE_FILTER", payload: filterId })
    if (typeof window !== 'undefined' && window.umami) {
      window.umami.track('filter_change', { action: 'remove', filterId })
    }
  }, [])

  const clearAllFilters = useCallback(() => {
    // Clear all filters in the state
    dispatch({ type: "CLEAR_ALL_FILTERS" })

    // Reset the search query as well
    dispatch({ type: "SET_SEARCH_QUERY", payload: null })

    // Update URL directly to ensure immediate effect
    skipNextUrlUpdate.current = true

    // Navigate to the base path without any query parameters
    router.push(pathname, { scroll: false })

    // Close the filter sheet if it's open
    if (isFilterSheetOpen) {
      closeFilterSheet()
    }

    if (typeof window !== 'undefined' && window.umami) {
      window.umami.track('filter_change', { action: 'clear_all' })
    }
  }, [pathname, router, isFilterSheetOpen, closeFilterSheet])

  const clearCategoryFilters = useCallback((category: string) => {
    dispatch({ type: "CLEAR_CATEGORY_FILTERS", payload: category })
  }, [])

  const setSortOption = useCallback((option: SortOption) => {
    dispatch({ type: "SET_SORT_OPTION", payload: option })
    if (typeof window !== 'undefined' && window.umami) {
      window.umami.track('sort_change', { sortOption: option })
    }
  }, [])

  const setSearchQuery = useCallback((query: string | null) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: query })
  }, [])

  const toggleCategoryExpansion = useCallback((categoryId: string) => {
    dispatch({ type: "TOGGLE_CATEGORY_EXPANSION", payload: categoryId })
  }, [])

  /**
   * Filter helpers
   */
  const isFilterActive = useCallback(
    (filterId: string): boolean => {
      return state.activeFilters.some((filter) => filter.id === filterId)
    },
    [state.activeFilters],
  )

  const getActiveFiltersByCategory = useCallback(
    (category: string): ActiveFilter[] => {
      return state.activeFilters.filter((filter) => filter.category === category)
    },
    [state.activeFilters],
  )

  /**
   * Filter sheet operations
   */

  /**
   * Product filtering logic
   * This function applies all active filters to a list of products
   */
  const filterProducts = useCallback(
    <T extends FilterableProduct>(products: T[]): T[] => {
      if (state.activeFilters.length === 0 && !state.searchQuery) {
        return products
      }

      return products.filter((product) => {
        // Apply search query filter
        if (state.searchQuery) {
          const query = state.searchQuery.toLowerCase()
          const nameMatch = product.name?.toLowerCase().includes(query)
          const typeMatch = product.type?.toLowerCase().includes(query)
          const brandMatch = product.brand?.toLowerCase().includes(query)

          if (!(nameMatch || typeMatch || brandMatch)) {
            return false
          }
        }

        // Group filters by category
        const filtersByCategory: Record<string, ActiveFilter[]> = {}
        state.activeFilters.forEach((filter) => {
          if (!filtersByCategory[filter.category]) {
            filtersByCategory[filter.category] = []
          }
          filtersByCategory[filter.category].push(filter)
        })

        // Apply filters grouped by category
        return Object.entries(filtersByCategory).every(([category, filters]) => {
          switch (category) {
            case "type":
              // For type category, check if ANY filter matches (OR condition)
              return filters.some(filter => 
                product.type === filter.value
              )
              
            case "brand":
              // For brand category, check if ANY filter matches (OR condition)
              return filters.some(filter => 
                product.brand?.includes(filter.value as string) || 
                product.name?.includes(filter.value as string)
              )
              
            case "package":
              // For package category, check if ANY filter matches (OR condition)
              return filters.some(filter => 
                product.name?.toLowerCase().includes((filter.value as string).toLowerCase())
              )
              
            case "size":
              // For size category, check if ANY filter matches (OR condition)
              return filters.some(filter => 
                product.size?.includes(filter.value as string)
              )
              
            case "availability":
              // For availability toggles, use OR condition
              return filters.every(filter => {
                if (filter.id === "availability-instock") {
                  return product.inStock
                }
                if (filter.id === "availability-returnable") {
                  return product.returnable
                }
                return true
              })
              
            case "price":
              // For price range filter
              return filters.every(filter => {
                const [min, max] = filter.value as [number, number]
                return !(product.price < min || (max > 0 && product.price > max))
              })
              
            default:
              return true
          }
        })
      })
    },
    [state.activeFilters, state.searchQuery],
  )

  // Initialize filter categories
  useEffect(() => {
    const defaultCategories: FilterCategory[] = [
      {
        id: "brand",
        label: "Brand",
        type: FilterType.CHECKBOX,
        isExpanded: true,
      },
      {
        id: "type",
        label: "Type",
        type: FilterType.CHECKBOX,
        isExpanded: true,
      },
      {
        id: "package",
        label: "Package",
        type: FilterType.CHECKBOX,
        isExpanded: true,
      },
      {
        id: "size",
        label: "Size",
        type: FilterType.CHECKBOX,
        isExpanded: true,
      },
      {
        id: "price",
        label: "Price",
        type: FilterType.RANGE,
        isExpanded: true,
      },
      {
        id: "availability",
        label: "Availability",
        type: FilterType.TOGGLE,
        isExpanded: true,
      },
    ]

    dispatch({ type: "SET_FILTER_CATEGORIES", payload: defaultCategories })
  }, [])

  // Context value
  const contextValue = useMemo(
    () => ({
      // State
      activeFilters: state.activeFilters,
      sortOption: state.sortOption,
      searchQuery: state.searchQuery,
      categories: state.categories,
      totalActiveFilters,

      // Filter sheet state
      isFilterSheetOpen,
      openFilterSheet,
      closeFilterSheet,

      // Filter operations
      addFilter,
      removeFilter,
      clearAllFilters,
      clearCategoryFilters,
      setSortOption,
      setSearchQuery,
      toggleCategoryExpansion,

      // Filter helpers
      isFilterActive,
      getActiveFiltersByCategory,

      // Product filtering
      filterProducts,
      filteredProductCount,
      setFilteredProductCount,

      // --- Static sidebar ---
      staticSidebarEnabled,
      setStaticSidebarEnabled,
    }),
    [
      state.activeFilters,
      state.sortOption,
      state.searchQuery,
      state.categories,
      totalActiveFilters,
      isFilterSheetOpen,
      openFilterSheet,
      closeFilterSheet,
      addFilter,
      removeFilter,
      clearAllFilters,
      clearCategoryFilters,
      setSortOption,
      setSearchQuery,
      toggleCategoryExpansion,
      isFilterActive,
      getActiveFiltersByCategory,
      filterProducts,
      filteredProductCount,
      setFilteredProductCount,
      staticSidebarEnabled,
      setStaticSidebarEnabled,
    ],
  )

  return <FilterContext.Provider value={contextValue}>{children}</FilterContext.Provider>
}

/**
 * Hook to use the filter context
 */
export function useFilter() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider")
  }
  return context
}

// Add Umami to the Window type (if not already present)
declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, any>) => void
    }
  }
}
