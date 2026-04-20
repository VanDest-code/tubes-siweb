"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Image from "next/image";
import Link from "next/link";
import LogoNadebee from "@/public/logo.png";
import { Truck, MapPin, CheckCircle } from "lucide-react"; // Ikon untuk fitur bawah

export default function PelangganHomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mencegah error Hydration Mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const now = new Date();
  const hari = now.toLocaleDateString("id-ID", { 
    weekday: "long", 
    day: "numeric", 
    month: "long", 
    year: "numeric" 
  });
  const jam = now.toLocaleTimeString("id-ID", { 
    hour12: false,
    hour: "2-digit",
    minute: "2-digit"
  }).replace(/:/g, ".");

  return (
    <main className="min-h-screen bg-[#F4F4F4] relative font-sans">
      
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* HEADER NAVBAR */}
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
        
        {/* Spacer agar logo tetap di tengah */}
        <div className="w-12" /> 
      </header>

      {/* KONTEN DASHBOARD */}
      <section className="min-h-[calc(100vh-80px)] bg-[#F0F9F0] flex flex-col items-center pt-10 px-6 pb-20">
        
        {/* Info Waktu */}
        <div className="w-full max-w-2xl mb-10 flex justify-between items-end px-2">
          <div>
            <p className="text-[11px] text-gray-400 uppercase font-black tracking-widest mb-1">Hari ini</p>
            <p className="text-[15px] font-bold text-gray-800 capitalize">
              {mounted ? hari : "..."}
            </p>
          </div>
          <p className="text-[15px] font-bold text-[#4CAF50]">
            {mounted ? `${jam} WIB` : "--.-- WIB"}
          </p>
        </div>

        {/* Logo Utama */}
        <div className="w-32 h-32 rounded-full border-[6px] border-white shadow-2xl shadow-green-100/50 bg-white flex items-center justify-center mb-8 transform hover:scale-105 transition-transform">
          <Image 
            src={LogoNadebee} 
            alt="Logo" 
            width={90} 
            height={90} 
            style={{ height: 'auto' }}
            priority 
          />
        </div>

        <h2 className="text-[22px] font-bold text-gray-900 mb-10 tracking-tight">
          Halo! Selamat datang..
        </h2>

        {/* Tombol Utama */}
        <div className="w-full max-w-[300px] space-y-4 mb-16">
          <Link 
            href="/auth/dashboard/pelanggan/tracking" 
            className="flex items-center justify-center h-14 rounded-[22px] bg-[#4CAF50] text-white font-bold shadow-lg shadow-green-200 hover:bg-[#43A047] transition-all"
          >
            Lacak Paket
          </Link>
          <Link 
            href="/auth/dashboard/pelanggan/request-pickup" 
            className="flex items-center justify-center h-14 rounded-[22px] bg-white border-2 border-gray-100 text-gray-800 font-bold shadow-sm hover:bg-gray-50 transition-all"
          >
            Request Pickup
          </Link>
        </div>

        {/* --- FITUR CARDS (Bagian yang sebelumnya belum tampil) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mb-12">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-[24px] shadow-sm flex flex-col items-center text-center border border-white">
            <div className="w-10 h-10 bg-[#F1F8E9] text-[#4CAF50] rounded-xl flex items-center justify-center mb-4">
              <Truck size={20} />
            </div>
            <h3 className="text-[13px] font-bold text-gray-800 mb-1">Request Pickup</h3>
            <p className="text-[10px] text-gray-400 font-medium">Isi form dan tentukan lokasi penjemputan</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-[24px] shadow-sm flex flex-col items-center text-center border border-white">
            <div className="w-10 h-10 bg-[#E3F2FD] text-[#2196F3] rounded-xl flex items-center justify-center mb-4">
              <MapPin size={20} />
            </div>
            <h3 className="text-[13px] font-bold text-gray-800 mb-1">Kurir Datang</h3>
            <p className="text-[10px] text-gray-400 font-medium">Kurir kami menuju lokasi anda</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-[24px] shadow-sm flex flex-col items-center text-center border border-white">
            <div className="w-10 h-10 bg-[#FFF8E1] text-[#FFC107] rounded-xl flex items-center justify-center mb-4">
              <CheckCircle size={20} />
            </div>
            <h3 className="text-[13px] font-bold text-gray-800 mb-1">Paket Sampai</h3>
            <p className="text-[10px] text-gray-400 font-medium">Paket diantarkan hingga tujuan</p>
          </div>
        </div>

        {/* TIPS BOX */}
        <div className="w-full max-w-2xl bg-[#D7ECD9] p-6 rounded-[30px] border border-white/50 text-center">
          <p className="text-[12px] font-semibold text-[#2E7D32] leading-relaxed">
            <span className="block text-[14px] mb-1">💡 Tips</span>
            Simpan nomor resimu, lalu masukkan di halaman Tracking untuk mulai melacak paketmu!
          </p>
        </div>

      </section>
    </main>
  );
}