"use client";

import { Frown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotFound() {
  const router = useRouter();
  const [safePath, setSafePath] = useState("/");

  useEffect(() => {
    // 1. Deteksi apakah user yang nyasar ini adalah Kurir
    const isKurir = sessionStorage.getItem("loggedInCourierId");
    
    // 2. Deteksi apakah user punya karcis login umum (Token Auth)
    const hasToken = document.cookie.includes("nadebee-auth-token");

    // 3. Tentukan rute pulang yang aman untuk mereka
    if (isKurir) {
      setSafePath("/auth/dashboard/kurir");
    } else if (hasToken) {
      setSafePath("/auth/dashboard/pelanggan");
    } else {
      setSafePath("/auth/login"); // Kalau tidak ada token, suruh login
    }
  }, []);

  return (
    <main className="flex h-screen bg-[#F4F9F4] flex-col items-center justify-center gap-2 font-poppins px-6 w-full">
      <div className="bg-white p-10 rounded-[32px] shadow-xl shadow-green-900/5 border border-gray-100 flex flex-col items-center text-center max-w-sm w-full animate-in zoom-in-95 duration-500">
        
        <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-6 shadow-inner border-4 border-white">
          <Frown size={40} strokeWidth={2} />
        </div>
        
        <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">404 Error</h2>
        <p className="text-sm text-gray-500 mb-8 font-medium">
          Akses ditolak atau halaman yang kamu cari tidak ditemukan.
        </p>
        
        <button
          onClick={() => router.push(safePath)}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#4CAF50] px-6 py-4 text-sm md:text-base font-bold text-white transition-all hover:bg-[#43A047] active:scale-95 shadow-md shadow-green-200"
        >
          Kembali ke Tempat Aman
        </button>
      </div>
    </main>
  );
}