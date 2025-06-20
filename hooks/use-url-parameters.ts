"use client"

import { useState, useEffect } from "react"

// Define all URL parameters and their default values
export interface UrlParameters {
  store_selector: boolean
  distributor_selector: boolean
  promo_banner: boolean
  search_overlay: boolean
  admin_panel: boolean
  // Add more parameters here as needed
}

// Default values for all parameters
const DEFAULT_VALUES: UrlParameters = {
  store_selector: true,
  distributor_selector: true,
  promo_banner: true,
  search_overlay: true,
  admin_panel: false,
}

// Helper function to parse a URL parameter value to boolean
function parseParameterValue(value: string | null): boolean | null {
  if (value === null) return null
  
  const lowerValue = value.toLowerCase()
  
  // Explicitly false values
  if (['false', 'off', '0', 'no', 'disabled'].includes(lowerValue)) {
    return false
  }
  
  // Explicitly true values
  if (['true', 'on', '1', 'yes', 'enabled'].includes(lowerValue)) {
    return true
  }
  
  // Default to null for unrecognized values (will use default)
  return null
}

export function useUrlParameters(): UrlParameters {
  const [parameters, setParameters] = useState<UrlParameters>(DEFAULT_VALUES)
  
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return
    
    const updateParameters = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const newParameters: UrlParameters = { ...DEFAULT_VALUES }
      
      // Parse each parameter
      Object.keys(DEFAULT_VALUES).forEach((key) => {
        const paramKey = key as keyof UrlParameters
        const urlValue = urlParams.get(key)
        const parsedValue = parseParameterValue(urlValue)
        
        // Use parsed value if available, otherwise use default
        newParameters[paramKey] = parsedValue !== null ? parsedValue : DEFAULT_VALUES[paramKey]
      })
      
      setParameters(newParameters)
    }
    
    // Initial load
    updateParameters()
    
    // Listen for URL changes (back/forward navigation)
    window.addEventListener('popstate', updateParameters)
    
    return () => {
      window.removeEventListener('popstate', updateParameters)
    }
  }, [])
  
  return parameters
}

// Convenience hooks for specific parameters
export function useStoreSelector(): boolean {
  const { store_selector } = useUrlParameters()
  return store_selector
}

export function useDistributorSelector(): boolean {
  const { distributor_selector } = useUrlParameters()
  return distributor_selector
}

export function usePromoBanner(): boolean {
  const { promo_banner } = useUrlParameters()
  return promo_banner
}

export function useSearchOverlay(): boolean {
  const { search_overlay } = useUrlParameters()
  return search_overlay
}

export function useAdminPanel(): boolean {
  const { admin_panel } = useUrlParameters()
  return admin_panel
}

// Helper function to get current URL with updated parameters
export function getUrlWithParameters(updates: Partial<UrlParameters>): string {
  if (typeof window === 'undefined') return ''
  
  const url = new URL(window.location.href)
  
  Object.entries(updates).forEach(([key, value]) => {
    if (value === DEFAULT_VALUES[key as keyof UrlParameters]) {
      // Remove parameter if it's the default value
      url.searchParams.delete(key)
    } else {
      // Set parameter if it's different from default
      url.searchParams.set(key, value.toString())
    }
  })
  
  return url.toString()
}

// Helper function to navigate with updated parameters
export function updateUrlParameters(updates: Partial<UrlParameters>): void {
  if (typeof window === 'undefined') return
  
  const newUrl = getUrlWithParameters(updates)
  window.history.pushState({}, '', newUrl)
  
  // Trigger a popstate event to notify components of the change
  window.dispatchEvent(new PopStateEvent('popstate'))
} 