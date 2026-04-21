"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar"; 
import { Menu } from "lucide-react"; 

export default function PelangganLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F0FDF4] overflow-x-hidden">
      
      {/* 1. SIDEBAR */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* 2. KONTEN UTAMA */}
      <main
        className={`flex-1 flex flex-col min-h-screen transition-all duration-500 ease-in-out ${
          isSidebarOpen ? "ml-[280px]" : "ml-0"
        }`}
      >
        {/* HEADER BAR (Putih & Berada di Flow yang Sama) */}
        <header className="bg-white border-b border-green-50 px-8 h-[80px] flex items-center justify-center sticky top-0 z-40 shadow-sm relative">
          
          {/* TOMBOL HAMBURGER (Sekarang di dalam header) */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute left-8 p-3 bg-[#F0FDF4] text-green-700 rounded-2xl hover:bg-green-100 transition-colors"
          >
            <Menu size={24} strokeWidth={2.5} />
          </button>

          {/* Logo Nadebee di Tengah */}
          <h1 className="text-xl font-black text-gray-900 flex items-center gap-2 tracking-tighter">
             🐝 Nadebee <span className="text-green-500">Express</span>
          </h1>
        </header>

        {/* Area Dashboard */}
        <div className="flex-1 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}