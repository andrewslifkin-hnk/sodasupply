"use client"

import { useMobileBottomNavFlag } from './use-mobile-bottom-nav-flag'

/**
 * Hook that provides information about mobile bottom navigation state
 * This can be used by other components (like header) to adjust their behavior
 * when bottom navigation is enabled/disabled
 */
export function useMobileBottomNav() {
  const isEnabled = useMobileBottomNavFlag()
  
  return {
    isEnabled,
    hasBottomNav: isEnabled
  }
}