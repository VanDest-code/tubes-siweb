"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function NontunaiPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 menit
  const [totalBiaya, setTotalBiaya] = useState("20.000"); // Default fallback

  // 1. Tarik nilai total ongkir yang disimpan di sessionStorage
  useEffect(() => {
    const savedCost = sessionStorage.getItem("totalOngkir");
    if (savedCost) {
      setTotalBiaya(parseInt(savedCost).toLocaleString('id-ID'));
    }
  }, []);

  // 2. Efek Real-time Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Helper fungsi format timer (MM:SS)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  // 3. Fungsi Kirim Gabungan Data Form + Ongkir ke Supabase
  const handleKirimData = async () => {
    setIsLoading(true);
    
    const savedData = sessionStorage.getItem("pickupData");
    const savedCost = sessionStorage.getItem("totalOngkir");
    const savedCourierId = sessionStorage.getItem("selectedCourierId");
    const savedPayment = sessionStorage.getItem("paymentMethod"); // <-- Ambil Metode Pembayaran

    if (!savedData) {
      alert("Data form hilang, silakan isi ulang.");
      router.push("/auth/dashboard/pelanggan/request-pickup");
      return;
    }

    try {
      const response = await fetch("/api/pickup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...JSON.parse(savedData),
          shippingCost: parseInt(savedCost || "20000"),
          courier_id: savedCourierId,
          payment_method: savedPayment || "Non Tunai" // <-- Kirim ke API Backend
        })
      });

      const result = await response.json();

      if (response.ok) {
        sessionStorage.clear(); 
        router.push(`/auth/dashboard/pelanggan/request-pickup/berhasil?resi=${result.resi}`);
      } else {
        alert("Terjadi kesalahan sistem saat menyimpan data.");
      }
    } catch (error) {
      alert("Gagal menghubungi server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F9F4] font-sans pb-20">
      <div className="max-w-[1200px] mx-auto pt-12 px-6 flex flex-col items-center">
        
        {/* Container Judul Atas */}
        <div className="w-full max-w-md text-center mx-auto mb-8">
          <h2 className="text-[28px] font-bold text-[#1A1A1A] tracking-tight">Pembayaran Nontunai</h2>
          <p className="text-gray-500 text-sm mt-1">Scan kode dibawah untuk melakukan pembayaran</p>
        </div>
        
        {/* Box Putih Utama Pembayaran */}
        <div className="bg-white border border-green-400 rounded-[30px] p-8 w-full max-w-md shadow-sm mb-6 flex flex-col items-center">
          
          {/* Kotak QR Code */}
          <div className="bg-gray-50 w-48 h-48 mb-6 flex items-center justify-center rounded-xl border border-gray-100">
             <span className="text-gray-400 font-bold tracking-wider text-xs">QR CODE</span>
          </div>

          {/* Banner Ringkasan Total Pembayaran Dinamis */}
          <div className="bg-[#E8F5E9] w-full py-4 rounded-2xl border border-green-200 text-center">
            <p className="text-xs text-gray-500 font-medium tracking-wide">Total Pembayaran</p>
            <p className="text-xl font-bold text-green-600 mt-0.5">RP {totalBiaya}</p>
          </div>

          {/* Tampilan Sisa Waktu */}
          <p className={`mt-5 text-sm font-bold tracking-wide transition-colors duration-300 ${
            timeLeft < 60 ? "text-red-500 animate-pulse" : "text-gray-500"
          }`}>
            Sisa waktu {formatTime(timeLeft)}
          </p>
        </div>

        {/* Button Aksi Konfirmasi */}
        <button 
          onClick={handleKirimData}
          disabled={isLoading}
          className="w-full max-w-md bg-[#4CAF50] hover:bg-[#43A047] text-white py-4 rounded-2xl font-bold shadow-lg transition-transform active:scale-[0.99] flex justify-center items-center gap-2"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : "Saya sudah bayar"}
        </button>

      </div>
    </main>
  );
}