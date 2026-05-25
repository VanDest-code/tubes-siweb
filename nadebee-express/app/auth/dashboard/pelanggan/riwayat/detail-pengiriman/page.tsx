"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Clock, Star, Package, Truck, User } from "lucide-react"; 
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

  // State untuk Manajemen Rating & Ulasan
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [ulasan, setUlasan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const fetchDetail = async () => {
      if (!resiQuery) return;
      try {
        const { data, error } = await supabase
          .from("shipments")
          .select(`
            *,
            couriers (
              username,
              vehicle,
              phone
            )
          `)
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

  // ==========================================
  // LOGIKA INSERT RATING KE SUPABASE
  // ==========================================
  const submitRating = async () => {
    if (rating === 0 || !detailData) return;

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from("shipments")
        .update({
          rating: rating,
          review: ulasan
        })
        .eq("resi_number", resiQuery);

      if (error) throw error;

      // Sinkronkan state lokal agar UI langsung terkunci tanpa refresh manual
      setDetailData((prev: any) => ({
        ...prev,
        rating: rating,
        review: ulasan
      }));

    } catch (error) {
      console.error("Gagal mengirim penilaian:", error);
      alert("Gagal mengirim penilaian, silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  // Cek apakah data rating sudah tersimpan di database
  const hasBeenRated = detailData.rating && detailData.rating > 0;

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
            
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              {/* Box Nomor Resi */}
              <div className="bg-[#E8F5E9]/60 border border-[#4CAF50]/30 rounded-[20px] p-6 flex-1 flex flex-col justify-center">
                <p className="text-gray-400 text-[13px] font-bold mb-2 uppercase tracking-wider">Nomor Resi</p>
                <p className="text-[#4CAF50] font-black text-[22px] tracking-tight">{detailData.resi_number}</p>
              </div>

              {/* Box Info Kurir */}
              <div className="bg-white border border-gray-200 rounded-[20px] p-5 flex-1 shadow-sm flex flex-col justify-center">
                <p className="text-gray-400 text-[11px] font-bold mb-3 flex items-center gap-2 uppercase tracking-widest">
                  <Truck size={14} className="text-[#4CAF50]" /> Info Kurir
                </p>
                
                {detailData.couriers ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#E8F5E9] rounded-full flex items-center justify-center text-[#4CAF50] shrink-0">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="font-black text-[15px] text-black leading-tight">
                        {detailData.couriers.username}
                      </p>
                      <p className="text-[11px] font-medium text-gray-500 mt-1">
                        {detailData.couriers.vehicle}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-[12px] font-medium text-gray-400 italic">Mencari kurir terdekat...</p>
                )}
              </div>
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

          {/* --- KOLOM KANAN: BUKTI PENGIRIMAN --- */}
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
              <div className="flex flex-col items-end flex-grow w-full">
                <span className="px-8 py-2 rounded-full text-xs font-black border bg-orange-50 border-orange-200 text-orange-600 mb-12">
                  {detailData.status?.toUpperCase()}
                </span>

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

        {isSelesai && (
          <div className="absolute top-16 right-16">
            <span className="px-8 py-2 rounded-full text-xs font-black border bg-[#E8F5E9] border-green-200 text-green-600">
              SELESAI
            </span>
          </div>
        )}

      </div>

      {/* --- AREA FORM PENILAIAN / RATING --- */}
      {isSelesai && (
        <div className="w-full bg-white border border-black rounded-[40px] p-12 shadow-sm text-center mb-8">
          <h3 className="font-black text-black mb-6">
            {hasBeenRated ? "Penilaian Kamu Berhasil Dikirim" : "Paket sudah sampai! Yuk beri penilaian.."}
          </h3>
          
          {/* Looping Bintang Dinamis (Bisa mengunci otomatis) */}
          <div className="flex justify-center gap-3 mb-8">
            {[1, 2, 3, 4, 5].map((star) => {
              // Gunakan rating database jika sudah ada, jika tidak gunakan rating interaktif local
              const finalActiveStar = hasBeenRated ? detailData.rating : (hoveredRating || rating);
              const isActive = star <= finalActiveStar;

              if (hasBeenRated) {
                // RENDER BINTANG MATI (Tidak bisa di-hover / diklik)
                return (
                  <div key={star} className="transition-all">
                    <Star 
                      size={40} 
                      className={isActive ? "fill-[#4CAF50] text-[#4CAF50]" : "text-gray-300"} 
                    />
                  </div>
                );
              }

              // RENDER BINTANG AKTIF (Bisa di-hover / diklik untuk input pertama kali)
              return (
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
                    className={`${isActive ? "fill-[#4CAF50] text-[#4CAF50]" : "text-gray-300"} transition-colors`} 
                  />
                </button>
              );
            })}
          </div>

          {hasBeenRated ? (
            /* TAMPILAN TEXT REVIEW LOCK */
            <div className="w-full bg-[#F4F9F4] border border-green-200 rounded-[20px] p-6 text-sm font-semibold italic text-gray-600 max-w-[600px] mx-auto">
              "{detailData.review || "Tidak ada ulasan tertulis"}"
            </div>
          ) : (
            /* TAMPILAN INPUT FORM AKTIF */
            <>
              <textarea
                placeholder="Tulis ulasan (opsional)..."
                value={ulasan}
                onChange={(e) => setUlasan(e.target.value)}
                className="w-full bg-[#EBF5EB] border-transparent focus:border-[#4CAF50] focus:ring-0 rounded-[20px] p-5 text-sm mb-6 resize-none h-[120px] outline-none text-gray-700 placeholder:text-gray-400"
              ></textarea>

              <button 
                onClick={submitRating}
                disabled={rating === 0 || isSubmitting}
                className={`w-full font-black py-5 rounded-[20px] text-lg transition-all active:scale-[0.98] ${
                  rating > 0 && !isSubmitting
                    ? "bg-[#4CAF50] text-white shadow-lg shadow-green-100 hover:bg-[#43A047]" 
                    : "bg-[#E0E0E0] text-gray-400 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? "Mengirim Penilaian..." : "Kirim Penilaian"}
              </button>
            </>
          )}
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