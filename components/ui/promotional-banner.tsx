"use client"

import { useState, useEffect } from "react"
import { StatsigUser, createFeatureGate, identify } from "../../flags"
import { Button } from "@/components/ui/button"
import { Tag } from "lucide-react"

// Custom hook to handle the async feature flag
function useFeatureFlag(flagKey: string) {
  const [enabled, setEnabled] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<StatsigUser | null>(null)

  useEffect(() => {
    async function checkFlag() {
      try {
        // Get user identity
        const userInfo = await identify()
        setUser(userInfo)
        
        // Check feature flag with user context
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

  return { enabled, loading, user }
}

export function PromotionalBanner() {
  const { enabled, loading } = useFeatureFlag("promo_banner")
  
  // Don't render anything while loading or if the flag is disabled
  if (loading || !enabled) return null
  
  return (
    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 mb-6 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-2 mb-2 md:mb-0">
          <Tag className="h-5 w-5" />
          <h3 className="font-bold">Limited Time Offer</h3>
        </div>
        <p className="text-sm md:text-base text-center md:text-left flex-1 mx-4">
          Free shipping on orders over €50! Use code <span className="font-bold">FREESHIP50</span> at checkout.
        </p>
        <Button 
          variant="secondary" 
          className="bg-white text-teal-600 hover:bg-gray-100 whitespace-nowrap"
        >
          Shop Now
        </Button>
      </div>
    </div>
  )
} 