"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RiwayatPickupPage() {
  const router = useRouter();
  
  const [dataRiwayatAwal, setDataRiwayatAwal] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"Aktif" | "Selesai">("Aktif");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; 

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // --- LOGIKA KALENDER DINAMIS ---
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

  useEffect(() => {
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
              tanggal: d.created_at.split("T")[0] // Ambil YYYY-MM-DD
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

    fetchRiwayat();

    const channel = supabase
      .channel('live-update-riwayat')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'shipments' },
        () => { fetchRiwayat(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const countAktif = dataRiwayatAwal.filter(i => (i.status || "").toLowerCase().trim() !== "selesai").length;
  const countSelesai = dataRiwayatAwal.filter(i => (i.status || "").toLowerCase().trim() === "selesai").length;

  const dataTerfilter = dataRiwayatAwal.filter((item) => {
    const dbStatus = (item.status || "").toLowerCase().trim();
    const isSelesai = dbStatus === "selesai";
    const matchTab = activeTab === "Aktif" ? !isSelesai : isSelesai;
    
    const matchQuery = dbStatus.includes(searchQuery.toLowerCase().trim()) || 
                       item.id.toLowerCase().includes(searchQuery.toLowerCase().trim());
                       
    const matchDate = selectedDate ? item.tanggal === selectedDate : true;
    
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
    <main className="min-h-screen bg-[#F4F9F4] font-sans pb-20">
      <section className="max-w-[1200px] mx-auto pt-12 px-6">
        
        <div className="mb-10">
          <h2 className="text-[28px] font-bold text-[#1A1A1A]">Riwayat Pickup</h2>
          <p className="text-gray-500 text-sm">Berikut adalah semua riwayat permohonan pickup mu</p>
        </div>

        <div className="space-y-4 mb-6 relative">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">🔍</span>
            <input
              type="text"
              placeholder='Cari berdasarkan "status pickup" atau nomor resi'
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); 
              }}
              className="w-full bg-white border border-gray-300 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none"
            />
          </div>

          <div className="relative inline-block" ref={calendarRef}>
            <button 
              type="button"
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="flex items-center gap-2 bg-white border border-gray-400 rounded-xl px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <span>⏳</span> {selectedDate ? `Tanggal: ${selectedDate}` : "Tanggal"}
            </button>

            {isCalendarOpen && (
              <div className="absolute left-0 mt-2 bg-white border border-gray-200 rounded-[24px] p-5 shadow-xl z-50 w-[320px] animate-in fade-in zoom-in-95 duration-150">
                
                {/* Header Kalender Dinamis */}
                <div className="flex justify-between items-center mb-4 px-1">
                  <button type="button" onClick={handlePrevMonth} className="text-gray-600 font-bold hover:bg-gray-100 w-7 h-7 rounded-full text-sm">‹</button>
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
                  <button type="button" onClick={handleNextMonth} className="text-gray-600 font-bold hover:bg-gray-100 w-7 h-7 rounded-full text-sm">›</button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-gray-400 mb-2">
                  <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                </div>

                {/* Hari Dinamis */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
                  {/* Kosongkan padding sesuai hari pertama di bulan itu (opsional, untuk sederhana kita langsung render hari) */}
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
                        className={`p-2 rounded-lg transition-all font-bold ${
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

        <div className="flex items-center gap-2 mb-8">
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

        <div className="space-y-4 mb-12">
          {loading ? (
            <div className="text-center py-12 text-gray-400 font-bold animate-pulse">Memuat data riwayat...</div>
          ) : dataPerHalaman.length > 0 ? (
            dataPerHalaman.map((item) => (
              <div 
                key={item.id}
                className="bg-white border border-black rounded-[30px] p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between hover:shadow-md transition-shadow cursor-pointer gap-6 md:gap-0"
                onClick={() => router.push(`/auth/dashboard/pelanggan/riwayat/detail-pengiriman?resi=${item.id}`)}
              >
                <div className="flex items-center gap-6">
                  <div className="flex flex-col justify-center">
                    <span className="font-bold text-lg mb-2">{item.id}</span>
                    <div className="bg-[#E8F5E9]/60 w-14 h-14 flex items-center justify-center rounded-xl border border-green-200 shadow-sm shrink-0">
                      <span className="text-2xl">📦</span>
                    </div>
                  </div>

                  <div className="pt-6 text-[15px]">
                    <p className="text-gray-400">{item.rute}</p>
                    <p className="text-gray-500 mt-1">{item.detail}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end md:gap-12 w-full md:w-auto">
                  <span className={`px-8 py-2 rounded-full text-xs font-bold border text-center ${
                    (item.status || "").toLowerCase().trim() === "selesai" 
                      ? "bg-[#E8F5E9] border-green-200 text-green-600" 
                      : (item.status || "").toLowerCase().trim() === "dalam perjalanan"
                      ? "bg-blue-50 border-blue-200 text-blue-600"
                      : "bg-orange-50 border-orange-200 text-orange-600"
                  }`}>
                    {item.status}
                  </span>
                  
                  <button
                    type="button"
                    className="text-green-600 font-bold text-xl cursor-pointer hover:scale-110 transition-transform p-2 hidden md:block"
                  >
                    ➔
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400 bg-white border border-dashed border-gray-300 rounded-[30px]">
              Tidak ada data riwayat dengan filter ini.
            </div>
          )}
        </div>

        {!loading && dataTerfilter.length > 0 && (
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
                      ? "bg-green-600 text-white border-green-600" 
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

      </section>
    </main>
  );
}