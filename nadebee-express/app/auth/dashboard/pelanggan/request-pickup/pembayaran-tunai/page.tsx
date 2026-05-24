"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react"; 

export default function TunaiPage() { 
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [totalBiaya, setTotalBiaya] = useState("20.000"); // Default 20rb

  // Opsional: Tarik data ongkir yang sudah dihitung dari halaman konfirmasi
  useEffect(() => {
    const savedCost = sessionStorage.getItem("totalOngkir");
    if (savedCost) {
      setTotalBiaya(parseInt(savedCost).toLocaleString('id-ID'));
    }
  }, []);

  const handleKirimData = async () => {
    setIsLoading(true);
    
    // 1. Ambil data form yang dititipkan di browser tadi
    const savedData = sessionStorage.getItem("pickupData");
    const savedCost = sessionStorage.getItem("totalOngkir");

    if (!savedData) {
      alert("Data form hilang, silakan isi ulang.");
      router.push("/auth/dashboard/pelanggan/request-pickup");
      return;
    }

    try {
      // 2. Tembak ke API backend kita
      const response = await fetch("/api/pickup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Kirim gabungan data form dan ongkir
        body: JSON.stringify({
            ...JSON.parse(savedData),
            shippingCost: parseInt(savedCost || "20000")
        })
      });

      const result = await response.json();

      if (response.ok) {
        // 3. Bersihkan memori sementara, lalu lempar nomor resi baru ke URL
        sessionStorage.clear();
        router.push(`/auth/dashboard/pelanggan/request-pickup/berhasil?resi=${result.resi}`);
      } else {
        alert("Terjadi kesalahan sistem!");
      }
    } catch (error) {
      alert("Gagal menghubungi server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <h2 className="text-2xl font-bold mb-2">Pembayaran Tunai</h2>
      <p className="text-gray-500 mb-8 text-sm">Lakukan pembayaran langsung saat kurir datang</p>
      
      <div className="bg-white border border-black rounded-[30px] p-10 w-full max-w-md shadow-sm mb-8">
        <span className="text-4xl mb-4 block">💵</span>
        <p className="font-bold text-lg mb-1">Bayar saat kurir datang ya..</p>
        <p className="text-gray-500">
          Siapkan uang tunai sebesar <span className="text-green-600 font-bold">Rp {totalBiaya}</span>
        </p>
      </div>

      <button 
        onClick={handleKirimData}
        disabled={isLoading}
        className="w-full max-w-md bg-[#4CAF50] text-white py-4 rounded-2xl font-bold flex justify-center items-center"
      >
        {isLoading ? <Loader2 className="animate-spin" /> : "Oke, saya mengerti"}
      </button>
    </div> // <-- INI TAG PENUTUP YANG HILANG SEBELUMNYA
  );
}