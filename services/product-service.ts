import { supabase } from "@/lib/supabase"

export interface Product {
  id: number
  name: string
  type: string
  size: string
  price: number
  image_url: string
  description?: string
  returnable: boolean
  in_stock: boolean
}

export async function getProducts(searchQuery?: string): Promise<Product[]> {
  // Return empty array to force using the default products
  return []
  
  // Original implementation commented out
  /*
  let query = supabase.from("products").select("*")

  // Only apply search filter if searchQuery is not empty
  if (searchQuery && searchQuery.trim() !== "") {
    query = query.or(`name.ilike.%${searchQuery}%,type.ilike.%${searchQuery}%`)
  }

  const { data, error } = await query.order("name")

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return data || []
  */
}

export async function getProductById(id: number): Promise<Product | null> {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching product:", error)
    return null
  }

  return data
}
