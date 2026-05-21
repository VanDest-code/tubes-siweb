"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Image from "next/image";

export default function KonfirmasiPickupPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State untuk menyimpan pilihan metode pembayaran
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Update Halaman Konfirmasi (Logika Navigasi)
  const handlePayment = () => {
    if (!paymentMethod) {
      setError("Metode pembayaran wajib dipilih");
      return;
    }

    if (paymentMethod === "Tunai") {
      router.push("/auth/dashboard/pelanggan/request-pickup/pembayaran-tunai");
    } else {
      router.push("/auth/dashboard/pelanggan/request-pickup/pembayaran-nontunai");
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F9F4] font-sans pb-20">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <section className="max-w-[1200px] mx-auto pt-12 px-6">
        <div className="mb-10">
          <h2 className="text-[28px] font-bold text-[#1A1A1A]">Konfirmasi Pickup</h2>
          <p className="text-gray-500 text-sm">Request pickup kamu sudah masuk!</p>
        </div>

        {/* Pembungkus Utama Dua Kolom */}
        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-12 w-full">
          
          {/* Sisi Kiri: Ringkasan Card (Ukuran font, radius, & warna tetap asli milikmu) */}
          <div className="w-full lg:w-[60%]">
            <div className="bg-white border border-green-400 rounded-[30px] p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-6">Ringkasan</h3>
              
              <div className="space-y-4 text-[15px] border-b border-gray-100 pb-6 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Pengirim → Penerima</span>
                  <span className="text-[#4CAF50] font-semibold text-right">Siti Rahayu → Farhan Rizki</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Alamat Tujuan</span>
                  <span className="text-[#4CAF50] font-semibold text-right">Jl.Babarsari No.113</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Jenis Barang</span>
                  <span className="text-[#4CAF50] font-semibold">Dokumen</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Berat</span>
                  <span className="text-[#4CAF50] font-semibold">1-5 kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Pembayaran</span>
                  <span className="text-[#4CAF50] font-semibold">{paymentMethod || "-"}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-lg">Total Ongkir</span>
                <span className="font-bold text-lg text-[#4CAF50]">Rp. 20.000</span>
              </div>

              <div className="space-y-2 mb-8">
                <p className="text-[12px] text-gray-400 leading-tight">
                  ⓘ Biaya pengiriman dihitung berdasarkan jarak wilayah dan estimasi berat barang
                </p>
                <p className="text-[12px] text-gray-400 leading-tight">
                  ⓘ Biaya tambahan akan disesuaikan saat penjemputan jika diperlukan
                </p>
              </div>

              <h4 className="font-bold text-lg mb-4">Metode Pembayaran</h4>
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => { setPaymentMethod("Tunai"); setError(""); }}
                  className={`flex-1 py-3 rounded-2xl font-bold border transition-all ${
                    paymentMethod === "Tunai" 
                    ? "bg-[#E8F5E9] border-[#4CAF50] text-[#4CAF50]" 
                    : "bg-white border-gray-200 text-gray-400"
                  }`}
                >
                  Tunai
                </button>
                <button 
                  type="button"
                  onClick={() => { setPaymentMethod("Non Tunai"); setError(""); }}
                  className={`flex-1 py-3 rounded-2xl font-bold border transition-all ${
                    paymentMethod === "Non Tunai" 
                    ? "bg-[#E8F5E9] border-[#4CAF50] text-[#4CAF50]" 
                    : "bg-white border-gray-200 text-gray-400"
                  }`}
                >
                  Non Tunai
                </button>
              </div>
              
              {/* Tampilan Error jika belum pilih metode */}
              {error && (
                <p className="text-red-500 italic text-[12px] mt-2 ml-1">{error}</p>
              )}
            </div>
          </div>

          {/* Sisi Kanan: Gambar Ilustrasi (Dibuat center vertikal & proporsional menempel ke kanan desktop) */}
          <div className="w-full lg:w-[40%] flex justify-center lg:justify-end items-center min-h-[350px]">
            <div className="relative w-full max-w-[400px] lg:max-w-[440px] aspect-square flex items-center justify-center">
              <Image 
                src="/image.png" 
                alt="Waiting for Nadebee" 
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

        </div> {/* Penutupan tag pembungkus kolom yang tadinya hilang */}

        {/* Action Button Bagian Bawah */}
        <div className="mt-12">
          <button
            type="button"
            onClick={handlePayment}
            className="w-full bg-[#4CAF50] hover:bg-[#43A047] text-white py-5 rounded-[25px] font-bold text-lg shadow-lg transition-transform active:scale-[0.98]"
          >
            Lanjutkan Pembayaran
          </button>
        </div>
      </section>
    </main>
  );
}