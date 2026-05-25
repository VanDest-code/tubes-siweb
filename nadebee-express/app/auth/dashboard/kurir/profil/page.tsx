"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Truck, Edit3, Lock, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase"; // Pastikan path ini benar

export default function ProfilPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simulasi Login: Menggunakan ID Budi dari database-mu
  const courierId = "a2c08fd2-ccc2-4271-8a7b-b74870c9dd60";

  // State untuk data form
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); 
  const [phone, setPhone] = useState("");
  const [vehicle, setVehicle] = useState("");
  
  // State untuk statistik
  const [stats, setStats] = useState({ total: 0, rating: 0, onTime: 0 });

  // Tarik data profil dari Supabase saat halaman dimuat
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("couriers")
          .select("*")
          .eq("id", courierId)
          .single();

        if (error) throw error;
        
        if (data) {
          setUsername(data.username || "");
          setEmail(data.email || "");
          setPhone(data.phone || "");
          setVehicle(data.vehicle || "Belum diatur");
          setStats({
            total: data.total_pengiriman || 0,
            rating: data.rating || 0,
            onTime: data.on_time_percentage || 0
          });
        }
      } catch (error) {
        console.error("Gagal memuat profil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Fungsi simpan update ke database
  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("couriers")
        .update({ username, phone, vehicle })
        .eq("id", courierId);

      if (error) throw error;
      
      setIsEditing(false);
      setShowSaveSuccess(true);
    } catch (error) {
      console.error("Gagal menyimpan perubahan:", error);
      alert("Gagal menyimpan, silakan coba lagi.");
    }
  };

  if (loading) {
    return <div className="text-center py-20 font-bold text-[#4CAF50] animate-pulse">Memuat Profil...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 relative">
      {/* POP-UP SUKSES SIMPAN */}
      {showSaveSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
          <div className="bg-white rounded-[32px] p-10 max-w-sm w-full text-center relative z-10 shadow-2xl animate-in zoom-in duration-300">
            <div className="w-16 h-16 border-2 border-green-500 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-8">Perubahan Berhasil Disimpan</h2>
            <button 
              onClick={() => setShowSaveSuccess(false)}
              className="w-full bg-[#4CAF50] text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-colors"
            >
              Oke
            </button>
          </div>
        </div>
      )}

      {/* Header Halaman */}
      <div className="text-center">
        <h1 className="text-2xl font-black text-gray-900">Profil Kurir</h1>
        <p className="text-sm text-gray-500 font-medium">Kelola Informasi akunmu</p>
      </div>

      {/* 1. Card Statistik Profil */}
      <div className="bg-white border border-green-500 rounded-[32px] p-8 shadow-sm">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-white border border-green-500 rounded-full flex items-center justify-center mb-4">
            <User size={40} className="text-green-500" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-8">{username}</h2>

          <div className="flex w-full items-center justify-between px-4">
            <div className="text-center flex-1">
              <p className="text-2xl font-black text-green-600">{stats.total}</p>
              <p className="text-xs font-bold text-gray-400 mt-1">Pengiriman</p>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center flex-1">
              <p className="text-2xl font-black text-[#F3D45F]">{stats.rating.toFixed(1)}</p>
              <p className="text-xs font-bold text-gray-400 mt-1">Rating</p>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center flex-1">
              <p className="text-2xl font-black text-blue-500">{stats.onTime}</p>
              <p className="text-xs font-bold text-gray-400 mt-1">On-Time</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Card Informasi Pribadi */}
      <div className="bg-white border border-green-500 rounded-[32px] p-8 shadow-sm space-y-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-black text-gray-900">Informasi Pribadi</h3>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`transition-all p-2 rounded-lg ${isEditing ? "bg-green-500 text-white" : "text-green-500 hover:bg-green-50"}`}
          >
            <Edit3 size={20} />
          </button>
        </div>

        <div className="space-y-4 text-sm">
          {/* Username */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-black text-gray-600 italic">
              <User size={16} /> Username
            </label>
            <input 
              type="text"
              value={username}
              disabled={!isEditing}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 font-medium transition-all ${
                isEditing ? "border-green-400 text-gray-900" : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
              }`}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-black text-gray-600 italic">
              <Mail size={16} /> Email
            </label>
            <div className="relative">
              <input 
                type="email"
                value={email}
                disabled
                className="w-full p-3 bg-green-50 border border-green-200 rounded-xl text-gray-400 font-medium cursor-not-allowed"
              />
              <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
            </div>
          </div>

          {/* Nomor Telepon */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-black text-gray-600 italic">
              <Phone size={16} /> Nomor Telepon
            </label>
            <input 
              type="text"
              value={phone}
              disabled={!isEditing}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 font-medium transition-all ${
                isEditing ? "border-green-400 text-gray-900" : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
              }`}
            />
          </div>

          {/* Kendaraan */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-black text-gray-600 italic">
              <Truck size={16} /> Kendaraan
            </label>
            <input 
              type="text"
              value={vehicle}
              disabled={!isEditing}
              onChange={(e) => setVehicle(e.target.value)}
              className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 font-medium transition-all ${
                isEditing ? "border-green-400 text-gray-900" : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
              }`}
            />
          </div>
        </div>

        {/* Submit Button */}
        {isEditing && (
          <div className="pt-4 flex justify-center animate-in fade-in slide-in-from-top-2 duration-300">
            <button 
              onClick={handleSave}
              className="w-3/5 bg-[#4CAF50] text-white font-bold py-3.5 rounded-full hover:bg-green-600 transition-all shadow-lg shadow-green-100 text-sm"
            >
              Simpan Profil
            </button>
          </div>
        )}
      </div>
    </div>
  );
}