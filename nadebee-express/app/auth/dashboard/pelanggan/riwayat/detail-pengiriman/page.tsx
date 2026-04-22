"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Clock } from "lucide-react";

// Memaksa Next.js untuk tidak melakukan prerender statis pada halaman ini
export const dynamic = "force-dynamic";

/**
 * Komponen Utama yang berisi logika useSearchParams
 * Harus dipisah agar bisa dibungkus dalam Suspense Boundary
 */
function DetailPengirimanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resiQuery = searchParams.get("resi") || "NDB001";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const detailData = {
    resi: resiQuery,
    pengirim: "Siti Rahayu",
    telpPengirim: "08123456789",
    alamatPickup: "Jl.Dagen Malioboro No.15",
    penerima: "Farhan Rizki",
    telpPenerima: "08987654321",
    alamatTujuan: "Jl.Babarsari No.113",
    berat: "1-5 kg",
    jenis: "Dokumen",
    pembayaran: "Tunai",
    ongkir: "Rp 20.000",
  };

  const trackingStatus = [
    { label: "Menunggu Kurir", desc: "Permintaan Pickup sudah masuk, menunggu konfirmasi kurir", status: "completed" },
    { label: "Kurir Menuju Lokasi", desc: "Kurir sedang dalam perjalanan ke alamat penjemputan", status: "completed" },
    { label: "Paket Sudah Diambil", desc: "Paket sudah berhasil dijemput oleh kurir", status: "completed" },
    { label: "Dalam Perjalanan", desc: "Paket sedang dikirim menuju alamat tujuan", status: "active" },
    { label: "Selesai", desc: "Paket sudah sampai dan diterima dengan selamat", status: "pending" },
  ];

  if (!mounted) return null;

  return (
    <main className="w-full flex flex-col items-center pt-10 pb-20 px-6 max-w-[1200px] mx-auto animate-in fade-in duration-500">
      
      {/* Container Utama Putih */}
      <div className="w-full bg-white border border-black rounded-[40px] p-16 shadow-sm relative mb-8">
        <h2 className="text-[28px] font-black text-center mb-16 text-black">Detail Pengiriman</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* KOLOM KIRI: INFORMASI PAKET */}
          <div className="space-y-10">
            <div className="bg-[#E8F5E9]/60 border border-[#4CAF50]/30 rounded-[20px] p-8 w-full max-w-[320px]">
              <p className="text-gray-400 text-[14px] font-medium mb-2">Nomor Resi</p>
              <p className="text-[#4CAF50] font-black text-[22px] tracking-tight">{detailData.resi}</p>
            </div>

            <div className="space-y-12 text-[16px]">
              <div className="grid grid-cols-[160px_1fr] gap-4">
                <div className="text-gray-400 space-y-2">
                  <p>Pengirim</p>
                  <p>Nomor Telepon</p>
                  <p>Alamat Pickup</p>
                </div>
                <div className="text-black font-black space-y-2">
                  <p>{detailData.pengirim}</p>
                  <p>{detailData.telpPengirim}</p>
                  <p>{detailData.alamatPickup}</p>
                </div>
              </div>

              <div className="grid grid-cols-[160px_1fr] gap-4">
                <div className="text-gray-400 space-y-2">
                  <p>Penerima</p>
                  <p>Nomor Telepon</p>
                  <p>Alamat Pickup</p>
                </div>
                <div className="text-[#4CAF50] font-black space-y-2">
                  <p>{detailData.penerima}</p>
                  <p>{detailData.telpPenerima}</p>
                  <p>{detailData.alamatTujuan}</p>
                </div>
              </div>

              <div className="grid grid-cols-[160px_1fr] gap-4">
                <div className="text-gray-400 space-y-2">
                  <p>Berat</p>
                  <p>Jenis Barang</p>
                  <p>Pembayaran</p>
                  <p>Ongkir</p>
                </div>
                <div className="text-black font-black space-y-2">
                  <p>{detailData.berat}</p>
                  <p>{detailData.jenis}</p>
                  <p>{detailData.pembayaran}</p>
                  <p>{detailData.ongkir}</p>
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: TIMELINE */}
          <div className="relative">
            <div className="space-y-12 relative">
              <div className="absolute left-[20px] top-4 bottom-4 w-[1px] bg-gray-300"></div>

              {trackingStatus.map((item, idx) => (
                <div key={idx} className="flex gap-10 relative items-start">
                  <div className={`z-10 w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${
                    item.status === "completed" ? "bg-[#E8F5E9] border-[#4CAF50] text-[#4CAF50]" :
                    item.status === "active" ? "bg-[#4CAF50] border-[#4CAF50] text-white shadow-lg shadow-green-100" :
                    "bg-[#E0E0E0] border-[#E0E0E0] text-gray-500"
                  }`}>
                    {item.status === "pending" ? <Clock size={20} /> : <Check size={20} strokeWidth={3} />}
                  </div>

                  <div className="pt-1">
                    <p className={`text-[16px] font-black leading-none mb-2 ${
                      item.status === "pending" ? "text-gray-400" : "text-black"
                    }`}>
                      {item.label}
                    </p>
                    <p className="text-[12px] text-gray-400 font-medium leading-relaxed max-w-[320px]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tombol Kembali */}
      <div className="w-full flex justify-end">
        <button 
          onClick={() => router.back()}
          className="bg-[#E8F5E9] text-black border border-[#4CAF50]/30 font-black px-16 py-4 rounded-[18px] hover:bg-[#D7ECD9] transition-all"
        >
          Kembali
        </button>
      </div>
    </main>
  );
}

/**
 * Export default yang membungkus konten dalam Suspense.
 * Ini adalah solusi final untuk error Prerender/useSearchParams di Vercel.
 */
export default function DetailPengirimanPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50] mb-4"></div>
        <p className="font-black text-[#4CAF50]">Memuat Detail Pengiriman...</p>
      </div>
    }>
      <DetailPengirimanContent />
    </Suspense>
  );
}