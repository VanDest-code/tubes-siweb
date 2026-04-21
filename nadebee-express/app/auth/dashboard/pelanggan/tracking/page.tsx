"use client";

import { useState, useEffect } from "react";
import { Search, Package, AlertCircle, CheckCircle, Clock, ArrowLeft, ArrowRight, Star } from "lucide-react";
import Image from "next/image";

// 1. DATA SIMULASI (5 RESI BERBEDA STATUS)
const DATA_RESI: any = {
  "NDB001": {
    status: "Selesai",
    pengirim: "Siti Rahayu",
    penerima: "Farhan Rizki",
    wilayah: "Sleman",
    ongkir: "Rp. 20.000",
    durasi: "60 Menit",
    color: "bg-green-100 text-green-600 border-green-200",
    history: [
      { time: "12 April 2026 - 15.54", title: "Selesai", desc: "Paket sudah sampai dan diterima dengan selamat", active: true },
      { time: "12 April 2026 - 15.12", title: "Dalam Perjalanan", desc: "Paket sedang dikirim menuju alamat tujuan", active: true },
      { time: "12 April 2026 - 15.10", title: "Paket Sudah Diambil", desc: "Paket sudah berhasil dijemput oleh kurir", active: true },
      { time: "12 April 2026 - 14.56", title: "Kurir Menuju Lokasi", desc: "Kurir sedang dalam perjalanan ke alamat penjemputan", active: true },
      { time: "12 April 2026 - 14.54", title: "Menunggu Kurir", desc: "Permintaan Pickup sudah masuk", active: true },
    ]
  },
  "NDB002": {
    status: "Dalam Perjalanan",
    pengirim: "Budi Santoso",
    penerima: "Ani Wijaya",
    wilayah: "Bantul",
    ongkir: "Rp. 15.000",
    color: "bg-blue-50 text-blue-500 border-blue-100",
    history: [
      { time: "21 April 2026 - 14.00", title: "Dalam Perjalanan", desc: "Paket sedang dikirim menuju alamat tujuan", active: true },
      { time: "21 April 2026 - 13.30", title: "Paket Sudah Diambil", desc: "Paket sudah berhasil dijemput oleh kurir", active: true },
      { title: "Selesai", desc: "Paket akan segera sampai", active: false },
    ]
  },
  "NDB003": {
    status: "Paket Sudah Diambil",
    pengirim: "Eko Prasetyo",
    penerima: "Rina Sari",
    wilayah: "Gunungkidul",
    ongkir: "Rp. 25.000",
    color: "bg-orange-50 text-orange-500 border-orange-100",
    history: [
      { time: "21 April 2026 - 15.10", title: "Paket Sudah Diambil", desc: "Paket sudah berhasil dijemput oleh kurir", active: true },
      { title: "Dalam Perjalanan", desc: "Menunggu kurir berangkat", active: false },
    ]
  },
  "NDB004": {
    status: "Kurir Menuju Lokasi",
    pengirim: "Agus Setiawan",
    penerima: "Dewi Lestari",
    wilayah: "Kulon Progo",
    ongkir: "Rp. 22.000",
    color: "bg-yellow-50 text-yellow-600 border-yellow-100",
    history: [
      { time: "21 April 2026 - 15.20", title: "Kurir Menuju Lokasi", desc: "Kurir sedang dalam perjalanan ke alamat penjemputan", active: true },
      { title: "Paket Sudah Diambil", desc: "Menunggu serah terima paket", active: false },
    ]
  },
  "NDB005": {
    status: "Menunggu Kurir",
    pengirim: "Lestari Putri",
    penerima: "Hendra Kurnia",
    wilayah: "Kota Jogja",
    ongkir: "Rp. 10.000",
    color: "bg-red-50 text-red-400 border-red-100",
    history: [
      { time: "21 April 2026 - 15.30", title: "Menunggu Kurir", desc: "Permintaan Pickup sudah masuk", active: true },
    ]
  }
};

export default function TrackingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [showDetail, setShowDetail] = useState(false);
  const [rating, setRating] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toUpperCase().trim();
    if (!query) return;

    if (DATA_RESI[query]) {
      setStatus("success");
      setShowDetail(false);
    } else {
      setStatus("error");
      setShowDetail(false);
    }
  };

  if (!mounted) return null;

  const currentData = DATA_RESI[searchQuery.toUpperCase()];

  // --- VIEW DETAIL (FULL PAGE) ---
  if (showDetail && status === "success") {
    return (
      <main className="w-full flex flex-col items-center pt-6 pb-20 px-6 max-w-5xl mx-auto animate-in fade-in duration-500">
        <div className="w-full">
          <button onClick={() => setShowDetail(false)} className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-8 font-medium italic transition-all">
            <ArrowLeft size={18} /> Kembali
          </button>

          <div className="bg-white rounded-[32px] p-10 border border-gray-200 shadow-sm space-y-12">
            {/* Header Detail */}
            <div className="flex justify-between items-start">
              <div className="grid grid-cols-2 gap-x-20 gap-y-8">
                <div>
                  <p className="text-[14px] font-black text-gray-900 mb-4 tracking-tight">{searchQuery.toUpperCase()}</p>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Pengirim</p>
                  <p className="text-[15px] font-black text-gray-900 leading-none">{currentData.pengirim}</p>
                  <p className="text-[11px] text-gray-400 font-bold mt-2 tracking-widest uppercase">Wilayah</p>
                  <p className="text-[14px] font-black text-gray-800">{currentData.wilayah}</p>
                </div>
                <div className="pt-8">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Penerima</p>
                  <p className="text-[15px] font-black text-gray-900 leading-none">{currentData.penerima}</p>
                  <p className="text-[11px] text-gray-400 font-bold mt-2 tracking-widest uppercase">Ongkir</p>
                  <p className="text-[15px] font-black text-green-600 tracking-tighter">{currentData.ongkir}</p>
                </div>
              </div>
              <span className={`px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest border ${currentData.color}`}>
                {currentData.status}
              </span>
            </div>

            {/* Timeline & Bukti */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-widest mb-8">Status</h4>
                <div className="space-y-10 relative">
                  <div className="absolute left-[20px] top-2 bottom-2 w-[1.5px] bg-gray-100"></div>
                  {currentData.history.map((step: any, i: number) => (
                    <div key={i} className={`relative pl-14 ${step.active ? "opacity-100" : "opacity-30"}`}>
                      <div className={`absolute left-0 top-0 w-10 h-10 rounded-xl flex items-center justify-center z-10 ${step.active ? "bg-green-500 text-white shadow-lg shadow-green-200" : "bg-gray-100 text-gray-400"}`}>
                        {step.active ? <CheckCircle size={20} /> : <Clock size={20} />}
                      </div>
                      <div>
                        <h5 className="text-[14px] font-black text-gray-900 leading-none">{step.title}</h5>
                        <p className="text-[11px] text-gray-400 mt-2 font-medium">{step.desc}</p>
                        {step.time && <p className="text-[11px] text-green-500 font-black mt-1">{step.time}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bukti Pengiriman (Hanya Selesai) */}
              {currentData.status === "Selesai" && (
                <div className="space-y-4">
                  <p className="text-[12px] font-black text-gray-900 uppercase tracking-widest">Bukti Pengiriman</p>
                  <div className="rounded-[24px] overflow-hidden border-4 border-white shadow-lg h-64 relative">
                    <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000" alt="Bukti" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>

            {/* Banner Durasi */}
            {currentData.durasi && (
              <div className="bg-[#D7ECD9]/50 p-4 rounded-2xl flex items-center justify-center gap-3 border border-white">
                <Clock size={18} className="text-green-600" />
                <p className="text-[13px] font-black text-green-700 tracking-tight">Durasi Pengiriman: {currentData.durasi}</p>
              </div>
            )}
          </div>

          {/* RATING SECTION (FIGMA) */}
          {currentData.status === "Selesai" && (
            <div className="mt-8 bg-white rounded-[32px] p-10 border border-gray-900/10 shadow-sm text-center">
              <p className="text-[14px] font-black text-gray-900 mb-6">Paket sudah sampai! Yuk beri penilaian..</p>
              <div className="flex justify-center gap-3 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} className={`transition-all ${rating >= star ? "text-yellow-400 scale-110" : "text-gray-200 hover:text-yellow-200"}`}>
                    <Star size={32} fill={rating >= star ? "currentColor" : "none"} strokeWidth={2.5} />
                  </button>
                ))}
              </div>
              <textarea placeholder="Tulis ulasan (opsional)..." className="w-full bg-[#E8F5E9]/50 rounded-[24px] p-6 text-[14px] outline-none border border-transparent focus:border-green-200 mb-6 min-h-[120px] transition-all font-medium" />
              <button className="w-full bg-[#4CAF50] text-white font-black py-5 rounded-[22px] shadow-lg shadow-green-100 hover:bg-green-600 active:scale-[0.98] transition-all">
                Kirim Penilaian
              </button>
            </div>
          )}
        </div>
      </main>
    );
  }

  // --- VIEW AWAL (RINGKASAN / ERROR / IDLE) ---
  return (
    <main className="w-full flex flex-col items-center pt-10 pb-20 px-6 max-w-5xl mx-auto">
      <div className="w-full">
        <div className="mb-8">
          <h2 className="text-[22px] font-black text-gray-900 flex items-center gap-2 tracking-tight">Lacak Paket 📦</h2>
          <p className="text-gray-500 text-[14px]">Masukkan nomor resi untuk mulai melacak</p>
        </div>

        <form onSubmit={handleSearch} className="relative mb-12 flex gap-3">
          <input 
            type="text" placeholder="Contoh: NDB001" value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); if (e.target.value === "") setStatus("idle"); }}
            className={`flex-1 h-14 pl-6 pr-14 rounded-[22px] border-2 bg-white outline-none transition-all font-medium ${status === "error" ? 'border-red-400' : 'border-white focus:border-[#4CAF50]'}`}
          />
          <button type="submit" className="w-14 h-14 bg-[#4CAF50] text-white rounded-[20px] flex items-center justify-center shadow-lg shadow-green-200 hover:bg-green-600 active:scale-90 transition-all"><Search size={22} /></button>
        </form>

        {/* RINGKASAN SUKSES FIGMA */}
        {status === "success" && currentData && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div onClick={() => setShowDetail(true)} className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm relative cursor-pointer group hover:border-green-100 transition-all">
              <div className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-900 group-hover:translate-x-1 transition-transform">
                <ArrowRight size={24} strokeWidth={2.5} />
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <h3 className="text-[15px] font-black text-gray-900 uppercase">{searchQuery.toUpperCase()}</h3>
                  <span className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${currentData.color}`}>
                    {currentData.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-20">
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Pengirim</p>
                    <p className="text-[15px] font-black text-gray-900">{currentData.pengirim}</p>
                    <p className="text-[11px] text-gray-400 font-bold mt-2 uppercase">Wilayah</p>
                    <p className="text-[14px] font-black text-gray-800">{currentData.wilayah}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Penerima</p>
                    <p className="text-[15px] font-black text-gray-900">{currentData.penerima}</p>
                    <p className="text-[11px] text-gray-400 font-bold mt-2 uppercase">Ongkir</p>
                    <p className="text-[15px] font-black text-green-600">{currentData.ongkir}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#D7ECD9] p-5 rounded-[22px] text-center border border-white">
              <p className="text-[14px] font-bold text-green-800/60">Tenang, paketmu sedang dalam proses</p>
            </div>
          </div>
        )}

        {/* ERROR FIGMA */}
        {status === "error" && (
          <div className="bg-white rounded-[32px] p-1 border-2 border-red-400 shadow-xl shadow-red-100 animate-in zoom-in duration-300">
            <div className="bg-white rounded-[28px] border border-red-400 p-16 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center mb-6 shadow-lg shadow-red-200"><AlertCircle size={32} strokeWidth={3} /></div>
              <h3 className="text-red-500 font-black text-[18px] mb-2 uppercase tracking-wide">Nomor resi tidak ditemukan</h3>
              <p className="text-gray-400 text-[15px] font-medium">Coba cek lagi ya!</p>
            </div>
          </div>
        )}

        {/* IDLE */}
        {status === "idle" && (
          <div className="flex flex-col items-center py-20 opacity-60">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm"><Package size={60} className="text-orange-300" /></div>
            <p className="text-gray-500 font-bold">Yuk lacak paketmu!</p>
          </div>
        )}
      </div>
    </main>
  );
}