"use client"

import Image from "next/image"
import { Bell, BadgePercent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { useState, useEffect } from "react"
import { StatsigUser, createFeatureGate, identify } from "../flags"
import { useI18n } from "@/context/i18n-context"
import { formatCurrency } from "@/lib/i18n-utils"

// Feature flag hook for product card elements
function useFeatureFlag(flagKey: string) {
  const [enabled, setEnabled] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function checkFlag() {
      try {
        const userInfo = await identify()
        const flagEnabled = await createFeatureGate(flagKey)(userInfo)
        setEnabled(flagEnabled)
      } catch (error) {
        console.error('Error checking feature flag:', error)
        setEnabled(false)
      } finally {
        setLoading(false)
      }
    }
    
    checkFlag()
  }, [flagKey])

  return { enabled, loading }
}

export function ProductCard({
  product,
}: {
  product: {
    id: number
    name: string
    type: string
    price: number
    image: string
    size: string
    returnable: boolean
    inStock: boolean
    brand?: string
  }
}) {
  const { enabled: discountBadgeEnabled, loading: flagLoading } = useFeatureFlag("product_discount_badge")
  const [imgSrc, setImgSrc] = useState(product.image || '/placeholder_fallback.png')
  const { t, locale } = useI18n()
  
  return (
    <div className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out">
      <div className="relative">
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          <div className="bg-gray-100 text-[#202020] text-xs font-medium px-2 py-1 rounded">{product.type}</div>
          <div className="bg-gray-100 text-[#202020] text-xs font-medium px-2 py-1 rounded">{product.size}</div>
          
          {!flagLoading && discountBadgeEnabled && (
            <div className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
              <BadgePercent className="h-3 w-3" />
              {t('products.discount_badge')}
            </div>
          )}
        </div>

        <div className="relative h-48 bg-gray-50">
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
            loading="lazy"
            onError={() => setImgSrc('/placeholder_fallback.png')}
          />
        </div>

        <AddToCartButton
          product={product}
          className={cn("absolute bottom-4 right-4", !product.inStock && "opacity-50 cursor-not-allowed")}
        />
      </div>

      <div className="p-4">
        {product.returnable && (
          <div className="flex items-center gap-1 text-black text-xs font-medium mb-2">
            <span className="inline-block w-3 h-3 bg-black rounded-full"></span>
            {t('products.free_returns')}
          </div>
        )}

        {!product.inStock && (
          <div className="flex items-center gap-1 text-red-500 text-xs font-medium mb-2">
            <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
            {t('products.out_of_stock')}
          </div>
        )}

        <h3 className="font-medium text-[#202020] mb-1 line-clamp-2">{product.name}</h3>
        <div className="text-sm text-[#202020]/70 mb-2">
          {product.type} · {product.size}
        </div>
        <div className="flex items-center justify-between">
          <div className="font-bold text-[#202020]">{formatCurrency(product.price, locale)}</div>

          {!product.inStock && (
            <Button variant="outline" size="sm" className="text-xs h-8 gap-1">
              <Bell className="h-3 w-3" />
              {t('products.notify_me')}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
