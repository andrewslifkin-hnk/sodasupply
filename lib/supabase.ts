import { createClient } from '@supabase/supabase-js'

// Initialize the Supabase client
// Use typeof window check to ensure this code works in both server and client environments
const supabaseUrl = typeof window !== 'undefined' 
  ? process.env.NEXT_PUBLIC_SUPABASE_URL || '' 
  : process.env.NEXT_PUBLIC_SUPABASE_URL || ''

const supabaseAnonKey = typeof window !== 'undefined'
  ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Check for missing configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase configuration. Make sure to set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file. Using mock data instead.'
  )
}

// Create a Supabase client even if credentials are empty
// This prevents errors when calling methods on the client
// The store service will check if credentials are valid before making actual API calls
export const supabase = createClient(
  supabaseUrl, 
  supabaseAnonKey,
  {
    auth: {
      persistSession: false
    }
  }
)
