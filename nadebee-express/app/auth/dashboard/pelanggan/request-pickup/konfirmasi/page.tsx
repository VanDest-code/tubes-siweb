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

      {/* NAVBAR
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
          <h1 className="text-[18px] font-bold tracking-tight">
            Nadebee <span className="text-[#4CAF50]">Express</span>
          </h1>
        </div>
        <div className="w-10"></div>
      </header> */}

      <section className="max-w-[1200px] mx-auto pt-12 px-6">
        <div className="mb-10">
          <h2 className="text-[28px] font-bold text-[#1A1A1A]">Konfirmasi Pickup</h2>
          <p className="text-gray-500 text-sm">Request pickup kamu sudah masuk!</p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-12">
          {/* Sisi Kiri: Ringkasan Card */}
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

          {/* Sisi Kanan: Gambar Ilustrasi */}
          <div className="w-full lg:w-[40%] flex justify-center items-center">
            <div className="relative w-full max-w-[400px] aspect-square">
              <Image 
                src="/image.png" // Pastikan gambar ada di folder public
                alt="Waiting for Nadebee" 
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-12">
          <button
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