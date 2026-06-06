"use client";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import LogoNadebee from '@/public/logo.png';
import { ArrowLeft, User, Truck } from 'lucide-react';

export default function RoleSelection() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#F0FDF4] flex flex-col items-center relative font-poppins">
      
      {/* --- HEADER BAR --- */}
      <header className="w-full bg-white border-b border-gray-100 px-4 md:px-8 h-[80px] flex items-center justify-between sticky top-0 z-50">
        <button 
          onClick={() => router.push('/')} 
          className="text-gray-400 hover:text-gray-600 transition-all font-medium italic text-xs md:text-sm flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Kembali
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
      {/* padding atas bawah dikurangi dari py-12 ke py-6 */}
      <div className="flex flex-col items-center px-6 py-6 w-full max-w-md">
        
        {/* margin bawah dikurangi dari mb-10 ke mb-6 */}
        <div className="flex flex-col items-center mb-6 text-center">
          {/* Logo dibesarkan jadi w-56 h-56 */}
          <div className="relative w-56 h-56 mb-2">
            <Image 
              src={LogoNadebee} 
              alt="Nadebee Express Logo" 
              fill
              className="object-contain" 
              priority 
            />
          </div>

          <h1 className="text-lg md:text-xl font-bold text-gray-800 leading-tight">
            Selamat Datang di <br /> <span className="text-green-500">Nadebee Express</span>
          </h1>
          <p className="text-gray-500 text-xs mt-1">Solusi Pickup mudah untuk UMKM</p>
        </div>

        {/* --- ROLE CARDS --- */}
        <div className="w-full space-y-4">
          
          {/* Card Pelanggan */}
          <Link href="/auth/login/pelanggan" className="block bg-white p-5 rounded-3xl shadow-sm border-2 border-white hover:border-[#2E7D32] transition-all group active:scale-[0.98]">
            <div className="flex items-center gap-4">
              <div className="bg-[#E8F5E9] p-4 rounded-2xl text-[#2E7D32] group-hover:bg-[#2E7D32] group-hover:text-white transition-colors">
                <User size={24} />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-sm md:text-base">Masuk sebagai Pelanggan</h2>
                <p className="text-[11px] text-gray-400 mt-0.5">Request pickup dan lacak paket</p>
              </div>
            </div>
          </Link>

          {/* Card Kurir */}
          <Link href="/auth/login/kurir" className="block bg-white p-5 rounded-3xl shadow-sm border-2 border-white hover:border-[#2E7D32] transition-all group active:scale-[0.98]">
            <div className="flex items-center gap-4">
              <div className="bg-[#E8F5E9] p-4 rounded-2xl text-[#2E7D32] group-hover:bg-[#2E7D32] group-hover:text-white transition-colors">
                <Truck size={24} />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-sm md:text-base">Masuk sebagai Kurir</h2>
                <p className="text-[11px] text-gray-400 mt-0.5">Kelola pickup dan pengiriman</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}