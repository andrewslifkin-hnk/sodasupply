"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Search, MessageCircle, Menu, Gift, Heart } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"


interface NavItem {
  id: string
  label: string
  icon: React.ElementType
  href?: string
  isSheet?: boolean
}

export function MobileBottomNav() {
  const pathname = usePathname()
  
  const navItems: NavItem[] = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      href: "/products"
    },
    {
      id: "find",
      label: "Find", 
      icon: Search,
      href: "/products" // For now, could be promotions page later
    },
    {
      id: "news",
      label: "News",
      icon: MessageCircle,
      href: "/club" // Loyalty/club page
    },
    {
      id: "me",
      label: "Me",
      icon: Menu,
      isSheet: true
    }
  ]

  const isActiveTab = (item: NavItem) => {
    if (!item.href) return false
    
    if (item.id === "home") {
      return pathname === "/" || pathname.startsWith("/products")
    }
    if (item.id === "news") {
      return pathname.startsWith("/club")
    }
    if (item.id === "find") {
      // For now, using products page - can be updated when promotions page is added
      return false
    }
    
    return pathname.startsWith(item.href)
  }

  const MenuSheet = () => (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className={cn(
            "flex flex-col items-center justify-center h-full px-2 py-1 rounded-lg transition-colors",
            "text-gray-400 hover:text-gray-600"
          )}
        >
          <Menu className="h-6 w-6 mb-1" />
          <span className="text-xs font-medium">Me</span>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <div className="flex flex-col space-y-4 mt-8">
          <Link href="/account" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100">
            <Home className="h-5 w-5" />
            <span>Account</span>
          </Link>
          <Link href="/orders" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100">
            <Gift className="h-5 w-5" />
            <span>Orders</span>
          </Link>
          <Link href="/club" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100">
            <Heart className="h-5 w-5" />
            <span>Loyalty Club</span>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = isActiveTab(item)
          
          if (item.isSheet) {
            return (
              <div key={item.id} className="flex-1 flex justify-center">
                <MenuSheet />
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
    </div>
  )
}