"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Star, MapPin, Clock, Calendar, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function RiwayatPage() {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedRating, setSelectedRating] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  
  // State Data Dinamis Supabase
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const savedCourierId = sessionStorage.getItem("loggedInCourierId") || "a2c08fd2-ccc2-4271-8a7b-b74870c9dd60";

        const { data, error } = await supabase
          .from("shipments")
          .select("*")
          .eq("courier_id", savedCourierId)
          .eq("status", "Selesai")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data) {
          const formattedObject = data.map((item: any) => {
            const dateObj = new Date(item.created_at);
            const hasRating = item.rating && item.rating > 0;
            
            return {
              id: item.resi_number,
              customer: item.sender_name,
              // --- TAMBAHAN DATA UNTUK KEBUTUHAN SEARCH ---
              receiver: item.receiver_name, 
              itemCategory: item.item_category,
              // -------------------------------------------
              status: item.status,
              price: `Rp ${item.shipping_cost?.toLocaleString('id-ID') || 0}`,
              rating: item.rating || 0, 
              route: `${item.sender_address} → ${item.receiver_address}`,
              duration: "Selesai", 
              date: dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
              review: hasRating ? (item.review || "Tidak ada ulasan tertulis") : "Menunggu ulasan pelanggan...",
            };
          });

          setHistoryData(formattedObject);
        }
      } catch (error) {
        console.error("Gagal menarik data riwayat:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
    
    const channel = supabase
      .channel('kurir-history-realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'shipments' },
        () => { fetchHistory(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // --- LOGIKA FILTER YANG DIPERBAIKI (UNIVERSAL SEARCH) ---
  const filteredData = historyData.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    
    // Menyapu bersih pencarian berdasarkan ID, Pengirim, Penerima, Barang, dan Status
    const matchesSearch =
      item.id.toLowerCase().includes(query) ||
      item.customer.toLowerCase().includes(query) ||
      (item.receiver && item.receiver.toLowerCase().includes(query)) ||
      (item.itemCategory && item.itemCategory.toLowerCase().includes(query)) ||
      item.status.toLowerCase().includes(query);

    const matchesRating =
      selectedRating === "Semua" ||
      (selectedRating === "Belum Dinilai" && item.rating === 0) || 
      item.rating.toString() === selectedRating;

    return matchesSearch && matchesRating;
  });

  // Perhitungan Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(i);
    }
    return buttons;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 px-4 md:px-0 pt-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Riwayat Pickup</h1>
        <p className="text-sm text-gray-500 font-medium">Menampilkan ringkasan seluruh pickup yang telah selesai</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Cari resi, nama pengirim, penerima, atau barang..." // <-- REVISI PLACEHOLDER
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 font-medium transition-all"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="relative inline-block">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`flex items-center gap-2 px-6 py-2 border rounded-lg text-sm font-bold transition-all ${
            selectedRating !== "Semua" ? "bg-green-50 border-green-500 text-green-600" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Filter size={16} />
          {selectedRating === "Semua" ? "Filter Rating" : selectedRating === "Belum Dinilai" ? "Belum Dinilai" : `Rating ${selectedRating}`}
        </button>

        {showFilter && (
          <div className="absolute left-0 mt-2 w-[340px] bg-white border border-gray-300 rounded-2xl shadow-xl z-50 p-5 animate-in fade-in zoom-in-95 duration-200">
            <p className="text-sm font-black text-gray-700 mb-4">Rating</p>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => { setSelectedRating("Semua"); setCurrentPage(1); setShowFilter(false); }} className={`py-2 rounded-full text-xs font-bold transition-all ${selectedRating === "Semua" ? "bg-[#F3D45F] text-gray-900" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>Semua</button>
              <button onClick={() => { setSelectedRating("Belum Dinilai"); setCurrentPage(1); setShowFilter(false); }} className={`py-2 rounded-full text-xs font-bold col-span-2 transition-all ${selectedRating === "Belum Dinilai" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>Belum Dinilai</button>
              
              {[1, 2, 3, 4, 5].map((num) => (
                <button key={num} onClick={() => { setSelectedRating(num.toString()); setCurrentPage(1); setShowFilter(false); }} className={`flex items-center justify-center gap-1 py-2 rounded-full text-xs font-bold transition-all ${selectedRating === num.toString() ? "bg-[#F3D45F] text-gray-900" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                  <Star size={12} fill={selectedRating === num.toString() ? "black" : "none"} />{num}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between min-h-[480px]">
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12 text-[#4CAF50] font-bold animate-pulse">Memuat riwayat pekerjaanmu...</div>
          ) : filteredData.length > 0 ? (
            <>
              {paginatedData.map((item, index) => (
                <div key={index} className="bg-white border border-green-500 rounded-[24px] p-8 shadow-sm relative hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    
                    <div className="space-y-4 flex-1">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-black text-gray-900">{item.customer}</h3>
                          <span className="bg-green-50 text-green-500 text-[10px] font-black px-4 py-1 rounded-full border border-green-100 uppercase">{item.status}</span>
                        </div>
                        <p className="text-xs font-bold text-gray-400 mt-0.5">{item.id}</p>
                      </div>

                      <div className="space-y-2 text-gray-500 text-sm font-medium">
                        <div className="flex items-start gap-3">
                          <MapPin size={16} className="text-gray-300 mt-0.5 shrink-0" />
                          <span className="leading-snug pr-4">{item.route}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock size={16} className="text-gray-300 shrink-0" />
                          <span>Durasi: {item.duration}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar size={16} className="text-gray-300 shrink-0" />
                          <span>{item.date}</span>
                        </div>
                      </div>
                      
                      {/* --- REVISI EMOTIKON JAM PASIR MENJADI ICON LUCIDE --- */}
                      <div className={`flex items-start gap-2 p-3 rounded-xl border ${item.rating === 0 ? "text-orange-400 bg-orange-50 border-orange-100" : "text-gray-500 bg-gray-50 border-gray-100"}`}>
                        {item.rating === 0 && <Clock size={16} className="shrink-0 mt-0.5" />}
                        <p className="text-sm font-medium italic">
                          {item.rating === 0 ? item.review : `"${item.review}"`}
                        </p>
                      </div>
                      {/* ---------------------------------------------------- */}

                    </div>

                    <div className="text-left md:text-right space-y-4 shrink-0">
                      <p className="text-xl font-black text-green-600">{item.price}</p>
                      <div className="flex justify-start md:justify-end gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={18} 
                            className={star <= item.rating ? "text-[#F3D45F]" : "text-gray-200"} 
                            fill={star <= item.rating ? "#F3D45F" : "none"} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white border-2 border-dashed border-gray-200 rounded-[32px] space-y-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300"><XCircle size={48} /></div>
              <div className="text-center">
                <p className="text-gray-600 font-black text-xl">Tidak Ada Riwayat</p>
                <p className="text-gray-400 font-medium">Data tidak ditemukan untuk kata kunci tersebut.</p>
              </div>
            </div>
          )}
        </div>

        {/* --- PAGINATION --- */}
        {!loading && filteredData.length > 0 && (
          <div className="flex items-center justify-center gap-1 mt-10">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`w-10 h-10 border rounded-l-xl flex items-center justify-center font-bold text-sm transition-all border-gray-200 ${
                currentPage === 1 ? "bg-white text-gray-300 cursor-not-allowed" : "bg-white text-gray-600 hover:bg-gray-50 active:scale-95"
              }`}
            >
              ←
            </button>

            {renderPaginationButtons().map((page) => {
              const isSelected = currentPage === page;
              return (
                <button
                  key={`page-${page}`}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 font-bold text-sm transition-all border-y border-x border-gray-200 flex items-center justify-center ${
                    isSelected ? "bg-green-600 text-white border-green-600 shadow-sm font-semibold" : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`w-10 h-10 border rounded-r-xl flex items-center justify-center font-bold text-sm transition-all border-gray-200 ${
                currentPage === totalPages ? "bg-white text-gray-300 cursor-not-allowed" : "bg-white text-gray-600 hover:bg-gray-50 active:scale-95"
              }`}
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}