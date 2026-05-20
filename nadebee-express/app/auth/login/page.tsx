"use client";
import { useRouter } from 'next/navigation'; // Import router
import Image from 'next/image';
import Link from 'next/link';
import LogoNadebee from '@/public/logo.png';

export default function RoleSelection() {
  const router = useRouter(); // Inisialisasi router

  return (
    <main className="min-h-screen bg-[#F0FDF4] flex flex-col items-center relative font-poppins">
      
      {/* --- HEADER BAR --- */}
      <header className="w-full bg-white border-b border-gray-100 px-4 md:px-8 h-[80px] flex items-center justify-between sticky top-0 z-50">
        {/* Ganti Link dengan Button agar fungsi Back-nya kuat */}
        <button 
          onClick={() => router.push('/')} 
          className="text-gray-400 hover:text-gray-600 transition-all font-medium italic text-xs md:text-sm flex items-center gap-2"
        >
          ← Kembali
        </button>
        
        <div className="flex items-center gap-2">
           <span className="text-lg md:text-xl">🐝</span>
           <h1 className="text-sm md:text-lg font-black text-gray-900 tracking-tighter">
             Nadebee <span className="text-green-500">Express</span>
           </h1>
        </div>

        <div className="w-[60px] md:w-[80px]"></div>
      </header>

      {/* --- CONTENT AREA --- */}
      <div className="flex flex-col items-center px-6 py-10 md:py-12 w-full max-w-md">
        
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="relative w-40 h-40 md:w-[200px] md:h-[200px] mb-4">
            <Image 
              src={LogoNadebee} 
              alt="Nadebee Express Logo" 
              fill
              className="object-contain" 
              priority 
            />
          </div>

          {/* JUDUL SESUAI GAMBAR FIGMA BARU */}
          <h1 className="text-lg md:text-xl font-bold text-gray-800 leading-tight">
            Selamat Datang di <br /> <span className="text-nadebee-primary">Nadebee Express</span>
          </h1>
          <p className="text-gray-500 text-xs mt-2">Solusi Pickup mudah untuk UMKM</p>
        </div>

        <div className="w-full space-y-4">
          {/* Card Pelanggan */}
          <Link href="/app/auth/login/pelanggan" className="block bg-white p-5 md:p-6 rounded-[28px] shadow-sm border-2 border-transparent hover:border-nadebee-primary transition-all active:scale-[0.98]">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 md:p-4 rounded-2xl text-nadebee-primary text-xl md:text-2xl">👤</div>
              <div>
                <h2 className="font-bold text-gray-800 text-sm md:text-base leading-tight">Masuk sebagai Pelanggan</h2>
                <p className="text-[10px] md:text-[11px] text-gray-400 mt-0.5">Request Pickup dan lacak paketmu</p>
              </div>
            </div>
          </Link>

          {/* Card Kurir */}
          <Link href="/app/auth/login/kurir" className="block bg-white p-5 md:p-6 rounded-[28px] shadow-sm border-2 border-transparent hover:border-nadebee-primary transition-all active:scale-[0.98]">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 md:p-4 rounded-2xl text-nadebee-primary text-xl md:text-2xl">🚚</div>
              <div>
                <h2 className="font-bold text-gray-800 text-sm md:text-base leading-tight">Masuk sebagai Kurir</h2>
                <p className="text-[10px] md:text-[11px] text-gray-400 mt-0.5">Kelola Pickup</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
      
    </main>
  );
}