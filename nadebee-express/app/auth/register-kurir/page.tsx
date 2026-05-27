"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import LogoNadebee from "@/public/logo.png"; // Pastikan path logo sama dengan milik pelanggan

export default function RegisterKurirPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState(""); 
  
  // Menambahkan email dan kode_kurir agar sesuai dengan kebutuhan halaman Login Kurir
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setRegisterError("");

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
            rating: 5.0 // Rating default awal
          }
        ]);

      if (error) throw error;
      
      alert("Pendaftaran Mitra Kurir Berhasil! Silakan masuk.");
      router.push("/auth/login"); // Arahkan ke halaman login
    } catch (error: any) {
      setRegisterError("Gagal mendaftar: " + error.message);
    } finally {
      setIsLoading(false);
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
              required
              type="text"
              name="username"
              placeholder="Contoh: Budi Santoso"
              className="w-full bg-[#EBF5EB] border border-transparent rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-green-500 transition-colors placeholder:text-gray-400"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2">Email</label>
            <input 
              required
              type="email"
              name="email"
              placeholder="Contoh: kurirbudi@gmail.com"
              className="w-full bg-[#EBF5EB] border border-transparent rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-green-500 transition-colors placeholder:text-gray-400"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
             <label className="block text-xs font-bold text-gray-800 mb-2">Kode Kurir (Password)</label>
             <input 
               required
               type="password"
               name="kode_kurir"
               placeholder="Buat kode rahasia untuk login"
               className="w-full bg-[#EBF5EB] border border-transparent rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-green-500 transition-colors placeholder:text-gray-400"
               value={formData.kode_kurir}
               onChange={handleChange}
             />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2">Nomor Telepon</label>
            <input 
              required
              type="text"
              name="phone"
              placeholder="Contoh: 08123456789"
              className="w-full bg-[#EBF5EB] border border-transparent rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-green-500 transition-colors placeholder:text-gray-400"
              value={formData.phone}
              onChange={handleChange}
            />
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
                  required
                  type="text"
                  name="plat_nomor"
                  placeholder="Misal: AB 1234 CD"
                  className="w-full bg-[#EBF5EB] border border-transparent rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-green-500 transition-colors placeholder:text-gray-400 uppercase"
                  value={formData.plat_nomor}
                  onChange={handleChange}
                />
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