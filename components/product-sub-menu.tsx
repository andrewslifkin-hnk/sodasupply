"use client"

import * as React from "react"
import { useFilter } from "@/context/filter-context"
import { useI18n } from "@/context/i18n-context"
import { CheckboxFilterOption } from "@/types/filter-types"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export function ProductSubMenu() {
  const { categories, clearAndSetTypeFilter, activeFilters, areFiltersInitialized } = useFilter()
  const { t } = useI18n()

  const typeFilter = activeFilters.find((f) => f.category === "type")
  const selectedKey = typeFilter ? (typeFilter.value as string) : "All Products"

  const typeCategory = categories.find(c => c.id === 'type')
  const productTypeOptions = (typeCategory?.options as CheckboxFilterOption[] || [])

  const handleTypeSelect = (key: string) => {
    if (key === "All Products") {
      clearAndSetTypeFilter("")
    } else {
      clearAndSetTypeFilter(key)
    }
  }

  if (!areFiltersInitialized) {
    return (
      <div className="mb-4 border-b border-gray-200">
        <ScrollArea className="w-full whitespace-nowrap overflow-hidden">
          <div className="flex w-max space-x-6 -mb-px">
            <Skeleton className="h-8 w-24 shrink-0" />
            <Skeleton className="h-8 w-24 shrink-0" />
            <Skeleton className="h-8 w-24 shrink-0" />
            <Skeleton className="h-8 w-24 shrink-0" />
            <Skeleton className="h-8 w-24 shrink-0" />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    )
  }

  return (
    <div className="mb-4 border-b border-gray-200">
      <ScrollArea className="w-full whitespace-nowrap overflow-hidden">
        <nav className="-mb-px flex w-max space-x-6" aria-label="Tabs">
          <button
            key="All Products"
            onClick={() => handleTypeSelect("All Products")}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors shrink-0
              ${
                selectedKey === "All Products"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            {t("products.all_products")}
          </button>
          {productTypeOptions.map((option) => {
            return (
              <button
                key={option.id}
                onClick={() => handleTypeSelect(option.value)}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors shrink-0
                  ${
                    selectedKey === option.value
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                {option.label}
              </button>
            )
          })}
        </nav>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
} 