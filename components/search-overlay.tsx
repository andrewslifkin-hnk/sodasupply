"use client"

import { useEffect, useRef, type FormEvent } from "react"
import { ArrowLeft, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSearch } from "@/context/search-context"
import Image from "next/image"

// Mock search results based on query - same as in SearchDropdown
const getSearchResults = (query: string) => {
  if (!query) return []

  // Mock data - in a real app, this would come from an API or database
  const products = [
    {
      id: 1,
      name: "Air Max Pulse",
      type: "Running",
      size: "US 9",
      price: 149.99,
      image: "/sneaker-1.png",
      inStock: true,
    },
    {
      id: 2,
      name: "Ultra Boost 22",
      type: "Running",
      size: "US 10",
      price: 189.99,
      image: "/sneaker-2.png",
      inStock: false,
    },
    {
      id: 3,
      name: "Classic Leather",
      type: "Casual",
      size: "US 8.5",
      price: 79.99,
      image: "/sneaker-3.png",
      inStock: true,
    },
    {
      id: 4,
      name: "Dunk Low Retro",
      type: "Skateboarding",
      size: "US 11",
      price: 110.0,
      image: "/sneaker-4.png",
      inStock: true,
    },
  ]

  return products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()))
}

export function SearchOverlay() {
  const { isSearchOpen, searchQuery, closeSearch, setSearchQuery, submitSearch, clearSearch } = useSearch()
  const inputRef = useRef<HTMLInputElement>(null)
  const results = getSearchResults(searchQuery)

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      // Focus the input when the overlay opens
      inputRef.current.focus()
    }
  }, [isSearchOpen])

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault()
    submitSearch()
  }

  const handleClearSearch = () => {
    if (searchQuery) {
      clearSearch()
    }
  }

  if (!isSearchOpen) return null

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <form onSubmit={handleSearchSubmit}>
        <div className="flex items-center p-4 border-b">
          <Button type="button" variant="ghost" size="icon" onClick={closeSearch} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              type="search"
              placeholder="Search products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 pr-10 border-gray-200 rounded-full w-full"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={handleClearSearch}
            >
              {searchQuery ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </form>

      {!searchQuery ? (
        <div className="p-4 text-gray-500">Type to search for products</div>
      ) : (
        <div className="flex-1 overflow-auto">
          <div className="p-3 border-b text-sm text-gray-500">{results.length} results</div>

          <div className="divide-y">
            {results.map((product) => (
              <div key={product.id} className="p-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer">
                <div className="relative h-16 w-16 bg-gray-100 rounded">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-sm text-gray-500">
                    {product.type} • {product.size}
                  </p>
                  <p className="font-bold mt-1">€ {product.price.toFixed(2)}</p>
                </div>
                {!product.inStock && <div className="text-red-500 text-sm font-medium">out of stock</div>}
              </div>
            ))}
          </div>

          <div className="p-3 border-t flex items-center gap-2 hover:bg-gray-50 cursor-pointer" onClick={submitSearch}>
            <Search className="h-4 w-4" />
            <span className="text-sm">View all results for "{searchQuery}"</span>
          </div>
        </div>
      )}
    </div>
  )
}
