"use client";

import { ShieldAlert, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#F4F9F4] font-poppins flex flex-col items-center justify-center px-4 w-full">
      
      {/* Kotak Card Utama */}
      <div className="bg-white max-w-md w-full rounded-[32px] p-8 md:p-10 shadow-xl shadow-green-900/5 border border-gray-100 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-500">
        
        {/* Ikon Peringatan */}
        <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-6 shadow-inner border-4 border-white">
          <ShieldAlert size={40} strokeWidth={2.5} />
        </div>
        
        {/* Teks Peringatan */}
        <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
          Akses Dibatasi
        </h2>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed font-medium">
          Waduh, sepertinya kamu belum login. Silakan masuk atau daftar akun terlebih dahulu untuk bisa mengakses halaman ini ya!
        </p>
        
        {/* Tombol Redirect ke Login */}
        <button
          onClick={() => router.push('/auth/login')}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#4CAF50] px-6 py-4 text-sm md:text-base font-bold text-white transition-all hover:bg-[#43A047] active:scale-95 shadow-md shadow-green-200"
        >
          <LogIn size={20} /> Pergi ke Halaman Login
        </button>
        
      </div>
      
    </main>
  );
}