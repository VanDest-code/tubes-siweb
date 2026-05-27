"use client"; 

import { useState, useEffect } from "react";
import { Wallet, Package, Truck, CheckCircle2, Calendar } from "lucide-react"; 
import { supabase } from "@/lib/supabase"; 

export default function KurirHome() {
  const [time, setTime] = useState<Date | null>(null);
  const [courierName, setCourierName] = useState<string>("Kurir");
  const [loadingName, setLoadingName] = useState<boolean>(true);

  // --- FILTER TANGGAL ---
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // State untuk Statistik Dinamis
  const [totalPendapatan, setTotalPendapatan] = useState(0);
  const [menungguCount, setMenungguCount] = useState(0);
  const [prosesCount, setProsesCount] = useState(0);
  const [selesaiCount, setSelesaiCount] = useState(0);

  // State Khusus Line Chart (Pendapatan per hari)
  const [revenueData, setRevenueData] = useState<{ date: string, amount: number, rawDate: string }[]>([]);

  // Jalankan jam digital
  useEffect(() => {
    setTime(new Date()); 
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval); 
  }, []);

  // Set Default Date Range (1 Bulan Terakhir) saat komponen pertama kali dimuat
  useEffect(() => {
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);
    
    setEndDate(today.toISOString().split('T')[0]);
    setStartDate(lastMonth.toISOString().split('T')[0]);
  }, []);

  // Tarik Data Kurir & Statistik Pesanan + RADAR REALTIME
  useEffect(() => {
    const savedCourierId = sessionStorage.getItem("loggedInCourierId") || "a2c08fd2-ccc2-4271-8a7b-b74870c9dd60";

    const fetchDashboardData = async () => {
      // Tunggu sampai tanggal default ter-set
      if (!startDate || !endDate) return;

      try {
        setLoadingName(true);
        
        // 1. Tarik Nama Kurir
        const { data: courierData } = await supabase
          .from("couriers")
          .select("username")
          .eq("id", savedCourierId)
          .single();

        if (courierData) setCourierName(courierData.username);

        // 2. Tarik Semua Pesanan (Shipments) Milik Kurir Ini & Filter berdasarkan Tanggal!
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const { data: shipmentsData, error } = await supabase
          .from("shipments")
          .select("*, created_at")
          .eq("courier_id", savedCourierId)
          .gte("created_at", start.toISOString())
          .lte("created_at", end.toISOString())
          .order("created_at", { ascending: true }); // Mengurutkan dari terlama ke terbaru

        if (error) throw error;

        // 3. Kalkulasi Statistik
        if (shipmentsData) {
          let pendapatan = 0;
          let menunggu = 0;
          let proses = 0;
          let selesai = 0;
          
          // Map untuk menampung pendapatan harian (Untuk Line Chart)
          const dailyRevenueMap = new Map<string, number>();

          shipmentsData.forEach((task: any) => {
            const status = task.status?.toLowerCase().trim() || "";
            // Simpan format tanggal mentah (YYYY-MM-DD) sebagai kunci (key) di Map untuk kemudahan sorting
            const rawDate = new Date(task.created_at).toISOString().split('T')[0];
            
            if (status === "menunggu kurir") {
              menunggu++;
            } else if (status === "selesai") {
              selesai++;
              const cost = task.shipping_cost || 0;
              pendapatan += cost;
              
              // Masukkan ke log harian
              const currentDaily = dailyRevenueMap.get(rawDate) || 0;
              dailyRevenueMap.set(rawDate, currentDaily + cost);
              
            } else if (status !== "dibatalkan" && status !== "ditolak") {
              proses++;
            }
          });

          setTotalPendapatan(pendapatan);
          setMenungguCount(menunggu);
          setProsesCount(proses);
          setSelesaiCount(selesai);

          // Format map ke array, ubah tanggal mentah jadi format UI (Misal: 21 MEI), lalu sorting!
          const formattedLineData = Array.from(dailyRevenueMap, ([rawDate, amount]) => ({
            rawDate,
            amount,
            date: new Date(rawDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }).toUpperCase()
          })).sort((a, b) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime()); // Sorting Matematis

          setRevenueData(formattedLineData);
        }

      } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
      } finally {
        setLoadingName(false);
      }
    };

    fetchDashboardData();

    // RADAR REALTIME
    const channel = supabase
      .channel('kurir-dashboard-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'shipments' },
        () => fetchDashboardData()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [startDate, endDate]); // Effect akan dipanggil ulang jika filter tanggal berubah!

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

  // Logika Tinggi Bar Chart
  const maxBarValue = Math.max(menungguCount, prosesCount, selesaiCount, 1);
  const getChartHeight = (value: number) => {
    if (value === 0) return "5%";
    return `${(value / maxBarValue) * 100}%`;
  };

  // Logika Pembuatan SVG Line Chart Murni
  const generateLineChartPath = () => {
    if (revenueData.length === 0) return "";
    
    const maxAmt = Math.max(...revenueData.map(d => d.amount), 1); // Hindari / 0
    const height = 150; // Tinggi total area SVG (padding atas bawah 25)

    // JIKA HANYA ADA 1 DATA: Garis lurus dibuat tepat membelah titiknya
    if (revenueData.length === 1) {
      const y = 175 - ((revenueData[0].amount / maxAmt) * height);
      return `M 10 ${y} L 290 ${y}`; 
    }

    const width = 280; // Lebar total area SVG (padding kiri kanan 10)
    const stepX = width / (revenueData.length - 1);
    
    const points = revenueData.map((d, index) => {
      const x = 10 + (index * stepX);
      const y = 175 - ((d.amount / maxAmt) * height); 
      return `${x},${y}`;
    });

    return `M ${points.join(" L ")}`;
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

      {/* --- REVISI: FILTER TANGGAL --- */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 shadow-sm">
        <div className="flex items-center gap-2 text-gray-500 font-semibold mr-auto">
          <Calendar size={18} className="text-[#4CAF50]"/>
          <span className="text-sm">Filter Tanggal:</span>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full md:w-auto text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-green-500 transition-colors"
          />
          <span className="text-gray-400 font-bold">-</span>
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full md:w-auto text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-green-500 transition-colors"
          />
        </div>
      </div>

      {/* Card Pendapatan */}
      <div className="bg-[#4CAF50] rounded-2xl p-6 text-white shadow-md shadow-green-200">
        <div className="flex items-center gap-2 mb-2 opacity-90">
          <Wallet size={20} />
          <span className="font-medium text-sm">Total Pendapatan (Sesuai Filter)</span>
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
            <span>Total Selesai</span>
          </div>
          <span className="text-3xl font-bold text-green-600">{selesaiCount}</span>
        </div>
      </div>

      {/* --- REVISI: DUA GRAFIK BERDAMPINGAN --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* BAR CHART: Status Pesanan */}
        <div className="bg-white border border-green-500 rounded-2xl p-6 md:p-8 pt-10 shadow-sm flex flex-col relative h-[300px]">
          <h3 className="absolute top-4 left-6 text-sm font-bold text-gray-700">Status Pesanan</h3>
          
          <div className="h-40 flex items-end justify-center gap-8 md:gap-12 w-full mt-auto">
            {/* Bar Menunggu */}
            <div className="flex flex-col items-center gap-4 w-12 md:w-16 h-full justify-end group">
              <div className="text-[#1A1A1A] font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {menungguCount}
              </div>
              <div 
                className="w-full bg-[#1CD760] rounded-t-xl transition-all duration-700 ease-in-out" 
                style={{ height: getChartHeight(menungguCount) }}
              ></div> 
            </div>
            
            {/* Bar Proses */}
            <div className="flex flex-col items-center gap-4 w-12 md:w-16 h-full justify-end group">
              <div className="text-[#1A1A1A] font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {prosesCount}
              </div>
              <div 
                className="w-full bg-[#1CD760] rounded-t-xl transition-all duration-700 ease-in-out delay-100" 
                style={{ height: getChartHeight(prosesCount) }}
              ></div> 
            </div>
            
            {/* Bar Selesai */}
            <div className="flex flex-col items-center gap-4 w-12 md:w-16 h-full justify-end group">
              <div className="text-[#1A1A1A] font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {selesaiCount}
              </div>
              <div 
                className="w-full bg-[#1CD760] rounded-t-xl transition-all duration-700 ease-in-out delay-200" 
                style={{ height: getChartHeight(selesaiCount) }}
              ></div> 
            </div>
          </div>

          <div className="flex justify-center gap-8 md:gap-12 w-full mt-4">
            <span className="w-12 md:w-16 text-center text-[10px] md:text-xs text-gray-500 font-bold uppercase">Menunggu</span>
            <span className="w-12 md:w-16 text-center text-[10px] md:text-xs text-gray-500 font-bold uppercase">Proses</span>
            <span className="w-12 md:w-16 text-center text-[10px] md:text-xs text-gray-500 font-bold uppercase">Selesai</span>
          </div>
        </div>

        {/* LINE CHART: Tren Pendapatan Murni SVG */}
        <div className="bg-white border border-green-500 rounded-2xl p-6 md:p-8 pt-10 shadow-sm flex flex-col relative h-[300px]">
          <h3 className="absolute top-4 left-6 text-sm font-bold text-gray-700">Tren Pendapatan</h3>
          
          {revenueData.length === 0 ? (
             <div className="flex items-center justify-center h-full mt-4 w-full">
               <span className="text-gray-400 text-sm italic font-medium bg-gray-50 py-2 px-6 rounded-full">Belum ada data pendapatan.</span>
             </div>
          ) : (
            <>
              {/* Wadah SVG */}
              <div className="h-40 w-full mt-auto relative border-b-2 border-l-2 border-gray-100">
                <svg viewBox="0 0 300 200" className="w-full h-full overflow-visible">
                  
                  {/* Garis Horizontal Bantuan (Grid) */}
                  <line x1="0" y1="50" x2="300" y2="50" stroke="#f3f4f6" strokeWidth="2" strokeDasharray="5,5" />
                  <line x1="0" y1="125" x2="300" y2="125" stroke="#f3f4f6" strokeWidth="2" strokeDasharray="5,5" />
                  
                  {/* Garis Utama Line Chart */}
                  <path 
                    d={generateLineChartPath()}
                    fill="none"
                    stroke="#1CD760"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-md"
                  />
                  
                  {/* Titik-titik (Dots) di setiap data */}
                  {revenueData.map((d, i) => {
                    const maxAmt = Math.max(...revenueData.map(r => r.amount), 1);
                    const stepX = 280 / (revenueData.length > 1 ? revenueData.length - 1 : 1);
                    const x = revenueData.length > 1 ? 10 + (i * stepX) : 150;
                    const y = 175 - ((d.amount / maxAmt) * 150);
                    return (
                      <g key={i} className="group cursor-pointer">
                        {/* Area hover invisible yang lebih besar */}
                        <circle cx={x} cy={y} r="15" fill="transparent" />
                        {/* Dot Visual */}
                        <circle cx={x} cy={y} r="5" fill="white" stroke="#1CD760" strokeWidth="3" className="transition-all duration-300 group-hover:r-6 group-hover:fill-[#1CD760]" />
                        {/* Tooltip Nilai Uang (Muncul saat dihover) */}
                        <text x={x} y={y - 15} textAnchor="middle" fill="#374151" fontSize="12" fontWeight="bold" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          {d.amount >= 1000 ? `Rp${(d.amount/1000).toFixed(0)}rb` : `Rp${d.amount}`}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
              
              {/* Label Tanggal di Bawah Line Chart */}
              <div className="flex justify-between w-full mt-4 px-2">
                {revenueData.map((d, i) => {
                  // Jika datanya banyak (lebih dari 5), sembunyikan beberapa label agar tidak menumpuk
                  if (revenueData.length > 5 && i % Math.ceil(revenueData.length / 4) !== 0 && i !== revenueData.length - 1) return <span key={i}></span>;
                  return (
                    <span key={i} className="text-[10px] md:text-[11px] text-gray-500 font-bold uppercase whitespace-nowrap">
                      {d.date}
                    </span>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
}