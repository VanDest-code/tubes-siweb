"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NontunaiPage() {
  const router = useRouter();

  // 1. State untuk menyimpan sisa waktu dalam hitungan detik (5 menit = 300 detik)
  const [timeLeft, setTimeLeft] = useState(300);

  // 2. Efek Real-time Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // 3. Helper Fungsi untuk Mengubah Angka Detik ke Format Menit:Detik (MM:SS)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    // Mengganti min-h-screen & justify-center dengan pt-12 (padding-top) agar layout naik ke atas secara natural
    <main className="min-h-screen bg-[#F4F9F4] font-sans pb-20">
      <div className="max-w-[1200px] mx-auto pt-12 px-6 flex flex-col items-center">
        
        {/* Container Judul Atas - Sekarang sudah diatur pas di tengah (Center) */}
        <div className="w-full max-w-md text-center mx-auto mb-8">
          <h2 className="text-[28px] font-bold text-[#1A1A1A] tracking-tight">Pembayaran Nontunai</h2>
          <p className="text-gray-500 text-sm mt-1">Scan kode dibawah untuk melakukan pembayaran</p>
        </div>
        
        {/* Box Putih Utama Pembayaran */}
        <div className="bg-white border border-green-400 rounded-[30px] p-8 w-full max-w-md shadow-sm mb-6 flex flex-col items-center">
          
          {/* Kotak QR Code */}
          <div className="bg-gray-50 w-48 h-48 mb-6 flex items-center justify-center rounded-xl border border-gray-100">
             {/* Ganti teks span ini dengan tag <Image /> jika file gambar QRIS kamu sudah siap */}
             <span className="text-gray-400 font-bold tracking-wider text-xs">QR CODE</span>
          </div>

          {/* Banner Ringkasan Total Pembayaran */}
          <div className="bg-[#E8F5E9] w-full py-4 rounded-2xl border border-green-200 text-center">
            <p className="text-xs text-gray-500 font-medium tracking-wide">Total Pembayaran</p>
            <p className="text-xl font-bold text-green-600 mt-0.5">RP 20.000</p>
          </div>

          {/* Tampilan Sisa Waktu yang Berjalan Mundur Dinamis */}
          <p className={`mt-5 text-sm font-bold tracking-wide transition-colors duration-300 ${
            timeLeft < 60 ? "text-red-500 animate-pulse" : "text-gray-500"
          }`}>
            Sisa waktu {formatTime(timeLeft)}
          </p>
        </div>

        {/* Button Aksi Konfirmasi */}
        <button 
          onClick={() => router.push("/auth/dashboard/pelanggan/request-pickup/berhasil")}
          className="w-full max-w-md bg-[#4CAF50] hover:bg-[#43A047] text-white py-4 rounded-2xl font-bold shadow-lg transition-transform active:scale-[0.99]"
        >
          Saya sudah bayar
        </button>

      </div>
    </main>
  );
}