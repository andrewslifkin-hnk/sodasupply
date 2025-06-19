"use client"

import type React from "react"
import { createContext, useContext, useReducer, useCallback, useEffect, useMemo, useState, useRef } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { getProducts, type Product } from "@/services/product-service"
import { useI18n } from "@/context/i18n-context"
import { normalizeSize } from "@/lib/i18n-utils"

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
 * Type for filter predicate functions
 */
export type FilterPredicate = (product: Product) => boolean

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
  | { type: "SET_TYPE_FILTER"; payload: string }
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
  clearAndSetTypeFilter: (type: string) => void
  setSortOption: (option: SortOption) => void
  setSearchQuery: (query: string | null) => void
  toggleCategoryExpansion: (categoryId: string) => void

  // Filter helpers
  isFilterActive: (filterId: string) => boolean
  getActiveFiltersByCategory: (category: string) => ActiveFilter[]

  // Product filtering
  filterProducts: (products: Product[]) => Product[]
  filteredProductCount: number
  setFilteredProductCount: (count: number) => void

  // --- Static sidebar ---
  staticSidebarEnabled: boolean
  setStaticSidebarEnabled: (enabled: boolean) => void

  // --- Loading state ---
  areFiltersInitialized: boolean
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

// Helper function to normalize product type
const normalizeType = (type: string): string => {
  return type.toLowerCase().replace(/\s+/g, '_')
}

// Helper function to extract brand from product name
const extractBrand = (product: Product): string => {
  // Use localized name for brand extraction
  const name = product.name.toUpperCase()
  
  // Common brand mappings
  if (name.includes('BODYARMOR')) return 'BODYARMOR'
  if (name.includes('COCA-COLA') || name.includes('COCA COLA')) return 'COCA-COLA'
  if (name.includes('GATORADE')) return 'GATORADE'
  if (name.includes('VITAMINWATER')) return 'VITAMINWATER'
  if (name.includes('BOYLAN')) return 'BOYLAN'
  
  // Default to first word
  return name.split(' ')[0]
}

// Helper function to create a filter predicate from an ActiveFilter
const createFilterPredicate = (filter: ActiveFilter): FilterPredicate => {
  return (product: Product) => {
    switch (filter.category) {
      case 'brand':
        return extractBrand(product) === filter.value
      case 'size':
        return product.size === filter.value
      case 'type':
        return product.type === filter.value
      case 'availability':
        if (filter.id === 'availability-instock') return product.in_stock
        if (filter.id === 'availability-returnable') return product.returnable
        return true
      case 'price':
        const [min, max] = filter.value as [number, number]
        return product.price >= min && product.price <= max
      default:
        return true
    }
  }
}

// Helper function to get the correct sort function
const getSortFunction = (sortOption: SortOption) => {
  switch (sortOption) {
    case 'price-low':
      return (a: Product, b: Product) => a.price - b.price
    case 'price-high':
      return (a: Product, b: Product) => b.price - a.price
    case 'newest':
      return (a: Product, b: Product) => b.id - a.id // Assuming higher ID is newer
    case 'featured':
    default:
      return () => 0 // No change in order for featured
  }
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
    case "SET_TYPE_FILTER": {
      const otherFilters = state.activeFilters.filter(f => f.category !== 'type')
      const type = action.payload
      if (type === "") {
        return { ...state, activeFilters: otherFilters }
      }
      const newFilter: ActiveFilter = {
        id: `type-${normalizeType(type)}`,
        label: type,
        category: 'type',
        type: FilterType.CHECKBOX,
        value: type
      }
      return { ...state, activeFilters: [...otherFilters, newFilter] }
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
  const [state, dispatch] = useReducer(filterReducer, initialFilterState)
  const { t, locale } = useI18n()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // UI state
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)
  const [filteredProductCount, setFilteredProductCount] = useState(0)
  const [areFiltersInitialized, setAreFiltersInitialized] = useState(false)

  // Sync flags to prevent infinite loops
  const skipUrlToStateSync = useRef(false);

  const reinitializeFilters = useCallback(async () => {
    if (!t) return; // Wait for translations to load

    // Get products with current locale
    const products = await getProducts(undefined, locale)
    if (!products || products.length === 0) return

    // Get unique brands from products
    const brands = Array.from(new Set(products.map(product => extractBrand(product))))

    // Create brand filter options
    const brandOptions: CheckboxFilterOption[] = brands
      .sort()
      .map(brand => ({
        id: `brand-${brand.toLowerCase()}`,
        label: t(`brands.${brand}`),
        value: brand,
        type: FilterType.CHECKBOX,
        category: 'brand'
      }))

    // Get unique sizes and normalize them
    const sizes = Array.from(new Set(products.map(product => product.size)))
    
    // Create size filter options
    const sizeOptions: CheckboxFilterOption[] = sizes
      .sort()
      .map(size => {
        const normalizedSize = normalizeSize(size)
        const translationKey = `sizes.${normalizedSize}`
        const translatedLabel = t(translationKey)
        return {
          id: `size-${size.toLowerCase().replace(/\s+/g, '-')}`,
          label: translatedLabel !== translationKey ? translatedLabel : size,
          value: size,
          type: FilterType.CHECKBOX,
          category: 'size'
        }
      })

    // Get unique types from products
    const types = Array.from(new Set(products.map(product => product.type)))

    // Create type filter options
    const typeOptions: CheckboxFilterOption[] = types
      .sort()
      .map(type => {
        const translationKey = `product_types.${type}`
        const translatedLabel = t(translationKey)
        return {
          id: `type-${normalizeType(type)}`,
          label: translatedLabel !== translationKey ? translatedLabel : type,
          value: type,
          type: FilterType.CHECKBOX,
          category: 'type'
        }
      })

    // Update filter categories
    const categories: FilterCategory[] = [
      {
        id: 'brand',
        label: t('filters.brands'),
        type: FilterType.CHECKBOX,
        options: brandOptions,
        isExpanded: true
      },
      {
        id: 'size',
        label: t('filters.sizes'),
        type: FilterType.CHECKBOX,
        options: sizeOptions,
        isExpanded: true
      },
      {
        id: 'type',
        label: t('filters.types'),
        type: FilterType.CHECKBOX,
        options: typeOptions,
        isExpanded: true
      }
    ]

    dispatch({ type: 'SET_FILTER_CATEGORIES', payload: categories })
    setAreFiltersInitialized(true)
  }, [t, locale]);

  // Calculate total active filters
  const totalActiveFilters = state.activeFilters.length + (state.searchQuery ? 1 : 0)

  // --- Static sidebar state ---
  const [staticSidebarEnabled, setStaticSidebarEnabled] = useState<boolean>(true)

  // This effect syncs the URL to the state, handling back/forward navigation
  useEffect(() => {
    if (skipUrlToStateSync.current) {
      skipUrlToStateSync.current = false;
      return;
    }

    const typeFromUrl = searchParams.get("type") || ""
    const typeFilterInState = state.activeFilters.find(f => f.category === "type")
    const typeValueInState = typeFilterInState?.value as string || ""

    if (typeFromUrl !== typeValueInState) {
      // URL is out of sync with state, so sync the state.
      // This handles back/forward navigation.
      dispatch({ type: 'SET_TYPE_FILTER', payload: typeFromUrl })
    }
  }, [searchParams, state.activeFilters])

  useEffect(() => {
    reinitializeFilters();
  }, [reinitializeFilters])

  /**
   * Parse URL parameters into filter state
   */
  useEffect(() => {
    if (skipUrlToStateSync.current) {
      skipUrlToStateSync.current = false;
      return;
    }

    const activeFilters: ActiveFilter[] = []
    let sortOption: SortOption = "featured"
    const searchQuery = searchParams.get("q")

    // Parse checkbox filters (can have multiple values per category)
    for (const category of ["brand", "size"]) {
      const values = searchParams.getAll(category)
      values.forEach(value => {
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
        value: [minPrice ? Number.parseFloat(minPrice) : 0, maxPrice ? Number.parseFloat(maxPrice) : 9999],
        displayValue: `€${minPrice || "0"} - €${maxPrice || "9999+"}`,
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
  }, [searchParams])

  /**
   * Update URL based on current filter state
   */
  const updateURL = useCallback(() => {
    if (skipUrlToStateSync.current) return

    skipUrlToStateSync.current = true;

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
    skipUrlToStateSync.current = true;
    dispatch({ type: "ADD_FILTER", payload: filter })
    if (typeof window !== 'undefined' && window.umami) {
      window.umami.track('filter-add', { id: filter.id, value: filter.value.toString() })
    }
  }, [])

  const removeFilter = useCallback((filterId: string) => {
    skipUrlToStateSync.current = true;
    dispatch({ type: "REMOVE_FILTER", payload: filterId })
    if (typeof window !== 'undefined' && window.umami) {
      window.umami.track('filter-remove', { id: filterId })
    }
  }, [])

  const clearAllFilters = useCallback(() => {
    skipUrlToStateSync.current = true;
    dispatch({ type: "CLEAR_ALL_FILTERS" })

    // Reset the search query as well
    dispatch({ type: "SET_SEARCH_QUERY", payload: null })

    // Close the filter sheet if it's open
    if (isFilterSheetOpen) {
      closeFilterSheet()
    }
    if (typeof window !== 'undefined' && window.umami) {
      window.umami.track('filter-clear-all')
    }
  }, [isFilterSheetOpen])

  const clearCategoryFilters = useCallback((category: string) => {
    skipUrlToStateSync.current = true;
    dispatch({ type: "CLEAR_CATEGORY_FILTERS", payload: category })
  }, [])

  const clearAndSetTypeFilter = useCallback((type: string) => {
    skipUrlToStateSync.current = true;
    dispatch({ type: 'SET_TYPE_FILTER', payload: type })
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
    (products: Product[]): Product[] => {
      let filtered = [...products]

      // 1. Filter by search query (if any)
      if (state.searchQuery) {
        const lowercasedQuery = state.searchQuery.toLowerCase()
        filtered = filtered.filter(p => {
          const name = p.name.toLowerCase()
          const type = p.type.toLowerCase()
          const namePt = p.name_pt?.toLowerCase() || ''
          
          return name.includes(lowercasedQuery) || type.includes(lowercasedQuery) || namePt.includes(lowercasedQuery)
        })
      }

      // 2. Apply active filters
      const activeFilterPredicates = state.activeFilters.map((filter) => createFilterPredicate(filter))
      if (activeFilterPredicates.length > 0) {
        filtered = filtered.filter((product) =>
          activeFilterPredicates.every((predicate) => predicate(product)),
        )
      }

      // 3. Apply sorting
      filtered.sort(getSortFunction(state.sortOption))
      return filtered
    },
    [state.activeFilters, state.searchQuery, state.sortOption],
  )

  // Sync active filters to URL
  useEffect(() => {
    const typeFilter = state.activeFilters.find(f => f.category === 'type')
    const currentParams = new URLSearchParams(searchParams.toString())
    
    if (typeFilter) {
      currentParams.set('type', typeFilter.value.toString())
    } else {
      currentParams.delete('type')
    }

    // Only update if params actually changed
    const newSearch = currentParams.toString()
    const currentSearch = searchParams.toString()
    
    if (newSearch !== currentSearch) {
      router.push(`${pathname}${newSearch ? `?${newSearch}` : ''}`, { scroll: false })
    }
  }, [state.activeFilters, pathname, router, searchParams])

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
      clearAndSetTypeFilter,
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

      // --- Loading state ---
      areFiltersInitialized
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
      clearAndSetTypeFilter,
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
      areFiltersInitialized
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
