"use client"; 

import { useState, useEffect } from "react";
import { Wallet, Package, Truck, CheckCircle2 } from "lucide-react"; // Ikon diubah menyesuaikan "Total Pickup"
import { supabase } from "@/lib/supabase"; 

export default function KurirHome() {
  const [time, setTime] = useState<Date | null>(null);
  const [courierName, setCourierName] = useState<string>("Kurir");
  const [loadingName, setLoadingName] = useState<boolean>(true);

  // State untuk Statistik Dinamis (All-Time)
  const [totalPendapatan, setTotalPendapatan] = useState(0);
  const [menungguCount, setMenungguCount] = useState(0);
  const [prosesCount, setProsesCount] = useState(0);
  const [selesaiCount, setSelesaiCount] = useState(0);

  // Jalankan jam digital
  useEffect(() => {
    setTime(new Date()); 
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval); 
  }, []);

  // Tarik Data Kurir & Statistik Pesanan
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoadingName(true);
        
        // 1. Ambil ID kurir yang sedang login
        const savedCourierId = sessionStorage.getItem("loggedInCourierId") || "a2c08fd2-ccc2-4271-8a7b-b74870c9dd60";

        // 2. Tarik Nama Kurir
        const { data: courierData } = await supabase
          .from("couriers")
          .select("username")
          .eq("id", savedCourierId)
          .single();

        if (courierData) {
          setCourierName(courierData.username);
        }

        // 3. Tarik Semua Pesanan (Shipments) Milik Kurir Ini
        const { data: shipmentsData, error } = await supabase
          .from("shipments")
          .select("*")
          .eq("courier_id", savedCourierId);

        if (error) throw error;

        // 4. Kalkulasi Statistik Selama Menjadi Kurir (All-Time)
        if (shipmentsData) {
          let pendapatan = 0;
          let menunggu = 0;
          let proses = 0;
          let selesai = 0;

          shipmentsData.forEach((task: any) => {
            const status = task.status?.toLowerCase() || "";
            
            if (status === "menunggu kurir") {
              menunggu++;
            } else if (status === "selesai") {
              selesai++;
              pendapatan += (task.shipping_cost || 0); // Akumulasi pendapatan semua paket selesai
            } else if (status !== "dibatalkan") {
              proses++;
            }
          });

          setTotalPendapatan(pendapatan);
          setMenungguCount(menunggu);
          setProsesCount(proses);
          setSelesaiCount(selesai);
        }

      } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
      } finally {
        setLoadingName(false);
      }
    };

    fetchDashboardData();
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

  // Logika Tinggi Chart Dinamis (Maksimal 100%, Minimal 5% agar grafiknya tidak hilang)
  const maxChartValue = Math.max(menungguCount, prosesCount, selesaiCount, 1);
  const getChartHeight = (value: number) => {
    if (value === 0) return "5%";
    return `${(value / maxChartValue) * 100}%`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 px-4 md:px-0 pb-20">
      
      {/* Header Salam & Jam */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Halo!</h1>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-1">
            Selamat datang Kurir {loadingName ? <span className="text-gray-400 animate-pulse">...</span> : courierName} 👋
          </h2>
        </div>
        <div className="text-left md:text-right">
          <p className="text-sm text-gray-500 mb-1">Hari ini</p>
          <p className="font-bold text-gray-800">{formattedDate}</p>
          <p className="text-lg font-bold text-[#4CAF50]">{formattedTime}</p>
        </div>
      </div>

      {/* Card Pendapatan */}
      <div className="bg-[#4CAF50] rounded-2xl p-6 text-white shadow-md shadow-green-200">
        <div className="flex items-center gap-2 mb-2 opacity-90">
          <Wallet size={20} />
          <span className="font-medium text-sm">Total Pendapatan</span>
        </div>
        <h3 className="text-3xl md:text-4xl font-bold tracking-tight">
          Rp {totalPendapatan.toLocaleString('id-ID')}
        </h3>
      </div>

      {/* Status Pengiriman Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white border border-green-500 rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
          <div className="flex items-center gap-2 text-red-500 font-semibold mb-2 text-sm">
            <Package size={18} />
            <span>Menunggu Pickup</span>
          </div>
          <span className="text-3xl font-bold text-red-500">{menungguCount}</span>
        </div>

        <div className="bg-white border border-green-500 rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
          <div className="flex items-center gap-2 text-blue-500 font-semibold mb-2 text-sm">
            <Truck size={18} />
            <span>Dalam Proses</span>
          </div>
          <span className="text-3xl font-bold text-blue-500">{prosesCount}</span>
        </div>

        <div className="bg-white border border-green-500 rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
          <div className="flex items-center gap-2 text-green-600 font-semibold mb-2 text-sm">
            <CheckCircle2 size={18} />
            <span>Total Pickup</span>
          </div>
          {/* Angka Total Pickup akan sama dengan total paket yang sudah "Selesai" */}
          <span className="text-3xl font-bold text-green-600">{selesaiCount}</span>
        </div>
      </div>

      {/* Chart Section Dinamis */}
      <div className="bg-white border border-green-500 rounded-2xl p-6 md:p-8 pt-12 shadow-sm flex flex-col">
        <div className="h-48 flex items-end justify-center gap-8 md:gap-16 w-full">
          
          {/* Bar Menunggu */}
          <div className="flex flex-col items-center gap-4 w-12 md:w-24 h-full justify-end group">
            <div className="text-[#1A1A1A] font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              {menungguCount}
            </div>
            <div 
              className="w-full bg-[#1CD760] rounded-t-xl transition-all duration-700 ease-in-out" 
              style={{ height: getChartHeight(menungguCount) }}
            ></div> 
          </div>
          
          {/* Bar Proses */}
          <div className="flex flex-col items-center gap-4 w-12 md:w-24 h-full justify-end group">
            <div className="text-[#1A1A1A] font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              {prosesCount}
            </div>
            <div 
              className="w-full bg-[#1CD760] rounded-t-xl transition-all duration-700 ease-in-out delay-100" 
              style={{ height: getChartHeight(prosesCount) }}
            ></div> 
          </div>
          
          {/* Bar Selesai */}
          <div className="flex flex-col items-center gap-4 w-12 md:w-24 h-full justify-end group">
            <div className="text-[#1A1A1A] font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              {selesaiCount}
            </div>
            <div 
              className="w-full bg-[#1CD760] rounded-t-xl transition-all duration-700 ease-in-out delay-200" 
              style={{ height: getChartHeight(selesaiCount) }}
            ></div> 
          </div>
        </div>

        {/* Label Bawah Chart */}
        <div className="flex justify-center gap-8 md:gap-16 w-full mt-4">
          <span className="w-12 md:w-24 text-center text-xs md:text-sm text-gray-500 font-medium">Menunggu</span>
          <span className="w-12 md:w-24 text-center text-xs md:text-sm text-gray-500 font-medium">Proses</span>
          <span className="w-12 md:w-24 text-center text-xs md:text-sm text-gray-500 font-medium">Selesai</span>
        </div>
      </div>

    </div>
  );
}