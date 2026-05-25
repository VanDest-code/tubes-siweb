"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Image from "next/image";
import { supabase } from "@/lib/supabase"; // Pastikan path impor ini sesuai dengan struktur proyekmu

function KonfirmasiPickupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courierId = searchParams.get("courier_id"); // Menangkap ID Kurir dari URL query parameter

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [error, setError] = useState("");
  
  // State untuk data dinamis
  const [pickupData, setPickupData] = useState<any>(null);
  const [totalOngkir, setTotalOngkir] = useState<number>(0);
  const [courierName, setCourierName] = useState<string>("Memuat...");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // 1. Ambil data sementara dari halaman form
    const savedData = sessionStorage.getItem("pickupData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setPickupData(parsedData);

      // 2. Logika Hitung Harga Dasar berdasarkan Wilayah Tujuan
      let basePrice = 20000;
      switch (parsedData.destination) {
        case "Sleman": basePrice = 20000; break;
        case "Kota Yogyakarta": basePrice = 23000; break;
        case "Bantul": basePrice = 30000; break;
        case "Kulon Progo": basePrice = 40000; break;
        case "Gunung Kidul": basePrice = 50000; break;
      }

      // 3. Logika Hitung Faktor Pengali berdasarkan Prediksi Berat Barang
      let multiplier = 1.0; // Default untuk < 1 kg
      if (parsedData.weight === "1-5 kg") multiplier = 1.25; // Kenaikan 25%
      if (parsedData.weight === "5-10 kg") multiplier = 1.50; // Kenaikan 50%

      // 4. Set hasil kalkulasi akhir ke state
      setTotalOngkir(basePrice * multiplier);
    }
  }, []);

  // Ambil nama kurir dari database Supabase secara dinamis
  useEffect(() => {
    const fetchCourierName = async () => {
      if (!courierId) {
        setCourierName("Belum dipilih");
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from("couriers")
          .select("username")
          .eq("id", courierId)
          .single();
          
        if (error) throw error;
        if (data) {
          setCourierName(data.username);
        } else {
          setCourierName("Kurir tidak ditemukan");
        }
      } catch (err) {
        console.error("Gagal mengambil nama kurir:", err);
        setCourierName("Gagal memuat nama kurir");
      }
    };

    if (mounted) {
      fetchCourierName();
    }
  }, [courierId, mounted]);

  const handlePayment = () => {
    if (!paymentMethod) {
      setError("Metode pembayaran wajib dipilih");
      return;
    }

    // Titipkan metode pembayaran dan total ongkir akhir ke sessionStorage
    sessionStorage.setItem("paymentMethod", paymentMethod);
    sessionStorage.setItem("totalOngkir", totalOngkir.toString());

    // Titipkan ID Kurir agar nanti halaman sukses bayar bisa melakukan INSERT ke database dengan benar
    if (courierId) {
      sessionStorage.setItem("selectedCourierId", courierId);
    }

    if (paymentMethod === "Tunai") {
      router.push("/auth/dashboard/pelanggan/request-pickup/pembayaran-tunai");
    } else {
      router.push("/auth/dashboard/pelanggan/request-pickup/pembayaran-nontunai");
    }
  };

  // Mencegah error hydration Next.js sebelum data sessionStorage termuat sepenuhnya
  if (!mounted || !pickupData) return null;

  return (
    <main className="min-h-screen bg-[#F4F9F4] font-sans pb-20">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <section className="max-w-[1200px] mx-auto pt-12 px-6">
        <div className="mb-10">
          <h2 className="text-[28px] font-bold text-[#1A1A1A]">Konfirmasi Pickup</h2>
          <p className="text-gray-500 text-sm">Request pickup kamu sudah masuk!</p>
        </div>

        {/* Pembungkus Utama Dua Kolom */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 w-full">
          
          {/* Sisi Kiri: Ringkasan Card */}
          <div className="w-full lg:w-[60%]">
            <div className="bg-white border border-green-400 rounded-[30px] p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-6">Ringkasan</h3>
              
              <div className="space-y-4 text-[15px] border-b border-gray-100 pb-6 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Pengirim → Penerima</span>
                  <span className="text-[#4CAF50] font-semibold text-right">
                    {pickupData.senderName} → {pickupData.receiverName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Alamat Tujuan</span>
                  <span className="text-[#4CAF50] font-semibold text-right truncate max-w-[250px]">
                    {pickupData.receiverAddress}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Jenis Barang</span>
                  <span className="text-[#4CAF50] font-semibold">{pickupData.itemType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Berat</span>
                  <span className="text-[#4CAF50] font-semibold">{pickupData.weight}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Pembayaran</span>
                  <span className="text-[#4CAF50] font-semibold">{paymentMethod || "-"}</span>
                </div>
                {/* Bagian Kurir Terpilih secara Otomatis dari Database */}
                <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-2">
                  <span className="text-gray-400">Kurir Terpilih</span>
                  <span className="text-[#4CAF50] font-bold">
                    {courierName}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-lg">Total Ongkir</span>
                <span className="font-bold text-lg text-[#4CAF50]">
                  Rp. {totalOngkir.toLocaleString('id-ID')}
                </span>
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
              
              {error && (
                <p className="text-red-500 italic text-[12px] mt-2 ml-1">{error}</p>
              )}
            </div>
          </div>

          {/* Sisi Kanan: Gambar Ilustrasi */}
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

        </div>

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

// Wrapper utama dengan Suspense demi standar Next.js App Router
export default function KonfirmasiPickupPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <p className="font-bold text-[#4CAF50] animate-pulse">Memuat data konfirmasi...</p>
      </div>
    }>
      <KonfirmasiPickupContent />
    </Suspense>
  );
}