"use client"

import { Suspense } from "react"
import ProductList from "@/components/product-list"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ProductListSkeleton } from "@/components/skeletons"
import { FilterProvider } from "@/context/filter-context"
import { PromotionalBanner } from "@/components/ui/promotional-banner"
import WelcomeMenu from "@/components/WelcomeMenu"
import { ExperimentedFiltersLayout } from "@/components/filters/ExperimentedFiltersSidebar"
import { PLPQuickFiltersRow } from "@/components/filters/PLPQuickFiltersRow"

export default function Home() {
  return (
    <FilterProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 max-w-site py-6">
          <div className="mx-auto max-w-7xl w-full px-4">
            <div className="space-y-2 mb-6">
              <WelcomeMenu />
              <h1 className="text-2xl font-bold tracking-tight text-[#202020]">All products</h1>
            </div>
            <PromotionalBanner />
            <ExperimentedFiltersLayout>
              <PLPQuickFiltersRow />
              <Suspense fallback={<ProductListSkeleton />}>
                <ProductList />
              </Suspense>
            </ExperimentedFiltersLayout>
          </div>
        </main>
        <Footer />
      </div>
    </FilterProvider>
  )
}
