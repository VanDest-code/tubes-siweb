import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Disamakan menjadi PUBLISHABLE_KEY sesuai .env.local Anda
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY; 

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ PERINGATAN: Variabel lingkungan Supabase belum terbaca di .env.local!");
}

export const supabase = createClient(
  supabaseUrl || 'https://haovfjyqzfusbiswhgre.supabase.co', 
  supabaseAnonKey || 'sb_publishable_rDgSqT1usma88ZD-nhANsA_0jcEL4_u'
);