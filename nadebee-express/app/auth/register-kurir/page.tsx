"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import LogoNadebee from "@/public/logo.png"; 

export default function RegisterKurirPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState(""); 
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    kode_kurir: "",
    phone: "",
    jenis_kendaraan: "Motor",
    plat_nomor: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors: Record<string, string> = {};

    // 1. Validasi Nama
    if (!formData.username) {
      newErrors.username = "Nama wajib diisi";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Minimal 3 karakter";
    } else if (formData.username.length > 30) {
      newErrors.username = "Maksimal 30 karakter";
    } else if (!/^[a-zA-Z0-9 ]+$/.test(formData.username)) {
      newErrors.username = "Hanya boleh huruf, angka, dan spasi";
    }

    // 2. Validasi Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email wajib diisi";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Format tidak valid! cth: kurir@gmail.com";
    }

    // 3. Validasi Kode Kurir (Password)
    if (!formData.kode_kurir) {
      newErrors.kode_kurir = "Kode kurir wajib diisi";
    } else if (!/^\d{6}$/.test(formData.kode_kurir)) { // <-- Ganti \d{5} jadi \d{6}
      newErrors.kode_kurir = "Kode kurir harus persis 6 digit angka"; // <-- Ganti teksnya
    }

    // 4. Validasi Nomor Telepon
    if (!formData.phone) {
      newErrors.phone = "No.Telepon wajib diisi";
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = "No.Telepon harus angka";
    } else if (formData.phone.length < 10 || formData.phone.length > 13) {
      newErrors.phone = "Nomor telepon harus 10-13 digit";
    }
    
    // 5. Validasi Plat Nomor
    if (!formData.plat_nomor) {
        newErrors.plat_nomor = "Plat nomor wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");

    if (validate()) { 
      setIsLoading(true);
      try {
        const { error } = await supabase
          .from("couriers")
          .insert([
            {
              username: formData.username,
              email: formData.email,
              kode_kurir: formData.kode_kurir,
              phone: formData.phone,
              jenis_kendaraan: formData.jenis_kendaraan,
              plat_nomor: formData.plat_nomor,
              rating: 5.0 
            }
          ]);

        if (error) throw error;
        
        alert("Pendaftaran Mitra Kurir Berhasil! Silakan masuk.");
        router.push("/auth/login"); 
      } catch (error: any) {
        setRegisterError("Gagal mendaftar: " + error.message);
      } finally {
        setIsLoading(false);
      }
    } 
  };

  return (
    <main className="min-h-screen bg-[#F4F9F4] flex flex-col items-center relative font-poppins pb-16">
      
      {/* --- HEADER BAR --- */}
      <header className="w-full bg-white border-b border-gray-100 px-4 md:px-8 h-[80px] flex items-center justify-between sticky top-0 z-50">
        <Link href="/auth/login" className="text-gray-400 hover:text-gray-600 transition-all font-medium italic text-xs md:text-sm flex items-center gap-2">
          ← Kembali
        </Link>
        
        <div className="flex items-center gap-2">
           <Image src={LogoNadebee} alt="Nadebee Icon" width={28} height={28} className="object-contain" />
           <h1 className="text-sm md:text-lg font-black text-gray-900 tracking-tighter">
             Nadebee <span className="text-green-500">Express</span>
           </h1>
        </div>

        <div className="w-[60px] md:w-[80px]"></div>
      </header>

      {/* --- CONTENT AREA --- */}
      <div className="flex flex-col items-center w-full max-w-lg px-6 pt-12">
        
        <div className="text-center mb-10">
          <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
            Daftar Mitra Kurir
          </h1>
          <p className="text-[12px] md:text-sm text-gray-500 max-w-xs mx-auto mt-2 leading-relaxed">
            Bergabunglah menjadi pahlawan pengiriman Nadebee Express sekarang juga!
          </p>
        </div>

        <form onSubmit={handleRegister} className="w-full bg-white p-10 rounded-[40px] border border-green-400 shadow-sm space-y-6">
          
          {registerError && (
            <div className="bg-red-50 border border-red-200 text-red-500 text-xs p-3 rounded-xl text-center font-medium">
              {registerError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2">Nama Lengkap</label>
            <input 
              type="text"
              name="username"
              placeholder="Contoh: Budi Santoso"
              className={`w-full bg-[#EBF5EB] border ${errors.username ? 'border-red-400' : 'border-transparent'} rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-green-500 transition-colors placeholder:text-gray-400`}
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <p className="text-[10px] text-red-500 mt-1 italic">{errors.username}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2">Email</label>
            <input 
              type="email"
              name="email"
              placeholder="Contoh: kurirbudi@gmail.com"
              className={`w-full bg-[#EBF5EB] border ${errors.email ? 'border-red-400' : 'border-transparent'} rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-green-500 transition-colors placeholder:text-gray-400`}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-[10px] text-red-500 mt-1 italic">{errors.email}</p>}
          </div>

          <div>
             <label className="block text-xs font-bold text-gray-800 mb-2">Kode Kurir (Password)</label>
             <input 
               type="password"
               name="kode_kurir"
               placeholder="Buat kode rahasia untuk login"
               className={`w-full bg-[#EBF5EB] border ${errors.kode_kurir ? 'border-red-400' : 'border-transparent'} rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-green-500 transition-colors placeholder:text-gray-400`}
               value={formData.kode_kurir}
               onChange={handleChange}
             />
             {errors.kode_kurir && <p className="text-[10px] text-red-500 mt-1 italic">{errors.kode_kurir}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2">Nomor Telepon</label>
            <input 
              type="text"
              name="phone"
              placeholder="Contoh: 08123456789"
              className={`w-full bg-[#EBF5EB] border ${errors.phone ? 'border-red-400' : 'border-transparent'} rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-green-500 transition-colors placeholder:text-gray-400`}
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <p className="text-[10px] text-red-500 mt-1 italic">{errors.phone}</p>}
          </div>

          <div className="flex gap-4">
             <div className="w-1/2">
                <label className="block text-xs font-bold text-gray-800 mb-2">Jenis Kendaraan</label>
                <select 
                  name="jenis_kendaraan"
                  className="w-full bg-[#EBF5EB] border border-transparent rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-green-500 transition-colors cursor-pointer"
                  value={formData.jenis_kendaraan}
                  onChange={handleChange}
                >
                  <option value="Motor">Motor</option>
                  <option value="Mobil">Mobil</option>
                </select>
             </div>

             <div className="w-1/2">
                <label className="block text-xs font-bold text-gray-800 mb-2">Plat Nomor</label>
                <input 
                  type="text"
                  name="plat_nomor"
                  placeholder="Misal: AB 1234 CD"
                  className={`w-full bg-[#EBF5EB] border ${errors.plat_nomor ? 'border-red-400' : 'border-transparent'} rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-green-500 transition-colors placeholder:text-gray-400 uppercase`}
                  value={formData.plat_nomor}
                  onChange={handleChange}
                />
                {errors.plat_nomor && <p className="text-[10px] text-red-500 mt-1 italic">{errors.plat_nomor}</p>}
             </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`flex items-center justify-center w-full h-14 rounded-2xl bg-[#4CAF50] text-white font-black text-lg shadow-lg hover:bg-[#43A047] transition-all active:scale-[0.98] mt-8 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Memproses...' : 'Daftar Menjadi Mitra'}
          </button>
        </form>

      </div>

      <p className="text-center text-gray-600 text-sm mt-6">
        Sudah terdaftar menjadi mitra? <Link href="/auth/login" className="text-[#4CAF50] font-bold hover:underline">Masuk di sini</Link>
      </p>

    </main>
  );
}