"use client";
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Image from "next/image";
import Link from "next/link";

export default function PelangganHomePage() {
  // State untuk membuka/tutup sidebar di perangkat mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const now = new Date();
  const hari = now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const jam = now.toLocaleTimeString("id-ID", { hour12: false }).replace(/:/g, ".");

  return (
    <main className="min-h-screen bg-[#F4F4F4] flex overflow-x-hidden relative">
      
      {/* 1. SIDEBAR KOMPONEN */}
      {/* Pastikan Sidebar ini adalah satu-satunya navigasi yang dipanggil */}
      <Sidebar />

      {/* 2. MAIN CONTENT AREA */}
      {/* lg:ml-72 sangat penting agar konten tidak tertutup sidebar di desktop */}
      <div className="flex-1 lg:ml-72 flex flex-col h-screen overflow-y-auto">
        
        {/* HEADER KHUSUS MOBILE */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 sticky top-0 z-10 shadow-sm lg:hidden">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="w-10 h-10 rounded-xl bg-[#DCE5DA] flex items-center justify-center text-[20px] text-gray-700"
          >
            ☰
          </button>
          <div className="flex items-center gap-2 mx-auto">
             <Image src="/logo.png" alt="Logo" width={30} height={30} style={{ width: 'auto', height: '30px' }} priority />
             <h1 className="text-[16px] font-bold text-black">
               Nadebee <span className="text-[#4CAF50]">Express</span>
             </h1>
          </div>
          <div className="w-10" /> {/* Spacer penyeimbang */}
        </header>

        {/* HERO SECTION */}
        <section className="flex-1 bg-linear-to-br from-[#EEF3EE] to-[#F6F6F6] flex flex-col items-center pt-10 px-6 pb-20">
          
          {/* Box Waktu */}
          <div className="w-full max-w-md mb-8 bg-white/50 p-5 rounded-2xl border border-white shadow-sm">
            <p className="text-[11px] text-gray-400 uppercase font-bold tracking-widest mb-1">Hari ini</p>
            <div className="flex justify-between items-center">
              <p className="text-[16px] font-bold text-gray-800 capitalize">{hari}</p>
              <p className="text-[16px] font-bold text-[#43A047]">{jam} WIB</p>
            </div>
          </div>

          {/* Lingkaran Logo Utama */}
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl bg-white flex items-center justify-center mb-6 overflow-hidden transform hover:scale-105 transition-transform">
            <Image 
              src="/logo.png" 
              alt="Nadebee Express Logo" 
              width={100} 
              height={100}
              className="object-contain p-2"
              priority 
            />
          </div>

          <h2 className="text-[24px] font-bold text-gray-900 mb-8 text-center">
            Halo! Selamat datang..
          </h2>

          {/* Tombol Aksi Utama */}
          <div className="w-full max-w-[300px] space-y-4 mb-12">
            <Link href="/pelanggan/tracking" className="flex items-center justify-center h-14 rounded-2xl bg-[#4CAF50] text-white text-[16px] font-bold shadow-lg shadow-green-200 hover:bg-[#43A047] transition-colors">
              Lacak Paket
            </Link>
            <Link href="/pelanggan/request-pickup" className="flex items-center justify-center h-14 rounded-2xl border-2 border-gray-200 bg-white text-gray-800 text-[16px] font-bold hover:bg-gray-50 transition-colors">
              Request Pickup
            </Link>
          </div>

          {/* Kartu Alur Kerja */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-lg mb-12">
            {[
              { icon: "📦", label: "Request", color: "bg-green-100" },
              { icon: "🚚", label: "Dijemput", color: "bg-blue-100" },
              { icon: "🏁", label: "Sampai", color: "bg-yellow-100" }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-50">
                <div className={`w-12 h-12 mx-auto rounded-2xl ${item.color} flex items-center justify-center text-[22px] mb-2`}>
                  {item.icon}
                </div>
                <p className="text-[12px] font-bold text-gray-800">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Kotak Tips */}
          <div className="w-full max-w-md rounded-3xl bg-[#C7E3C2]/30 border border-[#B5D6B0] p-6 text-center relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full border border-[#B5D6B0] shadow-sm">
              <span className="text-[11px] font-bold text-[#E9A23B]">💡 Tips</span>
            </div>
            <p className="text-[14px] text-gray-600 leading-relaxed">
              Simpan nomor resimu, lalu masukkan di halaman <span className="font-bold text-green-700">Tracking</span> untuk mulai melacak paketmu!
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}