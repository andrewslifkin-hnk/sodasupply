"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Package, Search, Heart, ShoppingCart } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { useFilter } from "@/context/filter-context"
import { useI18n } from "@/context/i18n-context"
import { useCart } from "@/context/cart-context"
import { CartSheet } from "@/components/cart/cart-sheet"
import { useMobileBottomNavFlag } from "@/hooks/use-mobile-bottom-nav-flag"


interface NavItem {
  id: string
  label: string
  icon: React.ElementType
  href?: string
  isCart?: boolean
}

export function MobileBottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { clearAllFilters } = useFilter()
  const { t } = useI18n()
  const { totalItems } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { isEnabled, isLoading } = useMobileBottomNavFlag()
  
  // Add CSS class to body for spacing when enabled
  React.useEffect(() => {
    if (isEnabled && !isLoading) {
      document.body.classList.add('has-bottom-nav')
    } else {
      document.body.classList.remove('has-bottom-nav')
    }
    
    return () => {
      document.body.classList.remove('has-bottom-nav')
    }
  }, [isEnabled, isLoading])
  
  // Don't render if feature flag is disabled or loading
  if (isLoading || !isEnabled) {
    return null
  }
  
  const navItems: NavItem[] = [
    {
      id: "products",
      label: "Products",
      icon: Package,
      href: "/products"
    },
    {
      id: "search",
      label: "Search", 
      icon: Search,
      href: "/products" // For now, could be promotions page later
    },
    {
      id: "club",
      label: "Club",
      icon: Heart,
      href: "/club" // Loyalty/club page
    },
    {
      id: "cart",
      label: "Cart",
      icon: ShoppingCart,
      isCart: true
    }
  ]

  const isActiveTab = (item: NavItem) => {
    if (!item.href) return false
    
    if (item.id === "products") {
      return pathname === "/" || pathname.startsWith("/products")
    }
    if (item.id === "club") {
      return pathname.startsWith("/club")
    }
    if (item.id === "search") {
      // For now, using products page - can be updated when search page is added
      return false
    }
    
    return pathname.startsWith(item.href)
  }



  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = isActiveTab(item)
          
          if (item.isCart) {
            return (
              <div key={item.id} className="flex-1 flex justify-center">
                <button
                  onClick={() => setIsCartOpen(true)}
                  className={cn(
                    "flex flex-col items-center justify-center h-full px-2 py-1 rounded-lg transition-colors relative",
                    "text-gray-400 hover:text-gray-600"
                  )}
                >
                  <div className="relative">
                    <Icon className="h-6 w-6 mb-1" />
                    {totalItems > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white font-bold">
                        {totalItems}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              </div>
            )
          }
          
          return (
            <Link
              key={item.id}
              href={item.href!}
              className="flex-1 flex justify-center"
            >
              <button
                className={cn(
                  "flex flex-col items-center justify-center h-full px-2 py-1 rounded-lg transition-colors",
                  isActive 
                    ? "text-gray-900 font-medium" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <Icon className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            </Link>
          )
        })}
      </div>
      
      {/* Cart Sheet */}
      <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}