import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types for our database tables
export interface Pesanan {
  id?: string
  nama: string
  alamat: string
  no_hp: string
  email: string
  barang: string
  metode_bayar: string
  catatan?: string
  status: string
  created_at?: string
}

export interface Invoice {
  id?: string
  id_pesanan: string
  harga: number
  fee: number
  diskon: number
  dp: number
  total: number
  status: string
  created_at?: string
}