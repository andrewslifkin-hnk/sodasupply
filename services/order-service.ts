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

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  // Check both client and server environments
  const supabaseUrl = typeof window !== 'undefined' 
    ? process.env.NEXT_PUBLIC_SUPABASE_URL 
    : process.env.NEXT_PUBLIC_SUPABASE_URL;
    
  const supabaseAnonKey = typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
  return Boolean(supabaseUrl) && Boolean(supabaseAnonKey);
}

export async function createOrder(
  order: Order,
  items: CartItem[],
): Promise<{ success: boolean; order_id?: number; error?: string }> {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured. Cannot create order in the database.");
      // Return a mock success response
      return { 
        success: true, 
        order_id: Math.floor(Math.random() * 10000) // Mock order ID 
      };
    }

    // Insert the order
    const { data: orderData, error: orderError } = await supabase.from("orders").insert(order).select();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return { success: false, error: orderError.message };
    }

    const order_id = orderData[0].id;

    // Insert order items
    const orderItems = items.map((item) => ({
      order_id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      return { success: false, error: itemsError.message };
    }

    return { success: true, order_id };
  } catch (e) {
    console.error("Unexpected error creating order:", e);
    return { success: false, error: 'An unexpected error occurred while creating the order' };
  }
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured. Cannot fetch order.");
      return null;
    }

    const { data, error } = await supabase.from("orders").select("*").eq("order_number", orderNumber).single();

    if (error) {
      console.error("Error fetching order:", error);
      return null;
    }

    return data;
  } catch (e) {
    console.error("Unexpected error fetching order:", e);
    return null;
  }
}

export async function getOrderItems(orderId: number): Promise<OrderItem[]> {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured. Cannot fetch order items.");
      return [];
    }

    const { data, error } = await supabase.from("order_items").select("*").eq("order_id", orderId);

    if (error) {
      console.error("Error fetching order items:", error);
      return [];
    }

    return data || [];
  } catch (e) {
    console.error("Unexpected error fetching order items:", e);
    return [];
  }
}
