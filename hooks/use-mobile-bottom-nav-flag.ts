"use client"

import { useState, useEffect } from 'react'
import { createFeatureGate } from '@/flags'

/**
 * Hook that checks if the mobile bottom navigation should be visible
 * Uses Statsig feature flag with hydration-safe rendering
 */
export function useMobileBottomNavFlag(): { isEnabled: boolean; isLoading: boolean } {
  const [isEnabled, setIsEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  
  // Prevent hydration mismatch by only enabling on client
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  useEffect(() => {
    if (!isClient) return
    
    const checkFeatureFlag = async () => {
      try {
        // Create the feature gate for mobile bottom nav
        const mobileBottomNavGate = createFeatureGate('mobile_bottom_nav')
        
        // Check the feature flag
        const flagEnabled = await mobileBottomNavGate()
        
        setIsEnabled(flagEnabled)
        
      } catch (error) {
        console.error('Error checking mobile bottom nav feature flag:', error)
        // Fallback to false if feature flag check fails
        setIsEnabled(false)
      } finally {
        setLoading(false)
      }
    }
    
    checkFeatureFlag()
  }, [isClient])
  
  return { isEnabled: isClient && isEnabled, isLoading: loading }
}