/**
 * Example showing how to modify header behavior when mobile bottom nav is enabled
 * 
 * This is just an example - copy the pattern into your actual header component
 */

"use client"

import { useMobileBottomNav } from "@/hooks/use-mobile-bottom-nav"

export function HeaderWithBottomNavExample() {
  const { isEnabled: hasBottomNav } = useMobileBottomNav()
  
  return (
    <header className={`
      ${hasBottomNav ? 'md:block' : 'block'} 
      ${hasBottomNav ? 'mobile-header-with-bottom-nav' : 'mobile-header-default'}
    `}>
      {/* Example: Hide hamburger menu on mobile when bottom nav is active */}
      {!hasBottomNav && (
        <button className="md:hidden">
          {/* Hamburger menu - only show when bottom nav is disabled */}
        </button>
      )}
      
      {/* Example: Adjust search bar position when bottom nav is active */}
      <div className={`
        search-container
        ${hasBottomNav ? 'mobile-search-with-bottom-nav' : 'mobile-search-default'}
      `}>
        {/* Search input */}
      </div>
      
      {/* Example: Different cart button behavior */}
      <button className={`
        cart-button
        ${hasBottomNav ? 'mobile-cart-with-bottom-nav' : 'mobile-cart-default'}
      `}>
        {/* Cart button */}
      </button>
    </header>
  )
}

/**
 * CSS Classes you might add to your global CSS:
 * 
 * .mobile-header-with-bottom-nav {
 *   // Header styles when bottom nav is active
 *   // Maybe smaller height, different layout, etc.
 * }
 * 
 * .mobile-search-with-bottom-nav {
 *   // Search styles when bottom nav is active
 *   // Maybe hide search on mobile since it's in bottom nav
 * }
 * 
 * .mobile-cart-with-bottom-nav {
 *   // Cart button styles when bottom nav is active
 *   // Maybe different positioning
 * }
 */