"use client";

import { useState, useEffect } from "react";
import { Search, Package, AlertCircle, CheckCircle, Clock, ArrowLeft, ArrowRight, Star, Loader2 } from "lucide-react";

export default function TrackingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [currentData, setCurrentData] = useState<any>(null); 
  const [showDetail, setShowDetail] = useState(false);
  const [rating, setRating] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toUpperCase().trim();
    if (!query) return;

    setStatus("loading");
    setShowDetail(false);

    try {
      const response = await fetch(`/api/tracking/${query}`);
      
      if (!response.ok) {
        throw new Error("Data tidak ditemukan");
      }

      const data = await response.json();
      setCurrentData(data);
      setStatus("success");
    } catch (error) {
      setCurrentData(null);
      setStatus("error");
    }
  };

  if (!mounted) return null;

  // --- VIEW DETAIL (FULL PAGE) ---
  if (showDetail && status === "success" && currentData) {
    return (
      <main className="w-full flex flex-col items-center pt-6 pb-20 px-6 max-w-5xl mx-auto animate-in fade-in duration-500">
        <div className="w-full">
          <button onClick={() => setShowDetail(false)} className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-8 font-medium italic transition-all">
            <ArrowLeft size={18} /> Kembali
          </button>

          <div className="bg-white rounded-[32px] p-10 border border-gray-200 shadow-sm space-y-12">
            <div className="flex justify-between items-start">
              <div className="grid grid-cols-2 gap-x-20 gap-y-8">
                <div>
                  <p className="text-[14px] font-black text-gray-900 mb-4 tracking-tight">{searchQuery.toUpperCase()}</p>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Pengirim</p>
                  <p className="text-[15px] font-black text-gray-900 leading-none">{currentData.pengirim}</p>
                  <p className="text-[11px] text-gray-400 font-bold mt-2 tracking-widest uppercase">Wilayah</p>
                  <p className="text-[14px] font-black text-gray-800">{currentData.wilayah}</p>
                </div>
                <div className="pt-8">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Penerima</p>
                  <p className="text-[15px] font-black text-gray-900 leading-none">{currentData.penerima}</p>
                  <p className="text-[11px] text-gray-400 font-bold mt-2 tracking-widest uppercase">Ongkir</p>
                  <p className="text-[15px] font-black text-green-600 tracking-tighter">{currentData.ongkir}</p>
                </div>
              </div>
              <span className={`px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest border ${currentData.color}`}>
                {currentData.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-widest mb-8">Status</h4>
                <div className="space-y-10 relative">
                  <div className="absolute left-[20px] top-2 bottom-2 w-[1.5px] bg-gray-100"></div>
                  {currentData.history?.map((step: any, i: number) => (
                    <div key={i} className={`relative pl-14 ${step.active ? "opacity-100" : "opacity-30"}`}>
                      <div className={`absolute left-0 top-0 w-10 h-10 rounded-xl flex items-center justify-center z-10 ${step.active ? "bg-green-500 text-white shadow-lg shadow-green-200" : "bg-gray-100 text-gray-400"}`}>
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

              {currentData.status === "Selesai" && currentData.proof_image_url && (
                <div className="space-y-4">
                  <p className="text-[12px] font-black text-gray-900 uppercase tracking-widest">Bukti Pengiriman</p>
                  <div className="rounded-[24px] overflow-hidden border-4 border-white shadow-lg h-64 relative">
                    <img src={currentData.proof_image_url} alt="Bukti" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {currentData.status === "Selesai" && (
            <div className="mt-8 bg-white rounded-[32px] p-10 border border-gray-900/10 shadow-sm text-center">
              <p className="text-[14px] font-black text-gray-900 mb-6">Paket sudah sampai! Yuk beri penilaian..</p>
              <div className="flex justify-center gap-3 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} className={`transition-all ${rating >= star ? "text-yellow-400 scale-110" : "text-gray-200 hover:text-yellow-200"}`}>
                    <Star size={32} fill={rating >= star ? "currentColor" : "none"} strokeWidth={2.5} />
                  </button>
                ))}
              </div>
              <textarea placeholder="Tulis ulasan (opsional)..." className="w-full bg-[#E8F5E9]/50 rounded-[24px] p-6 text-[14px] outline-none border border-transparent focus:border-green-200 mb-6 min-h-[120px] transition-all font-medium" />
              <button className="w-full bg-[#4CAF50] text-white font-black py-5 rounded-[22px] shadow-lg shadow-green-100 hover:bg-green-600 active:scale-[0.98] transition-all">
                Kirim Penilaian
              </button>
            </div>
          )}
        </div>
      </main>
    );
  }

  // --- VIEW AWAL ---
  return (
    <main className="w-full flex flex-col items-center pt-10 pb-20 px-6 max-w-5xl mx-auto">
      <div className="w-full">
        <div className="mb-8">
          <h2 className="text-[22px] font-black text-gray-900 flex items-center gap-2 tracking-tight">Lacak Paket 📦</h2>
          <p className="text-gray-500 text-[14px]">Masukkan nomor resi untuk mulai melacak</p>
        </div>

        <form onSubmit={handleSearch} className="relative mb-12 flex gap-3">
          <input 
            type="text" 
            placeholder="Contoh: NDB001" 
            value={searchQuery}
            onChange={(e) => { 
              setSearchQuery(e.target.value); 
              if (e.target.value === "") setStatus("idle"); 
            }}
            disabled={status === "loading"}
            className={`flex-1 h-14 pl-6 pr-14 rounded-[22px] border-2 bg-white outline-none transition-all font-medium ${status === "error" ? 'border-red-400' : 'border-gray-200 focus:border-[#4CAF50]'}`}
          />
          <button 
            type="submit" 
            disabled={status === "loading"}
            className="w-14 h-14 bg-[#4CAF50] text-white rounded-[20px] flex items-center justify-center shadow-lg shadow-green-200 hover:bg-green-600 active:scale-90 transition-all disabled:opacity-50"
          >
            {status === "loading" ? <Loader2 size={22} className="animate-spin" /> : <Search size={22} />}
          </button>
        </form>

        {status === "success" && currentData && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div onClick={() => setShowDetail(true)} className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm relative cursor-pointer group hover:border-green-100 transition-all">
              <div className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-900 group-hover:translate-x-1 transition-transform">
                <ArrowRight size={24} strokeWidth={2.5} />
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <h3 className="text-[15px] font-black text-gray-900 uppercase">{searchQuery.toUpperCase()}</h3>
                  <span className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${currentData.color}`}>
                    {currentData.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-20">
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

        {status === "error" && (
          <div className="bg-white rounded-[32px] p-1 border-2 border-red-400 shadow-xl shadow-red-100 animate-in zoom-in duration-300">
            <div className="bg-white rounded-[28px] border border-red-400 p-16 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center mb-6 shadow-lg shadow-red-200"><AlertCircle size={32} strokeWidth={3} /></div>
              <h3 className="text-red-500 font-black text-[18px] mb-2 uppercase tracking-wide">Nomor resi tidak ditemukan</h3>
              <p className="text-gray-400 text-[15px] font-medium">Coba cek lagi ya!</p>
            </div>
          </div>
        )}

        {status === "idle" && (
          <div className="flex flex-col items-center py-20 opacity-60">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm"><Package size={60} className="text-orange-300" /></div>
            <p className="text-gray-500 font-bold">Yuk lacak paketmu!</p>
          </div>
        )}
      </div>
    </main>
  );
}