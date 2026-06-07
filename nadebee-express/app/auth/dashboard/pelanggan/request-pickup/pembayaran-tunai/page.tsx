"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Banknote } from "lucide-react"; // <-- Mengganti emoji dengan Banknote
import { supabase } from "@/lib/supabase"; 

export default function TunaiPage() { 
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [totalBiaya, setTotalBiaya] = useState("20.000");

  useEffect(() => {
    const savedCost = sessionStorage.getItem("totalOngkir");
    if (savedCost) {
      setTotalBiaya(parseInt(savedCost).toLocaleString('id-ID'));
    }
  }, []);

  const handleKirimData = async () => {
    setIsLoading(true);
    
    const savedData = sessionStorage.getItem("pickupData");
    const savedCost = sessionStorage.getItem("totalOngkir");
    const savedCourierId = sessionStorage.getItem("selectedCourierId");
    const savedPayment = sessionStorage.getItem("paymentMethod");

    if (!savedData) {
      alert("Data form hilang, silakan isi ulang.");
      router.push("/auth/dashboard/pelanggan/request-pickup");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const response = await fetch("/api/pickup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...JSON.parse(savedData),
            shippingCost: parseInt(savedCost || "20000"),
            courier_id: savedCourierId,
            payment_method: savedPayment || "Tunai",
            customer_email: user?.email 
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
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 md:px-6">
      <h2 className="text-xl md:text-2xl font-bold mb-2">Pembayaran Tunai</h2>
      <p className="text-gray-500 mb-6 md:mb-8 text-xs md:text-sm">Lakukan pembayaran langsung saat kurir datang</p>
      
      <div className="bg-white border border-black rounded-[24px] md:rounded-[30px] p-6 md:p-10 w-full max-w-md shadow-sm mb-6 md:mb-8 flex flex-col items-center">
        {/* Ikon Banknote menggantikan emoji 💵 */}
        <div className="mb-4">
           <Banknote size={48} className="text-[#4CAF50]" strokeWidth={1.5} />
        </div>
        <p className="font-bold text-base md:text-lg mb-1">Bayar saat kurir datang ya..</p>
        <p className="text-gray-500 text-sm md:text-base">
          Siapkan uang tunai sebesar <span className="text-green-600 font-bold">Rp {totalBiaya}</span>
        </p>
      </div>

      <button 
        onClick={handleKirimData}
        disabled={isLoading}
        className="w-full max-w-md bg-[#4CAF50] hover:bg-[#43A047] transition-all text-white py-3.5 md:py-4 rounded-[20px] md:rounded-2xl font-bold flex justify-center items-center shadow-lg text-sm md:text-base"
      >
        {isLoading ? <Loader2 className="animate-spin" /> : "Oke, saya mengerti"}
      </button>
    </div>
  );
}