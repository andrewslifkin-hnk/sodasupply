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
import { StoreDropdown } from "@/components/store-selector/store-dropdown"
import { StoreSheet } from "@/components/store-selector/store-sheet"
import { CartSheet } from "@/components/cart/cart-sheet"
import { useRouter } from "next/navigation"
import { useFilter } from "@/context/filter-context"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { totalItems } = useCart()
  const { isSearchOpen, searchQuery, openSearch, setSearchQuery, submitSearch } = useSearch()
  const { clearAllFilters } = useFilter()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

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
    e.preventDefault()

    // Clear all filters
    clearAllFilters()

    // Then navigate to home page
    router.push("/")
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-200",
          scrolled ? "bg-black shadow-md" : "bg-black",
        )}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-[auto_1fr_auto] items-center h-16 gap-4">
            {/* Left section - Logo and mobile menu */}
            <div className="flex items-center">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white mr-2 md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col gap-4 mt-8">
                    <Link href="/" className="text-lg font-medium" onClick={handleLogoClick}>
                      Home
                    </Link>
                    <Link href="/categories" className="text-lg font-medium">
                      Categories
                    </Link>
                    <Link href="/deals" className="text-lg font-medium">
                      Deals
                    </Link>
                    <Link href="/about" className="text-lg font-medium">
                      About
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>

              <Button variant="ghost" className="flex items-center p-0 h-auto" onClick={handleLogoClick}>
                <span className="font-bold text-xl text-white tracking-[-2px]">SodaSupply</span>
              </Button>
            </div>

            {/* Center section - Search */}
            <div className="hidden md:flex justify-center">
              <div ref={searchContainerRef} className="relative w-full max-w-md">
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search products"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={openSearch}
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
                        <span className="sr-only">Clear search</span>
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
                <span className="sr-only">Notifications</span>
              </Button>

              <Button variant="ghost" size="icon" className="text-white relative" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-white text-black font-bold">
                    {totalItems}
                  </Badge>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products"
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 w-full rounded-full focus-visible:ring-gray-600"
              onClick={openSearch}
              readOnly
            />
          </div>
        </div>
      </header>

      {/* Mobile search overlay */}
      {isMobile && <SearchOverlay />}

      {/* Mobile store sheet */}
      {isMobile && <StoreSheet />}

      {/* Cart sheet */}
      <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
