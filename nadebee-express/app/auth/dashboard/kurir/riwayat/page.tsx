"use client";

import { useState } from "react";
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

export default function RiwayatPage() {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedRating, setSelectedRating] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Data Dummy Riwayat LENGKAP
  const historyData = [
    {
      id: "NDB011",
      customer: "Citra Lestari",
      status: "Selesai",
      price: "Rp 35.000",
      rating: 4,
      route: "Jl.Nganglik No.123 → Jl.Kalasan No.12",
      duration: "30 Menit",
      date: "5 April 2026",
      review: "Kurir ramah dan amanah",
    },
    {
      id: "NDB012",
      customer: "Budi Santoso",
      status: "Selesai",
      price: "Rp 20.000",
      rating: 4,
      route: "Jl.Palagan No.45 → Jl.Magelang No.10",
      duration: "20 Menit",
      date: "Hari ini",
      review: "Pengiriman tepat waktu",
    },
    {
      id: "NDB013",
      customer: "Siti Rahayu",
      status: "Selesai",
      price: "Rp 15.000",
      rating: 5,
      route: "Jl.Dagen No.15 → Jl.Babarsari No.113",
      duration: "15 Menit",
      date: "3 April 2026",
      review: "Sangat cepat!",
    },
    {
      id: "NDB014",
      customer: "Ray Claudio",
      status: "Selesai",
      price: "Rp 25.000",
      rating: 3,
      route: "Jl.Wonomartani → Jl.Solo",
      duration: "45 Menit",
      date: "2 April 2026",
      review: "Biasa saja, agak telat",
    },
    {
      id: "NDB015",
      customer: "Andi Pratama",
      status: "Selesai",
      price: "Rp 28.000",
      rating: 5,
      route: "Jl.Seturan → Jl.Godean",
      duration: "25 Menit",
      date: "1 April 2026",
      review: "Pelayanan mantap",
    },
    {
      id: "NDB016",
      customer: "Dewi Anggraini",
      status: "Selesai",
      price: "Rp 18.000",
      rating: 4,
      route: "Jl.Adi Sucipto → Jl.Kaliurang",
      duration: "18 Menit",
      date: "31 Maret 2026",
      review: "Cepat dan sopan",
    },
    {
      id: "NDB017",
      customer: "Fajar Nugroho",
      status: "Selesai",
      price: "Rp 22.000",
      rating: 3,
      route: "Jl.Monjali → Jl.Timoho",
      duration: "35 Menit",
      date: "30 Maret 2026",
      review: "Lumayan baik",
    },
    {
      id: "NDB018",
      customer: "Nadia Putri",
      status: "Selesai",
      price: "Rp 40.000",
      rating: 5,
      route: "Jl.Gejayan → Jl.Bantul",
      duration: "40 Menit",
      date: "29 Maret 2026",
      review: "Sangat recommended",
    },
    {
      id: "NDB019",
      customer: "Rizky Maulana",
      status: "Selesai",
      price: "Rp 17.000",
      rating: 2,
      route: "Jl.Janti → Jl.Wates",
      duration: "50 Menit",
      date: "28 Maret 2026",
      review: "Agak lama",
    },
    {
      id: "NDB020",
      customer: "Lala Febriana",
      status: "Selesai",
      price: "Rp 32.000",
      rating: 5,
      route: "Jl.Kotabaru → Jl.Parangtritis",
      duration: "27 Menit",
      date: "27 Maret 2026",
      review: "Kurir sangat helpful",
    },
  ];

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
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
          Menampilkan ringkasan pickup yang pernah kamu lakukan
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
        {filteredData.length > 0 ? (
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
            <div className="flex items-center justify-center pt-4">
              <div className="flex overflow-hidden rounded-2xl border border-gray-300 bg-white">

                {/* Prev */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => prev - 1)
                  }
                  disabled={currentPage === 1}
                  className="w-14 h-12 flex items-center justify-center border-r border-gray-300 text-gray-400 disabled:opacity-50"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Number */}
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

                {/* Next */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => prev + 1)
                  }
                  disabled={currentPage === totalPages}
                  className="w-14 h-12 flex items-center justify-center text-[#2B3A55] disabled:opacity-50"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
          
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white border-2 border-dashed border-gray-200 rounded-[32px] space-y-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
              <XCircle size={48} strokeWidth={1.5} />
            </div>

            <div className="text-center">
              <p className="text-gray-600 font-black text-xl">
                Data Tidak Ditemukan
              </p>

              <p className="text-gray-400 font-medium">
                Riwayat berdasarkan kriteria tersebut tidak ditemukan
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