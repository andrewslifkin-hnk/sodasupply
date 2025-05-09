"use client"

import { Suspense } from "react"
import ProductList from "@/components/product-list"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { FilterBar } from "@/components/filter-bar"
import { ProductListSkeleton } from "@/components/skeletons"
import { FilterProvider } from "@/context/filter-context"

export default function Home() {
  return (
    <FilterProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="space-y-2 mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-[#202020]">All products</h1>
            <p className="text-[#202020]/80">
              Distributor:{" "}
              <span className="font-medium underline underline-offset-4 decoration-black/30 hover:decoration-black transition-all cursor-pointer">
                Atlas Beverages
              </span>
            </p>
          </div>

          <FilterBar />

          <div className="h-px w-full bg-gray-200 my-4"></div>

          <Suspense fallback={<ProductListSkeleton />}>
            <ProductList />
          </Suspense>
        </main>
        <Footer />
      </div>
    </FilterProvider>
  )
}
