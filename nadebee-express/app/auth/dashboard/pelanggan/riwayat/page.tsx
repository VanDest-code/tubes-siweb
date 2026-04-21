"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Calendar, ChevronRight } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";

// Definisi tipe data untuk item riwayat
interface RiwayatItem {
  id: string;
  resi: string;
  status: "Selesai" | "Menunggu Kurir" | "Paket Sudah Diambil" | "Dalam Perjalanan";
  pengirim: string;
  penerima: string;
  wilayah: string;
  jenis: string;
  berat: string;
  waktu: "Hari ini" | "Kemarin";
}

const RIWAYAT_DATA: RiwayatItem[] = [
  {
    id: "1",
    resi: "NDB003",
    status: "Selesai",
    pengirim: "Siti Rahayu",
    penerima: "Farhan Rizki",
    wilayah: "Sleman",
    jenis: "Dokumen",
    berat: "1-5 Kg",
    waktu: "Hari ini",
  },
  {
    id: "2",
    resi: "NDB001",
    status: "Menunggu Kurir",
    pengirim: "Siti Rahayu",
    penerima: "Yemima",
    wilayah: "Bantul",
    jenis: "Barang Pecah Belah",
    berat: "1-5 Kg",
    waktu: "Kemarin",
  },
];

export default function RiwayatPage() {
  const router = useRouter(); // Inisialisasi router untuk navigasi
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    const validStatuses = ["menunggu kurir", "paket sudah diambil", "dalam perjalanan", "selesai"];
    if (value && !validStatuses.some(s => s.includes(value.toLowerCase()))) {
      setError("Riwayat tidak ditemukan. Pencarian berdasarkan status \"Menunggu Kurir/Paket Sudah Diambil/Dalam Perjalanan/Selesai\"");
    } else {
      setError("");
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Selesai":
        return "bg-[#E8F5E9] text-[#4CAF50] border-[#A5D6A7]";
      case "Menunggu Kurir":
        return "bg-[#FBE9E7] text-[#D84315] border-[#FFCCBC]";
      case "Paket Sudah Diambil":
        return "bg-[#E3F2FD] text-[#1565C0] border-[#BBDEFB]";
      default:
        return "bg-gray-100 text-gray-600 border-gray-300";
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F9F4] font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* HEADER NAVBAR */}
      <header className="h-20 bg-white flex items-center px-8 sticky top-0 z-30 justify-between border-b border-gray-100">
        <button 
          onClick={() => setIsSidebarOpen(true)} 
          className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex flex-col items-center justify-center gap-[3px]"
        >
          <div className="w-5 h-[2px] bg-black"></div>
          <div className="w-5 h-[2px] bg-black"></div>
          <div className="w-5 h-[2px] bg-black"></div>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xl">🐝</span>
          <h1 className="text-[18px] font-bold tracking-tight">Nadebee <span className="text-[#4CAF50]">Express</span></h1>
        </div>
        <div className="w-10"></div>
      </header>

      <section className="max-w-[1100px] mx-auto pt-10 px-6 pb-20">
        <div className="mb-8">
          <h2 className="text-[28px] font-bold text-[#1A1A1A]">Riwayat Pickup</h2>
          <p className="text-gray-500 text-sm">Berikut adalah semua riwayat permohonan pickup mu</p>
        </div>

        {/* SEARCH BAR */}
        <div className="relative mb-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari berdasarkan status pickup"
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4CAF50] bg-white shadow-sm"
          />
        </div>

        {error && (
          <p className="text-red-500 italic text-[11px] mb-4 ml-1 leading-tight">
            {error}
          </p>
        )}

        {/* DATE FILTER BUTTON */}
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-600 text-sm mb-8 hover:bg-gray-50 transition-colors">
          <Calendar size={16} />
          <span>Tanggal</span>
        </button>

        {/* LIST RIWAYAT */}
        {["Hari ini", "Kemarin"].map((waktu) => (
          <div key={waktu} className="mb-10">
            <h3 className="text-[14px] font-bold text-black mb-4">{waktu}</h3>
            <div className="space-y-4">
              {RIWAYAT_DATA.filter(item => item.waktu === waktu).map((item) => (
                <div 
                  key={item.id}
                  onClick={() => router.push("/auth/dashboard/pelanggan/riwayat/detail-pengiriman")}
                  className="bg-white border border-black rounded-[25px] p-6 flex items-center justify-between hover:shadow-md transition-all cursor-pointer group active:scale-[0.99]"
                >
                  <div className="flex items-center gap-6">
                    {/* ICON BOX */}
                    <div className="w-14 h-14 bg-[#E8F5E9] rounded-2xl flex items-center justify-center border border-green-100">
                      <span className="text-2xl">📦</span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-4">
                        <span className="font-extrabold text-[#1A1A1A]">{item.resi}</span>
                        <span className={`px-10 py-1.5 rounded-full text-[11px] font-bold border ${getStatusStyle(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-[13px] text-gray-400 font-medium leading-none">
                        {item.pengirim} → {item.penerima}
                      </p>
                      <p className="text-[12px] text-gray-500">
                        {item.wilayah} | {item.jenis} | {item.berat}
                      </p>
                    </div>
                  </div>
                  
                  {/* ARROW ICON */}
                  <ChevronRight 
                    className="text-[#4CAF50] group-hover:translate-x-1 transition-transform" 
                    size={24} 
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}