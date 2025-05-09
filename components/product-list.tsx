"use client"

import { ProductCard } from "@/components/product-card"
import { motion } from "framer-motion"

// Replace the products array with sneaker products
const products = [
  {
    id: 1,
    name: "Air Max Pulse",
    type: "Running",
    size: "US 9",
    price: 149.99,
    image: "/sneaker-1.png",
    returnable: true,
    inStock: true,
  },
  {
    id: 2,
    name: "Ultra Boost 22",
    type: "Running",
    size: "US 10",
    price: 189.99,
    image: "/sneaker-2.png",
    returnable: true,
    inStock: false,
  },
  {
    id: 3,
    name: "Classic Leather",
    type: "Casual",
    size: "US 8.5",
    price: 79.99,
    image: "/sneaker-3.png",
    returnable: false,
    inStock: true,
  },
  {
    id: 4,
    name: "Dunk Low Retro",
    type: "Skateboarding",
    size: "US 11",
    price: 110.0,
    image: "/sneaker-4.png",
    returnable: true,
    inStock: true,
  },
  {
    id: 5,
    name: "Yeezy Boost 350",
    type: "Lifestyle",
    size: "US 9.5",
    price: 230.0,
    image: "/sneaker-5.png",
    returnable: false,
    inStock: false,
  },
  {
    id: 6,
    name: "Jordan 4 Retro",
    type: "Basketball",
    size: "US 10.5",
    price: 210.0,
    image: "/sneaker-6.png",
    returnable: true,
    inStock: true,
  },
]

interface ProductListProps {
  searchQuery?: string
}

export default function ProductList({ searchQuery = "" }: ProductListProps) {
  // Filter products based on search query
  const filteredProducts = searchQuery
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.type.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : products

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <p className="text-lg text-gray-500">No products found matching "{searchQuery}"</p>
          <p className="text-sm text-gray-400 mt-2">Try a different search term or browse all products</p>
        </div>
      ) : (
        filteredProducts.map((product) => (
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
