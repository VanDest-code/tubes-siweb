"use client";
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Image from "next/image";

export default function TrackingPage() {
  const [searchResi, setSearchResi] = useState("");

  return (
    <main className="min-h-screen bg-[#F4F4F4] flex overflow-x-hidden relative">
      
      {/* 1. SIDEBAR KOMPONEN */}
      {/* Memanggil Sidebar yang sudah dipisah agar navigasi konsisten */}
      <Sidebar />

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 lg:ml-72 flex flex-col h-screen overflow-y-auto">
        
        {/* HEADER (Bisa disamakan dengan Dashboard) */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 sticky top-0 z-10 shadow-sm lg:hidden">
          {/* Burger menu dihandle oleh Sidebar component melalui state internalnya atau props */}
          <div className="flex items-center gap-2 mx-auto">
             <Image src="/logo.png" alt="Logo" width={30} height={30} style={{ width: 'auto', height: '30px' }} priority />
             <h1 className="text-[16px] font-bold text-black tracking-tight">
               Nadebee <span className="text-[#4CAF50]">Express</span>
             </h1>
          </div>
        </header>

        {/* TRACKING CONTENT */}
        <section className="flex-1 bg-gradient-to-br from-[#EEF3EE] to-[#F6F6F6] p-6 lg:p-10">
          
          {/* Judul Halaman */}
          <div className="mb-8 pt-4">
            <h2 className="text-[26px] font-bold text-gray-800 flex items-center gap-3">
              Lacak Paket <span className="animate-bounce">📦</span>
            </h2>
            <p className="text-[15px] text-gray-500 font-medium">
              Pantau posisi paketmu secara real-time
            </p>
          </div>

          {/* Search Bar - Dibuat lebih lebar dan bersih sesuai Figma */}
          <div className="flex gap-3 mb-16 max-w-2xl group">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="Masukkan nomor resi (Contoh: NDB001)"
                value={searchResi}
                onChange={(e) => setSearchResi(e.target.value)}
                className="w-full h-14 px-8 rounded-full border-2 border-white bg-white shadow-lg shadow-gray-200/50 focus:border-[#4CAF50] focus:ring-4 focus:ring-green-50 focus:outline-none text-gray-700 font-semibold transition-all placeholder:text-gray-300 placeholder:font-normal"
              />
            </div>
            <button className="w-14 h-14 rounded-full bg-[#4CAF50] text-white flex items-center justify-center shadow-lg shadow-green-200 hover:bg-[#3d8b40] hover:scale-105 active:scale-95 transition-all text-xl">
              🔍
            </button>
          </div>

          {/* Empty Illustration Section (Tampilan sebelum ada data) */}
          <div className="flex flex-col items-center justify-center pt-10">
            <div className="relative group">
               {/* Efek Lingkaran di belakang ikon */}
               <div className="absolute inset-0 bg-white rounded-full blur-3xl opacity-40 group-hover:opacity-70 transition-opacity"></div>
               <div className="w-52 h-52 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center mb-8 shadow-inner border border-white relative z-10">
                  <span className="text-[90px] drop-shadow-xl">📦</span>
               </div>
            </div>
            
            <h3 className="text-[22px] font-bold text-gray-400 mb-2">Yuk lacak paketmu!</h3>
            <p className="text-[14px] text-gray-400/80 text-center max-w-[250px] leading-relaxed">
              Belum ada aktivitas pencarian. <br/> Masukkan nomor resi di atas.
            </p>
          </div>

        </section>
      </div>
    </main>
  );
}