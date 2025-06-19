"use client"

import Image from "next/image"
import { Heart, Recycle, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { useState, useEffect } from "react"
import { StatsigUser, createFeatureGate, identify } from "../flags"
import { useI18n } from "@/context/i18n-context"
import { formatCurrency, normalizeSize } from "@/lib/i18n-utils"

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
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { t, locale } = useI18n()
  
  // Calculate per-bottle price (assuming most products come in packs)
  const calculatePerBottlePrice = () => {
    // Extract number from size string for bottle count estimation
    const sizeMatch = product.size.match(/(\d+)/)
    const bottleCount = sizeMatch ? parseInt(sizeMatch[1]) : 1
    return bottleCount > 1 ? product.price / bottleCount : product.price
  }
  
  const perBottlePrice = calculatePerBottlePrice()
  
  // Generate a random SKU based on product ID
  const generateSKU = (productId: string): string => {
    // Create a hash-like number from the product ID for consistency
    let hash = 0
    for (let i = 0; i < productId.length; i++) {
      const char = productId.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    
    // Generate a SKU in format: ABC-1234
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const prefix = letters[Math.abs(hash) % 26] + 
                  letters[Math.abs(hash >> 5) % 26] + 
                  letters[Math.abs(hash >> 10) % 26]
    const numbers = String(Math.abs(hash) % 10000).padStart(4, '0')
    
    return `${prefix}-${numbers}`
  }

  const skuNumber = generateSKU(product.id.toString())
  
  // Determine if product should show eco-friendly badges
  const isEcoFriendly = product.returnable || product.type.toLowerCase().includes('organic') || product.name.toLowerCase().includes('eco')
  
  // Random badges for demo (in real app, these would come from product data)
  const showNewBadge = product.id % 7 === 0
  const showPromoBadge = product.id % 5 === 0 && product.id % 7 !== 0
  const showDiscountBadge = !flagLoading && discountBadgeEnabled && product.id % 3 === 0
  
  return (
    <div className="bg-white border border-gray-200 overflow-hidden pt-4 flex flex-col h-full">
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {showPromoBadge && (
          <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            1 + 1 Bouteille
          </div>
        )}
        {showNewBadge && (
          <div className="bg-teal-700 text-white text-xs font-bold px-2 py-1 rounded">
            New
          </div>
        )}
        {showDiscountBadge && (
          <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            -20%
          </div>
        )}
      </div>

      {/* Product Image */}
      <div className="relative h-48 p-4">
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          className={cn(
            "object-contain transition-all duration-300",
            !product.inStock && "grayscale opacity-50"
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          loading="lazy"
          onError={() => setImgSrc('/placeholder_fallback.png')}
        />
        
        {/* Eco-friendly icons */}
        {isEcoFriendly && (
          <div className="absolute bottom-2 left-2 flex gap-1">
            <div className="bg-green-100 p-1 rounded-full">
              <Recycle className="h-4 w-4 text-green-600" />
            </div>
            <div className="bg-green-100 p-1 rounded-full">
              <Leaf className="h-4 w-4 text-green-600" />
            </div>
          </div>
        )}
        
        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[1px]">
            <div className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium">
              {t('products.out_of_stock')}
            </div>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Variable Content - Top Section */}
        <div className="flex-grow">
          {/* Size and Type Info */}
          <div className="text-sm text-gray-600 mb-1">
            {(() => {
              // Try to get translated size first
              const normalizedSize = normalizeSize(product.size)
              const translatedSize = t(`sizes.${normalizedSize}`)
              let displaySize = translatedSize !== `sizes.${normalizedSize}` ? translatedSize : product.size
              
              // If we still have the raw size (no translation found), handle common patterns
              if (displaySize === product.size && locale === 'pt-BR') {
                // Handle common size patterns for Portuguese
                displaySize = product.size
                  .replace(/12 fl oz/gi, '355 ml')
                  .replace(/16 fl oz/gi, '473 ml')
                  .replace(/20 fl oz/gi, '591 ml')
                  .replace(/(\d+) fl oz/gi, (match, num) => {
                    // Convert other fl oz to ml (1 fl oz ≈ 29.57 ml)
                    const ml = Math.round(parseInt(num) * 29.57)
                    return `${ml} ml`
                  })
                  .replace(/(\d+)\s*pack/gi, '$1 Unidades')
                  .replace(/bottle/gi, 'Garrafa')
                  .replace(/can/gi, 'Lata')
                  .replace(/glass bottle/gi, 'Garrafa de Vidro')
              }
              
              return displaySize
            })()} • {t(`product_types.${product.type}`)}
          </div>
          
          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight">
            {product.name}
          </h3>
          
          {/* SKU Number */}
          <div className="text-sm text-gray-500 mb-3">
            SKU: {skuNumber}
          </div>
        </div>
        
        {/* Fixed Bottom Section - Price and Actions */}
        <div className="mt-auto">
          {/* Price */}
          <div className="mb-3">
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(product.price, locale)}
            </div>
            <div className="text-sm text-gray-500">
              ({formatCurrency(perBottlePrice, locale)} {t('common.per_bottle')})
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-between">
            <AddToCartButton
              product={product}
              className={cn(
                "bg-[#1d1d1d] hover:bg-[#1d1d1d]/90 text-white rounded-full",
                !product.inStock && "opacity-50 cursor-not-allowed"
              )}
            />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="rounded-full hover:bg-gray-100"
            >
              
              <Heart 
                className={cn(
                  "h-5 w-5",
                  isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
                )} 
              />
            </Button>
          </div>

        </div>
      </div>
    </div>
  )
}
