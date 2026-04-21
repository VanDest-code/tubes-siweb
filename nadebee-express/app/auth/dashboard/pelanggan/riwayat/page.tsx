"use client";

// PAKSA NEXT.JS UNTUK DYNAMIC RENDERING (SOLUSI PRERENDER ERROR)
export const dynamic = "force-dynamic";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Clock, ChevronLeft, MapPin, CreditCard } from "lucide-react";

// Komponen Konten
function DetailPengirimanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Ambil resi dengan aman
  const resiQuery = searchParams ? searchParams.get("resi") || "NDB001" : "NDB001";
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const detailData = {
    resi: resiQuery,
    pengirim: "Siti Rahayu",
    telpPengirim: "08123456789",
    alamatPickup: "Jl. Dagen Malioboro No.15, Yogyakarta",
    penerima: "Farhan Rizki",
    telpPenerima: "08987654321",
    alamatTujuan: "Jl. Babarsari No.113, Sleman",
    berat: "1-5 kg",
    jenis: "Dokumen",
    pembayaran: "Tunai",
    ongkir: "Rp 20.000",
  };

  const trackingStatus = [
    { label: "Menunggu Kurir", desc: "Permintaan Pickup sudah masuk", status: "completed" },
    { label: "Kurir Menuju Lokasi", desc: "Kurir sedang dalam perjalanan", status: "completed" },
    { label: "Paket Sudah Diambil", desc: "Paket sudah berhasil dijemput", status: "completed" },
    { label: "Dalam Perjalanan", desc: "Paket sedang dikirim menuju tujuan", status: "active" },
    { label: "Selesai", desc: "Paket sudah sampai dan diterima", status: "pending" },
  ];

  if (!mounted) return <div className="min-h-screen bg-[#F8F9FA]" />;

  return (
    <main className="w-full min-h-screen bg-[#F8F9FA] pb-20">
      <div className="w-full bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} className="text-gray-600" />
        </button>
        <h2 className="text-xl font-black text-[#1A1A1A]">Detail Pengiriman</h2>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Nomor Resi</p>
            <h1 className="text-3xl font-black text-[#4CAF50]">{detailData.resi}</h1>
          </div>
          <div className="bg-[#E8F5E9] px-6 py-2 rounded-full border border-[#A5D6A7]">
            <span className="text-[#4CAF50] font-black text-xs uppercase tracking-widest">Dalam Perjalanan</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-8">
            <h3 className="flex items-center gap-2 font-black text-black mb-6">
              <MapPin size={20} className="text-[#4CAF50]" /> Alamat Pengiriman
            </h3>
            <div className="space-y-6 relative ml-2">
              <div className="absolute left-[3px] top-2 bottom-2 w-[2px] bg-gray-100"></div>
              <div className="relative pl-6">
                <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-[#4CAF50]"></div>
                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Pengirim</p>
                <p className="font-black text-sm">{detailData.pengirim}</p>
                <p className="text-gray-500 text-sm">{detailData.alamatPickup}</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-orange-400"></div>
                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Penerima</p>
                <p className="font-black text-sm">{detailData.penerima}</p>
                <p className="text-gray-500 text-sm">{detailData.alamatTujuan}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
            <h3 className="flex items-center gap-2 font-black text-black mb-8">
              <Clock size={20} className="text-[#4CAF50]" /> Status Tracking
            </h3>
            <div className="space-y-8">
              {trackingStatus.map((step, idx) => (
                <div key={idx} className="flex gap-4 relative">
                  {idx !== trackingStatus.length - 1 && (
                    <div className={`absolute left-4 top-8 bottom-[-20px] w-[2px] ${step.status === 'completed' ? 'bg-[#4CAF50]' : 'bg-gray-100'}`}></div>
                  )}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                    step.status === 'completed' ? 'bg-[#4CAF50] text-white' : 'bg-gray-100'
                  }`}>
                    {step.status === 'completed' ? <Check size={16} /> : <div className="w-2 h-2 rounded-full bg-gray-400"></div>}
                  </div>
                  <div>
                    <p className={`font-black text-sm ${step.status === 'pending' ? 'text-gray-400' : 'text-black'}`}>{step.label}</p>
                    <p className="text-xs text-gray-400">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#4CAF50] rounded-[32px] p-8 text-white flex justify-between items-center">
          <div className="flex items-center gap-6">
            <CreditCard size={32} />
            <div>
              <p className="opacity-80 text-sm font-bold uppercase">Total Ongkos Kirim</p>
              <h2 className="text-3xl font-black">{detailData.ongkir}</h2>
            </div>
          </div>
          <div className="bg-white/20 px-6 py-3 rounded-2xl">
            <p className="font-black text-lg">{detailData.pembayaran}</p>
          </div>
        </div>
      </div>
    </main>
  );
}

// Export Utama
export default function DetailPengirimanPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-black">LOADING...</div>}>
      <DetailPengirimanContent />
    </Suspense>
  );
}