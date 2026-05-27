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
    
    // Ambil data form, ongkir, id kurir, dan metode pembayaran dari sessionStorage
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
        // Kirim semuanya ke API backend
        body: JSON.stringify({
            ...JSON.parse(savedData),
            shippingCost: parseInt(savedCost || "20000"),
            courier_id: savedCourierId,
            payment_method: savedPayment || "Tunai" // <-- Kirim ke API Backend
        })
      });

      const result = await response.json();

      if (response.ok) {
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