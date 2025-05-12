"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"
import { supabase } from "@/lib/supabase"

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
  createdAt?: string
}

interface OrderContextType {
  orders: Order[]
  saveOrder: (order: Omit<Order, "id">) => Promise<Order>
  getOrderById: (id: string) => Order | undefined
  getAllOrders: () => Promise<Order[]>
  getNextOrderNumber: () => string
  isLoading: boolean
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
  const [orderCounter, setOrderCounter] = useState(1000)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize the order counter from localStorage first, then from database
  useEffect(() => {
    // Try to get saved counter from localStorage
    const savedCounter = localStorage.getItem('orderCounter');
    if (savedCounter) {
      try {
        const counterValue = parseInt(savedCounter);
        if (!isNaN(counterValue) && counterValue > 1000) {
          setOrderCounter(counterValue);
          console.log(`Initialized order counter from localStorage: ${counterValue}`);
        }
      } catch (error) {
        console.error("Error parsing saved counter:", error);
      }
    }
    setIsInitialized(true);
  }, []);

  // Load orders from database on initial render
  useEffect(() => {
    if (!isInitialized) return;

    async function fetchOrders() {
      try {
        setIsLoading(true)
        // Fetch orders from Supabase
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)') // Join with order_items
          .order('created_at', { ascending: false })
        
        if (error) {
          console.error("Error fetching orders:", error)
          return
        }
        
        // Transform from DB format to application format
        const transformedOrders = data.map(dbOrder => {
          return {
            id: dbOrder.id.toString(),
            orderNumber: dbOrder.order_number,
            orderDate: new Date(dbOrder.order_date).toLocaleDateString("en-GB", { 
              day: "numeric", 
              month: "short", 
              year: "numeric" 
            }).replace(",", ""),
            orderTime: new Date(dbOrder.order_date).toLocaleTimeString([], { 
              hour: "2-digit", 
              minute: "2-digit" 
            }),
            deliveryDate: new Date(dbOrder.delivery_date).toLocaleDateString("en-GB", { 
              day: "numeric", 
              month: "short", 
              year: "numeric" 
            }).replace(",", ""),
            total: dbOrder.total,
            status: dbOrder.status,
            storeId: dbOrder.store_id?.toString(),
            storeName: dbOrder.store_name,
            storeAddress: dbOrder.store_address || "", // Provide fallback for potentially missing field
            items: dbOrder.order_items.map((item: any) => ({
              id: item.product_id,
              name: item.product_name,
              type: item.product_type,
              quantity: item.quantity,
              price: item.price,
              image: item.image || "/images/no-products-found.png" // Ensure image is never undefined
            })),
            createdAt: dbOrder.created_at
          } as Order
        })
        
        setOrders(transformedOrders)
        
        // Find highest order number to set counter, but only if it's higher than current counter
        if (data.length > 0) {
          const orderNumbers = data
            .map(order => {
              const match = order.order_number.match(/CO2024-(\d+)/)
              return match ? parseInt(match[1]) : 0
            })
            .filter(num => !isNaN(num))
          
          if (orderNumbers.length > 0) {
            const highestNumber = Math.max(...orderNumbers)
            if (highestNumber >= orderCounter) {
              const newCounter = highestNumber + 1;
              setOrderCounter(newCounter);
              // Save to localStorage for persistence
              localStorage.setItem('orderCounter', newCounter.toString());
              console.log(`Updated counter from database: ${newCounter}`);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchOrders()
  }, [isInitialized, orderCounter])

  const getNextOrderNumber = useCallback(() => {
    // Don't increment here, just return the current value
    return `CO2024-${orderCounter}`
  }, [orderCounter])

  const saveOrder = useCallback(async (order: Omit<Order, "id">) => {
    // If no order number is provided, use the current counter value without incrementing
    const orderToSave = {
      ...order,
      orderNumber: order.orderNumber || `CO2024-${orderCounter}`
    }
    
    try {
      // Convert to database format
      const dbOrder = {
        order_number: orderToSave.orderNumber,
        order_date: new Date().toISOString(),
        delivery_date: new Date(orderToSave.deliveryDate).toISOString(),
        total: orderToSave.total,
        status: orderToSave.status,
        store_id: orderToSave.storeId ? parseInt(orderToSave.storeId) : null,
        store_name: orderToSave.storeName
      }
      
      // Insert order into database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert(dbOrder)
        .select()
      
      if (orderError) {
        throw new Error(`Error creating order: ${orderError.message}`)
      }
      
      const orderId = orderData[0].id
      
      // Insert order items
      const orderItems = orderToSave.items.map(item => ({
        order_id: orderId,
        product_id: item.id,
        product_name: item.name,
        product_type: item.type,
        quantity: item.quantity, 
        price: item.price,
        total: item.price * item.quantity,
        image: item.image || "/images/no-products-found.png" // Ensure image is never undefined
      }))
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)
      
      if (itemsError) {
        throw new Error(`Error creating order items: ${itemsError.message}`)
      }
      
      // Create new order with ID
      const newOrder: Order = {
        ...orderToSave,
        id: orderId.toString(),
        createdAt: new Date().toISOString()
      }
      
      // Update local state
      setOrders(prev => [newOrder, ...prev])
      
      // Only increment the counter AFTER successfully saving the order
      const newCounter = orderCounter + 1;
      setOrderCounter(newCounter);
      localStorage.setItem('orderCounter', newCounter.toString());
      console.log(`Order saved successfully. Incremented counter to ${newCounter}`);
      
      return newOrder
    } catch (error) {
      console.error("Error saving order:", error)
      throw error
    }
  }, [orderCounter])

  const getOrderById = useCallback((id: string) => {
    return orders.find(order => order.id === id)
  }, [orders])

  const getAllOrders = useCallback(async () => {
    // Refresh orders from database before returning
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error("Error fetching orders from Supabase:", error)
        
        // Try to get orders from localStorage as fallback
        try {
          const localOrdersJson = localStorage.getItem('orders');
          if (localOrdersJson) {
            const localOrders = JSON.parse(localOrdersJson);
            
            // Ensure all local orders have unique IDs
            const uniqueLocalOrders = deduplicateOrders(localOrders);
            
            console.log("Using orders from localStorage fallback:", uniqueLocalOrders.length);
            return uniqueLocalOrders;
          }
        } catch (localError) {
          console.error("Error getting orders from localStorage:", localError);
        }
        
        return orders // Return cached orders if both Supabase and localStorage fail
      }
      
      // Transform orders
      const transformedOrders = data.map(dbOrder => ({
        id: dbOrder.id.toString(),
        orderNumber: dbOrder.order_number,
        orderDate: new Date(dbOrder.order_date).toLocaleDateString("en-GB", { 
          day: "numeric", 
          month: "short", 
          year: "numeric" 
        }).replace(",", ""),
        orderTime: new Date(dbOrder.order_date).toLocaleTimeString([], { 
          hour: "2-digit", 
          minute: "2-digit" 
        }),
        deliveryDate: new Date(dbOrder.delivery_date).toLocaleDateString("en-GB", { 
          day: "numeric", 
          month: "short", 
          year: "numeric" 
        }).replace(",", ""),
        total: dbOrder.total,
        status: dbOrder.status,
        storeId: dbOrder.store_id?.toString(),
        storeName: dbOrder.store_name,
        storeAddress: dbOrder.store_address || "", // Provide fallback for potentially missing field
        items: (dbOrder.order_items || []).map((item: any) => ({
          id: item.product_id,
          name: item.product_name,
          type: item.product_type,
          quantity: item.quantity,
          price: item.price,
          image: item.image || "/images/no-products-found.png" // Ensure image is never undefined
        })),
        createdAt: dbOrder.created_at
      })) as Order[]
      
      // Merge with any orders in localStorage that might not be in the database yet
      try {
        const localOrdersJson = localStorage.getItem('orders');
        if (localOrdersJson) {
          const localOrders = JSON.parse(localOrdersJson);
          
          // Ensure all local orders have unique IDs before merging
          const uniqueLocalOrders = deduplicateOrders(localOrders);
          
          // Only use local orders with IDs that start with "local-"
          const localOnlyOrders = uniqueLocalOrders.filter((order: any) => 
            order.id && order.id.toString().startsWith('local-') &&
            !transformedOrders.some(dbOrder => dbOrder.orderNumber === order.orderNumber)
          );
          
          if (localOnlyOrders.length > 0) {
            console.log(`Adding ${localOnlyOrders.length} local-only orders to the list`);
            transformedOrders.push(...localOnlyOrders);
            
            // Sort all orders by date (most recent first)
            transformedOrders.sort((a, b) => {
              const dateA = new Date(a.createdAt || a.orderDate).getTime();
              const dateB = new Date(b.createdAt || b.orderDate).getTime();
              return dateB - dateA;
            });
          }
        }
      } catch (localError) {
        console.error("Error merging local orders:", localError);
      }
      
      setOrders(transformedOrders)
      return transformedOrders
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      
      // Try to get orders from localStorage as fallback
      try {
        const localOrdersJson = localStorage.getItem('orders');
        if (localOrdersJson) {
          const localOrders = JSON.parse(localOrdersJson);
          
          // Ensure all local orders have unique IDs
          const uniqueLocalOrders = deduplicateOrders(localOrders);
          
          console.log("Using orders from localStorage after fetch error:", uniqueLocalOrders.length);
          return uniqueLocalOrders;
        }
      } catch (localError) {
        console.error("Error getting orders from localStorage after fetch error:", localError);
      }
      
      return orders // Return cached orders on error
    }
  }, [orders])

  // Helper function to deduplicate orders by ensuring unique IDs
  const deduplicateOrders = (ordersArray: any[]): Order[] => {
    if (!Array.isArray(ordersArray)) return [];
    
    const seenIds = new Set<string>();
    const seenOrderNumbers = new Set<string>();
    const uniqueOrders: Order[] = [];
    
    ordersArray.forEach((order, index) => {
      if (!order || !order.id) return;
      
      // Generate a truly unique ID if needed
      let uniqueId = order.id;
      if (seenIds.has(uniqueId)) {
        // This is a duplicate ID, so create a new one with index
        uniqueId = order.id.includes('-') 
          ? `${order.id.split('-')[0]}-${Date.now()}-${index}`
          : `local-${Date.now()}-${index}`;
      }
      
      // Skip if we've already seen this order number (potential duplicate)
      if (order.orderNumber && seenOrderNumbers.has(order.orderNumber)) {
        console.log(`Skipping duplicate order number: ${order.orderNumber}`);
        return;
      }
      
      // Add to our tracking sets
      seenIds.add(uniqueId);
      if (order.orderNumber) {
        seenOrderNumbers.add(order.orderNumber);
      }
      
      // Add the order with the potentially updated ID
      uniqueOrders.push({
        ...order,
        id: uniqueId
      });
    });
    
    return uniqueOrders;
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        saveOrder,
        getOrderById,
        getAllOrders,
        getNextOrderNumber,
        isLoading
      }}
    >
      {children}
    </OrderContext.Provider>
  )
} 