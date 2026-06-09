"use client";

import { useState, useEffect } from "react";
// 1. UBAH IMPORT INI: Panggil komponen SidebarKurir, bukan Sidebar biasa
import SidebarKurir from "@/components/layout/SidebarKurir"; 
import { Menu } from "lucide-react"; 
import { notFound } from "next/navigation";

export default function KurirLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isKurir, setIsKurir] = useState<boolean | null>(null);

  useEffect(() => {
    const courierId = sessionStorage.getItem("loggedInCourierId");
    setIsKurir(!!courierId);
  }, []);

  if (isKurir === false) {
    notFound(); 
  }

  if (isKurir === null) return null; 

  return (
    <div className="flex min-h-screen bg-[#F0FDF4] overflow-x-hidden">
      
      {/* 2. UBAH TAG INI: Gunakan <SidebarKurir />, bukan <Sidebar /> */}
      <SidebarKurir 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <main
        className={`flex-1 flex flex-col min-h-screen transition-all duration-500 ease-in-out ${
          isSidebarOpen ? "ml-[280px]" : "ml-0"
        }`}
      >
        <header className="bg-white border-b border-green-50 px-8 h-[80px] flex items-center justify-center sticky top-0 z-40 shadow-sm relative">
          
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute left-8 p-3 bg-[#F0FDF4] text-green-700 rounded-2xl hover:bg-green-100 transition-colors"
          >
            <Menu size={24} strokeWidth={2.5} />
          </button>

          <h1 className="text-xl font-black text-gray-900 flex items-center gap-2 tracking-tighter">
             🐝 Nadebee <span className="text-green-500">Express</span>
          </h1>
        </header>

        <div className="flex-1 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}