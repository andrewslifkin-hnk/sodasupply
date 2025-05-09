"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { motion } from "framer-motion"
import { getProducts } from "@/services/product-service"
import { ProductListSkeleton } from "@/components/skeletons"
import { useFilter } from "@/context/filter-context"

interface Product {
  id: number
  name: string
  type: string
  size: string
  price: number
  image: string
  returnable: boolean
  inStock: boolean
  brand?: string
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { activeFilters, sortOption, searchQuery, setFilteredProductCount, getActiveFiltersByCategory } = useFilter()

  // Fetch products whenever filters change
  useEffect(() => {
    let isMounted = true

    async function fetchProducts() {
      try {
        setLoading(true)
        // In a real app, you would pass the filters to your API
        // Here we'll fetch all products and filter them client-side
        const productsData = await getProducts(searchQuery || "")

        if (productsData.length > 0) {
          const mappedProducts = productsData.map((product) => ({
            id: product.id,
            name: product.name,
            type: product.type,
            size: product.size,
            price: product.price,
            image:
              product.image_url || `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(product.name)}`,
            returnable: product.returnable,
            inStock: product.in_stock,
            brand: product.name.split(" ")[0], // Extract brand from name for demo purposes
          }))

          if (isMounted) {
            setProducts(mappedProducts)
          }
        } else {
          // Fallback to default products if none are found in the database
          if (isMounted) {
            setProducts(defaultProducts)
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        if (isMounted) {
          setProducts(defaultProducts)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchProducts()

    return () => {
      isMounted = false
    }
  }, [searchQuery])

  // Apply filters to products
  const filteredProducts = products.filter((product) => {
    // If no filters are active, show all products
    if (activeFilters.length === 0) {
      return true
    }

    // Check if the product matches the search query
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Get active filters by category
    const typeFilters = getActiveFiltersByCategory("type")
    const packageFilters = getActiveFiltersByCategory("package")
    const sizeFilters = getActiveFiltersByCategory("size")
    const brandFilters = getActiveFiltersByCategory("brand")
    const availabilityFilters = getActiveFiltersByCategory("availability")

    // For each category with active filters, check if the product matches any filter in that category
    // If a category has no active filters, consider it a match

    // Check type filters
    const matchesType = typeFilters.length === 0 || typeFilters.some((filter) => product.type === filter.value)

    // Check package filters
    const matchesPackage =
      packageFilters.length === 0 ||
      packageFilters.some((filter) => product.name.toLowerCase().includes(filter.value.toLowerCase()))

    // Check size filters
    const matchesSize = sizeFilters.length === 0 || sizeFilters.some((filter) => product.size.includes(filter.value))

    // Check brand filters
    const matchesBrand =
      brandFilters.length === 0 ||
      brandFilters.some(
        (filter) =>
          product.brand?.toLowerCase().includes(filter.value.toLowerCase()) ||
          product.name.toLowerCase().includes(filter.value.toLowerCase()),
      )

    // Check availability filters
    const matchesAvailability =
      availabilityFilters.length === 0 ||
      availabilityFilters.some((filter) => {
        if (filter.value === "instock") return product.inStock
        if (filter.value === "returnable") return product.returnable
        return true
      })

    // Product must match all categories that have active filters
    return matchesType && matchesPackage && matchesSize && matchesBrand && matchesAvailability
  })

  // Update the filtered product count in the context
  useEffect(() => {
    setFilteredProductCount(filteredProducts.length)
  }, [filteredProducts.length, setFilteredProductCount])

  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "newest":
        return b.id - a.id // Using ID as a proxy for newness
      default: // featured
        return 0
    }
  })

  if (loading) {
    return <ProductListSkeleton />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedProducts.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <p className="text-lg text-gray-500">No products found matching your criteria</p>
          <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or search term</p>
        </div>
      ) : (
        sortedProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5 }}
            className="transition-all duration-300"
          >
            <ProductCard product={product} />
          </motion.div>
        ))
      )}
    </div>
  )
}

// Default products as fallback
const defaultProducts = [
  {
    id: 1,
    name: "Cola Classic 6-Pack",
    type: "Carbonated",
    size: "6 x 330ml",
    price: 4.99,
    image: "/cola-6pack.png",
    returnable: true,
    inStock: true,
    brand: "Cola",
  },
  {
    id: 2,
    name: "Sparkling Water Variety",
    type: "Water",
    size: "12 x 500ml",
    price: 6.49,
    image: "/sparkling-water-variety.png",
    returnable: true,
    inStock: false,
    brand: "Sparkling",
  },
  {
    id: 3,
    name: "Orange Soda",
    type: "Carbonated",
    size: "2L Bottle",
    price: 1.99,
    image: "/orange-soda-2l.png",
    returnable: false,
    inStock: true,
    brand: "Fanta",
  },
  {
    id: 4,
    name: "Lemon-Lime Soda Cans",
    type: "Carbonated",
    size: "8 x 330ml",
    price: 5.29,
    image: "/lemon-lime-cans.png",
    returnable: true,
    inStock: true,
    brand: "Sprite",
  },
  {
    id: 5,
    name: "Energy Drink 4-Pack",
    type: "Energy",
    size: "4 x 250ml",
    price: 7.99,
    image: "/energy-4pack.png",
    returnable: false,
    inStock: false,
    brand: "Energy",
  },
  {
    id: 6,
    name: "Iced Tea Peach",
    type: "Tea",
    size: "1.5L Bottle",
    price: 2.49,
    image: "/iced-tea-peach.png",
    returnable: true,
    inStock: true,
    brand: "Tea",
  },
  {
    id: 7,
    name: "Premium Still Water",
    type: "Water",
    size: "6 x 1L",
    price: 3.99,
    image: "/still-water-6pack.png",
    returnable: true,
    inStock: true,
    brand: "Water",
  },
  {
    id: 8,
    name: "Cola Zero Sugar",
    type: "Carbonated",
    size: "1.5L Bottle",
    price: 1.79,
    image: "/cola-zero-1.5l.png",
    returnable: true,
    inStock: true,
    brand: "Cola",
  },
  {
    id: 9,
    name: "Ginger Ale",
    type: "Carbonated",
    size: "4 x 330ml",
    price: 3.49,
    image: "/ginger-ale-4pack.png",
    returnable: true,
    inStock: true,
    brand: "Ginger",
  },
  {
    id: 10,
    name: "Heineken Lager Beer Case",
    type: "Beer",
    size: "24 x 330ml",
    price: 24.99,
    image: "/heineken-crate.png",
    returnable: true,
    inStock: true,
    brand: "Heineken",
  },
]
