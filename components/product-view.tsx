"use client"

import { Suspense } from "react"
import ProductList from "@/components/product-list"
import { ProductListSkeleton } from "@/components/skeletons"
import { FilterBar } from "@/components/filters/filter-bar"
import { FilterSheet } from "@/components/filters/filter-sheet"
import { PromotionalBanner } from "@/components/ui/promotional-banner"
import WelcomeMenu from "@/components/WelcomeMenu"
import { FilterSidebar } from "@/components/filters/filter-sidebar"
import { useFilter } from "@/context/filter-context"
import { FilterTags } from "@/components/filters/filter-tags"
import { useI18n } from "@/context/i18n-context"
import { ProductSubMenu } from "@/components/product-sub-menu"
import { useDistributorFeatureFlag } from "@/hooks/use-distributor-feature-flag"

export function ProductView({ pageTitle }: { pageTitle?: string }) {
  const { staticSidebarEnabled, filteredProductCount } = useFilter()
  const { t } = useI18n()
  const isDistributorVisible = useDistributorFeatureFlag()
  const title = pageTitle || t('products.all_products')
  
  return (
    <div className="content-container">
      {staticSidebarEnabled ? (
        <>
          {/* Products title and distributor selector in a single row, full width */}
          <div className="flex items-center justify-between w-full mt-2 mb-4">
            <h1 className="text-2xl font-bold tracking-tight text-[#202020]">{title}</h1>
            {isDistributorVisible && (
              <span className="text-[#202020]/80">
                {t('products.distributor')}:{" "}
                <span className="font-medium underline underline-offset-4 decoration-black/30 hover:decoration-black transition-all cursor-pointer">
                  {t('products.atlas_beverages')}
                </span>
              </span>
            )}
          </div>
          {/* Flex row: sidebar and main content */}
          <div className="flex w-full">
            <FilterSidebar />
            <div className="flex-1 ml-8 flex flex-col">
              <PromotionalBanner />
              {/* Product count */}
              <div className="mb-2 text-gray-700 font-medium">{t('products.products_count', { count: filteredProductCount })}</div>
              <Suspense fallback={<ProductListSkeleton />}>
                <ProductList />
              </Suspense>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Mobile/tablet layout */}
          <PromotionalBanner />
          <WelcomeMenu />
          <div className="mb-4 px-4 md:px-0">
            <h1 className="text-2xl font-bold tracking-tight text-[#202020] mb-4">{title}</h1>
            {isDistributorVisible && (
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#202020]/80">
                  {t('products.distributor')}:{" "}
                  <span className="font-medium underline underline-offset-4 decoration-black/30 hover:decoration-black transition-all cursor-pointer">
                    {t('products.atlas_beverages')}
                  </span>
                </span>
              </div>
            )}
            {/* Sub menu */}
            <ProductSubMenu />
            <FilterBar />
            <FilterSheet />
            {/* Product count for mobile/tablet layout */}
            <div className="mb-2 text-gray-700 font-medium">{t('products.products_count', { count: filteredProductCount })}</div>
          </div>
          <Suspense fallback={<ProductListSkeleton />}>
            <ProductList />
          </Suspense>
        </>
      )}
    </div>
  )
} 