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
import WelcomeMenu from "@/components/WelcomeMenu"
import { FilterSidebar } from "@/components/filters/filter-sidebar"
import { useFilter } from "@/context/filter-context"
import { FilterTags } from "@/components/filters/filter-tags"

function HomeContent() {
  const { staticSidebarEnabled, filteredProductCount } = useFilter()
  return (
    <div className="content-container">
      {staticSidebarEnabled ? (
        <>
          {/* Products title and distributor selector in a single row, full width */}
          <div className="flex items-center justify-between w-full mt-2 mb-4">
            <h1 className="text-2xl font-bold tracking-tight text-[#202020]">Products</h1>
            <span className="text-[#202020]/80">
              Distributor: {" "}
              <span className="font-medium underline underline-offset-4 decoration-black/30 hover:decoration-black transition-all cursor-pointer">
                Atlas Beverages
              </span>
            </span>
          </div>
          {/* Flex row: sidebar and main content */}
          <div className="flex w-full">
            <FilterSidebar />
            <div className="flex-1 ml-8 flex flex-col">
              <PromotionalBanner />
              {/* Applied filters bar */}
              <div className="mb-4">
                <FilterTags />
              </div>
              {/* Product count */}
              <div className="mb-2 text-gray-700 font-medium">{filteredProductCount} products</div>
              <Suspense fallback={<ProductListSkeleton />}>
                <ProductList />
              </Suspense>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2 mb-6">
            <WelcomeMenu />
            <h1 className="text-2xl font-bold tracking-tight text-[#202020]">Products</h1>
            <p className="text-[#202020]/80">
              Distributor: {" "}
              <span className="font-medium underline underline-offset-4 decoration-black/30 hover:decoration-black transition-all cursor-pointer">
                Atlas Beverages
              </span>
            </p>
          </div>
          <PromotionalBanner />
          <FilterBar />
          <div className="flex w-full">
            <div className="flex-1">
              <FilterSheet />
              <div className="h-px w-full bg-gray-200 my-4"></div>
              <Suspense fallback={<ProductListSkeleton />}>
                <ProductList />
              </Suspense>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function Home() {
  return (
    <FilterProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 max-w-site py-6">
          <HomeContent />
        </main>
        <Footer />
      </div>
    </FilterProvider>
  )
}
