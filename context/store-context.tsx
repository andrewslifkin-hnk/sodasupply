"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"

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
}

const defaultStores: Store[] = [
  {
    id: "1",
    name: "Downtown Flagship",
    address: "123 Main Street",
    city: "New York",
    region: "NY 10001",
    isSelected: true,
  },
  {
    id: "2",
    name: "Brooklyn Heights",
    address: "45 Atlantic Avenue",
    city: "Brooklyn",
    region: "NY 11201",
    isSelected: false,
  },
  {
    id: "3",
    name: "SoHo Concept Store",
    address: "210 Spring Street",
    city: "New York",
    region: "NY 10012",
    isSelected: false,
  },
  {
    id: "4",
    name: "Upper East Side",
    address: "785 Madison Avenue",
    city: "New York",
    region: "NY 10065",
    isSelected: false,
  },
  {
    id: "5",
    name: "Williamsburg",
    address: "247 Bedford Avenue",
    city: "Brooklyn",
    region: "NY 11211",
    isSelected: false,
  },
  {
    id: "6",
    name: "Queens Center",
    address: "90-15 Queens Boulevard",
    city: "Queens",
    region: "NY 11373",
    isSelected: false,
  },
]

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [stores, setStores] = useState<Store[]>(defaultStores)
  const [isStoreMenuOpen, setIsStoreMenuOpen] = useState(false)
  const [isStoreSheetOpen, setIsStoreSheetOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

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
