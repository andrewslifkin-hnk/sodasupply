"use client"

import type React from "react"

import Link from "next/link"
import { Menu, Bell, ShoppingCart, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect, useRef, type FormEvent } from "react"
import { cn } from "@/lib/utils"
import { useCart } from "@/context/cart-context"
import { Input } from "@/components/ui/input"
import { useSearch } from "@/context/search-context"
import { SearchOverlay } from "@/components/search-overlay"
import { SearchDropdown } from "@/components/search-dropdown"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useMobileBottomNav } from "@/hooks/use-mobile-bottom-nav"
import { StoreDropdown } from "@/components/store-selector/store-dropdown"
import { StoreSheet } from "@/components/store-selector/store-sheet"
import { CartSheet } from "@/components/cart/cart-sheet"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useFilter } from "@/context/filter-context"
import { getProductsByType } from "@/services/product-service"
import { useI18n } from "@/context/i18n-context"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { totalItems } = useCart()
  const { isSearchOpen, searchQuery, openSearch, setSearchQuery, submitSearch } = useSearch()
  const { clearAllFilters, clearAndSetTypeFilter } = useFilter()
  const { t } = useI18n()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { isEnabled: hasBottomNav } = useMobileBottomNav()
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("type") || ""

  // Dynamic product categories for the sub-menu
  const [categories, setCategories] = useState<string[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  useEffect(() => {
    getProductsByType().then((grouped) => {
      setCategories(Object.keys(grouped))
      setLoadingCategories(false)
    })
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault()
    submitSearch()
  }

  // Handle input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Simple and reliable approach to clear search
  const handleClearSearch = () => {
    // Clear the search query in the context
    setSearchQuery("")

    // Navigate to home page without query parameters
    router.push("/")
  }

  // Handle logo click to clear all filters and show all products
  const handleLogoClick = (e: React.MouseEvent) => {
    // Prevent the default link behavior
    e.preventDefault()
    
    // Clear all filters
    clearAllFilters()
    
    // Navigate to the homepage after a small delay
    setTimeout(() => {
      router.push("/")
    }, 0)
  }

  // Simple direct function to go to homepage
  const goToHomePage = () => {
    router.push("/")
  }

  const showProductSubMenu = pathname.startsWith("/products");

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-200",
          scrolled ? "bg-black shadow-md" : "bg-black",
        )}
      >
        <div className="max-w-site">
          <div className="content-container">
            <div className="grid grid-cols-[auto_1fr_auto] items-center h-16 gap-4">
              {/* Left section - Logo and mobile menu */}
              <div className="flex items-center">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white mr-2 md:hidden">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">{t('common.menu')}</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px]">
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
                <Link 
                  href="/" 
                  className="font-bold text-xl text-white tracking-[-2px]"
                >
                  {t('footer.company_name')}
                </Link>
              </div>
              
              {/* Search section */}
              <div className="hidden md:flex justify-center">
                <div ref={searchContainerRef} className="relative w-full max-w-md">
                  <form onSubmit={handleSearchSubmit}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder={t('search.search_products')}
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={openSearch}
                        inputMode="search"
                        className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 w-full rounded-full focus-visible:ring-gray-600"
                      />
                      {searchQuery && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={handleClearSearch}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full hover:bg-gray-700 transition-colors"
                        >
                          <X className="h-4 w-4 text-gray-400 hover:text-white" />
                          <span className="sr-only">{t('search.clear_search')}</span>
                        </Button>
                      )}
                    </div>
                  </form>
                  <SearchDropdown />
                </div>
              </div>

              {/* Right section - Icons */}
              <div className="flex items-center justify-end gap-4">
                {/* Store selector */}
                <StoreDropdown />

                <Button variant="ghost" size="icon" className="text-white">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">{t('navigation.notifications')}</span>
                </Button>

                {!(isMobile && hasBottomNav) && (
                  <Button variant="ghost" size="icon" className="text-white relative" onClick={() => setIsCartOpen(true)}>
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-white text-black font-bold">
                        {totalItems}
                      </Badge>
                    )}
                    <span className="sr-only">{t('navigation.cart')}</span>
                  </Button>
                )}

              </div>
            </div>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden pb-3 max-w-site">
          <div className="content-container">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={t('search.search_products')}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 w-full rounded-full focus-visible:ring-gray-600"
                value={searchQuery}
                onChange={handleSearchChange}
                onClick={openSearch}
                inputMode="search"
              />
              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full hover:bg-gray-700 transition-colors"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-white" />
                  <span className="sr-only">{t('search.clear_search')}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Secondary Navigation Bar - Desktop Only */}
      <div className="hidden md:block bg-black text-white w-full border-t border-gray-800 shadow-sm">
        <div className="max-w-site">
          <div className="content-container">
            <nav className="flex items-center h-12">
              <div className="flex space-x-8">
                <Link 
                  href="/" 
                  className="text-white hover:text-gray-300 font-medium text-sm transition-colors"
                >
                  {t('navigation.products')}
                </Link>
                <Link 
                  href="/club" 
                  className="text-white hover:text-gray-300 font-medium text-sm transition-colors"
                >
                  {t('navigation.club')}
                </Link>
                <Link 
                  href="/orders" 
                  className="text-white hover:text-gray-300 font-medium text-sm transition-colors"
                >
                  {t('navigation.my_orders')}
                </Link>
                <Link 
                  href="/account" 
                  className="text-white hover:text-gray-300 font-medium text-sm transition-colors"
                >
                  {t('navigation.my_account')}
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Product Categories Sub-Menu - Desktop Only, now always visible and dynamic */}
      {showProductSubMenu && (
        <div className="hidden md:block w-full bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-site">
            <div className="content-container">
              <nav className="flex items-center h-12">
                {loadingCategories ? (
                  <div className="text-gray-400 text-sm">{t('common.loading')}</div>
                ) : categories.length === 0 ? (
                  <div className="text-gray-400 text-sm">{t('products.no_categories_found')}</div>
                ) : (
                  <ul className="flex space-x-6 w-full">
                    <li>
                      <a
                        href="/products"
                        onClick={e => {
                          e.preventDefault();
                          clearAllFilters();
                        }}
                        className={
                          cn(
                            "text-sm font-medium px-1 pb-2 border-b-2 transition-colors",
                            !currentCategory
                              ? "text-green-700 border-green-700 font-semibold"
                              : "text-gray-800 hover:text-black border-transparent hover:border-gray-400"
                          )
                        }
                      >
                        {t('footer.all_products')}
                      </a>
                    </li>
                    {categories.map(category => (
                      <li key={category}>
                        <a
                          href={`/products?type=${encodeURIComponent(category)}`}
                          onClick={e => {
                            e.preventDefault();
                            clearAndSetTypeFilter(category);
                          }}
                          className={
                            cn(
                              "text-sm font-medium px-1 pb-2 border-b-2 transition-colors",
                              currentCategory === category
                                ? "text-green-700 border-green-700 font-semibold"
                                : "text-gray-800 hover:text-black border-transparent hover:border-gray-400"
                            )
                          }
                        >
                          {t(`product_types.${category}`)}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Search overlay for mobile/desktop */}
      <SearchOverlay />
      
      {/* Mobile store sheet */}
      <StoreSheet />
      
      {/* Cart sheet */}
      <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
