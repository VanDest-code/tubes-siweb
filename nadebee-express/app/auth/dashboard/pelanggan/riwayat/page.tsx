"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Trash2, Search, Calendar, Package, ChevronRight, ChevronLeft, AlertCircle, XCircle } from "lucide-react"; 

export default function RiwayatPickupPage() {
  const router = useRouter();
  
  const [dataRiwayatAwal, setDataRiwayatAwal] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"Aktif" | "Selesai">("Aktif");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState(false); 
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; 

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [resiToDelete, setResiToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
  const daysInMonthCount = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInMonth = Array.from({ length: daysInMonthCount }, (_, i) => i + 1);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchRiwayat = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && user.email) {
        const { data, error } = await supabase
          .from("shipments")
          .select("*")
          .eq("customer_email", user.email)
          .order("created_at", { ascending: false });

        if (error) throw error;
        
        if (data) {
          const formattedData = data.map((d) => ({
            id: d.resi_number,
            status: d.status,
            rute: `${d.sender_name} → ${d.receiver_name}`,
            detail: `${d.destination_city} | ${d.item_category} | ${d.weight_range}`,
            tanggal: d.created_at.split("T")[0],
            tanggal_raw: d.created_at // Simpan format asli untuk UI & Filter
          }));
          setDataRiwayatAwal(formattedData);
        }
      }
    } catch (error) {
      console.error("Gagal menarik data riwayat:", error);
    } finally {
      setLoading(false);
    }
  };

  // Agar langsung refresh jika tab atau filter tanggal diklik
  useEffect(() => {
    fetchRiwayat();
  }, [activeTab, selectedDate]);

  useEffect(() => {
    const channel = supabase
      .channel('live-update-riwayat')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'shipments' }, 
        () => { fetchRiwayat(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const executeDelete = async () => {
    if (!resiToDelete) return;
    setIsDeleting(true);

    try {
      // Ubah dari .delete() menjadi .update({ status: 'Dibatalkan' })
      const { error } = await supabase
        .from('shipments')
        .update({ status: 'Dibatalkan' }) 
        .eq('resi_number', resiToDelete);

      if (error) throw error;

      // Update state lokal: cari item tersebut dan ubah statusnya jadi 'dibatalkan'
      setDataRiwayatAwal(prev => prev.map(item => 
        item.id === resiToDelete ? { ...item, status: 'dibatalkan' } : item
      ));
      
      setShowDeleteConfirm(false);
      setShowDeleteSuccess(true);
      setResiToDelete(null);

    } catch (error: any) {
      console.error("Gagal membatalkan pesanan:", error);
      alert(`Gagal membatalkan pesanan. Error: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSearchClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchError(true);
    } else {
      setSearchError(false);
    }
  };

  // --- FORMATTER TANGGAL CANTIK ---
  const formatTanggalCard = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }); 
  };

  const countAktif = dataRiwayatAwal.filter(i => {
    const s = (i.status || "").toLowerCase().trim();
    return s !== "selesai" && s !== "ditolak" && s !== "dibatalkan";
  }).length;

  const countSelesai = dataRiwayatAwal.filter(i => {
    const s = (i.status || "").toLowerCase().trim();
    return s === "selesai" || s === "ditolak" || s === "dibatalkan";
  }).length;

  // --- LOGIKA FILTER (Sudah dibersihkan dari duplikat/dobel) ---
  const dataTerfilter = dataRiwayatAwal.filter((item) => {
    const dbStatus = (item.status || "").toLowerCase().trim();
    
    const isHistory = dbStatus === "selesai" || dbStatus === "ditolak" || dbStatus === "dibatalkan";
    const matchTab = activeTab === "Aktif" ? !isHistory : isHistory;
    
    const query = searchQuery.toLowerCase().trim();
    const matchQuery = 
      dbStatus.includes(query) || 
      item.id.toLowerCase().includes(query) ||
      item.rute.toLowerCase().includes(query) || 
      item.detail.toLowerCase().includes(query); 
                        
    // --- FILTER TANGGAL ZONA WAKTU LOKAL (WIB) ---
    const matchDate = selectedDate ? (() => {
      const dbDate = new Date(item.tanggal_raw); 
      const localYear = dbDate.getFullYear();
      const localMonth = String(dbDate.getMonth() + 1).padStart(2, '0');
      const localDay = String(dbDate.getDate()).padStart(2, '0');
      const formattedLocal = `${localYear}-${localMonth}-${localDay}`;
      return formattedLocal === selectedDate;
    })() : true;
    
    return matchTab && matchQuery && matchDate;
  });
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const dataPerHalaman = dataTerfilter.slice(indexOfFirstItem, indexOfLastItem); 

  const totalPages = Math.ceil(dataTerfilter.length / itemsPerPage) || 1;

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(i); 
    }
    return buttons;
  };

  return (
    <main className="min-h-screen bg-[#F4F9F4] font-sans pb-20 w-full overflow-x-hidden">
      
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)}></div>
          <div className="bg-white rounded-[32px] p-8 md:p-10 max-w-sm w-full text-center relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Batalkan Pesanan?</h2>
           <p className="text-sm text-gray-500 mb-6">
            Yakin ingin membatalkan pesanan <span className="font-bold text-gray-800">{resiToDelete}</span>? 
            Pesanan ini akan berstatus Dibatalkan dan tidak dapat diproses kembali.
          </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)} 
                disabled={isDeleting}
                className="flex-1 bg-white border border-gray-300 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50"
              >
                Kembali
              </button>
              <button 
                onClick={executeDelete} 
                disabled={isDeleting}
                className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 flex justify-center items-center"
              >
                {isDeleting ? <span className="animate-pulse">Menghapus...</span> : "Ya, Batalkan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
          <div className="bg-white rounded-[32px] p-8 md:p-10 max-w-sm w-full text-center relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-xl font-black text-gray-900 mb-2">Berhasil Dibatalkan</h2>
            <p className="text-sm text-gray-500 mb-6">Pesanan pickup kamu telah berhasil dibatalkan dan dihapus dari sistem.</p>
            <button 
              onClick={() => setShowDeleteSuccess(false)} 
              className="w-full bg-[#4CAF50] text-white font-bold py-4 rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-100"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      <section className="max-w-[1100px] mx-auto pt-12 px-6">
        
        <div className="mb-10 text-left">
          <h2 className="text-[28px] font-bold text-[#1A1A1A]">Riwayat Pickup</h2>
          <p className="text-gray-500 text-sm mt-1">Berikut adalah semua riwayat permohonan pickup mu</p>
        </div>

        <div className="space-y-4 mb-6 relative">
          
          <form onSubmit={handleSearchClick} className="flex gap-3 relative w-full">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder='Cari resi, nama, atau barang...' 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); 
                  if (e.target.value.trim() !== "") setSearchError(false);
                }}
                className={`w-full bg-white border ${searchError ? 'border-red-400' : 'border-gray-300'} rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors`}
              />
            </div>
            <button 
              type="submit" 
              className="bg-[#4CAF50] text-white px-8 rounded-xl font-bold hover:bg-[#43A047] transition-all shadow-md shrink-0 text-base flex items-center justify-center min-w-[80px]"
            >
              Cari
            </button>
          </form>

          <div className="relative inline-block w-full md:w-auto" ref={calendarRef}>
            <button 
              type="button"
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="w-full md:w-auto flex items-center justify-center md:justify-start gap-2 bg-white border border-gray-400 rounded-xl px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Calendar size={14} className="text-[#4CAF50]"/> 
              {selectedDate ? `Tanggal: ${selectedDate}` : "Filter Tanggal"}
            </button>

            {isCalendarOpen && (
              <div className="absolute left-0 right-0 md:right-auto mt-2 bg-white border border-gray-200 rounded-[24px] p-5 shadow-xl z-50 w-full md:w-[320px] animate-in fade-in zoom-in-95 duration-150 mx-auto">
                <div className="flex justify-between items-center mb-4 px-1">
                  <button type="button" onClick={handlePrevMonth} className="text-gray-600 hover:bg-gray-100 w-7 h-7 rounded-full flex items-center justify-center text-sm"><ChevronLeft size={18}/></button>
                  <div className="flex gap-2">
                    <select 
                      value={currentMonth}
                      onChange={(e) => setCurrentMonth(Number(e.target.value))}
                      className="text-sm font-bold text-gray-700 bg-gray-50 rounded-lg p-1 outline-none cursor-pointer"
                    >
                      {monthNames.map((m, i) => <option key={i} value={i}>{m}</option>)}
                    </select>
                    <select 
                      value={currentYear}
                      onChange={(e) => setCurrentYear(Number(e.target.value))}
                      className="text-sm font-bold text-gray-700 bg-gray-50 rounded-lg p-1 outline-none cursor-pointer"
                    >
                      {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2].map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  <button type="button" onClick={handleNextMonth} className="text-gray-600 hover:bg-gray-100 w-7 h-7 rounded-full flex items-center justify-center text-sm"><ChevronRight size={18}/></button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-gray-400 mb-2">
                  <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
                  {daysInMonth.map((day) => {
                    const monthStr = String(currentMonth + 1).padStart(2, "0");
                    const dayStr = String(day).padStart(2, "0");
                    const dateStr = `${currentYear}-${monthStr}-${dayStr}`;
                    const isSelected = selectedDate === dateStr;

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          setSelectedDate(isSelected ? null : dateStr);
                          setIsCalendarOpen(false);
                          setCurrentPage(1); 
                        }}
                        className={`p-2 rounded-lg transition-all font-bold text-xs ${
                          isSelected
                            ? "bg-green-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-8 justify-start">
          <button
            onClick={() => { setActiveTab("Aktif"); setCurrentPage(1); }}
            className={`flex items-center gap-3 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              activeTab === "Aktif" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Aktif
            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-[11px] ${activeTab === "Aktif" ? "bg-gray-200 text-gray-700" : "bg-gray-200 text-gray-500"}`}>
              {countAktif}
            </span>
          </button>
          
          <button
            onClick={() => { setActiveTab("Selesai"); setCurrentPage(1); }}
            className={`flex items-center gap-3 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              activeTab === "Selesai" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Selesai
            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-[11px] ${activeTab === "Selesai" ? "bg-[#4CAF50] text-white" : "bg-gray-200 text-gray-500"}`}>
              {countSelesai}
            </span>
          </button>
        </div>

        <div className="flex flex-col justify-between min-h-[480px]">
          <div className="space-y-4">
            
            {searchError ? (
              <div className="bg-white rounded-[32px] p-1 border-2 border-red-400 shadow-xl shadow-red-100 animate-in zoom-in duration-300">
                <div className="bg-white rounded-[28px] border border-red-400 p-8 md:p-16 flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center mb-6 shadow-lg shadow-red-200">
                    <AlertCircle size={32} strokeWidth={3} className="md:w-8 md:h-8" />
                  </div>
                  <h3 className="text-red-500 font-black text-[18px] mb-2 uppercase tracking-wide">
                    KATA KUNCI WAJIB DIISI
                  </h3>
                  <p className="text-gray-400 text-[15px] font-medium max-w-xs mx-auto">Silakan masukkan nomor resi, nama, atau barang untuk mencari.</p>
                </div>
              </div>
            ) : loading ? (
              <div className="text-center py-12 text-gray-400 font-bold animate-pulse text-base">Memuat data riwayat...</div>
            ) : dataPerHalaman.length > 0 ? (
              dataPerHalaman.map((item) => {
                const isMenungguKurir = (item.status || "").toLowerCase().trim() === "menunggu kurir";

                return (
                  <div 
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-[30px] p-8 shadow-sm flex flex-col hover:shadow-md hover:border-green-200 transition-all cursor-pointer gap-0 relative"
                    onClick={() => router.push(`/auth/dashboard/pelanggan/riwayat/detail-pengiriman?resi=${item.id}`)}
                  >
                    
                    <div className="absolute top-6 right-6 md:top-8 md:right-8">
                      <span className="text-[10px] md:text-[11px] font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                        {formatTanggalCard(item.tanggal_raw)}
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between w-full mt-4 md:mt-0">
                      <div className="flex items-center gap-6 w-full">
                        
                        <div className="flex flex-col justify-center">
                          <span className="font-bold text-lg mb-2">{item.id}</span>
                          <div className="bg-[#E8F5E9]/60 w-14 h-14 flex items-center justify-center rounded-xl border border-green-200 shadow-sm shrink-0">
                            <Package size={28} className="text-[#4CAF50]" /> 
                          </div>
                        </div>

                        <div className="pt-6 text-[15px] flex-1">
                          <p className="text-gray-600 font-medium leading-normal">{item.rute}</p>
                          <p className="text-gray-400 mt-1 text-[13px] leading-normal">{item.detail}</p>
                        </div>
                        
                        <button
                          type="button"
                          className="text-green-600 font-bold cursor-pointer hover:translate-x-1 transition-transform p-2 hidden md:block shrink-0"
                        >
                          <ChevronRight size={24} /> 
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full mt-4 pt-4 border-t border-gray-100 md:border-none md:pt-0 md:mt-2">
                      
                      <span className={`px-8 py-2 rounded-full text-xs font-bold border text-center whitespace-nowrap ${
                        (item.status || "").toLowerCase().trim() === "selesai" 
                          ? "bg-[#E8F5E9] border-green-200 text-green-600" 
                          : (item.status || "").toLowerCase().trim() === "dalam perjalanan"
                          ? "bg-purple-50 border-purple-200 text-purple-600"
                          : (item.status || "").toLowerCase().trim() === "paket sudah diambil"
                          ? "bg-blue-50 border-blue-200 text-blue-600"
                          : (item.status || "").toLowerCase().trim() === "ditolak" || (item.status || "").toLowerCase().trim() === "dibatalkan"
                          ? "bg-red-50 border-red-200 text-red-600"
                          : "bg-orange-50 border-orange-200 text-orange-600"
                      }`}>
                        {(item.status || "").toUpperCase()}
                      </span>
                      
                      {isMenungguKurir && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); 
                            setResiToDelete(item.id);
                            setShowDeleteConfirm(true);
                          }}
                          className="w-10 h-10 flex items-center justify-center bg-white border border-red-200 text-red-500 rounded-full hover:bg-red-50 hover:text-red-600 hover:scale-105 transition-all shadow-sm shrink-0"
                          title="Batalkan Pesanan"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                      
                    </div>

                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-white border-2 border-dashed border-gray-200 rounded-[32px] space-y-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300"><XCircle size={48} /></div>
                <div className="text-center px-4">
                  <p className="text-gray-600 font-black text-xl mb-1">
                    {dataRiwayatAwal.length === 0 ? "Belum Ada Data Riwayat." : "Tidak Ada Riwayat"}
                  </p>
                  <p className="text-gray-400 font-medium text-sm">
                    {dataRiwayatAwal.length === 0 ? "Kamu belum pernah melakukan request pickup." : "Data tidak ditemukan untuk filter tersebut. Silahkan coba lagi."}
                  </p>
                </div>
              </div>
            )}
          </div>

          {!loading && dataTerfilter.length > 0 && !searchError && (
            <div className="flex items-center justify-center gap-1 mt-8">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`w-10 h-10 border rounded-l-xl flex items-center justify-center font-bold text-sm transition-all border-gray-200 ${
                  currentPage === 1
                    ? "bg-white text-gray-300 cursor-not-allowed"
                    : "bg-white text-gray-600 hover:bg-gray-50 active:scale-95"
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
                      isSelected
                        ? "bg-green-600 text-white border-green-600 shadow-sm" 
                        : "bg-white text-gray-700 hover:bg-gray-50"
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
                  currentPage === totalPages
                    ? "bg-white text-gray-300 cursor-not-allowed"
                    : "bg-white text-gray-600 hover:bg-gray-50 active:scale-95"
                }`}
              >
                →
              </button>
            </div>
          )}
        </div>

      </section>
    </main>
  );
}