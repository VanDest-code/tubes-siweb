"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Clock, Star, Package, Truck } from "lucide-react"; // <-- TAMBAHAN IKON
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const STATUS_FLOW = [
  "Menunggu Kurir",
  "Kurir Menuju Lokasi",
  "Paket Sudah Diambil",
  "Dalam Perjalanan",
  "Selesai"
];

function DetailPengirimanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resiQuery = searchParams.get("resi") || "";
  
  const [mounted, setMounted] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [ulasan, setUlasan] = useState("");

  useEffect(() => {
    setMounted(true);
    
    const fetchDetail = async () => {
      if (!resiQuery) return;
      try {
        const { data, error } = await supabase
          .from("shipments")
          .select("*")
          .eq("resi_number", resiQuery)
          .single();

        if (error) throw error;
        if (data) setDetailData(data);
      } catch (error) {
        console.error("Gagal mengambil detail resi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [resiQuery]);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50] mb-4"></div>
        <p className="font-black text-[#4CAF50]">Memuat Detail Pengiriman...</p>
      </div>
    );
  }

  if (!detailData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="font-black text-red-500 text-xl mb-4">Resi tidak ditemukan!</p>
        <button onClick={() => router.back()} className="bg-gray-200 px-6 py-2 rounded-xl font-bold">Kembali</button>
      </div>
    );
  }

  const dbStatus = (detailData.status || "").toLowerCase().trim();
  const isSelesai = dbStatus === "selesai";
  
  let currentStatusIndex = STATUS_FLOW.findIndex(s => s.toLowerCase() === dbStatus);
  if (currentStatusIndex === -1) {
    currentStatusIndex = 0; 
  }

  const trackingStatus = STATUS_FLOW.map((item, index) => {
    let visualStatus = "pending"; 
    if (index < currentStatusIndex) {
      visualStatus = "completed"; 
    } else if (index === currentStatusIndex) {
      visualStatus = "active"; 
    }
    
    return { 
      label: item, 
      desc: getStatusDescription(item),
      status: visualStatus 
    };
  });

  function getStatusDescription(status: string) {
    switch(status) {
      case "Menunggu Kurir": return "Permintaan Pickup sudah masuk, menunggu konfirmasi kurir";
      case "Kurir Menuju Lokasi": return "Kurir sedang dalam perjalanan ke alamat penjemputan";
      case "Paket Sudah Diambil": return "Paket sudah berhasil dijemput oleh kurir";
      case "Dalam Perjalanan": return "Paket sedang dikirim menuju alamat tujuan";
      case "Selesai": return "Paket sudah sampai dan diterima dengan selamat";
      default: return "";
    }
  }

  const proofImageUrl = detailData.bukti_foto_url || "https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=2070&auto=format&fit=crop";

  return (
    <main className="w-full flex flex-col items-center pt-10 pb-20 px-6 max-w-[1200px] mx-auto animate-in fade-in duration-500">
      
      <div className="w-full flex justify-start mb-4">
        <button 
          onClick={() => router.back()}
          className="text-gray-400 hover:text-gray-600 transition-all font-medium italic text-sm flex items-center gap-2 cursor-pointer"
        >
          ← Kembali
        </button>
      </div>

      <div className="w-full bg-white border border-black rounded-[40px] p-16 shadow-sm relative mb-8">
        <h2 className="text-[28px] font-black text-center mb-16 text-black">Detail Pengiriman</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          {/* --- KOLOM KIRI: INFO PAKET & STATUS TIMELINE --- */}
          <div className="space-y-12">
            
            <div className="bg-[#E8F5E9]/60 border border-[#4CAF50]/30 rounded-[20px] p-8 w-full max-w-[320px]">
              <p className="text-gray-400 text-[14px] font-medium mb-2">Nomor Resi</p>
              <p className="text-[#4CAF50] font-black text-[22px] tracking-tight">{detailData.resi_number}</p>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-6 text-[15px]">
              <div>
                <p className="text-gray-400 mb-1">Pengirim</p>
                <p className="text-black font-black">{detailData.sender_name}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Penerima</p>
                <p className="text-black font-black">{detailData.receiver_name}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Wilayah</p>
                <p className="text-black font-black">{detailData.destination_city || "Sleman"}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Ongkir</p>
                <p className="text-[#4CAF50] font-black">Rp {detailData.shipping_cost?.toLocaleString('id-ID') || "20.000"}</p>
              </div>
            </div>

            <div className="space-y-8 pt-4">
              <h3 className="text-[16px] font-black text-black">Status</h3>
              <div className="relative pl-2 space-y-12">
                <div className="absolute left-[20px] top-4 bottom-4 w-[1px] bg-gray-300"></div>

                {trackingStatus.map((item, idx) => (
                  <div key={idx} className="flex gap-10 relative items-start">
                    <div className={`z-10 w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${
                      item.status === "completed" ? "bg-[#E8F5E9] border-[#4CAF50] text-[#4CAF50]" :
                      item.status === "active" ? "bg-[#4CAF50] border-[#4CAF50] text-white shadow-lg shadow-green-100" :
                      "bg-[#E0E0E0] border-[#E0E0E0] text-gray-500"
                    }`}>
                      {item.status === "pending" ? <Clock size={20} /> : <Check size={20} strokeWidth={3} />}
                    </div>

                    <div className="pt-1">
                      <p className={`text-[16px] font-black leading-none mb-2 ${
                        item.status === "pending" ? "text-gray-400" : "text-black"
                      }`}>
                        {item.label}
                      </p>
                      <p className="text-[12px] text-gray-400 font-medium leading-relaxed max-w-[320px]">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* --- KOLOM KANAN: BUKTI PENGIRIMAN ATAU FILLER INFO AKTIF --- */}
          <div className="w-full flex flex-col h-full">
            {isSelesai ? (
              <div className="space-y-4">
                <h3 className="text-[16px] font-black text-black">Bukti Pengiriman</h3>
                <div className="w-full h-[320px] relative rounded-[20px] overflow-hidden border border-black bg-gray-50">
                  <img 
                    src={proofImageUrl} 
                    alt="Bukti Pengiriman"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ) : (
              // --- PENGISI BLANK SPACE UNTUK STATUS AKTIF ---
              <div className="flex flex-col items-end flex-grow w-full">
                {/* Badge Status (Sekarang Capslock) */}
                <span className="px-8 py-2 rounded-full text-xs font-black border bg-orange-50 border-orange-200 text-orange-600 mb-12">
                  {detailData.status?.toUpperCase()}
                </span>

                {/* Box Ilustrasi/Tips agar tidak kosong */}
                <div className="w-full mt-auto bg-[#F9FBF9] border-2 border-dashed border-gray-200 rounded-[30px] flex flex-col items-center justify-center p-10 text-center">
                  <div className="w-20 h-20 bg-white border border-gray-100 shadow-sm rounded-[20px] flex items-center justify-center mb-6 text-[#4CAF50]">
                    {dbStatus === "menunggu kurir" ? <Package size={36} strokeWidth={2.5} /> : <Truck size={36} strokeWidth={2.5} />}
                  </div>
                  <h3 className="font-black text-gray-800 text-lg mb-3">
                    {dbStatus === "menunggu kurir" ? "Menunggu Penjemputan" : "Paket Sedang Berjalan"}
                  </h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed max-w-[280px]">
                    {dbStatus === "menunggu kurir" 
                      ? "Pastikan barangmu sudah dikemas dengan rapi dan aman ya. Kurir kami akan segera tiba!" 
                      : "Duduk manis! Paketmu sedang dalam penanganan kurir kami untuk diantar dengan selamat."}
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Badge SELESAI Hijau di Pojok Kanan Atas Khusus Jika Selesai */}
        {isSelesai && (
          <div className="absolute top-16 right-16">
            <span className="px-8 py-2 rounded-full text-xs font-black border bg-[#E8F5E9] border-green-200 text-green-600">
              SELESAI
            </span>
          </div>
        )}

      </div>

      {isSelesai && (
        <div className="w-full bg-white border border-black rounded-[40px] p-12 shadow-sm text-center mb-8">
          <h3 className="font-black text-black mb-6">Paket sudah sampai! Yuk beri penilaian..</h3>
          
          <div className="flex justify-center gap-3 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
              >
                <Star 
                  size={40} 
                  className={`${
                    star <= (hoveredRating || rating) 
                      ? "fill-[#4CAF50] text-[#4CAF50]" 
                      : "text-gray-300"
                  } transition-colors`} 
                />
              </button>
            ))}
          </div>

          <textarea
            placeholder="Tulis ulasan (opsional)..."
            value={ulasan}
            onChange={(e) => setUlasan(e.target.value)}
            className="w-full bg-[#EBF5EB] border-transparent focus:border-[#4CAF50] focus:ring-0 rounded-[20px] p-5 text-sm mb-6 resize-none h-[120px] outline-none text-gray-700 placeholder:text-gray-400"
          ></textarea>

          <button 
            className={`w-full font-black py-5 rounded-[20px] text-lg transition-all active:scale-[0.98] ${
              rating > 0 
                ? "bg-[#4CAF50] text-white shadow-lg shadow-green-100 hover:bg-[#43A047]" 
                : "bg-[#E0E0E0] text-gray-400 cursor-not-allowed"
            }`}
            disabled={rating === 0}
          >
            Kirim Penilaian
          </button>
        </div>
      )}

    </main>
  );
}

export default function DetailPengirimanPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50] mb-4"></div>
        <p className="font-black text-[#4CAF50]">Memuat Detail Pengiriman...</p>
      </div>
    }>
      <DetailPengirimanContent />
    </Suspense>
  );
}