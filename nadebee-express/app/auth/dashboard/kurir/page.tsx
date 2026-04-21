"use client"; 

import { useState, useEffect } from "react";
import { Wallet, Package, Clock as ClockIcon, Truck } from "lucide-react";

export default function KurirHome() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date()); 
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval); 
  }, []);

  const formattedDate = time
    ? time.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Memuat...";

  const formattedTime = time
    ? time.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).replace(/:/g, ".") 
    : "";

  return (
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 px-4 md:px-0">
      {/* Header Salam & Jam - Disesuaikan agar stack di mobile */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Halo!</h1>
          <h2 className="text-xl font-bold text-gray-900">Selamat datang Kurir 👋</h2>
        </div>
        <div className="text-left md:text-right">
          <p className="text-sm text-gray-500 mb-1">Hari ini</p>
          <p className="font-bold text-gray-800">{formattedDate}</p>
          <p className="text-lg font-bold text-green-600">{formattedTime}</p>
        </div>
      </div>

      {/* Card Pendapatan */}
      <div className="bg-[#4CAF50] rounded-2xl p-6 text-white shadow-md shadow-green-200">
        <div className="flex items-center gap-2 mb-2 opacity-90">
          <Wallet size={20} />
          <span className="font-medium text-sm">Total Pendapatan</span>
        </div>
        <h3 className="text-3xl md:text-4xl font-bold tracking-tight">Rp 50.000</h3>
      </div>

      {/* Status Pengiriman Cards - Stack vertikal di mobile, grid di tablet/desktop  */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white border border-green-500 rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
          <div className="flex items-center gap-2 text-red-500 font-semibold mb-2 text-sm">
            <Package size={18} />
            <span>Menunggu Pickup</span>
          </div>
          <span className="text-3xl font-bold text-red-500">5</span>
        </div>

        <div className="bg-white border border-green-500 rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
          <div className="flex items-center gap-2 text-blue-500 font-semibold mb-2 text-sm">
            <Truck size={18} />
            <span>Dalam Proses</span>
          </div>
          <span className="text-3xl font-bold text-blue-500">8</span>
        </div>

        <div className="bg-white border border-green-500 rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
          <div className="flex items-center gap-2 text-green-600 font-semibold mb-2 text-sm">
            <ClockIcon size={18} />
            <span>Pickup Hari Ini</span>
          </div>
          <span className="text-3xl font-bold text-green-600">4</span>
        </div>
      </div>

      {/* Chart Section - Gap dan ukuran bar disesuaikan untuk layar kecil */}
      <div className="bg-white border border-green-500 rounded-2xl p-6 md:p-8 pt-12 shadow-sm h-auto flex items-end justify-center gap-8 md:gap-16 overflow-hidden">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 md:w-24 bg-green-500 rounded-t-xl h-32"></div> 
          <span className="text-xs md:text-sm text-gray-500 font-medium">Menunggu</span>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 md:w-24 bg-green-500 rounded-t-xl h-48"></div> 
          <span className="text-xs md:text-sm text-gray-500 font-medium">Proses</span>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 md:w-24 bg-green-500 rounded-t-xl h-24"></div> 
          <span className="text-xs md:text-sm text-gray-500 font-medium">Selesai</span>
        </div>
      </div>
    </div>
  );
}