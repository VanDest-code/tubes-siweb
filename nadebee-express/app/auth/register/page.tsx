"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import LogoNadebee from "@/public/logo.png";
import { User, Truck, ArrowLeft } from 'lucide-react';

export default function UnifiedRegister() {
  const router = useRouter(); 
  
  const [activeTab, setActiveTab] = useState<"pelanggan" | "kurir">("pelanggan");
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState(""); 
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '', 
    kode_kurir: '',
    jenis_kendaraan: 'Motor',
    plat_nomor: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    let newErrors: Record<string, string> = {};

    // Validasi Umum (Nama, Email, Telepon)
    if (!formData.username) {
      newErrors.username = "Nama wajib diisi";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Minimal 3 karakter";
    } else if (!/^[a-zA-Z0-9 ]+$/.test(formData.username)) {
      newErrors.username = "Hanya boleh huruf, angka, dan spasi";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email wajib diisi";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Format tidak valid! cth: email@gmail.com";
    }

    if (!formData.phone) {
      newErrors.phone = "No.Telepon wajib diisi";
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = "No.Telepon harus angka";
    } else if (formData.phone.length < 10 || formData.phone.length > 13) {
      newErrors.phone = "Harus 10-13 digit";
    }

    // Validasi Spesifik Pelanggan
    if (activeTab === 'pelanggan') {
      if (!formData.password) {
        newErrors.password = "Password wajib diisi";
      } else if (formData.password.length < 8 || formData.password.length > 12) {
        newErrors.password = "Min. 8 digit & Maks. 12 digit";
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Konfirmasi Password wajib diisi";
      } else if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = "Password tidak cocok";
      }
    } 
    // Validasi Spesifik Kurir
    else {
      if (!formData.kode_kurir) {
        newErrors.kode_kurir = "Kode kurir wajib diisi";
      } else if (!/^\d{6}$/.test(formData.kode_kurir)) { 
        newErrors.kode_kurir = "Harus persis 6 digit angka"; 
      }

      if (!formData.plat_nomor) {
        newErrors.plat_nomor = "Plat nomor wajib diisi";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");

    if (validate()) { 
      setLoading(true);
      try {
        if (activeTab === 'pelanggan') {
          const { error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
              data: {
                username: formData.username,
                phone: formData.phone,
              }
            }
          });
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("couriers")
            .insert([{
              username: formData.username,
              email: formData.email,
              kode_kurir: formData.kode_kurir,
              phone: formData.phone,
              jenis_kendaraan: formData.jenis_kendaraan,
              plat_nomor: formData.plat_nomor,
              rating: 5.0 
            }]);
          
          // --- INI BAGIAN PENTING UNTUK MENGUBAH ERROR TEKNIS ---
          if (error) {
            if (error.code === '23505') {
              throw new Error("User already registered.");
            }
            throw error;
          }
        }
        
        alert(`Pendaftaran ${activeTab === 'pelanggan' ? 'Akun' : 'Mitra'} Berhasil! Silakan masuk.`);
        router.push("/auth/login"); 
      } catch (error: any) {
        // Jika errornya berasal dari auth Supabase, kita juga tangkap
        const msg = error.message === "User already registered" 
          ? "Email ini sudah terdaftar sebagai pelanggan." 
          : error.message;
        setRegisterError(msg || "Terjadi kesalahan saat mendaftar.");
      } finally {
        setLoading(false);
      }
    } 
  };

  return (
    <main className="min-h-screen bg-[#F4F9F4] flex flex-col items-center relative font-poppins pb-16 w-full overflow-x-hidden">
      
      {/* --- HEADER BAR RESPONSIVE --- */}
      <header className="w-full bg-white border-b border-gray-100 px-4 md:px-8 h-[80px] flex items-center justify-between sticky top-0 z-50">
        <button onClick={() => router.push('/auth/login')} className="text-gray-400 hover:text-gray-600 transition-all font-medium italic text-xs md:text-sm flex items-center gap-1">
          <ArrowLeft size={16} /> Batal
        </button>
        <div className="flex items-center gap-1.5 md:gap-2">
           <Image src={LogoNadebee} alt="Nadebee Icon" width={24} height={24} className="object-contain md:w-7 md:h-7" />
           <h1 className="text-xs md:text-lg font-black text-gray-900 tracking-tighter">
             Nadebee <span className="text-green-500">Express</span>
           </h1>
        </div>
        <div className="w-[50px] md:w-[80px]"></div>
      </header>

      {/* --- CONTENT AREA RESPONSIVE --- */}
      <div className="flex flex-col items-center w-full max-w-md px-4 sm:px-6 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="text-center mb-6">
          <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight mb-1">Buat Akun Baru</h1>
          <p className="text-xs md:text-sm text-gray-500 font-medium">Pilih peranmu dan isi data diri di bawah ini.</p>
        </div>

        {/* --- TOGGLE SWITCH ROLE --- */}
        <div className="bg-gray-200/60 p-1 rounded-full flex w-full mb-6 relative shadow-inner border border-gray-100">
          <button
            type="button"
            onClick={() => { setActiveTab('pelanggan'); setErrors({}); setRegisterError(""); }}
            className={`flex-1 py-2.5 md:py-3 text-xs md:text-sm font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-1.5 md:gap-2 ${
              activeTab === 'pelanggan' ? 'bg-white text-green-600 shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <User size={16} /> Pelanggan
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('kurir'); setErrors({}); setRegisterError(""); }}
            className={`flex-1 py-2.5 md:py-3 text-xs md:text-sm font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-1.5 md:gap-2 ${
              activeTab === 'kurir' ? 'bg-white text-green-600 shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Truck size={16} /> Mitra Kurir
          </button>
        </div>

        <form onSubmit={handleRegister} className="w-full bg-white p-5 sm:p-6 md:p-8 rounded-[28px] md:rounded-[32px] border border-green-100 shadow-xl shadow-green-900/5 space-y-4 md:space-y-5">
          
          {registerError && (
            <div className="bg-red-50 border border-red-200 text-red-500 text-[10px] md:text-xs p-3 rounded-xl text-center font-medium">
              {registerError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">Nama Lengkap</label>
            <input 
              type="text"
              name="username"
              placeholder="Contoh: Budi Santoso"
              className={`w-full bg-[#EBF5EB]/50 border ${errors.username ? 'border-red-400' : 'border-transparent'} rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-green-500 transition-colors placeholder:text-gray-400`}
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <p className="text-[10px] text-red-500 mt-1 italic">{errors.username}</p>}
          </div>

          {/* Grid dibentuk flex-col di mobile supaya form input memanjang ke bawah dan lebar proporsional */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-800 mb-1.5">Email</label>
              <input 
                type="email"
                name="email"
                placeholder="email@gmail.com"
                className={`w-full bg-[#EBF5EB]/50 border ${errors.email ? 'border-red-400' : 'border-transparent'} rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-green-500 transition-colors placeholder:text-gray-400`}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-[10px] text-red-500 mt-1 italic">{errors.email}</p>}
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-800 mb-1.5">No. Whatsapp</label>
              <input 
                type="text"
                name="phone"
                placeholder="08123456789"
                className={`w-full bg-[#EBF5EB]/50 border ${errors.phone ? 'border-red-400' : 'border-transparent'} rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-green-500 transition-colors placeholder:text-gray-400`}
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <p className="text-[10px] text-red-500 mt-1 italic">{errors.phone}</p>}
            </div>
          </div>

          {/* INPUT KHUSUS PELANGGAN */}
          {activeTab === 'pelanggan' && (
            <div className="space-y-4 md:space-y-5 animate-in fade-in duration-300">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">Password</label>
                <input 
                  type="password"
                  name="password"
                  placeholder="Buat password"
                  className={`w-full bg-[#EBF5EB]/50 border ${errors.password ? 'border-red-400' : 'border-transparent'} rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-green-500 transition-colors placeholder:text-gray-400`}
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <p className="text-[10px] text-red-500 mt-1 italic">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">Konfirmasi Password</label>
                <input 
                  type="password"
                  name="confirmPassword"
                  placeholder="Ulangi password"
                  className={`w-full bg-[#EBF5EB]/50 border ${errors.confirmPassword ? 'border-red-400' : 'border-transparent'} rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-green-500 transition-colors placeholder:text-gray-400`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && <p className="text-[10px] text-red-500 mt-1 italic">{errors.confirmPassword}</p>}
              </div>
            </div>
          )}

          {/* INPUT KHUSUS KURIR */}
          {activeTab === 'kurir' && (
            <div className="space-y-4 md:space-y-5 animate-in fade-in duration-300">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">Kode Kurir (6 Digit Angka)</label>
                <input 
                  type="password"
                  name="kode_kurir"
                  placeholder="Buat PIN Rahasia"
                  className={`w-full bg-[#EBF5EB]/50 border ${errors.kode_kurir ? 'border-red-400' : 'border-transparent'} rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-green-500 transition-colors placeholder:text-gray-400`}
                  value={formData.kode_kurir}
                  onChange={handleChange}
                />
                {errors.kode_kurir && <p className="text-[10px] text-red-500 mt-1 italic">{errors.kode_kurir}</p>}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-800 mb-1.5">Kendaraan</label>
                  <select 
                    name="jenis_kendaraan"
                    className="w-full bg-[#EBF5EB]/50 border border-transparent rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-green-500 transition-colors cursor-pointer"
                    value={formData.jenis_kendaraan}
                    onChange={handleChange}
                  >
                    <option value="Motor">Motor</option>
                    <option value="Mobil">Mobil</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-800 mb-1.5">Plat Nomor</label>
                  <input 
                    type="text"
                    name="plat_nomor"
                    placeholder="AB 1234 CD"
                    className={`w-full bg-[#EBF5EB]/50 border ${errors.plat_nomor ? 'border-red-400' : 'border-transparent'} rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-green-500 transition-colors placeholder:text-gray-400 uppercase`}
                    value={formData.plat_nomor}
                    onChange={handleChange}
                  />
                  {errors.plat_nomor && <p className="text-[10px] text-red-500 mt-1 italic">{errors.plat_nomor}</p>}
                </div>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full bg-[#4CAF50] hover:bg-green-600 text-white font-black py-3.5 rounded-2xl transition-all shadow-lg active:scale-[0.98] text-sm md:text-base mt-4 h-12 md:h-14 flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Memproses...' : `Daftar sebagai ${activeTab === 'pelanggan' ? 'Pelanggan' : 'Mitra Kurir'}`}
          </button>
        </form>
      </div>

      <p className="text-center text-gray-600 text-xs md:text-sm mt-4">
        Sudah punya akun? <Link href="/auth/login" className="text-[#4CAF50] font-bold hover:underline cursor-pointer">Login di sini</Link>
      </p>

    </main>
  );
}