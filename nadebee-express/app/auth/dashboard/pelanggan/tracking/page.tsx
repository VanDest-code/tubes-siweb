"use client";
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Search, Package, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TrackingPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="min-h-screen bg-[#F4F4F4] relative font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* HEADER */}
      <header className="h-20 bg-white flex items-center px-6 sticky top-0 z-30 justify-between shadow-sm border-b border-gray-50">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="w-12 h-12 rounded-2xl bg-[#E8F5E9] flex flex-col items-center justify-center gap-[4px] hover:bg-[#C8E6C9] transition-all group"
        >
          <div className="w-5 h-[2px] bg-gray-700 rounded-full group-hover:bg-[#4CAF50]"></div>
          <div className="w-5 h-[2px] bg-gray-700 rounded-full group-hover:bg-[#4CAF50]"></div>
          <div className="w-5 h-[2px] bg-gray-700 rounded-full group-hover:bg-[#4CAF50]"></div>
        </button>

        <div className="flex items-center gap-2">
           <span className="text-xl">🐝</span>
           <h1 className="text-[17px] font-bold text-black tracking-tight">
             Nadebee <span className="text-[#4CAF50]">Express</span>
           </h1>
        </div>
        <div className="w-12" /> 
      </header>

      {/* KONTEN TRACKING */}
      <section className="min-h-[calc(100vh-80px)] bg-[#F0F9F0] pt-10 px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          
          {/* Judul Halaman */}
          <div className="mb-8">
            <h2 className="text-[22px] font-black text-gray-900 flex items-center gap-2">
              Lacak Paket 📦
            </h2>
            <p className="text-gray-500 text-[14px]">Masukkan nomor resi untuk mulai melacak</p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-12 flex gap-3">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="Contoh: NDB001"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-6 pr-14 rounded-[22px] border-2 border-white bg-white/80 focus:bg-white focus:border-[#4CAF50] outline-none transition-all shadow-sm text-gray-700 font-medium"
              />
            </div>
            <button className="w-14 h-14 bg-[#4CAF50] text-white rounded-[20px] flex items-center justify-center shadow-lg shadow-green-200 hover:bg-[#43A047] transition-all">
              <Search size={22} />
            </button>
          </div>

          {/* Tampilan Kondisi Kosong (Empty State) - Sesuai gambar kamu */}
          {!searchQuery && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-32 h-32 bg-white/40 rounded-full flex items-center justify-center mb-6">
                <Package size={60} className="text-orange-300 opacity-80" />
              </div>
              <p className="text-gray-500 font-medium">Yuk lacak paketmu!</p>
            </div>
          )}

          {/* Tampilan Hasil Tracking (Muncul jika ada input) */}
          {searchQuery && (
            <div className="bg-white rounded-[30px] p-8 shadow-sm border border-white">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-[12px] text-gray-400 uppercase font-black tracking-widest mb-1">Nomor Resi</p>
                  <h3 className="text-xl font-bold text-gray-800">{searchQuery.toUpperCase()}</h3>
                </div>
                <span className="px-4 py-2 bg-[#E8F5E9] text-[#4CAF50] rounded-full text-[12px] font-bold">
                  Dalam Perjalanan
                </span>
              </div>

              {/* Timeline Dummy */}
              <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                <div className="relative pl-10">
                  <div className="absolute left-0 top-1 w-6 h-6 bg-[#4CAF50] rounded-full border-4 border-white shadow-sm z-10"></div>
                  <p className="text-[14px] font-bold text-gray-800">Paket sedang diantar oleh kurir</p>
                  <p className="text-[12px] text-gray-400">20 April 2026 - 14:20</p>
                </div>
                <div className="relative pl-10">
                  <div className="absolute left-0 top-1 w-6 h-6 bg-gray-200 rounded-full border-4 border-white z-10"></div>
                  <p className="text-[14px] font-bold text-gray-600">Paket telah sampai di hub transit Jakarta</p>
                  <p className="text-[12px] text-gray-400">20 April 2026 - 09:00</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}