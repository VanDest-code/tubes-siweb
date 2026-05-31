"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, MapPin, User, Truck } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import { supabase } from "@/lib/supabase";

export default function PilihKurir() {
  const router = useRouter();
  
  const [couriers, setCouriers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourier, setSelectedCourier] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState("");
  const [targetVehicle, setTargetVehicle] = useState("Motor"); // Untuk judul

  // 1. Tarik Data Kurir (DIFILTER BERDASARKAN ARMADA)
  useEffect(() => {
    const fetchCouriers = async () => {
      try {
        setLoading(true);
        
        // Baca data dari halaman sebelumnya
        const pickupDataRaw = sessionStorage.getItem("pickupData");
        let requiredVehicle = "Motor"; // Default aman
        
        if (pickupDataRaw) {
          const parsed = JSON.parse(pickupDataRaw);
          if (parsed.vehicleType) requiredVehicle = parsed.vehicleType;
        }
        
        setTargetVehicle(requiredVehicle); // Simpan state untuk UI

        // Tarik data dengan filter .eq("jenis_kendaraan")
        const { data, error } = await supabase
          .from("couriers")
          .select("*")
          .eq("jenis_kendaraan", requiredVehicle)
          .order("rating", { ascending: false });

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

  const handlePaymentNavigation = () => {
    if (!selectedCourier) {
      setError("Kurir wajib dipilih"); 
      return;
    }
    setError("");
    router.push(`/auth/dashboard/pelanggan/request-pickup/konfirmasi?courier_id=${selectedCourier}`);
  };

  return (
    <main className="min-h-screen bg-[#F4F9F4] font-sans pb-20">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <section className="w-full max-w-[1100px] mx-auto pt-10 px-6 pb-24">
        <div className="mb-10">
          <h2 className="text-[28px] font-bold text-[#1A1A1A]">Pilih Kurir {targetVehicle}</h2>
          <p className="text-gray-500 text-sm">Hanya menampilkan kurir dengan armada {targetVehicle} di sekitarmu</p>
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
          {loading ? (
            <div className="text-center py-10 font-bold text-[#4CAF50] animate-pulse">
              Mencari kurir dengan {targetVehicle}...
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
                {/* --- KARTU KURIR KIRI --- */}
                <div className="flex items-center gap-6">
                  
                  {/* FOTO KURIR DINAMIS */}
                  <div className="w-16 h-16 bg-[#E8F5E9] rounded-2xl flex items-center justify-center shrink-0 overflow-hidden border border-green-200">
                    {kurir.avatar_url ? (
                      <img src={kurir.avatar_url} alt={`Foto ${kurir.username}`} className="w-full h-full object-cover" />
                    ) : (
                      <User size={32} className="text-[#4CAF50]" />
                    )}
                  </div>
                  
                  {/* INFO KURIR */}
                  <div>
                    <h3 className="text-lg font-bold text-[#1A1A1A] mb-0.5">{kurir.username}</h3>
                    <p className="text-gray-500 text-sm font-semibold mb-2">{kurir.phone}</p>

                    {/* KENDARAAN DAN PLAT NOMOR */}
                    <div className="flex gap-2">
                       <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                         {kurir.jenis_kendaraan}
                       </span>
                       <span className="bg-gray-100 text-gray-600 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider border border-gray-200">
                         {kurir.plat_nomor}
                       </span>
                    </div>
                  </div>
                </div>

                {/* --- KARTU KURIR KANAN (RATING) --- */}
                <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm shrink-0 border border-gray-100">
                  <Star size={18} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-[#1A1A1A]">
                    {Number(kurir.rating).toFixed(1)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-white rounded-[25px] border border-gray-200">
              <p className="text-gray-500 font-bold">Waduh!</p>
              <p className="text-gray-400 text-sm">Tidak ada kurir dengan armada {targetVehicle} yang tersedia saat ini. Coba lagi nanti!</p>
            </div>
          )}
        </div>

        {error && (
          <p className="text-red-500 italic text-sm mb-8 ml-2">{error}</p>
        )}

        <button
          onClick={handlePaymentNavigation}
          disabled={!selectedCourier}
          className={`w-full py-5 rounded-[25px] font-bold text-lg transition-all shadow-lg ${
            selectedCourier
              ? "bg-[#4CAF50] text-white hover:bg-[#43A047]"
              : "bg-gray-300 text-gray-400 cursor-not-allowed" 
          }`}
        >
          Lanjutkan Pembayaran
        </button>
      </section>
    </main>
  );
}