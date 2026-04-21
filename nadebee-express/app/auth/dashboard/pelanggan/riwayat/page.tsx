"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Calendar, ChevronRight } from "lucide-react";

// Tipe Data
interface RiwayatItem {
  id: string;
  resi: string;
  status: "Selesai" | "Menunggu Kurir" | "Paket Sudah Diambil" | "Dalam Perjalanan" | "Kurir Menuju Lokasi";
  pengirim: string;
  penerima: string;
  wilayah: string;
  jenis: string;
  berat: string;
  waktu: "Hari ini" | "Kemarin";
}

// 5 DATA DUMMY LENGKAP
const RIWAYAT_DATA: RiwayatItem[] = [
  {
    id: "1",
    resi: "NDB001",
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
    resi: "NDB002",
    status: "Dalam Perjalanan",
    pengirim: "Budi Santoso",
    penerima: "Ani Wijaya",
    wilayah: "Bantul",
    jenis: "Elektronik",
    berat: "1-5 Kg",
    waktu: "Hari ini",
  },
  {
    id: "3",
    resi: "NDB003",
    status: "Paket Sudah Diambil",
    pengirim: "Eko Prasetyo",
    penerima: "Rina Sari",
    wilayah: "Gunungkidul",
    jenis: "Pakaian",
    berat: "1-5 Kg",
    waktu: "Kemarin",
  },
  {
    id: "4",
    resi: "NDB004",
    status: "Kurir Menuju Lokasi",
    pengirim: "Agus Setiawan",
    penerima: "Dewi Lestari",
    wilayah: "Kulon Progo",
    jenis: "Makanan",
    berat: "1-5 Kg",
    waktu: "Kemarin",
  },
  {
    id: "5",
    resi: "NDB005",
    status: "Menunggu Kurir",
    pengirim: "Lestari Putri",
    penerima: "Hendra Kurnia",
    wilayah: "Kota Jogja",
    jenis: "Kosmetik",
    berat: "1-5 Kg",
    waktu: "Kemarin",
  },
];

export default function RiwayatPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    const validStatuses = ["menunggu kurir", "paket sudah diambil", "dalam perjalanan", "selesai", "kurir menuju lokasi"];
    if (value && !validStatuses.some(s => s.includes(value.toLowerCase()))) {
      setError("Status tidak ditemukan.");
    } else {
      setError("");
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Selesai": return "bg-[#E8F5E9] text-[#4CAF50] border-[#A5D6A7]";
      case "Menunggu Kurir": return "bg-[#FBE9E7] text-[#D84315] border-[#FFCCBC]";
      case "Paket Sudah Diambil": return "bg-[#E3F2FD] text-[#1565C0] border-[#BBDEFB]";
      case "Kurir Menuju Lokasi": return "bg-[#FFF8E1] text-[#FF8F00] border-[#FFE082]";
      case "Dalam Perjalanan": return "bg-[#F3E5F5] text-[#7B1FA2] border-[#E1BEE7]";
      default: return "bg-gray-100 text-gray-600 border-gray-300";
    }
  };

  const filteredData = RIWAYAT_DATA.filter(item => 
    item.status.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.resi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="w-full flex flex-col items-center pt-10 pb-20 px-6 max-w-5xl mx-auto">
      <div className="w-full">
        <div className="mb-8">
          <h2 className="text-[28px] font-black text-[#1A1A1A]">Riwayat Pickup</h2>
          <p className="text-gray-500 text-sm">Berikut adalah semua riwayat permohonan pickup mu</p>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari berdasarkan status atau nomor resi..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#4CAF50] bg-white shadow-sm font-medium"
          />
        </div>

        {error && <p className="text-red-500 italic text-[11px] mb-4 ml-1">{error}</p>}

        <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm mb-8 hover:bg-gray-50 transition-all font-bold shadow-sm">
          <Calendar size={16} />
          <span>Tanggal</span>
        </button>

        {["Hari ini", "Kemarin"].map((waktu) => (
          <div key={waktu} className="mb-10">
            <h3 className="text-[15px] font-black text-black mb-6 uppercase tracking-wider">{waktu}</h3>
            <div className="space-y-5">
              {filteredData.filter(item => item.waktu === waktu).map((item) => (
                <div 
                  key={item.id}
                  onClick={() => router.push(`/auth/dashboard/pelanggan/riwayat/detail-pengiriman?resi=${item.resi}`)}
                  className="bg-white border-2 border-transparent rounded-[30px] p-7 flex items-center justify-between hover:border-green-100 hover:shadow-xl hover:shadow-green-50/50 transition-all cursor-pointer group active:scale-[0.98] shadow-sm shadow-gray-100"
                >
                  <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-[#F0FDF4] rounded-[22px] flex items-center justify-center border border-green-50">
                      <span className="text-3xl">📦</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-black text-[#1A1A1A]">{item.resi}</span>
                        <span className={`px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-[14px] text-gray-400 font-bold">
                        {item.pengirim} <span className="mx-1 text-green-300">→</span> {item.penerima}
                      </p>
                      <div className="flex gap-3 text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                        <span>{item.wilayah}</span>
                        <span className="text-gray-200">|</span>
                        <span>{item.jenis}</span>
                        <span className="text-gray-200">|</span>
                        <span>{item.berat}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="text-[#4CAF50] group-hover:translate-x-2 transition-transform" size={28} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}