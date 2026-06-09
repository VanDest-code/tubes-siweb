"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User, Check, Truck, ArrowLeft } from 'lucide-react';

export default function UnifiedLogin() {
  const router = useRouter();
  
  // State untuk Switch Role
  const [activeTab, setActiveTab] = useState<"pelanggan" | "kurir">("pelanggan");
  
  // State Form Gabungan
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [kurirCode, setKurirCode] = useState('');
  
  const [errors, setErrors] = useState<{email?: string; password?: string; code?: string; auth?: string}>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    let newErrors: {email?: string; password?: string; code?: string; auth?: string} = {};
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validasi Umum (Email)
    if (!email) {
      newErrors.email = "Email wajib diisi";
    } else if (!emailRegex.test(email)) {
      newErrors.email = activeTab === 'pelanggan' ? "Format salah! cth: natalie@gmail.com" : "Format salah! cth: kurir@gmail.com";
    }

    // Validasi Spesifik Role
    if (activeTab === 'pelanggan') {
      if (!password) {
        newErrors.password = "Password wajib diisi";
      } else if (password.length < 8 || password.length > 12) {
        newErrors.password = "Password harus 8 - 12 digit"; 
      }
    } else {
      if (!kurirCode) {
        newErrors.code = "Kode Kurir wajib diisi";
      } else if (!/^\d{6}$/.test(kurirCode)) { 
        newErrors.code = "Kode Kurir harus persis 6 digit angka"; 
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    // Eksekusi Supabase Berdasarkan Role
    try {
  if (activeTab === 'pelanggan') {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error("Email atau Password salah!");
    
    sessionStorage.removeItem("loggedInCourierId"); 
    document.cookie = "nadebee-auth-token=true; path=/; max-age=86400";
  } else {
    // === TAMBAHKAN BARIS INI UNTUK KURIR ===
    // Bersihkan dulu session Supabase Auth pelanggan agar tidak merusak Sidebar Kurir!
    await supabase.auth.signOut(); 
    // =======================================

    const { data, error } = await supabase
      .from("couriers")
      .select("id")
      .eq("email", email)
      .eq("kode_kurir", kurirCode)
      .single();

    if (error || !data) throw new Error("Email atau Kode Kurir salah!");
    
    sessionStorage.setItem("loggedInCourierId", data.id);
    document.cookie = "nadebee-auth-token=true; path=/; max-age=86400";
  }

  setShowSuccess(true);
} catch (err: any) {
  setErrors({ auth: err.message || "Terjadi kesalahan sistem." });
} finally {
  setLoading(false);
}
}; // <--- INI KURUNG KURAWAL YANG TADI TIDAK SENGAJA TERHAPUS

  const displayName = email ? email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1) : "";

  return (
    <main className="min-h-screen bg-[#F0FDF4] flex flex-col items-center relative font-poppins w-full overflow-x-hidden">
      
      {/* --- HEADER BAR RESPONSIVE --- */}
      <header className="w-full bg-white border-b border-gray-100 px-4 md:px-8 h-[80px] flex items-center justify-between sticky top-0 z-50">
        <button onClick={() => router.push('/')} className="text-gray-400 hover:text-gray-600 transition-all font-medium italic text-xs md:text-sm flex items-center gap-1 md:gap-2">
          <ArrowLeft size={16} /> Kembali
        </button>
        <div className="flex items-center gap-1.5 md:gap-2">
           <span className="text-base md:text-xl">🐝</span>
           <h1 className="text-xs md:text-lg font-black text-gray-900 tracking-tighter">
             Nadebee <span className="text-green-500">Express</span>
           </h1>
        </div>
        <div className="w-[50px] md:w-[80px]"></div>
      </header>

      {/* --- CONTENT AREA RESPONSIVE --- */}
      <div className="flex flex-col items-center px-4 sm:px-6 py-6 md:py-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight mb-1">Selamat Datang Kembali!</h1>
          <p className="text-xs md:text-sm text-gray-500 font-medium">Silakan masuk ke akunmu untuk melanjutkan.</p>
        </div>

        {/* --- TOGGLE SWITCH ROLE --- */}
        <div className="bg-gray-100/80 p-1 rounded-full flex w-full mb-6 md:mb-8 relative shadow-inner">
          <button
            type="button"
            onClick={() => { setActiveTab('pelanggan'); setErrors({}); }}
            className={`flex-1 py-2.5 md:py-3 text-xs md:text-sm font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-1.5 md:gap-2 ${
              activeTab === 'pelanggan' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <User size={16} /> Pelanggan
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('kurir'); setErrors({}); }}
            className={`flex-1 py-2.5 md:py-3 text-xs md:text-sm font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-1.5 md:gap-2 ${
              activeTab === 'kurir' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Truck size={16} /> Kurir
          </button>
        </div>

        {/* Form Container dengan padding fleksibel */}
        <form onSubmit={handleLogin} className="w-full bg-white p-5 sm:p-6 md:p-8 rounded-[28px] md:rounded-[32px] border-none shadow-xl shadow-green-900/5 space-y-5 md:space-y-6">
          {errors.auth && (
            <div className="bg-red-50 text-red-500 text-[10px] md:text-[11px] p-3 rounded-lg border border-red-100 text-center italic font-medium">
              {errors.auth}
            </div>
          )}

          <div className="animate-in fade-in duration-300">
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Email</label>
            <input 
              type="text"
              placeholder="Masukkan Email"
              className={`w-full bg-green-50/50 border ${errors.email ? 'border-red-400' : 'border-gray-100'} rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-green-500 transition-colors`}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors({...errors, email: ''}); }}
            />
            {errors.email && <p className="text-[10px] text-red-500 mt-1.5 italic">{errors.email}</p>}
          </div>

          {activeTab === 'pelanggan' ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Password</label>
              <input 
                type="password"
                placeholder="Masukkan Password"
                className={`w-full bg-green-50/50 border ${errors.password ? 'border-red-400' : 'border-gray-100'} rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-green-500 transition-colors`}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors({...errors, password: ''}); }}
              />
              {errors.password && <p className="text-[10px] text-red-500 mt-1.5 italic">{errors.password}</p>}
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Kode Kurir</label>
              <input 
                type="password"
                placeholder="Masukkan 6 Digit Kode Kurir"
                className={`w-full bg-green-50/50 border ${errors.code ? 'border-red-400' : 'border-gray-100'} rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-green-500 transition-colors`}
                value={kurirCode}
                onChange={(e) => { setKurirCode(e.target.value); setErrors({...errors, code: ''}); }}
              />
              {errors.code && <p className="text-[10px] text-red-500 mt-1.5 italic">{errors.code}</p>}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full bg-[#4CAF50] hover:bg-green-600 text-white font-black py-3.5 md:py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] text-sm md:text-base mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Memproses...' : `Masuk sebagai ${activeTab === 'pelanggan' ? 'Pelanggan' : 'Kurir'}`}
          </button>

          <p className="text-center text-[10px] md:text-[11px] text-gray-500 font-medium">
            Belum punya akun? <Link href="/auth/register" className="text-[#4CAF50] font-black cursor-pointer hover:underline">Daftar sekarang</Link>
          </p>
        </form>
      </div>

      {/* MODAL SUKSES */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-[28px] md:rounded-[32px] p-6 md:p-8 w-full max-w-xs flex flex-col items-center animate-in fade-in zoom-in duration-300 shadow-2xl">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-4 border-green-50 bg-green-100 flex items-center justify-center text-[#4CAF50] mb-4">
              <Check size={28} strokeWidth={3} />
            </div>
            <h3 className="font-black text-gray-900 text-base md:text-lg mb-1">Login Berhasil!</h3>
            <p className="text-gray-500 text-xs md:text-sm mb-6 text-center font-medium">
              Selamat datang <span className="font-bold text-gray-800">{displayName}</span>{activeTab === 'kurir' ? ' dan selamat bekerja!' : ''}
            </p>
            <Link 
              href={activeTab === 'pelanggan' ? "/auth/dashboard/pelanggan" : "/auth/dashboard/kurir"} 
              className="w-full bg-[#4CAF50] text-white font-bold py-3 rounded-xl text-center shadow-lg hover:bg-green-600 transition-colors text-sm"
            >
              Lanjutkan
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}