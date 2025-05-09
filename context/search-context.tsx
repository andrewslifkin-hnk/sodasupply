"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

interface SearchContextType {
  isSearchOpen: boolean
  searchQuery: string
  openSearch: () => void
  closeSearch: () => void
  setSearchQuery: (query: string) => void
  submitSearch: () => void
  clearSearch: () => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize searchQuery from URL on mount and when URL changes
  useEffect(() => {
    const query = searchParams.get("q") || ""
    setSearchQuery(query)
  }, [searchParams])

  const openSearch = () => setIsSearchOpen(true)
  const closeSearch = () => setIsSearchOpen(false)

  const submitSearch = useCallback(() => {
    if (searchQuery.trim()) {
      // Close the search dropdown/overlay
      setIsSearchOpen(false)

      // Navigate to the product listing page with the search query
      router.push(`${pathname}?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }, [searchQuery, router, pathname])

  const clearSearch = useCallback(() => {
    // Clear the search query
    setSearchQuery("")

    // Navigate to home page without query parameters
    router.push("/")

    // Close the search dropdown/overlay
    setIsSearchOpen(false)
  }, [router])

  return (
    <SearchContext.Provider
      value={{
        isSearchOpen,
        searchQuery,
        openSearch,
        closeSearch,
        setSearchQuery,
        submitSearch,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider")
  }
  return context
}
