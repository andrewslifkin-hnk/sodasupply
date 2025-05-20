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

// Mock stores for when Supabase is not configured
const mockStores: Store[] = [
  {
    id: 1,
    name: "Beverage World",
    address: "123 Main Street",
    city: "New York",
    region: "NY",
    postal_code: "10001",
  },
  {
    id: 2,
    name: "Drink Depot",
    address: "45 Atlantic Avenue",
    city: "Brooklyn",
    region: "NY",
    postal_code: "11201",
  },
  {
    id: 3,
    name: "Soda Express",
    address: "210 Spring Street",
    city: "New York",
    region: "NY",
    postal_code: "10012",
  },
  {
    id: 4,
    name: "Refreshment Center",
    address: "785 Madison Avenue",
    city: "New York",
    region: "NY",
    postal_code: "10065",
  },
  {
    id: 5,
    name: "Fizz & Co.",
    address: "247 Bedford Avenue",
    city: "Brooklyn",
    region: "NY",
    postal_code: "11211",
  },
  {
    id: 6,
    name: "Thirst Quenchers",
    address: "90-15 Queens Boulevard",
    city: "Queens",
    region: "NY",
    postal_code: "11373",
  },
];

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

export async function getStores(): Promise<Store[]> {
  try {
    // If Supabase is not configured, return mock data
    if (!isSupabaseConfigured()) {
      return Promise.resolve(mockStores);
    }

    // Always wrap Supabase operations in a try-catch to prevent unhandled errors
    const { data, error } = await supabase.from("stores").select("*").order("name");

    if (error) {
      console.error("Error fetching stores:", error);
      return mockStores;
    }

    return data && data.length > 0 ? data : mockStores;
  } catch (e) {
    console.error("Error fetching stores:", e);
    return mockStores;
  }
}

export async function getStoreById(id: number): Promise<Store | null> {
  try {
    // If Supabase is not configured, return mock data
    if (!isSupabaseConfigured()) {
      const store = mockStores.find(s => s.id === id);
      return Promise.resolve(store || null);
    }

    // Always wrap Supabase operations in a try-catch to prevent unhandled errors
    const { data, error } = await supabase.from("stores").select("*").eq("id", id).single();

    if (error) {
      console.error("Error fetching store:", error);
      const mockStore = mockStores.find(s => s.id === id);
      return mockStore || null;
    }

    return data;
  } catch (e) {
    console.error("Error fetching store:", e);
    const mockStore = mockStores.find(s => s.id === id);
    return mockStore || null;
  }
}
