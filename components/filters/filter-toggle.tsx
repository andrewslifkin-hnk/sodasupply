"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useFilter } from "@/context/filter-context"
import { FilterType, type ToggleFilterOption, type ActiveFilter } from "@/types/filter-types"

interface FilterToggleProps {
  option: ToggleFilterOption
  hideLabel?: boolean
}

/**
 * Toggle filter component
 * Used for boolean filtering
 */
export function FilterToggle({ option, hideLabel = false }: FilterToggleProps) {
  const { isFilterActive, addFilter, removeFilter } = useFilter()

  const isActive = isFilterActive(option.id)

  const handleChange = (checked: boolean) => {
    if (checked) {
      const activeFilter: ActiveFilter = {
        id: option.id,
        label: option.label,
        category: option.category,
        type: FilterType.TOGGLE,
        value: true,
      }
      addFilter(activeFilter)
    } else {
      removeFilter(option.id)
    }
  }

  const handleToggle = () => {
    handleChange(!isActive)
  }

  return (
    <div 
      className="flex items-center justify-between space-x-2 cursor-pointer hover:bg-gray-50 p-2 -m-2 rounded-md transition-colors"
      onClick={handleToggle}
    >
      {!hideLabel && (
        <Label className="text-base cursor-pointer flex-1 select-none">
          {option.label}
        </Label>
      )}
      <Switch
        id={option.id}
        checked={isActive}
        onCheckedChange={handleChange}
        className="data-[state=checked]:bg-black"
      />
    </div>
  )
}
