"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import LogoNadebee from "@/public/logo.png";
import { Truck, MapPin, CheckCircle, AlertCircle, Search } from "lucide-react";

export default function PelangganHomePage() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());
  const [resiInput, setResiInput] = useState(""); // State untuk menampung ketikan resi
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hari = time.toLocaleDateString("id-ID", { 
    weekday: "long", day: "numeric", month: "long", year: "numeric" 
  });
  
  const jam = time.toLocaleTimeString("id-ID", { 
    hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" 
  }).replace(/:/g, ".");

  // Fungsi simulasi pencarian resi cepat
  const handleCariResi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resiInput.trim()) return;

    // Simulasi: Jika resi bukan format NDB yang kita buat di database, munculkan error figma
    if (!resiInput.toUpperCase().startsWith("NDB")) {
      setIsError(true);
    } else {
      setIsError(false);
      // Jika formatnya benar, langsung arahkan ke halaman tracking internal
      window.location.href = `/auth/dashboard/pelanggan/tracking?resi=${resiInput.toUpperCase()}`;
    }
  };

  if (!mounted) return null;

  return (
    <div className="w-full flex flex-col items-center pt-10 pb-20 px-6 max-w-5xl mx-auto">
      
      {/* 1. INFO WAKTU */}
      <div className="w-full mb-10">
        <div className="flex flex-col items-start">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Hari ini</p>
          <p className="text-[16px] font-bold text-gray-800">{hari}</p>
          <p className="text-[16px] font-bold text-green-600">{jam}</p>
        </div>
      </div>

      {/* 2. LOGO & GREETING */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="w-44 h-44 flex items-center justify-center mb-6">
          <Image 
            src={LogoNadebee} 
            alt="Logo Nadebee Express" 
            width={180} 
            height={180} 
            className="object-contain drop-shadow-2xl"
            priority 
          />
        </div>
        <h2 className="text-[26px] font-black text-gray-900 tracking-tight">
          Halo! Selamat datang..
        </h2>
      </div>

      {/* ⚡ BARU: FORM TRACING INSTAN (Menghubungkan Fitur Error) */}
      <form onSubmit={handleCariResi} className="w-full max-w-[400px] mb-8 relative">
        <div className="relative flex items-center">
          <input 
            type="text"
            placeholder="Masukkan nomor resi ekspedisi..."
            value={resiInput}
            onChange={(e) => {
              setResiInput(e.target.value);
              if (isError) setIsError(false); // Sembunyikan error saat user mulai mengetik ulang
            }}
            className="w-full h-14 pl-5 pr-14 rounded-full border-2 border-gray-100 shadow-sm bg-white font-medium text-sm focus:outline-none focus:border-[#4CAF50] transition-colors"
          />
          <button 
            type="submit"
            className="absolute right-2 w-10 h-10 bg-[#4CAF50] rounded-full flex items-center justify-center text-white hover:bg-[#43A047] transition-colors"
          >
            <Search size={18} />
          </button>
        </div>
      </form>

      {/* 3. TOMBOL AKSI UTAMA */}
      <div className="w-full max-w-[340px] space-y-4 mb-16">
        <Link 
          href="/auth/dashboard/pelanggan/tracking" 
          className="flex items-center justify-center w-full h-16 rounded-[24px] bg-[#4CAF50] text-white font-black text-lg shadow-lg shadow-green-100 hover:bg-[#43A047] transition-all"
        >
          Lacak Paket Utama
        </Link>
        <Link 
          href="/auth/dashboard/pelanggan/request-pickup" 
          className="flex items-center justify-center w-full h-16 rounded-[24px] bg-white border-2 border-gray-100 text-gray-800 font-black text-lg hover:bg-gray-50 shadow-sm transition-all"
        >
          Request Pickup
        </Link>
      </div>

      {/* TAMPILAN ERROR FIGMA (DIPICU OLEH FORM DI ATAS) */}
      {isError && (
        <div className="w-full max-w-2xl mx-auto mb-16 animate-in fade-in zoom-in duration-300">
          <div className="bg-white rounded-[32px] p-1 border-2 border-red-400 shadow-xl shadow-red-100">
            <div className="bg-white rounded-[28px] border border-red-400 p-16 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center mb-6 shadow-lg shadow-red-200">
                <AlertCircle size={32} strokeWidth={3} />
              </div>
              <h3 className="text-red-500 font-black text-[18px] mb-2 uppercase tracking-wide">
                Nomor resi tidak ditemukan
              </h3>
              <p className="text-gray-400 text-[15px] font-medium">
                Coba cek lagi ya! Masukkan nomor dengan awalan 'NDB'
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. GRID CARD FITUR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-16">
        <div className="bg-white p-8 rounded-[32px] shadow-sm flex flex-col items-center text-center border border-white">
          <div className="w-12 h-12 bg-[#F1F8E9] text-[#4CAF50] rounded-2xl flex items-center justify-center mb-4">
            <Truck size={24} />
          </div>
          <h3 className="text-[14px] font-black text-gray-800 mb-2">Request Pickup</h3>
          <p className="text-[11px] text-gray-400 font-semibold px-4">
            Isi form dan tentukan lokasi penjemputan
          </p>
        </div>

        <div className="bg-white p-8 rounded-[32px] shadow-sm flex flex-col items-center text-center border border-white">
          <div className="w-12 h-12 bg-[#E3F2FD] text-[#2196F3] rounded-2xl flex items-center justify-center mb-4">
            <MapPin size={24} />
          </div>
          <h3 className="text-[14px] font-black text-gray-800 mb-2">Kurir Datang</h3>
          <p className="text-[11px] text-gray-400 font-semibold px-4">
            Kurir kami menuju lokasi anda
          </p>
        </div>

        <div className="bg-white p-8 rounded-[32px] shadow-sm flex flex-col items-center text-center border border-white">
          <div className="w-12 h-12 bg-[#FFF8E1] text-[#FFC107] rounded-2xl flex items-center justify-center mb-4">
            <CheckCircle size={24} />
          </div>
          <h3 className="text-[14px] font-black text-gray-800 mb-2">Paket Sampai</h3>
          <p className="text-[11px] text-gray-400 font-semibold px-4">
            Paket diantarkan hingga tujuan
          </p>
        </div>
      </div>

      {/* 5. TIPS BOX */}
      <div className="w-full max-w-4xl bg-[#D7ECD9] p-8 rounded-[40px] border border-white text-center shadow-sm">
        <p className="text-[12px] font-bold text-[#2E7D32] leading-relaxed">
          <span className="block text-[15px] mb-1 font-black uppercase tracking-wider">💡 Tips</span>
          Simpan nomor resimu, lalu masukkan di halaman Tracking untuk mulai melacak paketmu!
        </p>
      </div>
    </div>
  );
}