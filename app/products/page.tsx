"use client"

import { useSearchParams } from "next/navigation"
import { ProductView } from "@/components/product-view"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const category = searchParams.get("type")
  
  return (
    <ProductView pageTitle={category || undefined} />
  )
} 