import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Log untuk memeriksa isi asli variabel di terminal dan browser console
console.log("=== DEBUG SUPABASE ENV ===");
console.log("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl);
console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "Ada (Terbaca)" : "Kosong (Undefined)");
console.log("==========================");

// Gunakan URL & Key tiruan jika aslinya kosong agar halaman tidak crash di awal
const safeUrl = supabaseUrl || 'https://nadebee-placeholder.supabase.co';
const safeKey = supabaseAnonKey || 'placeholder-anon-key';

export const supabase = createClient(safeUrl, safeKey);