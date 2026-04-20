"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LogoNadebee from "@/public/logo.png";
export default function PelangganHomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const now = new Date();
  const hari = now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const jam = now.toLocaleTimeString("id-ID", { hour12: false }).replace(/:/g, ".");

  // Fungsi untuk toggle sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <main className="min-h-screen bg-[#F4F4F4] overflow-x-hidden relative">
      
      {/* 1. SIDEBAR / DRAWER */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={toggleSidebar}
      />
      <aside className={`fixed left-0 top-0 h-full w-64 bg-white z-50 transition-transform duration-300 ease-in-out shadow-2xl ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-bold text-[#58B65C]">Menu Utama</h2>
            <button onClick={toggleSidebar} className="text-gray-500">✕</button>
          </div>
          <nav className="space-y-4">
            <Link href="/pelanggan/dashboard" className="block p-3 rounded-lg bg-green-50 text-[#58B65C] font-semibold">Beranda</Link>
            <Link href="/pelanggan/tracking" className="block p-3 rounded-lg hover:bg-gray-100 text-gray-700">Lacak Paket</Link>
            <Link href="/pelanggan/history" className="block p-3 rounded-lg hover:bg-gray-100 text-gray-700">Riwayat Pengiriman</Link>
            <Link href="/profile" className="block p-3 rounded-lg hover:bg-gray-100 text-gray-700">Profil Saya</Link>
            <hr className="my-4 border-gray-100" />
            <Link href="/auth/login" className="block p-3 rounded-lg text-red-500 hover:bg-red-50">Keluar</Link>
          </nav>
        </div>
      </aside>

      {/* 2. HEADER */}
      <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-center relative shadow-sm z-10">
        <button 
          onClick={toggleSidebar}
          className="absolute left-4 w-10 h-10 rounded-xl bg-[#DCE5DA] flex items-center justify-center text-[20px] text-gray-700 hover:bg-green-100 transition-colors"
        >
          ☰
        </button>
        <h1 className="text-[16px] font-bold text-black tracking-tight flex items-center gap-1">
          🐝 Nadebee <span className="text-[#58B65C]">Express</span>
        </h1>
      </header>

      {/* 3. HERO CONTENT */}
      <section className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#EEF3EE] to-[#F6F6F6] flex flex-col items-center pt-10 px-4">
        
        {/* Date & Time Info */}
        <div className="w-full max-w-sm mb-8">
          <p className="text-[11px] text-gray-400 uppercase tracking-wider">Hari ini</p>
          <div className="flex justify-between items-end">
            <p className="text-[14px] font-bold text-gray-800 capitalize">{hari}</p>
            <p className="text-[14px] font-bold text-[#43A047]">{jam} WIB</p>
        </div>
        </div>

{/* Logo Circle */}
<div className="w-28 h-28 rounded-full border-4 border-white shadow-xl bg-white flex items-center justify-center mb-6 overflow-hidden">
  <Image 
    src="/logo.png" 
    alt="Nadebee Express Logo" 
    width={0}    // Biarkan 0 atau angka sembarang karena akan dioverride CSS
    height={80}  // Tentukan tinggi yang diinginkan
    sizes="100vw"
    style={{ width: 'auto', height: '80px' }} // Ini adalah kuncinya agar rasio tetap terjaga
    className="object-contain"
    priority 
  />
</div>

        <h2 className="text-[20px] font-bold text-gray-900 mb-6 text-center">
          Halo! Selamat datang..
        </h2>

        {/* Main CTA Buttons */}
        <div className="w-full max-w-[240px] space-y-3 mb-10">
          <Link href="/pelanggan/tracking" className="flex items-center justify-center h-12 rounded-xl bg-[#4CAF50] text-white text-[14px] font-bold shadow-md shadow-green-200 active:scale-95 transition-transform">
            Lacak Paket
          </Link>
          <Link href="/pelanggan/request-pickup" className="flex items-center justify-center h-12 rounded-xl border-2 border-gray-200 bg-white text-gray-800 text-[14px] font-bold active:scale-95 transition-transform">
            Request Pickup
          </Link>
        </div>

        {/* Workflow Info Cards */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-sm mb-10">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-3 text-center border border-white">
            <div className="w-9 h-9 mx-auto rounded-xl bg-[#DCEFDC] flex items-center justify-center text-[16px] text-green-600 mb-2">📦</div>
            <p className="text-[9px] font-bold text-gray-800 mb-1">Request</p>
            <p className="text-[7px] text-gray-500 leading-tight">Tentukan lokasi jemput</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-3 text-center border border-white">
            <div className="w-9 h-9 mx-auto rounded-xl bg-[#E2EFFF] flex items-center justify-center text-[16px] text-blue-500 mb-2">🚚</div>
            <p className="text-[9px] font-bold text-gray-800 mb-1">Dijemput</p>
            <p className="text-[7px] text-gray-500 leading-tight">Kurir menuju lokasi anda</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-3 text-center border border-white">
            <div className="w-9 h-9 mx-auto rounded-xl bg-[#F6EFCF] flex items-center justify-center text-[16px] text-yellow-700 mb-2">🏁</div>
            <p className="text-[9px] font-bold text-gray-800 mb-1">Sampai</p>
            <p className="text-[7px] text-gray-500 leading-tight">Paket tiba di tujuan</p>
          </div>
        </div>

        {/* Tips Box */}
        <div className="w-full max-w-sm rounded-2xl bg-[#C7E3C2]/50 border border-[#B5D6B0] p-5 text-center mb-8 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full border border-[#B5D6B0]">
            <span className="text-[10px] font-bold text-[#E9A23B]">💡 Tips</span>
          </div>
          <p className="text-[12px] text-gray-600 leading-relaxed mt-1">
            Simpan nomor resimu, lalu masukkan di halaman <span className="font-bold text-green-700">Tracking</span> untuk mulai melacak paketmu!
          </p>
        </div>
      </section>
    </main>
  );
}