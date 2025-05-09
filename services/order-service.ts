import { supabase } from "@/lib/supabase"
import type { CartItem } from "@/context/cart-context"

export interface Order {
  id?: number
  customer_id?: number
  store_id: number
  order_number: string
  order_date: string
  delivery_date: string
  subtotal: number
  vat: number
  discount: number
  total: number
  status: string
  payment_method: string
  remarks?: string
}

export interface OrderItem {
  order_id?: number
  product_id: number
  quantity: number
  price: number
  total: number
}

export async function createOrder(
  order: Order,
  items: CartItem[],
): Promise<{ success: boolean; order_id?: number; error?: string }> {
  // Insert the order
  const { data: orderData, error: orderError } = await supabase.from("orders").insert(order).select()

  if (orderError) {
    console.error("Error creating order:", orderError)
    return { success: false, error: orderError.message }
  }

  const order_id = orderData[0].id

  // Insert order items
  const orderItems = items.map((item) => ({
    order_id,
    product_id: item.id,
    quantity: item.quantity,
    price: item.price,
    total: item.price * item.quantity,
  }))

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

  if (itemsError) {
    console.error("Error creating order items:", itemsError)
    return { success: false, error: itemsError.message }
  }

  return { success: true, order_id }
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const { data, error } = await supabase.from("orders").select("*").eq("order_number", orderNumber).single()

  if (error) {
    console.error("Error fetching order:", error)
    return null
  }

  return data
}

export async function getOrderItems(orderId: number): Promise<OrderItem[]> {
  const { data, error } = await supabase.from("order_items").select("*").eq("order_id", orderId)

  if (error) {
    console.error("Error fetching order items:", error)
    return []
  }

  return data || []
}
