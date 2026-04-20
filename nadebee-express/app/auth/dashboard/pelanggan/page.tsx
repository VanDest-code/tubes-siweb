"use client";
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Image from "next/image";
import Link from "next/link";
import LogoNadebee from "@/public/logo.png";

export default function PelangganHomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const now = new Date();
  const hari = now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const jam = now.toLocaleTimeString("id-ID", { hour12: false }).replace(/:/g, ".");

  return (
    <main className="min-h-screen bg-[#F4F4F4] relative">
      
      {/* Sidebar - Menunggu trigger isSidebarOpen */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* HEADER UTAMA */}
      <header className="h-20 bg-white flex items-center px-6 sticky top-0 z-10 border-b border-gray-50 shadow-sm">
        {/* Tombol Hamburger */}
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="w-12 h-12 rounded-2xl bg-[#E8F5E9] flex flex-col items-center justify-center gap-[4px] hover:bg-[#C8E6C9] transition-all group"
        >
          <div className="w-5 h-[2px] bg-gray-700 rounded-full group-hover:bg-[#4CAF50]"></div>
          <div className="w-5 h-[2px] bg-gray-700 rounded-full group-hover:bg-[#4CAF50]"></div>
          <div className="w-5 h-[2px] bg-gray-700 rounded-full group-hover:bg-[#4CAF50]"></div>
        </button>

        {/* Logo Nadebee di Tengah */}
        <div className="flex items-center gap-2 mx-auto pr-12">
           <span className="text-xl">🐝</span>
           <h1 className="text-[17px] font-black text-black">
             Nadebee <span className="text-[#4CAF50]">Express</span>
           </h1>
        </div>
      </header>

      {/* KONTEN DASHBOARD (Halaman Home) */}
      <section className="min-h-[calc(100vh-80px)] bg-[#F0F9F0] flex flex-col items-center pt-10 px-6 pb-20">
        
        {/* Info Waktu */}
        <div className="w-full max-w-md mb-10 flex justify-between items-end px-2">
          <div>
            <p className="text-[11px] text-gray-400 uppercase font-black tracking-widest">Hari ini</p>
            <p className="text-[15px] font-bold text-gray-800 capitalize">{hari}</p>
          </div>
          <p className="text-[15px] font-bold text-[#4CAF50]">{jam} WIB</p>
        </div>

        {/* Logo Utama Lingkaran */}
        <div className="w-32 h-32 rounded-full border-[6px] border-white shadow-2xl shadow-green-100 bg-white flex items-center justify-center mb-8 transform hover:scale-105 transition-transform">
          <Image src={LogoNadebee} alt="Logo" width={90} height={90} priority />
        </div>

        <h2 className="text-[22px] font-bold text-gray-900 mb-10">Halo! Selamat datang..</h2>

        {/* Tombol Navigasi Home */}
        <div className="w-full max-w-[280px] space-y-4">
          <Link href="/pelanggan/tracking" className="flex items-center justify-center h-14 rounded-[22px] bg-[#4CAF50] text-white font-bold shadow-lg shadow-green-200">
            Lacak Paket
          </Link>
          <Link href="/pelanggan/request-pickup" className="flex items-center justify-center h-14 rounded-[22px] bg-white border-2 border-gray-100 text-gray-800 font-bold shadow-sm">
            Request Pickup
          </Link>
        </div>
      </section>
    </main>
  );
}