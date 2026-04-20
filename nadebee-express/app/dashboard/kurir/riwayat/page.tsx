"use client";

import { useState } from "react";
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Clock, 
  Calendar,
  XCircle 
} from "lucide-react";

export default function RiwayatPage() {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedRating, setSelectedRating] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  // Data Dummy Riwayat LENGKAP
  const historyData = [
    {
      id: "NDB011",
      customer: "Citra Lestari",
      status: "Selesai",
      price: "Rp 35.000",
      rating: 4,
      route: "Jl.Nganglik No.123 → Jl.Kalasan No.12",
      duration: "30 Menit",
      date: "5 April 2026",
      review: "Kurir ramah dan amanah"
    },
    {
      id: "NDB012",
      customer: "Budi Santoso",
      status: "Selesai",
      price: "Rp 20.000",
      rating: 4,
      route: "Jl.Palagan No.45 → Jl.Magelang No.10",
      duration: "20 Menit",
      date: "Hari ini",
      review: "Pengiriman tepat waktu"
    },
    {
      id: "NDB013",
      customer: "Siti Rahayu",
      status: "Selesai",
      price: "Rp 15.000",
      rating: 5,
      route: "Jl.Dagen No.15 → Jl.Babarsari No.113",
      duration: "15 Menit",
      date: "3 April 2026",
      review: "Sangat cepat!"
    },
    {
      id: "NDB014",
      customer: "Ray Claudio",
      status: "Selesai",
      price: "Rp 25.000",
      rating: 3,
      route: "Jl.Wonomartani → Jl.Solo",
      duration: "45 Menit",
      date: "2 April 2026",
      review: "Biasa saja, agak telat"
    }
  ];

  // ==========================================
  // LOGIKA FILTERING & SEARCHING
  // ==========================================
  const filteredData = historyData.filter((item) => {
    // 1. Filter berdasarkan Search (Nomor Resi atau Nama Customer)
    const matchesSearch = 
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customer.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Filter berdasarkan Rating
    const matchesRating = 
      selectedRating === "Semua" || 
      item.rating.toString() === selectedRating;

    return matchesSearch && matchesRating;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Riwayat Pickup</h1>
        <p className="text-sm text-gray-500 font-medium">Menampilkan ringkasan pickup yang pernah kamu lakukan</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text"
          placeholder="cari berdasarkan nomor resi atau nama"
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition-all font-medium"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter Section */}
      <div className="relative inline-block">
        <button 
          onClick={() => setShowFilter(!showFilter)}
          className={`flex items-center gap-2 px-6 py-2 border rounded-lg text-sm font-bold transition-all ${
            selectedRating !== "Semua" 
            ? "bg-green-50 border-green-500 text-green-600" 
            : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Filter size={16} /> 
          {selectedRating === "Semua" ? "Filter" : `Rating ${selectedRating}`}
        </button>

        {/* Dropdown Filter Rating */}
        {showFilter && (
          <div className="absolute left-0 mt-2 w-72 bg-white border border-gray-300 rounded-2xl shadow-xl z-50 p-5 animate-in fade-in zoom-in duration-200">
            <p className="text-sm font-black text-gray-700 mb-4 tracking-tight">Rating</p>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => {setSelectedRating("Semua"); setShowFilter(false);}}
                className={`py-2 rounded-full text-xs font-bold transition-all ${selectedRating === "Semua" ? "bg-[#F3D45F] text-gray-900" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
              >
                Semua
              </button>
              {[1, 2, 3, 4, 5].map((num) => (
                <button 
                  key={num}
                  onClick={() => {setSelectedRating(num.toString()); setShowFilter(false);}}
                  className={`flex items-center justify-center gap-1 py-2 rounded-full text-xs font-bold transition-all ${selectedRating === num.toString() ? "bg-[#F3D45F] text-gray-900" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                >
                  <Star size={12} fill={selectedRating === num.toString() ? "black" : "none"} /> {num}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* List Riwayat */}
      <div className="space-y-6">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <div key={index} className="bg-white border border-green-500 rounded-[24px] p-8 shadow-sm group hover:shadow-md transition-all relative">
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-black text-gray-900">{item.customer}</h3>
                      <span className="bg-green-50 text-green-500 text-[10px] font-black px-4 py-1 rounded-full border border-green-100 uppercase">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 mt-0.5 tracking-wider">{item.id}</p>
                  </div>

                  <div className="space-y-2 text-gray-500 font-medium text-sm">
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="text-gray-300" />
                      <span>{item.route}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-gray-300" />
                      <span>Durasi: {item.duration}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-gray-300" />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm font-medium italic text-gray-500">"{item.review}"</p>
                  </div>
                </div>

                <div className="text-right space-y-4">
                  <p className="text-xl font-black text-green-600">{item.price}</p>
                  <div className="flex justify-end gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={18} 
                        className={star <= item.rating ? "text-[#F3D45F]" : "text-gray-200"} 
                        fill={star <= item.rating ? "#F3D45F" : "none"} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          /* TAMPILAN JIKA TIDAK DITEMUKAN (SESUAI PERINTAH) */
          <div className="flex flex-col items-center justify-center py-20 bg-white border-2 border-dashed border-gray-200 rounded-[32px] space-y-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
              <XCircle size={48} strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <p className="text-gray-600 font-black text-xl">Data Tidak Ditemukan</p>
              <p className="text-gray-400 font-medium">Riwayat berdasarkan kriteria tersebut tidak ditemukan</p>
            </div>
            <button 
              onClick={() => {setSearchQuery(""); setSelectedRating("Semua");}}
              className="text-green-500 font-bold hover:underline"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}