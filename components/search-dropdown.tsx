"use client"

import { useRef } from "react"
import { useSearch } from "@/context/search-context"
import { useOnClickOutside } from "@/hooks/use-click-outside"
import Image from "next/image"
import { Search } from "lucide-react"

// Mock search results based on query
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

export function SearchDropdown() {
  const { isSearchOpen, searchQuery, closeSearch } = useSearch()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const results = getSearchResults(searchQuery)

  // Close dropdown when clicking outside
  useOnClickOutside(dropdownRef, closeSearch)

  if (!isSearchOpen || !searchQuery) return null

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-50 overflow-hidden max-h-[80vh] overflow-y-auto"
    >
      <div className="p-3 border-b text-sm text-gray-500">{results.length} results</div>

      <div className="divide-y">
        {results.map((product) => (
          <div key={product.id} className="p-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer">
            <div className="relative h-16 w-16 bg-gray-100 rounded">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-contain p-2" />
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

      <div className="p-3 border-t flex items-center gap-2 hover:bg-gray-50 cursor-pointer">
        <Search className="h-4 w-4" />
        <span className="text-sm">View all results for "{searchQuery}"</span>
      </div>
    </div>
  )
}
