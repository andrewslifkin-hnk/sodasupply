"use client"

import { BannerCarousel } from "@/components/ui/banner-carousel"
import { useBannerFeature } from "@/hooks/use-banner-feature"
import { useEffect } from "react"

export function BannerCarouselFeature() {
  const { enabled, loading } = useBannerFeature()
  
  // Add debug logging
  useEffect(() => {
    if (!loading) {
      console.log("Banner carousel feature flag status:", enabled ? "enabled" : "disabled")
    }
  }, [enabled, loading])
  
  // Don't render anything while loading or if the feature is disabled
  if (loading || !enabled) return null
  
  return <BannerCarousel />
} 