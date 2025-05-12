"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

// Define types for order items and orders
export interface OrderItem {
  id: number
  name: string
  type: string
  quantity: number
  price: number
  image: string
}

export interface Order {
  id: string
  orderNumber: string
  orderDate: string
  orderTime: string
  deliveryDate: string
  items: OrderItem[]
  total: number
  status: "processing" | "delivered" | "cancelled"
  storeId?: string
  storeName?: string
  storeAddress?: string
}

interface OrderContextType {
  orders: Order[]
  saveOrder: (order: Omit<Order, "id">) => void
  getOrderById: (id: string) => Order | undefined
  getAllOrders: () => Order[]
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export const useOrders = () => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider")
  }
  return context
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [initialized, setInitialized] = useState(false)

  // Load orders from localStorage on initial render
  useEffect(() => {
    const storedOrders = localStorage.getItem("orders")
    if (storedOrders) {
      try {
        const parsedOrders = JSON.parse(storedOrders)
        setOrders(parsedOrders)
      } catch (error) {
        console.error("Failed to parse orders from localStorage:", error)
      }
    }
    setInitialized(true)
  }, [])

  // Save orders to localStorage whenever they change
  useEffect(() => {
    if (initialized) {
      localStorage.setItem("orders", JSON.stringify(orders))
    }
  }, [orders, initialized])

  const saveOrder = (order: Omit<Order, "id">) => {
    const newOrder: Order = {
      ...order,
      id: `order_${Date.now()}`,
    }
    
    setOrders(prev => [newOrder, ...prev])
    return newOrder
  }

  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id)
  }

  const getAllOrders = () => {
    return orders
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        saveOrder,
        getOrderById,
        getAllOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
} 