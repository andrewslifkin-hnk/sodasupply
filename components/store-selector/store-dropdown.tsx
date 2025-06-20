"use client"

import { Check, MapPin, ChevronUp, ChevronDown } from "lucide-react"
import { useStore } from "@/context/store-context"
import { useRef, useEffect } from "react"
import { useOnClickOutside } from "@/hooks/use-click-outside"
import { Button } from "@/components/ui/button"
import { useStoreSelector } from "@/hooks/use-url-parameters"

export function StoreDropdown() {
  const { stores, selectedStore, isStoreMenuOpen, openStoreMenu, closeStoreMenu, selectStore } = useStore()
  const isStoreVisible = useStoreSelector()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useOnClickOutside(dropdownRef as React.RefObject<HTMLDivElement>, closeStoreMenu)

  // Close dropdown when pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeStoreMenu()
    }

    if (isStoreMenuOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isStoreMenuOpen, closeStoreMenu])

  // Don't render if disabled via URL parameter
  if (!isStoreVisible) return null

  if (!selectedStore) return null

  return (
    <div ref={dropdownRef} className="relative">
      <button onClick={openStoreMenu} className="flex items-center gap-2 text-white">
        {/* Show pin icon on both mobile and desktop */}
        <MapPin className="h-5 w-5" />

        {/* Store info - always visible on desktop, hidden on mobile */}
        <div className="hidden md:block text-left">
          <div className="font-medium">{selectedStore.name}</div>
          <div className="text-xs text-white/70">{selectedStore.city}</div>
        </div>

        {/* Dropdown chevron - only on desktop */}
        {isStoreMenuOpen ? (
          <ChevronUp className="h-4 w-4 hidden md:block" />
        ) : (
          <ChevronDown className="h-4 w-4 hidden md:block" />
        )}
      </button>

      {isStoreMenuOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-4 bg-green-50">
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <MapPin className="h-5 w-5 text-green-700" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 flex items-center justify-between">
                  {selectedStore.name}
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {selectedStore.address}, {selectedStore.city}, {selectedStore.region}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t">
            {stores
              .filter((store) => !store.isSelected)
              .map((store) => (
                <button
                  key={store.id}
                  className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => selectStore(store.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <MapPin className="h-5 w-5 text-gray-700" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{store.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {store.address}, {store.city}, {store.region}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
          </div>

          <div className="p-4 border-t">
            <Button variant="outline" className="w-full">
              Find More Stores
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
