"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useFilter } from "@/context/filter-context"
import { Loader2 } from "lucide-react"

export default function ProductsPage() {
  const { clearAllFilters } = useFilter()
  const router = useRouter()
  
  useEffect(() => {
    // Clear all filters and redirect to the home page
    clearAllFilters()
    router.push('/')
  }, [clearAllFilters, router])
  
  // This won't be displayed for long since we're redirecting
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-3" />
      <p className="text-gray-600">Redirecting to products...</p>
    </div>
  )
} 