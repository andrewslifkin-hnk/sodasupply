"use client"

import type React from "react"

import { useEffect, useRef, type FormEvent } from "react"
import { ArrowLeft, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSearch } from "@/context/search-context"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { getProducts } from "@/services/product-service"
import { useState } from "react"
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

export function SearchOverlay() {
  const { isSearchOpen, searchQuery, closeSearch, setSearchQuery, submitSearch } = useSearch()
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const [results, setResults] = useState<SearchProduct[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t, locale } = useI18n()

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      // Focus the input when the overlay opens
      inputRef.current.focus()
    }
  }, [isSearchOpen])

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

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault()
    submitSearch()
  }

  // Handle input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Simple and reliable approach to clear search
  const handleClearSearch = () => {
    // Clear the search query in the context
    setSearchQuery("")

    // Close the search overlay
    closeSearch()

    // Navigate to home page without query parameters
    router.push("/")
  }

  // Prevent default touch behavior to avoid closing the overlay when scrolling
  const handleTouchMove = (e: React.TouchEvent) => {
    // Allow scrolling in the results area
    if (resultsRef.current && resultsRef.current.contains(e.target as Node)) {
      e.stopPropagation()
    }
  }

  const handleProductClick = (productId: number) => {
    closeSearch()
    router.push(`/products/${productId}`)
  }

  if (!isSearchOpen) return null

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <form onSubmit={handleSearchSubmit}>
        <div className="flex items-center p-4 border-b">
          <Button type="button" variant="ghost" size="icon" onClick={closeSearch} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">{t('common.back')}</span>
          </Button>
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              type="text"
              placeholder={t('search.search_products_placeholder')}
              value={searchQuery}
              onChange={handleSearchChange}
              inputMode="search"
              className="pl-4 pr-10 border-gray-200 rounded-full w-full"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full hover:bg-gray-100 transition-colors"
              onClick={searchQuery ? handleClearSearch : undefined}
            >
              {searchQuery ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </form>

      {!searchQuery ? (
        <div className="p-4 text-gray-500">{t('search.type_to_search')}</div>
      ) : (
        <div className="flex-1 overflow-auto" ref={resultsRef} onTouchMove={handleTouchMove}>
          <div className="p-3 border-b text-sm text-gray-500">
            {loading ? t('search.searching') : t('search.results_count', { count: results.length })}
          </div>

          <div className="divide-y">
            {results.map((product) => (
              <div 
                key={product.id} 
                className="p-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleProductClick(product.id)}
              >
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
                {!product.inStock && <div className="text-red-500 text-sm font-medium">{t('products.out_of_stock')}</div>}
              </div>
            ))}
          </div>

          {results.length > 0 && (
            <div
              className="p-3 border-t flex items-center gap-2 hover:bg-gray-50 cursor-pointer"
              onClick={submitSearch}
            >
              <Search className="h-4 w-4" />
              <span className="text-sm">{t('search.view_all_results', { query: searchQuery })}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
