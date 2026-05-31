"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import LogoNadebee from "@/public/logo.png";

export default function RegisterPelanggan() {
  const router = useRouter(); 
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    nomorTelepon: '',
    password: '',
    confirmPassword: '', // <-- Sudah dikembalikan!
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState(""); 

  const validate = () => {
    let newErrors: Record<string, string> = {};

    // 1. Validasi Username
    if (!formData.username) {
      newErrors.username = "Username wajib diisi";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Minimal 3 karakter";
    } else if (formData.username.length > 30) {
      newErrors.username = "Maksimal 30 karakter";
    } else if (!/^[a-zA-Z0-9 ]+$/.test(formData.username)) {
      newErrors.username = "Hanya boleh huruf, angka, dan spasi";
    }
    
    // 2. REVISI ASDOS: Validasi Email Menggunakan Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email wajib diisi";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Format email tidak valid! cth: natalie@gmail.com";
    }

    // 3. REVISI ASDOS: Validasi Nomor Telepon (Angka & 10-13 Digit)
    if (!formData.nomorTelepon) {
      newErrors.nomorTelepon = "No.Telepon wajib diisi";
    } else if (!/^\d+$/.test(formData.nomorTelepon)) {
      newErrors.nomorTelepon = "No.Telepon harus angka";
    } else if (formData.nomorTelepon.length < 10 || formData.nomorTelepon.length > 13) {
      newErrors.nomorTelepon = "Nomor telepon harus 10-13 digit";
    }

    // 4. Validasi Password
    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 8 || formData.password.length > 12) {
      newErrors.password = "Min. 8 digit & Maks. 12 digit";
    }
    
    // 5. Validasi Konfirmasi Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi Password wajib diisi";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Password tidak cocok";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(""); 

    if (validate()) {
      setLoading(true);
      
      try {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              username: formData.username,
              phone: formData.nomorTelepon,
            }
          }
        });

        if (error) {
          setRegisterError(error.message);
        } else {
          alert("Registrasi Berhasil! Silakan login.");
          router.push("/auth/login"); 
        }
      } catch (err) {
        setRegisterError("Terjadi kesalahan sistem. Coba lagi nanti.");
      } finally {
        setLoading(false);
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
            Daftar Akun Baru
          </h1>
          <p className="text-[12px] md:text-sm text-gray-500 max-w-xs mx-auto mt-2 leading-relaxed">
            Daftar sekarang dan mulai pengalaman menarikmu bersama Nadebee Express!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full bg-white p-10 rounded-[40px] border border-green-400 shadow-sm space-y-6">
          
          {registerError && (
            <div className="bg-red-50 border border-red-200 text-red-500 text-xs p-3 rounded-xl text-center font-medium">
              Gagal mendaftar: Email sudah digunakan atau tidak valid.
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2">Username</label>
            <input 
              type="text"
              placeholder="Masukkan username"
              className={`w-full bg-[#EBF5EB] border ${errors.username ? 'border-red-400' : 'border-transparent'} rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-green-500 transition-colors placeholder:text-gray-400`}
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
            {errors.username && <p className="text-[10px] text-red-500 mt-1 italic">{errors.username}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2">Email</label>
            <input 
              type="email"
              placeholder="Masukkan Email"
              className={`w-full bg-[#EBF5EB] border ${errors.email ? 'border-red-400' : 'border-transparent'} rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-green-500 transition-colors placeholder:text-gray-400`}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            {errors.email && <p className="text-[10px] text-red-500 mt-1 italic">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2">Nomor Telepon</label>
            <input 
              type="text"
              placeholder="Masukkan Nomor Telepon"
              className={`w-full bg-[#EBF5EB] border ${errors.nomorTelepon ? 'border-red-400' : 'border-transparent'} rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-green-500 transition-colors placeholder:text-gray-400`}
              value={formData.nomorTelepon}
              onChange={(e) => setFormData({...formData, nomorTelepon: e.target.value})}
            />
            {errors.nomorTelepon && <p className="text-[10px] text-red-500 mt-1 italic">{errors.nomorTelepon}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2">Password</label>
            <input 
              type="password"
              placeholder="Masukkan Password"
              className={`w-full bg-[#EBF5EB] border ${errors.password ? 'border-red-400' : 'border-transparent'} rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-green-500 transition-colors placeholder:text-gray-400`}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            {errors.password && <p className="text-[10px] text-red-500 mt-1 italic">{errors.password}</p>}
          </div>

          {/* <-- Kolom Konfirmasi Password Dikembalikan --> */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2">Konfirmasi Password</label>
            <input 
              type="password"
              placeholder="Ulangi Password"
              className={`w-full bg-[#EBF5EB] border ${errors.confirmPassword ? 'border-red-400' : 'border-transparent'} rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-green-500 transition-colors placeholder:text-gray-400`}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
            {errors.confirmPassword && <p className="text-[10px] text-red-500 mt-1 italic">{errors.confirmPassword}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`flex items-center justify-center w-full h-14 rounded-2xl bg-[#4CAF50] text-white font-black text-lg shadow-lg hover:bg-[#43A047] transition-all active:scale-[0.98] mt-8 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

      </div>

      <p className="text-center text-gray-600 text-sm mt-4">
        Sudah punya akun? <Link href="/auth/login" className="text-[#4CAF50] font-bold hover:underline">Login</Link>
      </p>

    </main>
  );
}