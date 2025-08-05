"use client"

import { useState, useEffect } from 'react'
import { createFeatureGate } from '@/flags'
import { useDistributorSelector } from './use-url-parameters'

/**
 * Hook that checks if the distributor selector should be visible
 * Uses Statsig feature flag with URL parameter override
 */
export function useDistributorFeatureFlag(): boolean {
  const [isEnabled, setIsEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // Get URL parameter override
  const urlParameterEnabled = useDistributorSelector()
  
  useEffect(() => {
    const checkFeatureFlag = async () => {
      try {
        // Create the feature gate for distributor selector
        const distributorGate = createFeatureGate('distributor_selector')
        
        // Check the feature flag
        const flagEnabled = await distributorGate()
        
        // URL parameter takes precedence over feature flag
        // If URL parameter is explicitly set, use that; otherwise use feature flag
        setIsEnabled(urlParameterEnabled || flagEnabled)
        
      } catch (error) {
        console.error('Error checking distributor feature flag:', error)
        // Fallback to URL parameter if feature flag check fails
        setIsEnabled(urlParameterEnabled)
      } finally {
        setLoading(false)
      }
    }
    
    checkFeatureFlag()
  }, [urlParameterEnabled])
  
  return isEnabled
}