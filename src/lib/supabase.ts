import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Temporary fallback for development
console.log('Supabase URL:', supabaseUrl)

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