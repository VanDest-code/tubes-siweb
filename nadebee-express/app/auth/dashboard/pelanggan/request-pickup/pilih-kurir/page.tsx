"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, MapPin, User } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Image from "next/image";
import { supabase } from "@/lib/supabase"; // Pastikan import supabase sudah benar

export default function PilihKurir() {
  const router = useRouter();
  
  // State untuk menyimpan data dari database
  const [couriers, setCouriers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State selectedCourier sekarang bertipe string (UUID dari Supabase)
  const [selectedCourier, setSelectedCourier] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState("");

  // 1. Tarik Data Kurir dari Supabase
  useEffect(() => {
    const fetchCouriers = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("couriers")
          .select("*")
          .order("rating", { ascending: false }); // Urutkan rating tertinggi di atas

        if (error) throw error;
        if (data) setCouriers(data);
      } catch (error) {
        console.error("Gagal menarik data kurir:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCouriers();
  }, []);

  // 2. Navigasi sambil membawa ID Kurir
  const handlePaymentNavigation = () => {
    if (!selectedCourier) {
      setError("Kurir wajib dipilih"); 
      return;
    }
    setError("");
    
    // Arahkan ke halaman konfirmasi sambil mengoper ID kurir lewat URL (?courier_id=...)
    router.push(`/auth/dashboard/pelanggan/request-pickup/konfirmasi?courier_id=${selectedCourier}`);
  };

  return (
    <main className="min-h-screen bg-[#F4F9F4] font-sans pb-20">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <section className="w-full max-w-[1100px] mx-auto pt-10 px-6 pb-24">
        <div className="mb-10">
          <h2 className="text-[28px] font-bold text-[#1A1A1A]">Pilih Kurir</h2>
          <p className="text-gray-500 text-sm">Pilih kurir yang tersedia di dekatmu</p>
        </div>

        <div className="w-full flex justify-start mb-6">
          <button 
            onClick={() => router.back()}
            className="text-gray-400 hover:text-gray-600 transition-all font-medium italic text-sm flex items-center gap-2 cursor-pointer"
          >
            ← Kembali
          </button>
        </div>
        
        <div className="space-y-4 mb-4">
          {/* Tampilkan loading state jika data masih ditarik */}
          {loading ? (
            <div className="text-center py-10 font-bold text-[#4CAF50] animate-pulse">
              Memuat daftar kurir...
            </div>
          ) : couriers.length > 0 ? (
            couriers.map((kurir) => (
              <div
                key={kurir.id}
                onClick={() => {
                  setSelectedCourier(kurir.id);
                  setError(""); 
                }}
                className={`bg-white border-2 rounded-[25px] p-6 flex items-center justify-between cursor-pointer transition-all duration-200 ${
                  selectedCourier === kurir.id 
                    ? "border-[#4CAF50] bg-[#F0FDF4] shadow-md" 
                    : "border-green-100 hover:border-green-300"
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-[#E8F5E9] rounded-2xl flex items-center justify-center shrink-0">
                    <User size={32} className="text-[#4CAF50]" />
                  </div>
                  <div>
                    {/* Menggunakan kurir.username sesuai nama kolom di database */}
                    <h3 className="text-lg font-bold text-[#1A1A1A]">{kurir.username}</h3>
                    <p className="text-gray-500 text-sm font-semibold">{kurir.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm shrink-0">
                  <Star size={18} className="fill-yellow-400 text-yellow-400" />
                  {/* Rating dari database */}
                  <span className="font-bold text-[#1A1A1A]">
                    {Number(kurir.rating).toFixed(1)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-400 italic">
              Tidak ada kurir yang tersedia saat ini.
            </div>
          )}
        </div>

        {/* Tampilan Error */}
        {error && (
          <p className="text-red-500 italic text-sm mb-8 ml-2">{error}</p>
        )}

        <button
          onClick={handlePaymentNavigation}
          className={`w-full py-5 rounded-[25px] font-bold text-lg transition-all shadow-lg ${
            selectedCourier
              ? "bg-[#4CAF50] text-white hover:bg-[#43A047]"
              : "bg-gray-300 text-gray-500 cursor-pointer" 
          }`}
        >
          Lanjutkan Pembayaran
        </button>
      </section>
    </main>
  );
}