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
