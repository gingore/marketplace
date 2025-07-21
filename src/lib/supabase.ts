import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Listing {
  id: string
  title: string
  description: string
  price: string
  seller_email: string
  category: string
  image_url?: string
  location: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  listing_id: string
  buyer_name: string
  buyer_email: string
  message: string
  seller_email: string
  created_at: string
}
