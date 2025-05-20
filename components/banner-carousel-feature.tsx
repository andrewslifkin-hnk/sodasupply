"use client"

import { BannerCarousel } from "@/components/ui/banner-carousel"
import { useBannerFeature } from "@/hooks/use-banner-feature"

export function BannerCarouselFeature() {
  const { enabled, loading } = useBannerFeature()
  
  // Don't render anything while loading or if the feature is disabled
  if (loading || !enabled) return null
  
  return <BannerCarousel />
} 