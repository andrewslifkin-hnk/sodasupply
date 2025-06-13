"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useStore } from "@/context/store-context"

// Add Umami to the Window type
declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, any>) => void
    }
  }
}

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  type: string
  size: string
}

interface StoreCart {
  storeId: string
  items: CartItem[]
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Omit<CartItem, "quantity">) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  getItemQuantity: (productId: number) => number
  totalItems: number
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Create a safe version of useStore that returns null if used outside StoreProvider
// function useSafeStore() {
//   try {
//     return useStore()
//   } catch (error) {
//     // Return a default value if the store context is not available
//     return { selectedStore: null, stores: [] }
//   }
// }

export function CartProvider({ children }: { children: ReactNode }) {
  const [storeCarts, setStoreCarts] = useState<StoreCart[]>([])
  const [currentItems, setCurrentItems] = useState<CartItem[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)

  // Use the safe version of useStore
  // const { selectedStore } = useSafeStore()
  const { selectedStore } = useStore()

  // Load carts from localStorage on initial render
  useEffect(() => {
    const storedCarts = localStorage.getItem("storeCarts")
    if (storedCarts) {
      try {
        const parsedCarts = JSON.parse(storedCarts)
        setStoreCarts(parsedCarts)
      } catch (error) {
        console.error("Failed to parse carts from localStorage:", error)
      }
    }
    setIsInitialized(true)
  }, [])

  // Update localStorage whenever carts change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("storeCarts", JSON.stringify(storeCarts))
    }
  }, [storeCarts, isInitialized])

  // Update current items when selected store changes
  useEffect(() => {
    if (selectedStore) {
      const storeCart = storeCarts.find((cart) => cart.storeId === selectedStore.id)
      setCurrentItems(storeCart?.items || [])
    } else {
      setCurrentItems([])
    }
  }, [selectedStore, storeCarts])

  // Update total items count
  useEffect(() => {
    const count = currentItems.reduce((total, item) => total + item.quantity, 0)
    setTotalItems(count)
  }, [currentItems])

  // Update the store cart in the storeCarts array
  const updateStoreCart = (items: CartItem[]) => {
    if (!selectedStore) return

    setStoreCarts((prevCarts) => {
      const existingCartIndex = prevCarts.findIndex((cart) => cart.storeId === selectedStore.id)

      if (existingCartIndex >= 0) {
        // Update existing cart
        const updatedCarts = [...prevCarts]
        updatedCarts[existingCartIndex] = {
          ...updatedCarts[existingCartIndex],
          items,
        }
        return updatedCarts
      } else {
        // Create new cart for this store
        return [...prevCarts, { storeId: selectedStore.id, items }]
      }
    })
  }

  const addToCart = (product: Omit<CartItem, "quantity">) => {
    if (!selectedStore) return

    const updatedItems = [...currentItems]
    const existingItemIndex = updatedItems.findIndex((item) => item.id === product.id)

    if (existingItemIndex >= 0) {
      // Update existing item
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + 1,
      }
    } else {
      // Add new item
      updatedItems.push({ ...product, quantity: 1 })
    }

    setCurrentItems(updatedItems)
    updateStoreCart(updatedItems)

    // Umami event tracking
    if (typeof window !== 'undefined' && window.umami) {
      window.umami.track('add_to_cart', {
        product_id: product.id,
        product_name: product.name,
        product_type: product.type,
        product_price: product.price,
        store_id: selectedStore.id,
        store_name: selectedStore.name,
      })
    }
  }

  const removeFromCart = (productId: number) => {
    if (!selectedStore) return

    const removedItem = currentItems.find((item) => item.id === productId)
    const updatedItems = currentItems.filter((item) => item.id !== productId)
    setCurrentItems(updatedItems)
    updateStoreCart(updatedItems)

    // Umami event tracking
    if (removedItem && typeof window !== 'undefined' && window.umami) {
      window.umami.track('remove_from_cart', {
        product_id: removedItem.id,
        product_name: removedItem.name,
        product_type: removedItem.type,
        product_price: removedItem.price,
        store_id: selectedStore.id,
        store_name: selectedStore.name,
      })
    }
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (!selectedStore) return

    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    const updatedItems = currentItems.map((item) => (item.id === productId ? { ...item, quantity } : item))

    setCurrentItems(updatedItems)
    updateStoreCart(updatedItems)
  }

  const getItemQuantity = (productId: number) => {
    const item = currentItems.find((item) => item.id === productId)
    return item ? item.quantity : 0
  }

  const clearCart = () => {
    if (!selectedStore) return
    
    // Update current items immediately
    setCurrentItems([])
    
    // Update store carts state with an empty cart for the current store
    setStoreCarts((prevCarts) => {
      const existingCartIndex = prevCarts.findIndex((cart) => cart.storeId === selectedStore.id)
      
      if (existingCartIndex >= 0) {
        // Update existing cart with empty items array
        const updatedCarts = [...prevCarts]
        updatedCarts[existingCartIndex] = {
          ...updatedCarts[existingCartIndex],
          items: [],
        }
        return updatedCarts
      }
      return prevCarts
    })
    
    // Force update localStorage immediately
    if (isInitialized && selectedStore) {
      const updatedCarts = storeCarts.map(cart => 
        cart.storeId === selectedStore.id ? {...cart, items: []} : cart
      )
      localStorage.setItem("storeCarts", JSON.stringify(updatedCarts))
    }
  }

  return (
    <CartContext.Provider
      value={{
        items: currentItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getItemQuantity,
        totalItems,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
