"use client"

import React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Package, Search, Heart, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useFilter } from "@/context/filter-context"
import { useI18n } from "@/context/i18n-context"


interface NavItem {
  id: string
  label: string
  icon: React.ElementType
  href?: string
  isSheet?: boolean
}

export function MobileBottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { clearAllFilters } = useFilter()
  const { t } = useI18n()
  
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
      id: "menu",
      label: "Menu",
      icon: Menu,
      isSheet: true
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
          <span className="text-xs font-medium">Menu</span>
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetTitle className="sr-only">{t('common.menu')}</SheetTitle>
        <nav className="flex flex-col gap-4 mt-8">
          <button
            onClick={() => {
              clearAllFilters();
              router.push("/");
            }}
            className="text-left text-lg font-medium bg-transparent border-0 p-0"
          >
            {t('navigation.home')}
          </button>
          <Link href="/categories" className="text-lg font-medium">
            {t('navigation.categories')}
          </Link>
          <Link href="/deals" className="text-lg font-medium">
            {t('navigation.deals')}
          </Link>
          <Link href="/about" className="text-lg font-medium">
            {t('footer.about_us')}
          </Link>
        </nav>
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