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
  const { searchQuery, sortOption, filterProducts, setFilteredProductCount } = useFilter()

  // Fetch products whenever search query changes
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
            setLoading(false)
          }
        } else {
          // Fallback to default products if none are found in the database
          if (isMounted) {
            setProducts(defaultProducts)
            setLoading(false)
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        if (isMounted) {
          setProducts(defaultProducts)
          setLoading(false)
        }
      }
    }

    fetchProducts()

    return () => {
      isMounted = false
    }
  }, [searchQuery])

  // Apply filters to products (now solely from context)
  const filteredProducts = filterProducts(products)

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
    id: 27,
    name: "Premium Cola Variety Pack",
    type: "Soda",
    size: "12 x 12 fl oz",
    price: 14.99,
    image: "/products/04b0220b-def5-4481-b727-00d6c55d6234.c306a466de3157600795cc1064b62953.jpeg",
    returnable: true,
    inStock: true,
    brand: "Assorted",
  },
  {
    id: 28,
    name: "Citrus Sparkling Beverage",
    type: "Sparkling Water",
    size: "8 x 12 fl oz",
    price: 9.99,
    image: "/products/8aa3f01a-9f6d-43c4-a1f3-0a33fa8dad1d.46c5fde827e0adee668603f00cc44de5.jpeg",
    returnable: true,
    inStock: true,
    brand: "Citrus",
  },
  {
    id: 100,
    name: "Grape Juice Premium",
    type: "Juice",
    size: "6 x 12 fl oz",
    price: 7.99,
    image: "/products/25a0ccac-e863-4d9b-948f-87e50ff668dc.9f835718233d2bc5a5618e5a44ac9235.jpeg",
    returnable: true,
    inStock: true,
    brand: "Grape",
  },
]
