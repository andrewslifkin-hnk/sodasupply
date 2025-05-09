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
