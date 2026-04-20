"use client";
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { MapPin, Package, Phone, User, ChevronRight } from "lucide-react";

export default function RequestPickupPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#F4F4F4] relative font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* HEADER */}
      <header className="h-20 bg-white flex items-center px-6 sticky top-0 z-30 justify-between shadow-sm border-b border-gray-50">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="w-12 h-12 rounded-2xl bg-[#E8F5E9] flex flex-col items-center justify-center gap-[4px] hover:bg-[#C8E6C9] transition-all"
        >
          <div className="w-5 h-[2px] bg-gray-700 rounded-full"></div>
          <div className="w-5 h-[2px] bg-gray-700 rounded-full"></div>
          <div className="w-5 h-[2px] bg-gray-700 rounded-full"></div>
        </button>

        <div className="flex items-center gap-2">
           <span className="text-xl">🐝</span>
           <h1 className="text-[17px] font-bold text-black tracking-tight">
             Nadebee <span className="text-[#4CAF50]">Express</span>
           </h1>
        </div>
        <div className="w-12" /> 
      </header>

      {/* CONTENT */}
      <section className="min-h-[calc(100vh-80px)] bg-[#F0F9F0] pt-10 px-6 pb-20">
        <div className="max-w-2xl mx-auto">
          
          <div className="mb-8">
            <h2 className="text-[22px] font-black text-gray-900 flex items-center gap-2">
              Request Pickup 🚚
            </h2>
            <p className="text-gray-500 text-[14px]">Lengkapi data penjemputan paketmu</p>
          </div>

          <form className="space-y-6">
            {/* SECTION: DATA PENGIRIM */}
            <div className="bg-white rounded-[30px] p-8 shadow-sm border border-white">
              <h3 className="text-[15px] font-black text-gray-800 mb-6 flex items-center gap-2">
                <User size={18} className="text-[#4CAF50]" /> Data Pengirim
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[12px] font-bold text-gray-400 ml-2 mb-1 block uppercase tracking-wider">Nama Lengkap</label>
                  <input type="text" placeholder="Masukkan nama pengirim" className="w-full h-14 px-6 rounded-[20px] bg-gray-50 border-2 border-gray-50 focus:border-[#4CAF50] focus:bg-white outline-none transition-all text-[14px] font-semibold" />
                </div>
                
                <div>
                  <label className="text-[12px] font-bold text-gray-400 ml-2 mb-1 block uppercase tracking-wider">Nomor WhatsApp</label>
                  <input type="tel" placeholder="0812xxxx" className="w-full h-14 px-6 rounded-[20px] bg-gray-50 border-2 border-gray-50 focus:border-[#4CAF50] focus:bg-white outline-none transition-all text-[14px] font-semibold" />
                </div>

                <div>
                  <label className="text-[12px] font-bold text-gray-400 ml-2 mb-1 block uppercase tracking-wider">Alamat Penjemputan</label>
                  <textarea placeholder="Jl. Nama Jalan, No. Rumah, Kecamatan..." className="w-full h-32 p-6 rounded-[25px] bg-gray-50 border-2 border-gray-50 focus:border-[#4CAF50] focus:bg-white outline-none transition-all text-[14px] font-semibold resize-none"></textarea>
                </div>
              </div>
            </div>

            {/* SECTION: DETAIL PAKET */}
            <div className="bg-white rounded-[30px] p-8 shadow-sm border border-white">
              <h3 className="text-[15px] font-black text-gray-800 mb-6 flex items-center gap-2">
                <Package size={18} className="text-[#4CAF50]" /> Detail Paket
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] font-bold text-gray-400 ml-2 mb-1 block uppercase tracking-wider">Berat (Kg)</label>
                  <input type="number" placeholder="1" className="w-full h-14 px-6 rounded-[20px] bg-gray-50 border-2 border-gray-50 focus:border-[#4CAF50] focus:bg-white outline-none transition-all text-[14px] font-semibold" />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-gray-400 ml-2 mb-1 block uppercase tracking-wider">Jenis Barang</label>
                  <select className="w-full h-14 px-6 rounded-[20px] bg-gray-50 border-2 border-gray-50 focus:border-[#4CAF50] focus:bg-white outline-none transition-all text-[14px] font-semibold appearance-none">
                    <option>Dokumen</option>
                    <option>Makanan</option>
                    <option>Pakaian</option>
                    <option>Elektronik</option>
                  </select>
                </div>
              </div>
            </div>

            {/* RINGKASAN & BUTTON */}
            <div className="bg-[#4CAF50] rounded-[30px] p-8 text-white shadow-xl shadow-green-200">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-[12px] opacity-80 font-bold uppercase tracking-widest">Estimasi Biaya</p>
                  <h4 className="text-2xl font-black">Rp 15.000</h4>
                </div>
                <TruckIcon />
              </div>
              
              <button type="button" className="w-full h-16 bg-white text-[#4CAF50] rounded-[22px] font-black text-[16px] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-inner">
                Konfirmasi Penjemputan
                <ChevronRight size={20} />
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

// Icon Truck sederhana untuk variasi visual
function TruckIcon() {
  return (
    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
      <Truck size={28} />
    </div>
  );
}
import { Truck } from "lucide-react";