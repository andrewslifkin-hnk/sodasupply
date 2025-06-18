"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { motion } from "framer-motion"
import { getProducts, Product } from "@/services/product-service"
import { ProductListSkeleton } from "@/components/skeletons"
import { useFilter } from "@/context/filter-context"
import { useInView } from "react-intersection-observer"
import { useI18n } from "@/context/i18n-context"
import { FilterTags } from "./filters/filter-tags"

// Main products list component
export default function ProductList() {
  const { filterProducts, searchQuery } = useFilter()
  const [products, setProducts] = useState<React.ReactNode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { ref, inView } = useInView({ threshold: 0.5 })
  const { t, locale } = useI18n()

  const PRODUCTS_PER_PAGE = 12

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true)
      const allProducts = await getProducts(searchQuery || undefined, locale)
      const filtered = filterProducts(allProducts)

      const paginated = filtered.slice(0, page * PRODUCTS_PER_PAGE)
      setHasMore(filtered.length > paginated.length)

      const productComponents = paginated.map((p) => (
        <ProductCard
          key={p.id}
          product={{
            id: p.id,
            name: p.name,
            type: p.type,
            price: p.price,
            image: p.image_url,
            size: p.size,
            returnable: p.returnable,
            inStock: p.in_stock,
            brand: p.name.split(" ")[0],
          }}
        />
      ))

      setProducts(productComponents)
      setIsLoading(false)
    }
    loadProducts()
  }, [page, filterProducts, searchQuery, locale])

  useEffect(() => {
    if (inView && !isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1)
    }
  }, [inView, isLoading, hasMore])

  if (isLoading && products.length === 0) {
    return <ProductListSkeleton />
  }

  return (
    <>
      <FilterTags />
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {products}
      </motion.div>
      {hasMore && (
        <div ref={ref} className="text-center py-8">
          <p>{t("common.loading")}</p>
        </div>
      )}
      {!hasMore && products.length === 0 && (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-2">{t("filters.no_products_found")}</h2>
          <p className="text-gray-600">{t("filters.try_adjusting_filters")}</p>
        </div>
      )}
    </>
  )
}

// Default products as fallback
const defaultProducts: Product[] = [
  {
    id: 27,
    name: "Premium Cola Variety Pack",
    type: "Soda",
    size: "12 x 12 fl oz",
    price: 14.99,
    image_url: "/products/04b0220b-def5-4481-b27-00d6c55d6234.c306a466de3157600795cc1064b62953.jpeg",
    returnable: true,
    in_stock: true,
  },
  {
    id: 28,
    name: "Citrus Sparkling Beverage",
    type: "Sparkling Water",
    size: "8 x 12 fl oz",
    price: 9.99,
    image_url: "/products/8aa3f01a-9f6d-43c4-a1f3-0a33fa8dad1d.46c5fde827e0adee668603f00cc44de5.jpeg",
    returnable: true,
    in_stock: true,
  },
  {
    id: 100,
    name: "Grape Juice Premium",
    type: "Juice",
    size: "6 x 12 fl oz",
    price: 7.99,
    image_url: "/products/25a0ccac-e863-4d9b-948f-87e50ff668dc.9f835718233d2bc5a5618e5a44ac9235.jpeg",
    returnable: true,
    in_stock: true,
  },
]
