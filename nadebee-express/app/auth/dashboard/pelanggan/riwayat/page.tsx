"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

// Data riwayat lengkap berjumlah 9 data dummy untuk simulasi 3 halaman penuh
const dataRiwayatAwal = [
  {
    id: "NDB009",
    status: "Dalam Perjalanan",
    rute: "Siti Rahayu → Happy Asmara",
    detail: "Bantul | Makanan | <1 Kg",
    tanggal: "2025-09-12"
  },
  {
    id: "NDB008",
    status: "Selesai",
    rute: "Siti Rahayu → Gading Marten",
    detail: "Sleman | Lainnya | 5-10 Kg",
    tanggal: "2025-09-07"
  },
  {
    id: "NDB007",
    status: "Menunggu Kurir",
    rute: "Siti Rahayu → Dewi Sartika",
    detail: "Kota Yogyakarta | Dokumen | <1 Kg",
    tanggal: "2025-09-14"
  },
  {
    id: "NDB006",
    status: "Dalam Perjalanan",
    rute: "Siti Rahayu → Kevin Sanjaya",
    detail: "Kulon Progo | Barang Elektronik | 1-5 Kg",
    tanggal: "2025-09-11"
  },
  {
    id: "NDB005",
    status: "Selesai",
    rute: "Siti Rahayu → Rian Jombang",
    detail: "Kota Yogyakarta | Lainnya | 5-10 Kg",
    tanggal: "2025-09-08"
  },
  {
    id: "NDB004",
    status: "Menunggu Kurir",
    rute: "Siti Rahayu → Larasati",
    detail: "Gunung Kidul | Makanan | 1-5 Kg",
    tanggal: "2025-09-14"
  },
  {
    id: "NDB003",
    status: "Selesai",
    rute: "Siti Rahayu → Farhan Rizki",
    detail: "Sleman | Dokumen | 1-5 Kg",
    tanggal: "2025-09-09"
  },
  {
    id: "NDB002",
    status: "Dalam Perjalanan",
    rute: "Siti Rahayu → Ahmad Dani",
    detail: "Magelang | Elektronik | 5-10 Kg",
    tanggal: "2025-09-10"
  },
  {
    id: "NDB001",
    status: "Menunggu Kurir",
    rute: "Siti Rahayu → Yemima",
    detail: "Bantul | Barang Pecah Belah | 1-5 Kg",
    tanggal: "2025-09-13"
  },
];

export default function RiwayatPickupPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  
  // ================= LOGIKA UTAMA PAGINATION YANG DIUBAH =================
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Mengunci data agar maksimal 3 riwayat per halaman

  // State kontrol dropdown kalender asli milikmu
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Menutup kalender otomatis jika pengguna mengklik di luar area
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logika Filter Pencarian Aktif Berdasarkan Status & Tanggal
  const dataTerfilter = dataRiwayatAwal.filter((item) => {
    const matchQuery = item.status.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDate = selectedDate ? item.tanggal === selectedDate : true;
    return matchQuery && matchDate;
  });

  // ================= LOGIKA PEMOTONGAN DATA PER HALAMAN =================
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const dataPerHalaman = dataTerfilter.slice(indexOfFirstItem, indexOfLastItem); // Memotong data secara dinamis (maks 3 data)

  // Menghitung total halaman (9 data / 3 = 3 halaman)
  const totalPages = Math.ceil(dataTerfilter.length / itemsPerPage) || 1;

  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  // ================= LOGIKA TOMBOL ANGKA (AKAN MUNCUL 1, 2, 3 SAJA) =================
  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(i); // Mengisi array angka secara berurutan sesuai totalPages nyata
    }
    return buttons;
  };

  return (
    <main className="min-h-screen bg-[#F4F9F4] font-sans pb-20">
      <section className="max-w-[1200px] mx-auto pt-12 px-6">
        
        {/* Tampilan Header Asli */}
        <div className="mb-10">
          <h2 className="text-[28px] font-bold text-[#1A1A1A]">Riwayat Pickup</h2>
          <p className="text-gray-500 text-sm">Berikut adalah semua riwayat permohonan pickup mu</p>
        </div>

        {/* Input Search & Filter Asli */}
        <div className="space-y-4 mb-8 relative">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
              🔍
            </span>
            <input
              type="text"
              placeholder='Cari berdasarkan "status pickup"'
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset otomatis ke halaman 1 saat mengetik kata kunci
              }}
              className="w-full bg-white border border-gray-300 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none"
            />
          </div>

          {/* Tombol Kontrol Kalender */}
          <div className="relative inline-block" ref={calendarRef}>
            <button 
              type="button"
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="flex items-center gap-2 bg-white border border-gray-400 rounded-xl px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <span>⏳</span> {selectedDate ? `Tanggal: ${selectedDate}` : "Tanggal"}
            </button>

            {/* Popup Kalender */}
            {isCalendarOpen && (
              <div className="absolute left-0 mt-2 bg-white border border-gray-200 rounded-[24px] p-5 shadow-xl z-50 w-[320px] animate-in fade-in zoom-in-95 duration-150">
                <div className="flex justify-between items-center mb-4 px-1">
                  <button type="button" className="text-gray-600 font-bold hover:bg-gray-100 w-7 h-7 rounded-full text-sm">‹</button>
                  <div className="flex gap-2">
                    <select className="text-sm font-bold text-gray-700 bg-gray-50 rounded-lg p-1 outline-none cursor-pointer">
                      <option>Sep</option>
                    </select>
                    <select className="text-sm font-bold text-gray-700 bg-gray-50 rounded-lg p-1 outline-none cursor-pointer">
                      <option>2025</option>
                    </select>
                  </div>
                  <button type="button" className="text-gray-600 font-bold hover:bg-gray-100 w-7 h-7 rounded-full text-sm">›</button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-gray-400 mb-2">
                  <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
                  <div className="p-2"></div>
                  {daysInMonth.map((day) => {
                    const dateStr = `2025-09-${String(day).padStart(2, "0")}`;
                    const isSelected = selectedDate === dateStr;
                    const isSpecialMarked = day === 9 || day === 13;

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          setSelectedDate(isSelected ? null : dateStr);
                          setIsCalendarOpen(false);
                          setCurrentPage(1); // Reset halaman saat tanggal difilter
                        }}
                        className={`p-2 rounded-lg transition-all font-bold ${
                          isSelected
                            ? "bg-green-600 text-white"
                            : isSpecialMarked
                            ? "bg-[#2D2D2D] text-white shadow-sm"
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

        {/* Daftar Kartu Riwayat (Hanya me-render dataPerHalaman maksimal 3 kartu per page) */}
        <div className="space-y-4 mb-12">
          {dataPerHalaman.length > 0 ? (
            dataPerHalaman.map((item) => (
              <div 
                key={item.id}
                className="bg-white border border-black rounded-[30px] p-8 shadow-sm flex items-center justify-between"
              >
                {/* Blok Kiri Informasi Manifes */}
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

                {/* Blok Kanan Aksi */}
                <div className="flex items-center gap-12">
                  <span className={`px-8 py-2 rounded-full text-xs font-bold border text-center ${
                    item.status === "Selesai" 
                      ? "bg-[#E8F5E9] border-green-200 text-green-600" 
                      : item.status === "Dalam Perjalanan"
                      ? "bg-blue-50 border-blue-200 text-blue-600"
                      : "bg-orange-50 border-orange-200 text-orange-600"
                  }`}>
                    {item.status}
                  </span>
                  
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`riwayat/detail-pengiriman?resi=${item.id}`);
                    }}
                    className="text-green-600 font-bold text-xl cursor-pointer hover:scale-110 active:scale-95 transition-transform p-2"
                  >
                    ➔
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400 bg-white border border-dashed border-gray-200 rounded-[30px]">
              Tidak ada riwayat dengan kriteria tersebut.
            </div>
          )}
        </div>

        {/* Bar Component Pagination (Didesain dinamis menampilkan halaman 1, 2, 3 saja tanpa elipsis) */}
        <div className="flex items-center justify-center gap-1 mt-8">
          
          {/* Tombol Back (←) */}
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

          {/* Render Angka Halaman Dinamis */}
          {renderPaginationButtons().map((page) => {
            const isSelected = currentPage === page;

            return (
              <button
                key={`page-${page}`}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 font-bold text-sm transition-all border-y border-x border-gray-200 flex items-center justify-center ${
                  isSelected
                    ? "bg-green-600 text-white border-green-600" // Aksen warna hijau aslimu tetap terjaga
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            );
          })}

          {/* Tombol Next (→) */}
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

      </section>
    </main>
  );
}