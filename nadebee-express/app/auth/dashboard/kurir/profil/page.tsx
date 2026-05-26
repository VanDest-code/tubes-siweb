"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Edit2, Check, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ProfilKurirPage() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Data Kurir
  const [courierData, setCourierData] = useState({
    id: "",
    username: "",
    email: "",
    phone: "",
  });

  // Statistik Database Asli
  const [stats, setStats] = useState({
    totalPengiriman: 0,
    avgRating: "0.0",
    pesananAktif: 0,
  });

  useEffect(() => {
    fetchProfileAndStats();
  }, []);

  const fetchProfileAndStats = async () => {
    try {
      setLoading(true);
      const savedCourierId = sessionStorage.getItem("loggedInCourierId") || "a2c08fd2-ccc2-4271-8a7b-b74870c9dd60";

      // 1. Tarik Data Profil Kurir
      const { data: profile, error: profileError } = await supabase
        .from("couriers")
        .select("*")
        .eq("id", savedCourierId)
        .single();

      if (profileError) throw profileError;

      if (profile) {
        setCourierData({
          id: profile.id,
          username: profile.username || "Kurir",
          email: profile.email || "",
          phone: profile.phone || "",
        });
      }

      // 2. Tarik Data Pesanan untuk Statistik (Sesuai Database)
      const { data: shipments, error: shipError } = await supabase
        .from("shipments")
        .select("status, rating")
        .eq("courier_id", savedCourierId);

      if (shipError) throw shipError;

      if (shipments) {
        let selesai = 0;
        let totalBintang = 0;
        let jumlahPemberiRating = 0;
        let aktif = 0;

        shipments.forEach((task) => {
          const status = (task.status || "").toLowerCase().trim();
          
          if (status === "selesai") {
            selesai++;
            if (task.rating && task.rating > 0) {
              totalBintang += task.rating;
              jumlahPemberiRating++;
            }
          } else if (status !== "dibatalkan" && status !== "ditolak" && status !== "menunggu kurir") {
            // Hitung yang sedang di jalan / diambil
            aktif++;
          }
        });

        const rataRataRating = jumlahPemberiRating > 0 
          ? (totalBintang / jumlahPemberiRating).toFixed(1) 
          : "0.0";

        setStats({
          totalPengiriman: selesai,
          avgRating: rataRataRating,
          pesananAktif: aktif, // Pengganti "On-Time"
        });
      }

    } catch (error) {
      console.error("Gagal memuat profil:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from("couriers")
        .update({
          username: courierData.username,
          phone: courierData.phone,
        })
        .eq("id", courierData.id);

      if (error) throw error;
      
      setIsEditing(false);
    } catch (error) {
      console.error("Gagal update profil:", error);
      alert("Gagal menyimpan profil.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 px-4 md:px-0 pt-6">
      
      <div className="text-center mb-10">
        <h1 className="text-2xl font-black text-gray-900">Profil Kurir</h1>
        <p className="text-sm text-gray-500 font-medium mt-1">Kelola informasi akunmu</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#4CAF50] font-bold animate-pulse">Memuat data profil...</div>
      ) : (
        <div className="space-y-6">
          
          {/* --- KARTU STATISTIK ATAS --- */}
          <div className="bg-white border border-green-400 rounded-[32px] p-8 shadow-sm flex flex-col items-center">
            
            <div className="w-24 h-24 border-2 border-green-500 rounded-full flex items-center justify-center text-green-500 bg-green-50 mb-4">
              <User size={40} />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-8">{courierData.username}</h2>

            <div className="flex w-full justify-between px-4 md:px-12 text-center divide-x divide-gray-100">
              <div className="flex-1">
                <p className="text-3xl font-black text-[#4CAF50] mb-1">{stats.totalPengiriman}</p>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Pengiriman</p>
              </div>
              <div className="flex-1">
                <p className="text-3xl font-black text-orange-400 mb-1">{stats.avgRating}</p>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Rating</p>
              </div>
              <div className="flex-1">
                <p className="text-3xl font-black text-blue-500 mb-1">{stats.pesananAktif}</p>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Pesanan Aktif</p>
              </div>
            </div>
          </div>

          {/* --- KARTU INFORMASI PRIBADI (BEBAS KENDARAAN) --- */}
          <div className="bg-white border border-green-400 rounded-[32px] p-8 md:p-10 shadow-sm relative">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black text-gray-900">Informasi Pribadi</h3>
              <button 
                onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                disabled={isSaving}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
              >
                {isEditing ? <Check size={18} /> : <Edit2 size={18} />}
              </button>
            </div>

            <div className="space-y-6">
              
              {/* Field Username */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <User size={16} /> Username
                </label>
                <input
                  type="text"
                  value={courierData.username}
                  onChange={(e) => setCourierData({...courierData, username: e.target.value})}
                  disabled={!isEditing}
                  className={`w-full p-4 rounded-xl text-sm font-medium border ${isEditing ? "bg-white border-green-400 focus:ring-2 focus:ring-green-100 outline-none text-black" : "bg-gray-50/50 border-gray-100 text-gray-500"}`}
                />
              </div>

              {/* Field Email (Terkunci) */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <Mail size={16} /> Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={courierData.email}
                    disabled
                    className="w-full p-4 rounded-xl text-sm font-medium border bg-green-50/30 border-green-100 text-gray-500 pr-12"
                  />
                  <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                </div>
              </div>

              {/* Field Nomor Telepon */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <Phone size={16} /> Nomor Telepon
                </label>
                <input
                  type="text"
                  value={courierData.phone}
                  onChange={(e) => setCourierData({...courierData, phone: e.target.value})}
                  disabled={!isEditing}
                  className={`w-full p-4 rounded-xl text-sm font-medium border ${isEditing ? "bg-white border-green-400 focus:ring-2 focus:ring-green-100 outline-none text-black" : "bg-gray-50/50 border-gray-100 text-gray-500"}`}
                />
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}