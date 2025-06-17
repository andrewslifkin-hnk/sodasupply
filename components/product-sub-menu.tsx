"use client"

import * as React from "react"
import { useFilter } from "@/context/filter-context"
import { useI18n } from "@/context/i18n-context"

const productTypeKeys = ["Sports Drink", "Soda", "Beverage", "Enhanced Water", "Juice"]

export function ProductSubMenu() {
  const { clearAndSetTypeFilter, activeFilters } = useFilter()
  const { t } = useI18n()

  const typeFilter = activeFilters.find((f) => f.category === "type")
  const selectedKey = typeFilter ? (typeFilter.value as string) : "All Products"

  const handleTypeSelect = (key: string) => {
    if (key === "All Products") {
      clearAndSetTypeFilter("")
    } else {
      clearAndSetTypeFilter(key)
    }
  }

  return (
    <div className="mb-4 border-b border-gray-200">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        <button
          key="All Products"
          onClick={() => handleTypeSelect("All Products")}
          className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors
            ${
              selectedKey === "All Products"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }
          `}
        >
          {t("products.all_products")}
        </button>
        {productTypeKeys.map((key) => {
          const translatedLabel = t(`product_types.${key}`)
          return (
            <button
              key={key}
              onClick={() => handleTypeSelect(key)}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  selectedKey === key
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              {translatedLabel}
            </button>
          )
        })}
      </nav>
    </div>
  )
} 