"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { getStores } from "@/services/store-service"

export interface Store {
  id: string
  name: string
  address: string
  city: string
  region: string
  isSelected: boolean
}

interface StoreContextType {
  stores: Store[]
  selectedStore: Store | null
  isStoreMenuOpen: boolean
  isStoreSheetOpen: boolean
  openStoreMenu: () => void
  closeStoreMenu: () => void
  openStoreSheet: () => void
  closeStoreSheet: () => void
  selectStore: (storeId: string) => void
  loading: boolean
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [stores, setStores] = useState<Store[]>([])
  const [isStoreMenuOpen, setIsStoreMenuOpen] = useState(false)
  const [isStoreSheetOpen, setIsStoreSheetOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Fetch stores from the database
  useEffect(() => {
    async function fetchStores() {
      try {
        setLoading(true)
        const storesData = await getStores()

        if (storesData && Array.isArray(storesData) && storesData.length > 0) {
          const mappedStores = storesData.map((store, index) => ({
            id: store.id?.toString() || `unknown-${index}`,
            name: store.name || `Unknown Store ${index + 1}`,
            address: store.address || "No address available",
            city: store.city || "Unknown city",
            region: store.region || "Unknown region",
            isSelected: index === 0, // Select the first store by default
          }))

          setStores(mappedStores)
        } else {
          // Fallback to default stores if none are found in the database
          setStores(defaultStores)
        }
      } catch (error) {
        console.error("Error fetching stores:", error)
        setStores(defaultStores)
      } finally {
        setLoading(false)
      }
    }

    fetchStores()
  }, [])

  const selectedStore = stores.find((store) => store.isSelected) || null

  const openStoreMenu = () => {
    if (isMobile) {
      openStoreSheet()
    } else {
      setIsStoreMenuOpen(true)
    }
  }

  const closeStoreMenu = () => {
    setIsStoreMenuOpen(false)
  }

  const openStoreSheet = () => {
    setIsStoreSheetOpen(true)
  }

  const closeStoreSheet = () => {
    setIsStoreSheetOpen(false)
  }

  const selectStore = (storeId: string) => {
    setStores(
      stores.map((store) => ({
        ...store,
        isSelected: store.id === storeId,
      })),
    )
    closeStoreMenu()
    closeStoreSheet()
  }

  return (
    <StoreContext.Provider
      value={{
        stores,
        selectedStore,
        isStoreMenuOpen,
        isStoreSheetOpen,
        openStoreMenu,
        closeStoreMenu,
        openStoreSheet,
        closeStoreSheet,
        selectStore,
        loading,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}

// Default stores as fallback
const defaultStores: Store[] = [
  {
    id: "1",
    name: "Beverage World",
    address: "123 Main Street",
    city: "New York",
    region: "NY 10001",
    isSelected: true,
  },
  {
    id: "2",
    name: "Drink Depot",
    address: "45 Atlantic Avenue",
    city: "Brooklyn",
    region: "NY 11201",
    isSelected: false,
  },
  {
    id: "3",
    name: "Soda Express",
    address: "210 Spring Street",
    city: "New York",
    region: "NY 10012",
    isSelected: false,
  },
  {
    id: "4",
    name: "Refreshment Center",
    address: "785 Madison Avenue",
    city: "New York",
    region: "NY 10065",
    isSelected: false,
  },
  {
    id: "5",
    name: "Fizz & Co.",
    address: "247 Bedford Avenue",
    city: "Brooklyn",
    region: "NY 11211",
    isSelected: false,
  },
  {
    id: "6",
    name: "Thirst Quenchers",
    address: "90-15 Queens Boulevard",
    city: "Queens",
    region: "NY 11373",
    isSelected: false,
  },
]
