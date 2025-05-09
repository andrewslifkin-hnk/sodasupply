import { supabase } from "@/lib/supabase"

export interface Store {
  id: number
  name: string
  address: string
  city: string
  region: string
  postal_code?: string
  phone?: string
  email?: string
}

export async function getStores(): Promise<Store[]> {
  const { data, error } = await supabase.from("stores").select("*").order("name")

  if (error) {
    console.error("Error fetching stores:", error)
    return []
  }

  return data || []
}

export async function getStoreById(id: number): Promise<Store | null> {
  const { data, error } = await supabase.from("stores").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching store:", error)
    return null
  }

  return data
}
