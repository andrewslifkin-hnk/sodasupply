"use client"

import { useState, useEffect } from 'react'
import { createFeatureGate } from '@/flags'

/**
 * Hook that checks if the mobile bottom navigation should be visible
 * Uses Statsig feature flag
 */
export function useMobileBottomNavFlag(): boolean {
  const [isEnabled, setIsEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
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
  }, [])
  
  return isEnabled
}