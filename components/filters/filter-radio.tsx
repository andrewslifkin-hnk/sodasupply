"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useFilter } from "@/context/filter-context"
import { FilterType, type RadioFilterOption, type ActiveFilter } from "@/types/filter-types"

interface FilterRadioGroupProps {
  options: RadioFilterOption[]
  groupId: string
  groupLabel: string
}

/**
 * Radio filter component
 * Used for single-select filtering
 */
export function FilterRadioGroup({ options, groupId, groupLabel }: FilterRadioGroupProps) {
  const { activeFilters, addFilter, removeFilter } = useFilter()

  // Find the currently selected option in this group
  const selectedOption = activeFilters.find(
    (filter) => filter.type === FilterType.RADIO && options.some((opt) => opt.id === filter.id),
  )

  const selectedValue = selectedOption?.id || ""

  const handleChange = (value: string) => {
    // Remove any existing selection in this group
    activeFilters
      .filter((filter) => filter.type === FilterType.RADIO && options.some((opt) => opt.id === filter.id))
      .forEach((filter) => removeFilter(filter.id))

    // If the user selected a value (not just deselecting)
    if (value) {
      const option = options.find((opt) => opt.id === value)
      if (option) {
        const activeFilter: ActiveFilter = {
          id: option.id,
          label: option.label,
          category: option.category,
          type: FilterType.RADIO,
          value: option.value,
        }
        addFilter(activeFilter)
      }
    }
  }

  return (
    <RadioGroup value={selectedValue} onValueChange={handleChange}>
      <div className="space-y-3">
        {options.map((option) => (
          <div key={option.id} className="flex flex-row-reverse items-center justify-between space-x-reverse space-x-2">
            <RadioGroupItem value={option.id} id={option.id} />
            <Label htmlFor={option.id}>{option.label}</Label>
          </div>
        ))}
      </div>
    </RadioGroup>
  )
}
