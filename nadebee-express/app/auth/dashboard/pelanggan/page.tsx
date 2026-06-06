"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Truck, Search, User, Clock, Hand, Lightbulb } from "lucide-react"; // Hanya menambah import ini
import { supabase } from "@/lib/supabase"; 

export default function PelangganHomePage() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());
  
  const [namaPelanggan, setNamaPelanggan] = useState("");
  const [avatarPelanggan, setAvatarPelanggan] = useState("");

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    const dapatkanUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && user.email) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("email", user.email.toLowerCase().trim())
          .single();

        if (profile) {
          if (profile.full_name) {
            setNamaPelanggan(profile.full_name);
          } else {
            const emailPotong = user.email.split('@')[0];
            const namaRapi = emailPotong.charAt(0).toUpperCase() + emailPotong.slice(1);
            setNamaPelanggan(namaRapi);
          }
          if (profile.avatar_url) setAvatarPelanggan(profile.avatar_url);
        }
      }
    };
    
    dapatkanUser(); 
    return () => clearInterval(timer);
  }, []);

  const hari = time.toLocaleDateString("id-ID", { 
    weekday: "long", day: "numeric", month: "long", year: "numeric" 
  });
  
  const jam = time.toLocaleTimeString("id-ID", { 
    hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" 
  }).replace(/:/g, ".");

  if (!mounted) return null;

  return (
    <div className="w-full flex flex-col pt-6 pb-20 px-6 max-w-[1200px] mx-auto space-y-8">
      
      {/* 1. HEADER DASHBOARD */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 md:px-10 md:py-6 rounded-[32px] shadow-sm border border-gray-100">
        <div className="flex items-center gap-5 mb-4 md:mb-0">
          <div className="w-16 h-16 rounded-full overflow-hidden border-[3px] border-[#4CAF50] bg-green-50 flex items-center justify-center shrink-0 shadow-md">
            {avatarPelanggan ? (
              <img src={avatarPelanggan} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={30} className="text-[#4CAF50]" />
            )}
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-none mb-1 flex items-center gap-2">
              Halo, {namaPelanggan || "Pelanggan"}! <Hand size={24} className="text-amber-500" />
            </h2>
            <p className="text-sm text-gray-500 font-medium">Siap mengirim paket hari ini?</p>
          </div>
        </div>
        <div className="text-left md:text-right border-l-2 border-gray-100 pl-0 md:pl-6">
          <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest mb-1">{hari}</p>
          <p className="text-xl font-black text-[#4CAF50] leading-none">{jam}</p>
        </div>
      </div>

      {/* 2. MENU PINTASAN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <Link href="/auth/dashboard/pelanggan/request-pickup" className="group relative overflow-hidden bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] rounded-[32px] p-8 min-h-[240px] flex flex-col justify-end shadow-xl shadow-green-200/50 hover:-translate-y-2 transition-all duration-300">
          <Truck size={120} className="absolute -right-6 -top-6 text-white opacity-20 group-hover:scale-110 group-hover:opacity-30 transition-all duration-500" />
          <div className="bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/30">
            <Truck size={28} className="text-white" />
          </div>
          <h3 className="text-2xl font-black text-white leading-tight mb-1">Request<br/>Pickup</h3>
          <p className="text-green-50 text-sm font-medium opacity-90">Kirim paket dari rumah</p>
        </Link>

        <Link href="/auth/dashboard/pelanggan/tracking" className="group relative overflow-hidden bg-white border border-gray-100 rounded-[32px] p-8 min-h-[240px] flex flex-col justify-end shadow-sm hover:border-[#4CAF50] hover:shadow-green-100 hover:-translate-y-2 transition-all duration-300">
          <Search size={120} className="absolute -right-6 -top-6 text-[#4CAF50] opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500" />
          <div className="bg-[#F1F8E9] w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-green-100">
            <Search size={28} className="text-[#4CAF50]" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 leading-tight mb-1">Lacak<br/>Paket</h3>
          <p className="text-gray-400 text-sm font-medium">Pantau resi aktif</p>
        </Link>

        <Link href="/auth/dashboard/pelanggan/riwayat" className="group relative overflow-hidden bg-white border border-gray-100 rounded-[32px] p-8 min-h-[240px] flex flex-col justify-end shadow-sm hover:border-emerald-400 hover:shadow-emerald-100 hover:-translate-y-2 transition-all duration-300">
          <Clock size={120} className="absolute -right-6 -top-6 text-emerald-500 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500" />
          <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100">
            <Clock size={28} className="text-emerald-500" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 leading-tight mb-1">Riwayat<br/>Pesanan</h3>
          <p className="text-gray-400 text-sm font-medium">Cek transaksi lalu</p>
        </Link>
      </div>

      {/* 3. TIPS BOX */}
      <div className="w-full bg-[#EAF5EB] py-8 px-6 rounded-[32px] text-center shadow-sm border border-white/50">
        <h4 className="text-base md:text-[17px] font-bold text-gray-700 mb-2 flex items-center justify-center gap-2">
          <Lightbulb size={20} className="text-yellow-500" /> Tips
        </h4>
        <p className="text-sm md:text-[16px] text-gray-600 max-w-md mx-auto leading-relaxed">
          Pastikan barangmu sudah dikemas dengan rapi, aman, dan rapat sebelum kurir Nadebee datang menjemput!
        </p>
      </div>
    </div>
  );
}