"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ActiveFilter } from "@/types/filter-types"

interface FilterTagProps {
  filter: ActiveFilter
  onRemove: (id: string) => void
}

/**
 * Filter tag component
 * Displays an active filter with a remove button
 */
export function FilterTag({ filter, onRemove }: FilterTagProps) {
  return (
    <Badge variant="outline" className="rounded-full py-1 px-3 flex items-center gap-1 bg-white border-gray-300">
      {filter.displayValue || filter.label}
      <Button
        variant="ghost"
        size="icon"
        className="h-4 w-4 p-0 hover:bg-transparent"
        onClick={() => onRemove(filter.id)}
      >
        <X className="h-3 w-3" />
        <span className="sr-only">Remove {filter.label} filter</span>
      </Button>
    </Badge>
  )
}
