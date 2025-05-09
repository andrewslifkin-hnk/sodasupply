"use client"

import type React from "react"

import { useEffect, useRef, type FormEvent } from "react"
import { ArrowLeft, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSearch } from "@/context/search-context"
import Image from "next/image"
import { useRouter } from "next/navigation"

// Mock search results based on query - same as in SearchDropdown
const getSearchResults = (query: string) => {
  if (!query) return []

  // Mock data - in a real app, this would come from an API or database
  const products = [
    {
      id: 1,
      name: "Cola Classic 6-Pack",
      type: "Carbonated",
      size: "6 x 330ml",
      price: 4.99,
      image: "/cola-6pack.png",
      inStock: true,
    },
    {
      id: 2,
      name: "Sparkling Water Variety",
      type: "Water",
      size: "12 x 500ml",
      price: 6.49,
      image: "/sparkling-water-variety.png",
      inStock: false,
    },
    {
      id: 3,
      name: "Orange Soda",
      type: "Carbonated",
      size: "2L Bottle",
      price: 1.99,
      image: "/orange-soda-2l.png",
      inStock: true,
    },
    {
      id: 4,
      name: "Lemon-Lime Soda Cans",
      type: "Carbonated",
      size: "8 x 330ml",
      price: 5.29,
      image: "/lemon-lime-cans.png",
      inStock: true,
    },
    {
      id: 5,
      name: "Energy Drink 4-Pack",
      type: "Energy",
      size: "4 x 250ml",
      price: 7.99,
      image: "/energy-4pack.png",
      inStock: false,
    },
    {
      id: 6,
      name: "Iced Tea Peach",
      type: "Tea",
      size: "1.5L Bottle",
      price: 2.49,
      image: "/iced-tea-peach.png",
      inStock: true,
    },
    {
      id: 7,
      name: "Premium Still Water",
      type: "Water",
      size: "6 x 1L",
      price: 3.99,
      image: "/still-water-6pack.png",
      inStock: true,
    },
    {
      id: 8,
      name: "Cola Zero Sugar",
      type: "Carbonated",
      size: "1.5L Bottle",
      price: 1.79,
      image: "/cola-zero-1.5l.png",
      inStock: true,
    },
    {
      id: 9,
      name: "Ginger Ale",
      type: "Carbonated",
      size: "4 x 330ml",
      price: 3.49,
      image: "/ginger-ale-4pack.png",
      inStock: true,
    },
  ]

  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.type.toLowerCase().includes(query.toLowerCase()),
  )
}

export function SearchOverlay() {
  const { isSearchOpen, searchQuery, closeSearch, setSearchQuery, submitSearch } = useSearch()
  const inputRef = useRef<HTMLInputElement>(null)
  const results = getSearchResults(searchQuery)
  const router = useRouter()

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
              type="text"
              placeholder="Search products"
              value={searchQuery}
              onChange={handleSearchChange}
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
