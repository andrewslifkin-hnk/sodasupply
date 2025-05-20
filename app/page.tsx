"use client"

import { Suspense } from "react"
import ProductList from "@/components/product-list"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ProductListSkeleton } from "@/components/skeletons"
import { FilterProvider } from "@/context/filter-context"
import { FilterBar } from "@/components/filters/filter-bar"
import { FilterSheet } from "@/components/filters/filter-sheet"
import { PromotionalBanner } from "@/components/ui/promotional-banner"

export default function Home() {
  return (
    <FilterProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 max-w-site py-6">
          <div className="content-container">
            <div className="space-y-2 mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-[#202020]">All products</h1>
              <p className="text-[#202020]/80">
                Distributor:{" "}
                <span className="font-medium underline underline-offset-4 decoration-black/30 hover:decoration-black transition-all cursor-pointer">
                  Atlas Beverages
                </span>
              </p>
            </div>
            
            <PromotionalBanner />

            <FilterBar />
            <FilterSheet />

            <div className="h-px w-full bg-gray-200 my-4"></div>

            <Suspense fallback={<ProductListSkeleton />}>
              <ProductList />
            </Suspense>
          </div>
        </main>
        <Footer />
      </div>
    </FilterProvider>
  )
}
