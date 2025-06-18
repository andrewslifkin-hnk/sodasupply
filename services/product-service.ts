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
  // Translation fields
  name_pt?: string
  description_pt?: string
  type_pt?: string
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
    in_stock: true,
    name_pt: "Gatorade Thirst Quencher Ponche de Frutas",
    description_pt: "Reponha eletrólitos com sabor Ponche de Frutas",
    type_pt: "Bebida esportiva",
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
    in_stock: true,
    name_pt: "OLIPOP Refrigerante Prebiótico Cola Vintage",
    description_pt: "Refrigerante prebiótico com sabor Cola Vintage, baixo açúcar",
    type_pt: "Refrigerante",
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

export async function getProducts(searchQuery?: string, locale: string = 'en'): Promise<Product[]> {
  try {
    // If Supabase is not configured, return mock data
    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured. Using mock product data.");
      // NOTE: If you want every image in /public/products to have a product, use a Node.js script to generate missing product entries and import them into Supabase or your mock data.
      return Promise.resolve(mockProducts);
    }

    // Select all fields including translation columns
    let query = supabase.from("products").select("*");

    // Apply search filter based on locale
    if (searchQuery && searchQuery.trim() !== "") {
      if (locale === 'pt-BR') {
        // Search in both original and Portuguese fields
        query = query.or(`name.ilike.%${searchQuery}%,type.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,name_pt.ilike.%${searchQuery}%,description_pt.ilike.%${searchQuery}%,type_pt.ilike.%${searchQuery}%`);
      } else {
        // Search in original fields only
        query = query.or(`name.ilike.%${searchQuery}%,type.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }
    }

    const { data, error } = await query.order("name");

    if (error) {
      console.error("Error fetching products:", error);
      return mockProducts;
    }

    // Return localized database data, only fall back to mock data if no products found
    if (data && data.length > 0) {
      // Localize the data based on the locale
      const localizedData = data.map(product => {
        if (locale === 'pt-BR') {
          return {
            ...product,
            name: product.name_pt || product.name,
            type: product.type_pt || product.type,
            description: product.description_pt || product.description,
          }
        }
        return product;
      });
      return localizedData;
    } else {
      return mockProducts;
    }
  } catch (e) {
    console.error("Error fetching products:", e);
    return mockProducts;
  }
}

export async function getProductById(id: number, locale: string = 'en'): Promise<Product | null> {
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

    if (data) {
      // Localize the data based on the locale
      if (locale === 'pt-BR') {
        return {
          ...data,
          name: data.name_pt || data.name,
          type: data.type_pt || data.type,
          description: data.description_pt || data.description,
        };
      }
      return data;
    }

    return null;
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
