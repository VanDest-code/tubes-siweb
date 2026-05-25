"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'; // Pastikan path ini benar

export default function LoginKurir() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [kurirCode, setKurirCode] = useState('');
  const [errors, setErrors] = useState<{email?: string; code?: string; api?: string}>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    let newErrors: {email?: string; code?: string; api?: string} = {};

    // Validasi Frontend (Kosong/Format Salah)
    if (!email) {
      newErrors.email = "Email wajib diisi";
    } else if (!email.includes('@')) {
      newErrors.email = "Gunakan format Email! cth: kurirbudi@gmail.com";
    }

    if (!kurirCode) {
      newErrors.code = "Kode kurir wajib diisi";
    }

    setErrors(newErrors);

    // Jika format sudah benar, lanjutkan cek ke Supabase
    if (Object.keys(newErrors).length === 0) {
      try {
        setLoading(true);

        // Menembak database untuk mencari kurir yang cocok
        const { data, error } = await supabase
          .from("couriers")
          .select("id")
          .eq("email", email)
          .eq("kode_kurir", kurirCode)
          .single();

        // Jika tidak ketemu (Email atau Kode salah)
        if (error || !data) {
          setErrors({ api: "Email atau Kode Kurir tidak ditemukan/salah." });
          return;
        }

        // BERHASIL! Simpan ID Kurir ke Session Storage
        sessionStorage.setItem("loggedInCourierId", data.id);
        
        // Munculkan Pop-up Sukses buatanmu
        setShowSuccess(true);

      } catch (err) {
        console.error("Login gagal:", err);
        setErrors({ api: "Terjadi kesalahan sistem." });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <main className="min-h-screen bg-nadebee-green flex flex-col items-center relative font-poppins">
      
      {/* --- HEADER BAR --- */}
      <header className="w-full bg-white border-b border-gray-100 px-4 md:px-8 h-[80px] flex items-center justify-between sticky top-0 z-50">
        <Link href="/auth/login" className="text-gray-400 hover:text-gray-600 transition-all font-medium italic text-xs md:text-sm flex items-center gap-2">
          ← Kembali
        </Link>
        
        <div className="flex items-center gap-2">
           <span className="text-lg md:text-xl">🐝</span>
           <h1 className="text-sm md:text-lg font-black text-gray-900 tracking-tighter">
             Nadebee <span className="text-green-500">Express</span>
           </h1>
        </div>

        <div className="w-[60px] md:w-[80px]"></div>
      </header>

      {/* --- CONTENT AREA --- */}
      <div className="flex flex-col items-center px-6 py-8 md:py-12 w-full max-w-md">
        
        <div className="bg-nadebee-primary p-4 rounded-2xl text-white text-3xl mb-6 shadow-lg">
          🚚
        </div>
        
        <h1 className="text-base md:text-lg font-bold mb-6 md:mb-8 text-gray-800 uppercase tracking-wide text-center">Masuk sebagai Kurir</h1>

        <form onSubmit={handleLogin} className="w-full bg-white p-6 md:p-8 rounded-[32px] border-none shadow-xl shadow-green-900/5 space-y-6">
          
          {/* Error Umum (Dari Supabase) */}
          {errors.api && (
            <div className="bg-red-50 text-red-500 text-xs font-bold p-3 rounded-xl text-center border border-red-100">
              {errors.api}
            </div>
          )}

          {/* Input Email */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Email</label>
            <input 
              type="text"
              placeholder="Masukkan Email"
              className={`w-full bg-green-50/50 border ${errors.email ? 'border-red-400' : 'border-gray-100'} rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-nadebee-primary`}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors({}); }} // Reset error saat mengetik
            />
            {errors.email && <p className="text-[10px] text-red-500 mt-1 italic">{errors.email}</p>}
          </div>

          {/* Input Kode Kurir */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Kode Kurir</label>
            <input 
              type="password"
              placeholder="Masukkan Kode Kurir"
              className={`w-full bg-green-50/50 border ${errors.code ? 'border-red-400' : 'border-gray-100'} rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-nadebee-primary`}
              value={kurirCode}
              onChange={(e) => { setKurirCode(e.target.value); setErrors({}); }} // Reset error saat mengetik
            />
            {errors.code && <p className="text-[10px] text-red-500 mt-1 italic">{errors.code}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full font-bold py-3.5 md:py-4 rounded-xl transition-all shadow-md text-sm md:text-base ${
              loading 
                ? "bg-green-300 text-white cursor-not-allowed" 
                : "bg-nadebee-primary hover:bg-green-600 text-white active:scale-95"
            }`}
          >
            {loading ? "Memeriksa..." : "Masuk"}
          </button>
        </form>
      </div>

      {/* MODAL SUKSES KURIR */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 px-6 md:px-10">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-xs flex flex-col items-center animate-in fade-in zoom-in duration-300 shadow-2xl">
            <div className="w-12 h-12 rounded-full border-2 border-nadebee-primary flex items-center justify-center text-nadebee-primary text-2xl mb-4">
              ✓
            </div>
            <h3 className="font-bold text-gray-800 text-center text-sm md:text-base leading-tight mb-6">
              Selamat datang dan <br /> selamat bekerja!
            </h3>
            {/* Navigasi Link tetap milikmu */}
            <Link href="/auth/dashboard/kurir" className="w-full bg-nadebee-primary text-white font-bold py-3 rounded-xl text-center shadow-md text-sm">
              Oke
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}