"use client"

import { useRef } from "react"
import { useSearch } from "@/context/search-context"
import { useOnClickOutside } from "@/hooks/use-click-outside"
import Image from "next/image"
import { Search } from "lucide-react"
import { getProducts } from "@/services/product-service"
import { useState, useEffect } from "react"
import { useI18n } from "@/context/i18n-context"
import { formatCurrency } from "@/lib/i18n-utils"

interface SearchProduct {
  id: number
  name: string
  type: string
  size: string
  price: number
  image: string
  inStock: boolean
}

export function SearchDropdown() {
  const { isSearchOpen, searchQuery, closeSearch, submitSearch } = useSearch()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [results, setResults] = useState<SearchProduct[]>([])
  const [loading, setLoading] = useState(false)
  const { t, locale } = useI18n()

  // Close dropdown when clicking outside
  useOnClickOutside<HTMLDivElement>(dropdownRef, closeSearch)

  // Fetch search results when query changes
  useEffect(() => {
    if (!searchQuery) {
      setResults([])
      return
    }

    async function fetchSearchResults() {
      setLoading(true)
      try {
        const productsData = await getProducts(searchQuery, locale)
        const mappedResults = productsData.map((product) => ({
          id: product.id,
          name: product.name,
          type: product.type,
          size: product.size,
          price: product.price,
          image: product.image_url || `/placeholder.svg?height=64&width=64&query=${encodeURIComponent(product.name)}`,
          inStock: product.in_stock,
        }))
        setResults(mappedResults)
      } catch (error) {
        console.error("Error fetching search results:", error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    fetchSearchResults()
  }, [searchQuery, locale])

  if (!isSearchOpen || !searchQuery) return null

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-50 overflow-hidden max-h-[80vh] overflow-y-auto"
    >
      <div className="p-3 border-b text-sm text-gray-500">{loading ? "Searching..." : `${results.length} results`}</div>

      <div className="divide-y">
        {results.map((product) => (
          <div key={product.id} className="p-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer">
            <div className="relative h-16 w-16 bg-gray-100 rounded">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-contain p-2"
                sizes="64px"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{product.name}</h4>
              <p className="text-sm text-gray-500">
                {product.type} • {product.size}
              </p>
              <p className="font-bold mt-1">{formatCurrency(product.price, locale)}</p>
            </div>
            {!product.inStock && <div className="text-red-500 text-sm font-medium">out of stock</div>}
          </div>
        ))}
      </div>

      {results.length > 0 && (
        <div 
          className="p-3 border-t flex items-center gap-2 hover:bg-gray-50 cursor-pointer"
          onClick={submitSearch}
        >
          <Search className="h-4 w-4" />
          <span className="text-sm">View all results for "{searchQuery}"</span>
        </div>
      )}
    </div>
  )
}
