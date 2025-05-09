"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useFilter } from "@/context/filter-context"
import { FilterType, type CheckboxFilterOption, type ActiveFilter } from "@/types/filter-types"

interface FilterCheckboxProps {
  option: CheckboxFilterOption
}

/**
 * Checkbox filter component
 * Used for multi-select filtering
 */
export function FilterCheckbox({ option }: FilterCheckboxProps) {
  const { isFilterActive, addFilter, removeFilter } = useFilter()

  const isActive = isFilterActive(option.id)

  const handleChange = () => {
    if (isActive) {
      removeFilter(option.id)
    } else {
      const activeFilter: ActiveFilter = {
        id: option.id,
        label: option.label,
        category: option.category,
        type: FilterType.CHECKBOX,
        value: option.value,
      }
      addFilter(activeFilter)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={option.id}
        checked={isActive}
        onCheckedChange={handleChange}
        className="h-5 w-5 rounded-sm border-gray-300 data-[state=checked]:bg-black data-[state=checked]:border-black cursor-pointer"
      />
      <Label htmlFor={option.id} className="text-base cursor-pointer" onClick={handleChange}>
        {option.label}
      </Label>
    </div>
  )
}
