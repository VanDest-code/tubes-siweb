"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Clock, Star, Package, Truck, User, Phone, XCircle, Frown } from "lucide-react";
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

  const submitRating = async () => {
    if (rating === 0 || !detailData) return;

    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from("shipments")
        .update({
          rating: rating,
          review: ulasan
        })
        .eq("resi_number", resiQuery)
        .select(); 

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error("Update diblokir oleh keamanan database (RLS)!");
      }

      setDetailData((prev: any) => ({
        ...prev,
        rating: rating,
        review: ulasan
      }));

    } catch (error: any) {
      console.error("Gagal mengirim penilaian:", error);
      alert(`Gagal mengirim! Pastikan RLS di tabel shipments Supabase sudah dimatikan (Disable). Error: ${error.message}`);
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

  // --- LOGIKA STATUS FIX ---
  const dbStatus = (detailData.status || "").toLowerCase().trim();
  const isSelesai = dbStatus === "selesai";
  const isDitolak = dbStatus === "ditolak" || dbStatus === "dibatalkan";
  
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
    <main className="w-full flex flex-col items-center pt-6 md:pt-10 pb-20 px-4 md:px-6 max-w-[1200px] mx-auto animate-in fade-in duration-500">
      
      <div className="w-full flex justify-start mb-4">
        <button 
          onClick={() => router.back()}
          className="text-gray-400 hover:text-gray-600 transition-all font-medium italic text-xs md:text-sm flex items-center gap-2 cursor-pointer"
        >
          ← Kembali
        </button>
      </div>

      <div className="w-full bg-white border border-black rounded-[24px] md:rounded-[40px] p-6 md:p-16 shadow-sm relative mb-8">
        <h2 className="text-[22px] md:text-[28px] font-black text-center mb-8 md:mb-16 text-black pr-16 md:pr-0">Detail Pengiriman</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-start">
          
          {/* --- KOLOM KIRI: INFO PAKET & STATUS TIMELINE --- */}
          <div className="space-y-8 md:space-y-12">
            
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <div className="bg-[#E8F5E9]/60 border border-[#4CAF50]/30 rounded-[20px] p-5 md:p-6 flex-1 flex flex-col justify-center">
                <p className="text-gray-400 text-[11px] md:text-[13px] font-bold mb-2 uppercase tracking-wider">Nomor Resi</p>
                <p className="text-[#4CAF50] font-black text-lg md:text-[22px] tracking-tight">{detailData.resi_number}</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-[20px] p-4 md:p-5 flex-1 shadow-sm flex flex-col justify-center">
                <p className="text-gray-400 text-[10px] md:text-[11px] font-bold mb-3 uppercase tracking-widest">
                  Info Kurir
                </p>
                
                {detailData.couriers ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#E8F5E9] rounded-full flex items-center justify-center text-[#4CAF50] shrink-0">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="font-black text-[14px] md:text-[15px] text-black leading-tight">
                        {detailData.couriers.username}
                      </p>
                      <p className="text-[11px] md:text-[12px] font-bold text-[#4CAF50] mt-1 flex items-center gap-1">
                        <Phone size={12} strokeWidth={2.5} /> {detailData.couriers.phone || "-"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] md:text-[12px] font-medium text-gray-400 italic">
                    {isDitolak ? "Kurir dibatalkan" : "Mencari kurir terdekat..."}
                  </p>
                )}
              </div>
            </div>

            {/* Ubah grid-cols-2 menjadi grid-cols-2 lg:grid-cols-3 agar muat lebih banyak */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-2 md:gap-x-4 gap-y-4 md:gap-y-6 text-[13px] md:text-[15px]">
              <div className="col-span-1">
                <p className="text-gray-400 mb-1">Pengirim</p>
                <p className="text-black font-black">{detailData.sender_name}</p>
              </div>
              <div className="col-span-1">
                <p className="text-gray-400 mb-1">Penerima</p>
                <p className="text-black font-black">{detailData.receiver_name}</p>
              </div>
              <div className="col-span-1 lg:col-span-1">
                <p className="text-gray-400 mb-1">Wilayah</p>
                <p className="text-black font-black">{detailData.destination_city || "Sleman"}</p>
              </div>
              
              {/* --- TAMBAHAN JENIS BARANG & BERAT --- */}
              <div className="col-span-1">
                <p className="text-gray-400 mb-1">Jenis Barang</p>
                <p className="text-black font-black">{detailData.item_category || "Paket"}</p>
              </div>
              <div className="col-span-1">
                <p className="text-gray-400 mb-1">Berat</p>
                <p className="text-black font-black">{detailData.weight_range || "-"}</p>
              </div>
              
              <div className="col-span-2 lg:col-span-1 border-t lg:border-t-0 pt-3 lg:pt-0 border-gray-100">
                <p className="text-gray-400 mb-1">Ongkir</p>
                <p className="text-[#4CAF50] font-black">Rp {detailData.shipping_cost?.toLocaleString('id-ID') || "20.000"}</p>
              </div>
            </div>

            <div className="space-y-6 md:space-y-8 pt-4">
              <h3 className="text-[16px] font-black text-black">Status</h3>
              <div className="relative pl-2 space-y-10 md:space-y-12">
                
                {/* TIMELINE RENDER BERDASARKAN STATUS DITOLAK ATAU TIDAK */}
                {isDitolak ? (
                  <div className="flex gap-6 md:gap-10 relative items-start animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="z-10 w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border-2 transition-all duration-300 bg-red-50 border-red-500 text-red-500 shadow-lg shadow-red-100">
                      <XCircle size={20} strokeWidth={3} />
                    </div>
                    <div className="pt-1">
                      <p className="text-[14px] md:text-[16px] font-black leading-none mb-1.5 md:mb-2 text-red-600">
                        Pengiriman Ditolak
                      </p>
                      <p className="text-[11px] md:text-[12px] text-red-400 font-medium leading-relaxed max-w-[320px]">
                        Mohon maaf, kurir tidak dapat memproses pesanan ini atau pesanan telah dibatalkan.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="absolute left-[20px] top-4 bottom-4 w-[1px] bg-gray-300"></div>
                    {trackingStatus.map((item, idx) => (
                      <div key={idx} className="flex gap-6 md:gap-10 relative items-start">
                        <div className={`z-10 w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${
                          item.status === "completed" ? "bg-[#E8F5E9] border-[#4CAF50] text-[#4CAF50]" :
                          item.status === "active" ? "bg-[#4CAF50] border-[#4CAF50] text-white shadow-lg shadow-green-100" :
                          "bg-[#E0E0E0] border-[#E0E0E0] text-gray-500"
                        }`}>
                          {item.status === "pending" ? <Clock size={20} /> : <Check size={20} strokeWidth={3} />}
                        </div>

                        <div className="pt-1">
                          <p className={`text-[14px] md:text-[16px] font-black leading-none mb-1.5 md:mb-2 ${
                            item.status === "pending" ? "text-gray-400" : "text-black"
                          }`}>
                            {item.label}
                          </p>
                          <p className="text-[11px] md:text-[12px] text-gray-400 font-medium leading-relaxed max-w-[320px]">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

          </div>

          {/* --- KOLOM KANAN: BUKTI PENGIRIMAN --- */}
          <div className="w-full flex flex-col h-full">
            {isSelesai ? (
              <div className="space-y-4">
                <h3 className="text-[16px] font-black text-black">Bukti Pengiriman</h3>
                <div className="w-full h-[240px] md:h-[320px] relative rounded-[20px] overflow-hidden border border-black bg-gray-50">
                  <img 
                    src={proofImageUrl} 
                    alt="Bukti Pengiriman"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ) : isDitolak ? (
              <div className="flex flex-col items-center justify-center flex-grow w-full mt-8 md:mt-0 animate-in fade-in duration-500">
                <div className="w-full bg-red-50 border-2 border-dashed border-red-200 rounded-[24px] md:rounded-[30px] flex flex-col items-center justify-center p-8 md:p-12 text-center h-[280px] md:h-[360px]">
                  <div className="mb-4 md:mb-6 text-red-400">
                    <Frown size={64} strokeWidth={2} />
                  </div>
                  <h3 className="font-black text-red-600 text-lg md:text-xl mb-2 md:mb-3">
                    Yah, pesananmu ditolak.
                  </h3>
                  <p className="text-[12px] md:text-[14px] text-red-400 font-medium leading-relaxed max-w-[280px]">
                    Kurir tidak dapat memproses pesanan ini. Silakan buat permohonan request pickup baru ya.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-end flex-grow w-full">
                <span className={`px-6 md:px-8 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-black border mb-8 md:mb-12 ${
                  dbStatus === "selesai" 
                    ? "bg-[#E8F5E9] border-green-200 text-green-600" 
                    : dbStatus === "dalam perjalanan"
                    ? "bg-purple-50 border-purple-200 text-purple-600"
                    : dbStatus === "paket sudah diambil"
                    ? "bg-blue-50 border-blue-200 text-blue-600"
                    : dbStatus === "ditolak" || dbStatus === "dibatalkan"
                    ? "bg-red-50 border-red-200 text-red-600"
                    : "bg-orange-50 border-orange-200 text-orange-600"
                }`}>
                  {(detailData.status || "").toUpperCase()}
                </span>

                <div className="w-full mt-auto bg-[#F9FBF9] border-2 border-dashed border-gray-200 rounded-[24px] md:rounded-[30px] flex flex-col items-center justify-center p-6 md:p-10 text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white border border-gray-100 shadow-sm rounded-[16px] md:rounded-[20px] flex items-center justify-center mb-4 md:mb-6 text-[#4CAF50]">
                    {dbStatus === "menunggu kurir" ? <Package size={32} strokeWidth={2.5} className="md:w-9 md:h-9" /> : <Truck size={32} strokeWidth={2.5} className="md:w-9 md:h-9" />}
                  </div>
                  <h3 className="font-black text-gray-800 text-base md:text-lg mb-2 md:mb-3">
                    {dbStatus === "menunggu kurir" ? "Menunggu Penjemputan" : "Paket Sedang Berjalan"}
                  </h3>
                  <p className="text-[12px] md:text-[13px] text-gray-500 leading-relaxed max-w-[280px]">
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
          <div className="absolute top-6 right-6 md:top-16 md:right-16">
            <span className="px-4 md:px-8 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-black border bg-[#E8F5E9] border-green-200 text-green-600">
              SELESAI
            </span>
          </div>
        )}

      </div>

      {isSelesai && (
        <div className="w-full bg-white border border-black rounded-[24px] md:rounded-[40px] p-6 md:p-12 shadow-sm text-center mb-8">
          
          {detailData?.rating && detailData.rating > 0 ? (
            <div className="animate-in fade-in zoom-in duration-500">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={28} strokeWidth={3} className="md:w-8 md:h-8" />
              </div>
              <h3 className="font-black text-black mb-4 text-sm md:text-base">Terima Kasih atas Penilaianmu!</h3>
              <div className="flex justify-center gap-1 md:gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={28} 
                    className={`md:w-8 md:h-8 ${star <= detailData.rating ? "fill-[#4CAF50] text-[#4CAF50]" : "text-gray-200"}`} 
                  />
                ))}
              </div>
              <p className="text-gray-500 italic text-xs md:text-sm">
                "{detailData.review || "Tidak ada ulasan tertulis"}"
              </p>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              <h3 className="font-black text-black mb-4 md:mb-6 text-sm md:text-base">Paket sudah sampai! Yuk beri penilaian..</h3>
              
              <div className="flex justify-center gap-2 md:gap-3 mb-6 md:mb-8">
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
                      size={36} 
                      className={`md:w-10 md:h-10 ${
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
                className="w-full bg-[#EBF5EB] border-transparent focus:border-[#4CAF50] focus:ring-0 rounded-[20px] p-4 md:p-5 text-sm mb-6 resize-none h-[100px] md:h-[120px] outline-none text-gray-700 placeholder:text-gray-400"
              ></textarea>

              <button 
                onClick={submitRating}
                disabled={rating === 0 || isSubmitting}
                className={`w-full font-black py-4 md:py-5 rounded-[20px] text-base md:text-lg transition-all active:scale-[0.98] ${
                  rating > 0 && !isSubmitting
                    ? "bg-[#4CAF50] text-white shadow-lg shadow-green-100 hover:bg-[#43A047]" 
                    : "bg-[#E0E0E0] text-gray-400 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? "Mengirim Penilaian..." : "Kirim Penilaian"}
              </button>
            </div>
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