"use client"

import dynamic from 'next/dynamic'

// Dynamically import the mobile bottom nav to avoid hydration issues
const MobileBottomNavDynamic = dynamic(
  () => import('./mobile-bottom-nav').then(mod => ({ default: mod.MobileBottomNav })),
  { 
    ssr: false,
    loading: () => null
  }
)

export function ConditionalMobileBottomNav() {
  return <MobileBottomNavDynamic />
}