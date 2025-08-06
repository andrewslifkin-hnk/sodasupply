"use client"

import { useEffect } from "react"
import { MobileBottomNav } from "./mobile-bottom-nav"
import { useMobileBottomNavFlag } from "@/hooks/use-mobile-bottom-nav-flag"

export function ConditionalMobileBottomNav() {
  const isEnabled = useMobileBottomNavFlag()
  
  // Add/remove CSS class on body to control spacing
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isEnabled) {
        document.body.classList.add('has-bottom-nav')
      } else {
        document.body.classList.remove('has-bottom-nav')
      }
    }
    
    // Cleanup on unmount
    return () => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('has-bottom-nav')
      }
    }
  }, [isEnabled])
  
  if (!isEnabled) {
    return null
  }
  
  return <MobileBottomNav />
}