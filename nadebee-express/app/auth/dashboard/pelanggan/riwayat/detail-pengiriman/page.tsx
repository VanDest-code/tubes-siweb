"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { CheckCircle2, Clock } from "lucide-react";

export default function DetailPengirimanPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Data dummy sesuai mockup
  const detailData = {
    resi: "NDB001",
    pengirim: "Siti Rahayu",
    telpPengirim: "08123456789",
    alamatPickup: "Jl. Dagen Malioboro No.15",
    penerima: "Farhan Rizki",
    telpPenerima: "08987654321",
    alamatTujuan: "Jl. Babarsari No.113",
    berat: "1-5 kg",
    jenis: "Dokumen",
    pembayaran: "Tunai",
    ongkir: "Rp 20.000",
  };

  const trackingStatus = [
    { label: "Menunggu Kurir", desc: "Permintaan Pickup sudah masuk, menunggu konfirmasi kurir", completed: true },
    { label: "Kurir Menuju Lokasi", desc: "Kurir sedang dalam perjalanan ke alamat penjemputan", completed: true },
    { label: "Paket Sudah Diambil", desc: "Paket sudah berhasil dijemput oleh kurir", completed: true },
    { label: "Dalam Perjalanan", desc: "Paket sedang dikirim menuju alamat tujuan", active: true },
    { label: "Selesai", desc: "Paket sudah sampai dan diterima dengan selamat", completed: false },
  ];

  return (
    <main className="min-h-screen bg-[#F4F9F4] font-sans pb-10">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <header className="h-20 bg-white flex items-center px-8 sticky top-0 z-30 justify-between border-b border-gray-100">
        <button onClick={() => setIsSidebarOpen(true)} className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex flex-col items-center justify-center gap-[3px]">
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

      <section className="max-w-[1200px] mx-auto pt-10 px-6">
        <div className="bg-white border border-gray-200 rounded-[30px] p-12 shadow-sm relative">
          <h2 className="text-2xl font-bold text-center mb-12">Detail Pengiriman</h2>

          <div className="flex flex-col lg:flex-row gap-16">
            {/* Info Section */}
            <div className="flex-1 space-y-6">
              <div className="bg-[#E8F5E9] border border-[#4CAF50] rounded-2xl p-4 w-fit px-8 mb-8">
                <p className="text-gray-400 text-xs mb-1">Nomor Resi</p>
                <p className="text-[#4CAF50] font-bold text-lg">{detailData.resi}</p>
              </div>

              <div className="grid grid-cols-2 gap-y-6 text-[14px]">
                <div className="text-gray-400 space-y-4">
                  <p>Pengirim</p>
                  <p>Nomor Telepon</p>
                  <p>Alamat Pickup</p>
                  <p className="pt-4 text-gray-400">Penerima</p>
                  <p>Nomor Telepon</p>
                  <p>Alamat Pickup</p>
                </div>
                <div className="text-[#1A1A1A] font-bold space-y-4 text-right lg:text-left">
                  <p>{detailData.pengirim}</p>
                  <p>{detailData.telpPengirim}</p>
                  <p>{detailData.alamatPickup}</p>
                  <p className="pt-4 text-[#4CAF50]">{detailData.penerima}</p>
                  <p className="text-[#4CAF50]">{detailData.telpPenerima}</p>
                  <p className="text-[#4CAF50]">{detailData.alamatTujuan}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-4 text-[14px] pt-6 border-t border-gray-100">
                <div className="text-gray-400 space-y-2">
                  <p>Berat</p>
                  <p>Jenis Barang</p>
                  <p>Pembayaran</p>
                  <p>Ongkir</p>
                </div>
                <div className="text-[#1A1A1A] font-bold space-y-2 text-right lg:text-left">
                  <p>{detailData.berat}</p>
                  <p>{detailData.jenis}</p>
                  <p>{detailData.pembayaran}</p>
                  <p>{detailData.ongkir}</p>
                </div>
              </div>
            </div>

            {/* Status Tracking Section */}
            <div className="flex-1">
              <div className="relative space-y-8">
                {trackingStatus.map((status, idx) => (
                  <div key={idx} className="flex gap-6 relative">
                    {/* Line connector */}
                    {idx !== trackingStatus.length - 1 && (
                      <div className="absolute left-[13px] top-8 w-[2px] h-12 bg-gray-200"></div>
                    )}
                    
                    <div className="z-10">
                      {status.active ? (
                        <div className="bg-[#4CAF50] text-white p-1 rounded-lg">
                          <CheckCircle2 size={20} />
                        </div>
                      ) : status.completed ? (
                        <div className="text-[#4CAF50] bg-[#E8F5E9] rounded-full p-1 border border-[#4CAF50]">
                          <CheckCircle2 size={20} />
                        </div>
                      ) : (
                        <div className="text-gray-300 bg-gray-100 rounded-full p-1">
                          <Clock size={20} />
                        </div>
                      )}
                    </div>

                    <div className={`${status.active ? 'text-[#1A1A1A]' : 'text-gray-400'}`}>
                      <p className={`font-bold text-[14px] ${status.active ? 'text-black' : ''}`}>{status.label}</p>
                      <p className="text-[11px] leading-tight mt-1">{status.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-end">
            <button 
              onClick={() => router.back()}
              className="bg-[#E8F5E9] text-black border border-gray-200 font-bold px-12 py-3 rounded-2xl hover:bg-gray-100 transition-colors"
            >
              Kembali
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}