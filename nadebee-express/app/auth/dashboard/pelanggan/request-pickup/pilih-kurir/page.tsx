"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, MapPin, User } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Image from "next/image";

interface Courier {
  id: number;
  name: string;
  vehicle: string;
  rating: number;
  distance: string;
}

const COURIER_DATA: Courier[] = [
  { id: 1, name: "Budioanto", vehicle: "Motor Vario", rating: 4.7, distance: "0.8 dari lokasimu" },
  { id: 2, name: "Arnold", vehicle: "Motor Honda Beat", rating: 5.0, distance: "0.8 dari lokasimu" },
  { id: 3, name: "Budioanto", vehicle: "Mobil Avanza", rating: 4.7, distance: "0.8 dari lokasimu" },
];

export default function PilihKurir() {
  const router = useRouter();
  const [selectedCourier, setSelectedCourier] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState("");

  const handlePaymentNavigation = () => {
    if (!selectedCourier) {
      setError("Kurir wajib dipilih"); // Sesuai permintaan gambar error
      return;
    }
    setError("");
    // Arahkan ke halaman konfirmasi/pembayaran
    router.push("/auth/dashboard/pelanggan/request-pickup/konfirmasi");
  };

  return (
    <main className="min-h-screen bg-[#F4F9F4] font-sans pb-20">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* <header className="h-20 bg-white flex items-center px-8 sticky top-0 z-30 justify-between border-b border-gray-100">
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
      </header> */}
      
      <section className="w-full max-w-[1100px] mx-auto pt-10 px-6 pb-24">
        <div className="mb-10">
          <h2 className="text-[28px] font-bold text-[#1A1A1A]">Pilih Kurir</h2>
          <p className="text-gray-500 text-sm">Pilih kurir yang tersedia di dekatmu</p>
        </div>

        <div className="space-y-4 mb-4">
          {COURIER_DATA.map((kurir) => (
            <div
              key={kurir.id}
              onClick={() => {
                setSelectedCourier(kurir.id);
                setError(""); // Hilangkan error saat kurir dipilih
              }}
              className={`bg-white border-2 rounded-[25px] p-6 flex items-center justify-between cursor-pointer transition-all duration-200 ${
                selectedCourier === kurir.id 
                  ? "border-[#4CAF50] bg-[#F0FDF4] shadow-md" 
                  : "border-green-100 hover:border-green-300"
              }`}
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-[#E8F5E9] rounded-2xl flex items-center justify-center">
                  <User size={32} className="text-[#4CAF50]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1A1A1A]">{kurir.name}</h3>
                  <p className="text-gray-500 text-sm font-semibold">{kurir.vehicle}</p>
                  <div className="flex items-center gap-1 mt-1 text-gray-400">
                    <MapPin size={14} />
                    <span className="text-[12px] font-medium">{kurir.distance}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm">
                <Star size={18} className="fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-[#1A1A1A]">{kurir.rating.toFixed(1)}</span>
              </div>
            </div>
          ))}
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