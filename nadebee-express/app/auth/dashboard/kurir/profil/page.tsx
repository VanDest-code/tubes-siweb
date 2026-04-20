"use client";

import { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Truck, 
  Edit3,
  Lock,
  CheckCircle2
} from "lucide-react";

export default function ProfilPage() {
  // State untuk mengontrol mode edit, pop-up sukses, dan data form
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const [username, setUsername] = useState("Budianto");
  const [email] = useState("kurirbudi@gmail.com"); 
  const [phone, setPhone] = useState("089999999999");
  const [vehicle, setVehicle] = useState("Vario - KT 8665");

  // Fungsi untuk menangani simpan profil
  const handleSave = () => {
    setIsEditing(false);
    setShowSaveSuccess(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 relative">
      
      {/* POP-UP SUKSES SIMPAN (SESUAI GAMBAR) */}
      {showSaveSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay Blur */}
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
          
          {/* Box Modal Center */}
          <div className="bg-white rounded-[32px] p-10 max-w-sm w-full text-center relative z-10 shadow-2xl animate-in zoom-in duration-300">
            <div className="w-16 h-16 border-2 border-green-500 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} />
            </div>
            
            <h2 className="text-lg font-bold text-gray-900 mb-8">
              Perubahan Berhasil Disimpan
            </h2>
            
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
              <p className="text-2xl font-black text-green-600">127</p>
              <p className="text-xs font-bold text-gray-400 mt-1">Pengiriman</p>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center flex-1">
              <p className="text-2xl font-black text-[#F3D45F]">4.9</p>
              <p className="text-xs font-bold text-gray-400 mt-1">Rating</p>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center flex-1">
              <p className="text-2xl font-black text-blue-500">98</p>
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

          {/* Email (Always Read-Only) */}
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