"use client";

import { useState } from "react";
import SidebarKurir from "@/components/layout/SidebarKurir";
import { Menu } from "lucide-react"; 

export default function KurirLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ubah default ke false agar tidak otomatis terbuka saat pertama kali load
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F0FDF4] overflow-x-hidden">
      
      {/* 1. Sidebar - Hanya terbuka jika isSidebarOpen === true */}
      <SidebarKurir 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* 2. Konten Utama */}
      <main
        className={`flex-1 flex flex-col min-h-screen transition-all duration-500 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        
        {/* Top Header Section */}
        <header className="bg-white border-b border-green-200 px-8 py-4 flex items-center justify-between sticky top-0 z-40">
          
          {/* Tombol Hamburger - Satu-satunya penggerak Sidebar */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-[#E8F5E9] text-green-700 rounded-xl hover:bg-green-200 transition-colors shadow-sm"
          >
            <Menu size={24} />
          </button>
          
          <div className="hidden md:block w-10"></div>
          
          <div className="flex-1 flex justify-center items-center">
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2 tracking-wide">
              🐝 Nadebee <span className="text-green-500">Express</span>
            </h1>
          </div>
          
          <div className="w-10"></div> 
        </header>

        {/* Area Isi Halaman */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}