"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { useFilter } from "@/context/filter-context"
import { FilterType, type RangeFilterOption, type ActiveFilter } from "@/types/filter-types"
import { Input } from "@/components/ui/input"
import { debounce } from "lodash"

interface FilterRangeProps {
  option: RangeFilterOption
}

/**
 * Range filter component
 * Used for numerical range filtering (e.g., price)
 */
export function FilterRange({ option }: FilterRangeProps) {
  const { activeFilters, addFilter, removeFilter } = useFilter()

  // Find if this range filter is already active
  const activeFilter = activeFilters.find((filter) => filter.type === FilterType.RANGE && filter.id === option.id)

  // Initialize with default or active values
  const [range, setRange] = useState<[number, number]>(
    activeFilter
      ? (activeFilter.value as [number, number])
      : [option.currentMin || option.min, option.currentMax || option.max],
  )

  // Debounced function to update the filter
  const updateFilter = debounce((newRange: [number, number]) => {
    // Remove existing filter for this option
    if (activeFilter) {
      removeFilter(option.id)
    }

    // Add new filter with updated range
    const filter: ActiveFilter = {
      id: option.id,
      label: option.label,
      category: option.category,
      type: FilterType.RANGE,
      value: newRange,
      displayValue: `€${newRange[0]} - €${newRange[1] === option.max ? newRange[1] + "+" : newRange[1]}`,
    }

    addFilter(filter)
  }, 300)

  // Handle slider change
  const handleSliderChange = (newRange: number[]) => {
    const typedRange: [number, number] = [newRange[0], newRange[1]]
    setRange(typedRange)
    updateFilter(typedRange)
  }

  // Handle min input change
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.max(option.min, Math.min(Number.parseFloat(e.target.value) || option.min, range[1]))
    const newRange: [number, number] = [newMin, range[1]]
    setRange(newRange)
    updateFilter(newRange)
  }

  // Handle max input change
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.min(option.max, Math.max(Number.parseFloat(e.target.value) || option.max, range[0]))
    const newRange: [number, number] = [range[0], newMax]
    setRange(newRange)
    updateFilter(newRange)
  }

  // Update local state when active filter changes
  useEffect(() => {
    if (activeFilter) {
      setRange(activeFilter.value as [number, number])
    } else {
      setRange([option.currentMin || option.min, option.currentMax || option.max])
    }
  }, [activeFilter, option.currentMin, option.currentMax, option.min, option.max])

  return (
    <div className="space-y-4">
      <Slider
        defaultValue={range}
        value={range}
        min={option.min}
        max={option.max}
        step={option.step || 1}
        onValueChange={handleSliderChange}
        className="my-6"
      />

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label htmlFor={`${option.id}-min`} className="text-xs text-gray-500 mb-1 block">
            Min
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
            <Input
              id={`${option.id}-min`}
              type="number"
              min={option.min}
              max={range[1]}
              value={range[0]}
              onChange={handleMinChange}
              className="pl-7"
            />
          </div>
        </div>

        <div className="flex-1">
          <label htmlFor={`${option.id}-max`} className="text-xs text-gray-500 mb-1 block">
            Max
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
            <Input
              id={`${option.id}-max`}
              type="number"
              min={range[0]}
              max={option.max}
              value={range[1]}
              onChange={handleMaxChange}
              className="pl-7"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
