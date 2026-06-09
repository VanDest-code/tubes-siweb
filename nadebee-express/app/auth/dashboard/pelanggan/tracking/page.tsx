"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Package, AlertCircle, CheckCircle, Clock, ArrowLeft, ArrowRight, Loader2, User } from "lucide-react";
import { supabase } from "@/lib/supabase";

function TrackingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [currentData, setCurrentData] = useState<any>(null); 
  const [showDetail, setShowDetail] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchError, setSearchError] = useState(false); 

  const getStatusStyle = (rawStatus: string) => {
    const statusStr = (rawStatus || "").toLowerCase().trim();
    switch (statusStr) {
      case "menunggu kurir": return "bg-orange-50 text-orange-500 border-orange-200"; 
      case "kurir menuju lokasi": return "bg-orange-50 text-orange-500 border-orange-200"; 
      case "paket sudah diambil": return "bg-blue-50 text-blue-500 border-blue-200"; 
      case "dalam perjalanan": return "bg-purple-50 text-purple-500 border-purple-200"; 
      case "selesai": return "bg-green-50 text-green-500 border-green-200"; 
      default: return "bg-gray-50 text-gray-400 border-gray-200";
    }
  };

  const performSearch = async (query: string, autoShowDetail: boolean = false) => {
    setStatus("loading");
    if (!autoShowDetail) setShowDetail(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) {
        throw new Error("Sesi login tidak ditemukan");
      }

      const response = await fetch(`/api/tracking/${query}`, { cache: "no-store" });
      
      if (!response.ok) {
        throw new Error("NOMOR RESI TIDAK DITEMUKAN"); 
      }

      const data = await response.json();

      const emailDatabase = data.email_pelanggan ? data.email_pelanggan.toLowerCase().trim() : "";
      const emailLogin = user.email ? user.email.toLowerCase().trim() : "";

      if (emailDatabase && emailDatabase !== emailLogin) {
        throw new Error("AKSES DITOLAK: RESI BUKAN MILIK ANDA"); 
      }

      setCurrentData(data);
      setStatus("success");
      
      if (autoShowDetail) {
        setShowDetail(true);
      }
    } catch (error) {
      setCurrentData(null);
      setStatus("error");
      setErrorMessage((error as Error).message);
    }
  };

  useEffect(() => { 
    setMounted(true); 
    const resiFromUrl = searchParams.get("resi");
    if (resiFromUrl) {
      setSearchQuery(resiFromUrl);
      performSearch(resiFromUrl, true);
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toUpperCase().trim();
    
    if (!query) {
      setSearchError(true);
      return;
    }
    
    setSearchError(false);
    router.replace('/auth/dashboard/pelanggan/tracking');
    performSearch(query, false);
  };

  const handleOpenDetail = () => {
    setShowDetail(true);
    router.push(`/auth/dashboard/pelanggan/tracking?resi=${searchQuery.toUpperCase()}`);
  };

  const handleBackToSearch = () => {
    setShowDetail(false);
    router.push('/auth/dashboard/pelanggan/tracking');
  };

  if (!mounted) return null;

  // === TAMPILAN DETAIL TRACKING (LEBAR DISAMAKAN: max-w-[1100px]) ===
  if (showDetail && status === "success" && currentData) {
    return (
      <main className="min-h-screen bg-[#F4F9F4] font-poppins w-full flex flex-col pt-12 pb-20 px-6 animate-in fade-in duration-500 overflow-x-hidden">
        <div className="w-full max-w-[1100px] mx-auto">
          <button onClick={handleBackToSearch} className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-6 font-medium italic transition-all w-fit">
            <ArrowLeft size={18} /> Kembali
          </button>

          <div className="bg-white rounded-[32px] p-6 md:p-10 border border-gray-200 shadow-sm space-y-8 md:space-y-12 w-full">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                <div>
                  <p className="text-[14px] font-black text-gray-900 mb-4 tracking-tight">{searchQuery.toUpperCase()}</p>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Pengirim</p>
                  <p className="text-[15px] font-black text-gray-900 leading-none">{currentData.pengirim}</p>
                  <p className="text-[11px] text-gray-400 font-bold mt-2 tracking-widest uppercase">Wilayah</p>
                  <p className="text-[14px] font-black text-gray-800">{currentData.wilayah}</p>
                </div>
                <div className="pt-0 sm:pt-8">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Penerima</p>
                  <p className="text-[15px] font-black text-gray-900 leading-none">{currentData.penerima}</p>
                  <p className="text-[11px] text-gray-400 font-bold mt-2 tracking-widest uppercase">Ongkir</p>
                  <p className="text-[15px] font-black text-green-600 tracking-tighter">{currentData.ongkir}</p>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(currentData.status)}`}>
                {currentData.status}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div>
                <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-widest mb-8">Status</h4>
                <div className="space-y-10 relative">
                  <div className="absolute left-[20px] top-2 bottom-2 w-[1.5px] bg-gray-100"></div>
                  {currentData.history?.map((step: any, i: number) => (
                    <div key={i} className={`relative pl-14 ${step.active ? "opacity-100" : "opacity-30"}`}>
                      <div className={`absolute left-0 top-0 w-10 h-10 rounded-xl flex items-center justify-center z-10 ${step.active ? "bg-[#4CAF50] text-white shadow-lg shadow-green-200" : "bg-gray-100 text-gray-400"}`}>
                        {step.active ? <CheckCircle size={20} /> : <Clock size={20} />}
                      </div>
                      <div>
                        <h5 className="text-[14px] font-black text-gray-900 leading-none">{step.title}</h5>
                        <p className="text-[11px] text-gray-400 mt-2 font-medium">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {currentData.status !== "Menunggu Kurir" && (
                <div className="space-y-4">
                  <p className="text-[12px] font-black text-gray-900 uppercase tracking-widest">Informasi Kurir</p>
                  <div className="bg-[#F8FAF8] rounded-[24px] p-4 sm:p-6 border border-green-100 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 shadow-sm">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#4CAF50] bg-white flex items-center justify-center shrink-0">
                      {currentData.kurir_avatar ? (
                        <img src={currentData.kurir_avatar} alt={`Foto ${currentData.kurir_nama}`} className="w-full h-full object-cover" />
                      ) : (
                        <User size={28} className="text-[#4CAF50]" />
                      )}
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Pahlawan Paketmu</p>
                      <h4 className="text-[16px] font-black text-gray-900 leading-none mb-2">{currentData.kurir_nama || "Kurir Nadebee"}</h4>
                      
                      <div className="flex flex-wrap gap-2">
                        {currentData.kurir_plat && (
                            <span className="bg-white border border-gray-200 text-gray-600 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                            {currentData.kurir_plat}
                            </span>
                        )}
                        {currentData.kurir_telp && (
                             <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded">
                             {currentData.kurir_telp}
                             </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentData.status === "Selesai" && currentData.proof_image_url && (
                <div className="space-y-4 md:col-span-2">
                  <p className="text-[12px] font-black text-gray-900 uppercase tracking-widest">Bukti Pengiriman</p>
                  <div className="rounded-[24px] overflow-hidden border-4 border-white shadow-lg h-64 relative">
                    <img src={currentData.proof_image_url} alt="Bukti" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // === TAMPILAN PENCARIAN UTAMA (LEBAR DISAMAKAN: max-w-[1100px]) ===
  return (
    <main className="min-h-screen bg-[#F4F9F4] font-poppins pb-20 pt-12 px-6 w-full overflow-x-hidden">
      
      {/* Wrapper yang memastikan lebar penuh seperti Request Pickup (max-w-[1100px]) */}
      <div className="w-full max-w-[1100px] mx-auto">
        
        {/* --- Judul Lacak Paket Rata Kiri --- */}
        <div className="mb-10 text-left">
          <h2 className="text-[28px] font-bold text-[#1A1A1A] flex items-center justify-start gap-2 tracking-tight">
            Lacak Paket <Package size={24} className="text-[#4CAF50] ml-1" />
          </h2>
          <p className="text-gray-500 text-sm mt-1">Masukkan nomor resi untuk mulai melacak</p>
        </div>

        {/* --- Form Cari Membentang Full Width (Tombol Ikon Kaca Pembesar Tetap Dipertahankan) --- */}
        <form onSubmit={handleSearch} className="flex gap-3 relative mb-12 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Contoh: NDB001" 
              value={searchQuery}
              onChange={(e) => { 
                setSearchQuery(e.target.value); 
                if (e.target.value === "") {
                  setStatus("idle");
                  setSearchError(false);
                }
              }}
              disabled={status === "loading"}
              className={`w-full h-14 bg-white border ${searchError ? 'border-red-400' : 'border-gray-300'} rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors`}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={status === "loading"}
            className="w-14 h-14 bg-[#4CAF50] text-white rounded-[20px] flex items-center justify-center shrink-0 shadow-lg shadow-green-200 hover:bg-green-600 active:scale-90 transition-all disabled:opacity-50"
          >
            {status === "loading" ? <Loader2 size={24} className="animate-spin" /> : <Search size={24} />}
          </button>
        </form>

        {/* Popup Error Kosong (Full Width) */}
        {searchError && (
          <div className="bg-white rounded-[32px] p-1 border-2 border-red-400 shadow-xl shadow-red-100 animate-in zoom-in duration-300 mb-8 w-full">
            <div className="bg-white rounded-[28px] border border-red-400 p-8 md:p-16 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center mb-6 shadow-lg shadow-red-200">
                <AlertCircle size={32} strokeWidth={3} />
              </div>
              <h3 className="text-red-500 font-black text-[16px] md:text-[18px] mb-2 uppercase tracking-wide">
                KATA KUNCI WAJIB DIISI
              </h3>
              <p className="text-gray-400 text-[14px] md:text-[15px] font-medium">Silakan masukkan nomor resi yang ingin dilacak.</p>
            </div>
          </div>
        )}

        {/* Hasil Pencarian Sukses (Full Width) */}
        {status === "success" && currentData && !searchError && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 w-full">
            <div onClick={handleOpenDetail} className="bg-white rounded-[32px] p-6 md:p-8 border border-gray-100 shadow-sm relative cursor-pointer group hover:border-green-100 transition-all overflow-hidden text-left">
              <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-gray-900 group-hover:translate-x-1 transition-transform hidden sm:block">
                <ArrowRight size={24} strokeWidth={2.5} />
              </div>
              <div className="space-y-6 sm:pr-10">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  <h3 className="text-[15px] font-black text-gray-900 uppercase">{searchQuery.toUpperCase()}</h3>
                  <span className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border self-start sm:self-auto ${getStatusStyle(currentData.status)}`}>
                    {currentData.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12">
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Pengirim</p>
                    <p className="text-[15px] font-black text-gray-900">{currentData.pengirim}</p>
                    <p className="text-[11px] text-gray-400 font-bold mt-2 uppercase">Wilayah</p>
                    <p className="text-[14px] font-black text-gray-800">{currentData.wilayah}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Penerima</p>
                    <p className="text-[15px] font-black text-gray-900">{currentData.penerima}</p>
                    <p className="text-[11px] text-gray-400 font-bold mt-2 uppercase">Ongkir</p>
                    <p className="text-[15px] font-black text-green-600">{currentData.ongkir}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#D7ECD9] p-5 rounded-[22px] text-center border border-white">
              <p className="text-[14px] font-bold text-green-800/60">Tenang, paketmu sedang dalam proses</p>
            </div>
          </div>
        )}

        {/* Popup Error Resi Tidak Ditemukan (Full Width) */}
        {status === "error" && !searchError && (
          <div className="bg-white rounded-[32px] p-1 border-2 border-red-400 shadow-xl shadow-red-100 animate-in zoom-in duration-300 w-full">
            <div className="bg-white rounded-[28px] border border-red-400 p-8 md:p-16 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center mb-6 shadow-lg shadow-red-200">
                <AlertCircle size={32} strokeWidth={3} />
              </div>
              <h3 className="text-red-500 font-black text-[16px] md:text-[18px] mb-2 uppercase tracking-wide">
                {errorMessage} 
              </h3>
              <p className="text-gray-400 text-[14px] md:text-[15px] font-medium">Coba cek lagi ya!</p>
            </div>
          </div>
        )}

        {/* Tampilan Idle (Full Width) */}
        {status === "idle" && !searchError && (
          <div className="flex flex-col items-center justify-center py-20 bg-white border-2 border-dashed border-gray-200 rounded-[32px] w-full">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4"><Package size={48} className="text-orange-300" /></div>
            <div className="text-center">
              <p className="text-gray-600 font-black text-xl">Yuk Lacak Paketmu!</p>
              <p className="text-gray-400 font-medium">Ketik nomor resi di atas untuk mengetahui status paket.</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="flex justify-center pt-20"><Loader2 className="animate-spin text-[#4CAF50]" size={40} /></div>}>
      <TrackingContent />
    </Suspense>
  );
}