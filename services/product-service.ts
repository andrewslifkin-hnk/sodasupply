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

// Mock products as fallback for when database fails or is not configured
// This is only used if Supabase connection fails and the database is empty
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Gatorade Thirst Quencher Fruit Punch",
    type: "Sports Drink",
    size: "12 fl oz (12 Pack)",
    price: 12.99,
    image_url: "/products/Gatorade-Thirst-Quencher-Fruit-Punch-Sports-Drinks-12-fl-oz-12-Count-Bottles_be2b5bf3-06c9-4b53-b2dc-1beab3e8d0e6.080d878747414581e2c57dd14102f909.jpeg",
    description: "Replenish electrolytes with Fruit Punch flavor",
    returnable: true,
    in_stock: true
  },
  {
    id: 2,
    name: "OLIPOP Prebiotic Soda Vintage Cola",
    type: "Prebiotic Soda",
    size: "12 fl oz (4 Pack)",
    price: 11.99,
    image_url: "/products/OLIPOP-Prebiotic-Soda-Vintage-Cola-12-fl-oz-4-Pack-Pantry-Packs_a411ca43-2ff8-4297-bfd8-636c98da5bf6.b571756ee739db94ffcbc24556a21106.jpeg",
    description: "Prebiotic soda with Vintage Cola flavor, low sugar",
    returnable: false,
    in_stock: true
  }
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

export async function getProducts(searchQuery?: string): Promise<Product[]> {
  try {
    // If Supabase is not configured, return mock data
    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured. Using mock product data.");
      // NOTE: If you want every image in /public/products to have a product, use a Node.js script to generate missing product entries and import them into Supabase or your mock data.
      return Promise.resolve(mockProducts);
    }

    let query = supabase.from("products").select("*");

    // Only apply search filter if searchQuery is not empty
    if (searchQuery && searchQuery.trim() !== "") {
      query = query.or(`name.ilike.%${searchQuery}%,type.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }

    const { data, error } = await query.order("name");

    if (error) {
      console.error("Error fetching products:", error);
      return mockProducts;
    }

    // Return database data, only fall back to mock data if no products found
    return data && data.length > 0 ? data : mockProducts;
  } catch (e) {
    console.error("Error fetching products:", e);
    return mockProducts;
  }
}

export async function getProductById(id: number): Promise<Product | null> {
  try {
    // If Supabase is not configured, return mock data
    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured. Using mock product data.");
      const product = mockProducts.find(p => p.id === id);
      return Promise.resolve(product || null);
    }

    const { data, error } = await supabase.from("products").select("*").eq("id", id).single();

    if (error) {
      console.error("Error fetching product:", error);
      const mockProduct = mockProducts.find(p => p.id === id);
      return mockProduct || null;
    }

    return data;
  } catch (e) {
    console.error("Error fetching product:", e);
    const mockProduct = mockProducts.find(p => p.id === id);
    return mockProduct || null;
  }
}

// Get products grouped by type (category)
export async function getProductsByType(): Promise<Record<string, Product[]>> {
  try {
    const products = await getProducts();
    
    // Group products by type
    const groupedProducts: Record<string, Product[]> = {};
    
    products.forEach(product => {
      if (!groupedProducts[product.type]) {
        groupedProducts[product.type] = [];
      }
      groupedProducts[product.type].push(product);
    });
    
    return groupedProducts;
  } catch (e) {
    console.error("Error grouping products by type:", e);
    return {};
  }
}
