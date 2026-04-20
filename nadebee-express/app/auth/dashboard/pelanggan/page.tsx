"use client";
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Image from "next/image";
import Link from "next/link";

export default function PelangganHomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const now = new Date();
  const hari = now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const jam = now.toLocaleTimeString("id-ID", { hour12: false }).replace(/:/g, ".");

  return (
    <main className="min-h-screen bg-[#F4F4F4] relative font-sans">
      
      {/* Sidebar dengan kontrol State */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* HEADER UTAMA - Disesuaikan Tinggi & Spacingnya */}
      <header className="h-20 bg-white flex items-center px-6 sticky top-0 z-30 justify-between shadow-sm border-b border-gray-50">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="w-12 h-12 rounded-2xl bg-[#E8F5E9] flex flex-col items-center justify-center gap-[4px] hover:bg-[#C8E6C9] transition-all group"
        >
          {/* Garis Hamburger custom agar persis Figma */}
          <div className="w-5 h-[2px] bg-gray-700 rounded-full group-hover:bg-[#4CAF50]"></div>
          <div className="w-5 h-[2px] bg-gray-700 rounded-full group-hover:bg-[#4CAF50]"></div>
          <div className="w-5 h-[2px] bg-gray-700 rounded-full group-hover:bg-[#4CAF50]"></div>
        </button>

        {/* Logo Tengah */}
        <div className="flex items-center gap-2">
           <span className="text-xl">🐝</span>
           <h1 className="text-[17px] font-bold text-black tracking-tight">
             Nadebee <span className="text-[#4CAF50]">Express</span>
           </h1>
        </div>

        {/* Spacer untuk menjaga logo tetap di tengah */}
        <div className="w-12" /> 
      </header>

      {/* KONTEN UTAMA */}
      <section className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#F9FBF9] to-[#F4F4F4] flex flex-col items-center pt-10 px-6 pb-12">
        
        {/* Info Waktu */}
        <div className="w-full max-w-md mb-10 flex justify-between items-end px-2">
          <div>
            <p className="text-[11px] text-gray-400 uppercase font-black tracking-widest mb-1">Hari ini</p>
            <p className="text-[15px] font-bold text-gray-800 capitalize">{hari}</p>
          </div>
          <p className="text-[15px] font-bold text-[#4CAF50]">{jam} WIB</p>
        </div>

        {/* Logo Lingkaran - Border lebih tebal & Shadow lembut */}
        <div className="w-32 h-32 rounded-full border-[6px] border-white shadow-2xl shadow-green-100/50 bg-white flex items-center justify-center mb-8 overflow-hidden transform hover:scale-105 transition-transform duration-300">
          <Image src="/logo.png" alt="Logo" width={95} height={95} className="object-contain p-2" priority />
        </div>

        <h2 className="text-[22px] font-bold text-gray-900 mb-10 tracking-tight">Halo! Selamat datang..</h2>

        {/* Tombol Aksi Utama */}
        <div className="w-full max-w-[280px] space-y-4 mb-14">
          <Link href="/pelanggan/tracking" className="flex items-center justify-center h-14 rounded-[20px] bg-[#4CAF50] text-white text-[15px] font-bold shadow-lg shadow-green-200/60 hover:bg-[#43A047] transition-all active:scale-95">
            Lacak Paket
          </Link>
          <Link href="/pelanggan/request-pickup" className="flex items-center justify-center h-14 rounded-[20px] border-2 border-white bg-white/70 backdrop-blur-sm text-gray-800 text-[15px] font-bold shadow-sm hover:bg-white transition-all active:scale-95">
            Request Pickup
          </Link>
        </div>

        {/* Workflow Cards */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-sm mb-14">
           {[
             { icon: "📦", label: "Request", color: "bg-green-50" },
             { icon: "🚚", label: "Kurir Datang", color: "bg-blue-50" },
             { icon: "🏁", label: "Paket Sampai", color: "bg-orange-50" }
           ].map((item, idx) => (
             <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-[22px] p-4 text-center shadow-sm border border-white flex flex-col items-center">
               <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center text-xl mb-2`}>
                 {item.icon}
               </div>
               <p className="text-[10px] font-bold text-gray-500 leading-tight">{item.label}</p>
             </div>
           ))}
        </div>

        {/* Tips Box */}
        <div className="w-full max-w-md rounded-[24px] bg-[#E8F5E9]/60 border border-white p-7 text-center relative shadow-inner">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full border border-[#E8F5E9] shadow-sm">
            <span className="text-[11px] font-black text-[#FFA000]">💡 Tips</span>
          </div>
          <p className="text-[13px] text-gray-600 leading-relaxed font-medium">
            Simpan nomor resimu, lalu masukkan di halaman <span className="font-bold text-[#2E7D32]">Tracking</span> untuk mulai melacak paketmu!
          </p>
        </div>
      </section>
    </main>
  );
}