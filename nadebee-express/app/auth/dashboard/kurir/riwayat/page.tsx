"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  Calendar,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function RiwayatPage() {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedRating, setSelectedRating] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // State Dinamis dari Supabase
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const savedCourierId = sessionStorage.getItem("loggedInCourierId") || "a2c08fd2-ccc2-4271-8a7b-b74870c9dd60";

        // Tarik data yang statusnya 'Selesai'
        // PERBAIKAN: Menggunakan created_at sebagai patokan urutan
        const { data, error } = await supabase
          .from("shipments")
          .select("*")
          .eq("courier_id", savedCourierId)
          .eq("status", "Selesai")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data) {
          // KUNCI LOGIKA: Hanya tampilkan yang sudah di-rating oleh pelanggan (> 0)
          const ratedShipments = data.filter((item: any) => item.rating && item.rating > 0);

          const formattedObject = ratedShipments.map((item: any) => {
            // PERBAIKAN: Menggunakan created_at
            const dateObj = new Date(item.created_at);
            return {
              id: item.resi_number,
              customer: item.sender_name,
              status: item.status,
              price: `Rp ${item.shipping_cost?.toLocaleString('id-ID') || 0}`,
              rating: item.rating,
              route: `${item.sender_address.substring(0, 15)}... → ${item.receiver_address.substring(0, 15)}...`,
              duration: "Selesai", 
              date: dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
              review: item.review || "Tidak ada ulasan tertulis",
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
  }, []);

  // ==========================================
  // FILTER & SEARCH
  // ==========================================
  const filteredData = historyData.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRating =
      selectedRating === "Semua" ||
      item.rating.toString() === selectedRating;

    return matchesSearch && matchesRating;
  });

  // ==========================================
  // PAGINATION
  // ==========================================
  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">
          Riwayat Pickup
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Menampilkan ringkasan pickup yang telah disetujui pelanggan
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="cari berdasarkan nomor resi atau nama"
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition-all font-medium"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Filter */}
      <div className="relative inline-block">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`flex items-center gap-2 px-6 py-2 border rounded-lg text-sm font-bold transition-all ${
            selectedRating !== "Semua"
              ? "bg-green-50 border-green-500 text-green-600"
              : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Filter size={16} />
          {selectedRating === "Semua"
            ? "Filter"
            : `Rating ${selectedRating}`}
        </button>

        {/* Dropdown */}
        {showFilter && (
          <div className="absolute left-0 mt-2 w-72 bg-white border border-gray-300 rounded-2xl shadow-xl z-50 p-5">
            <p className="text-sm font-black text-gray-700 mb-4 tracking-tight">
              Rating
            </p>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setSelectedRating("Semua");
                  setCurrentPage(1);
                  setShowFilter(false);
                }}
                className={`py-2 rounded-full text-xs font-bold transition-all ${
                  selectedRating === "Semua"
                    ? "bg-[#F3D45F] text-gray-900"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                Semua
              </button>

              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setSelectedRating(num.toString());
                    setCurrentPage(1);
                    setShowFilter(false);
                  }}
                  className={`flex items-center justify-center gap-1 py-2 rounded-full text-xs font-bold transition-all ${
                    selectedRating === num.toString()
                      ? "bg-[#F3D45F] text-gray-900"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  <Star
                    size={12}
                    fill={
                      selectedRating === num.toString()
                        ? "black"
                        : "none"
                    }
                  />
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* List Riwayat */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12 text-[#4CAF50] font-bold animate-pulse">
            Memuat riwayat pekerjaanmu...
          </div>
        ) : filteredData.length > 0 ? (
          <>
            {paginatedData.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-green-500 rounded-[24px] p-8 shadow-sm group hover:shadow-md transition-all relative"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-black text-gray-900">
                          {item.customer}
                        </h3>

                        <span className="bg-green-50 text-green-500 text-[10px] font-black px-4 py-1 rounded-full border border-green-100 uppercase">
                          {item.status}
                        </span>
                      </div>

                      <p className="text-xs font-bold text-gray-400 mt-0.5 tracking-wider">
                        {item.id}
                      </p>
                    </div>

                    <div className="space-y-2 text-gray-500 font-medium text-sm">
                      <div className="flex items-center gap-3">
                        <MapPin
                          size={16}
                          className="text-gray-300"
                        />
                        <span>{item.route}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock
                          size={16}
                          className="text-gray-300"
                        />
                        <span>Durasi: {item.duration}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Calendar
                          size={16}
                          className="text-gray-300"
                        />
                        <span>{item.date}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-sm font-medium italic text-gray-500">
                        "{item.review}"
                      </p>
                    </div>
                  </div>

                  <div className="text-right space-y-4">
                    <p className="text-xl font-black text-green-600">
                      {item.price}
                    </p>

                    <div className="flex justify-end gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={18}
                          className={
                            star <= item.rating
                              ? "text-[#F3D45F]"
                              : "text-gray-200"
                          }
                          fill={
                            star <= item.rating
                              ? "#F3D45F"
                              : "none"
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center pt-4">
                <div className="flex overflow-hidden rounded-2xl border border-gray-300 bg-white">
                  <button
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    disabled={currentPage === 1}
                    className="w-14 h-12 flex items-center justify-center border-r border-gray-300 text-gray-400 disabled:opacity-50"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-14 h-12 text-sm font-bold border-r border-gray-300 transition-all ${
                          currentPage === page
                            ? "bg-[#00B14F] text-white"
                            : "bg-[#F5F5F5] text-[#2B3A55]"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={currentPage === totalPages}
                    className="w-14 h-12 flex items-center justify-center text-[#2B3A55] disabled:opacity-50"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white border-2 border-dashed border-gray-200 rounded-[32px] space-y-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
              <XCircle size={48} strokeWidth={1.5} />
            </div>

            <div className="text-center">
              <p className="text-gray-600 font-black text-xl">
                Belum Ada Riwayat
              </p>
              <p className="text-gray-400 font-medium">
                Selesaikan pesanan dan tunggu penilaian dari pelanggan.
              </p>
            </div>

            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedRating("Semua");
                setCurrentPage(1);
              }}
              className="text-green-500 font-bold hover:underline"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}