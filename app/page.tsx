"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import ProductList from "@/components/product-list"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { FilterBar } from "@/components/filter-bar"
import { ProductListSkeleton } from "@/components/skeletons"
import { useSearch } from "@/context/search-context"

export default function Home() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("q") || ""
  const { setSearchQuery } = useSearch()
  const [isSearchResults, setIsSearchResults] = useState(false)

  // Update the search context when the URL query parameter changes
  useEffect(() => {
    if (searchQuery) {
      setSearchQuery(searchQuery)
      setIsSearchResults(true)
    } else {
      setIsSearchResults(false)
    }
  }, [searchQuery, setSearchQuery])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="space-y-2 mb-6">
          {isSearchResults ? (
            <>
              <h1 className="text-2xl font-bold tracking-tight text-[#202020]">Search results for "{searchQuery}"</h1>
              <p className="text-[#202020]/80">Showing products matching your search</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold tracking-tight text-[#202020]">All products</h1>
              <p className="text-[#202020]/80">
                Distributor:{" "}
                <span className="font-medium underline underline-offset-4 decoration-black/30 hover:decoration-black transition-all cursor-pointer">
                  Sneaker Vault
                </span>
              </p>
            </>
          )}
        </div>

        <FilterBar />

        <div className="h-px w-full bg-gray-200 my-4"></div>

        <p className="text-[#202020]/70 mb-6">{isSearchResults ? "Matching products" : "24 products"}</p>

        <Suspense fallback={<ProductListSkeleton />}>
          <ProductList searchQuery={searchQuery} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
