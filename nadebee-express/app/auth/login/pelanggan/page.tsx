"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPelanggan() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    let newErrors: {email?: string; password?: string} = {};

    if (!email.includes('@')) newErrors.email = "Format email salah (harus ada @)";
    if (!email) newErrors.email = "Email wajib diisi";

    if (password.length < 8 || password.length > 12) {
      newErrors.password = "Password wajib 8 - 12 digit";
    }
    if (!password) newErrors.password = "Password wajib diisi";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setShowSuccess(true);
    }
  };

  return (
    <main className="min-h-screen bg-nadebee-green flex flex-col items-center relative font-poppins">
      
      {/* --- HEADER BAR (Sama dengan Login Kurir) --- */}
      <header className="w-full bg-white border-b border-gray-100 px-4 md:px-8 h-[80px] flex items-center justify-between sticky top-0 z-50">
        <Link href="/auth/login" className="text-gray-400 hover:text-gray-600 transition-all font-medium italic text-xs md:text-sm flex items-center gap-2">
          ← Kembali
        </Link>
        
        <div className="flex items-center gap-2">
           <span className="text-lg md:text-xl">🐝</span>
           <h1 className="text-sm md:text-lg font-black text-gray-900 tracking-tighter">
             Nadebee <span className="text-green-500">Express</span>
           </h1>
        </div>

        <div className="w-[60px] md:w-[80px]"></div>
      </header>

      {/* --- CONTENT AREA (Ukuran disamakan dengan Kurir) --- */}
      <div className="flex flex-col items-center px-6 py-8 md:py-12 w-full max-w-md">
        <div className="bg-nadebee-primary p-4 rounded-2xl text-white text-2xl md:text-3xl mb-6 shadow-lg">👤</div>
        <h1 className="text-base md:text-lg font-bold mb-6 md:mb-8 text-gray-800 uppercase tracking-wide text-center">
          Masuk sebagai Pelanggan
        </h1>

        {/* Padding p-6 md:p-8 disamakan agar ukuran form identik */}
        <form onSubmit={handleLogin} className="w-full bg-white p-6 md:p-8 rounded-[32px] border-none shadow-xl shadow-green-900/5 space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Email</label>
            <input 
              type="text"
              placeholder="Masukkan Email"
              className={`w-full bg-green-50/50 border ${errors.email ? 'border-red-400' : 'border-gray-100'} rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-nadebee-primary`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-[10px] text-red-500 mt-1 italic">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Password</label>
            <input 
              type="password"
              placeholder="Masukkan Password"
              className={`w-full bg-green-50/50 border ${errors.password ? 'border-red-400' : 'border-gray-100'} rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-nadebee-primary`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="text-[10px] text-red-500 mt-1 italic">{errors.password}</p>}
          </div>

          <button type="submit" className="w-full bg-nadebee-primary hover:bg-green-600 text-white font-bold py-3.5 md:py-4 rounded-xl transition-all shadow-md active:scale-95 text-sm md:text-base">
            Login
          </button>

          <p className="text-center text-[10px] text-gray-500">
            Belum punya akun? <Link href="/auth/register/" className="text-nadebee-primary font-bold cursor-pointer hover:underline">Daftar</Link>
          </p>
        </form>
      </div>

      {/* MODAL SUKSES (Ukuran disamakan) */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 px-6 md:px-10">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-xs flex flex-col items-center animate-in fade-in zoom-in duration-300 shadow-2xl">
            <div className="w-12 h-12 rounded-full border-2 border-nadebee-primary flex items-center justify-center text-nadebee-primary text-2xl mb-4">
              ✓
            </div>
            <h3 className="font-bold text-gray-800 text-sm md:text-base mb-1">Login Berhasil.</h3>
            <p className="text-gray-500 text-[11px] md:text-sm mb-6 text-center">Selamat datang!</p>
            <Link href="/auth/dashboard/pelanggan" className="w-full bg-nadebee-primary text-white font-bold py-3 rounded-xl text-center shadow-md text-sm">
              Oke
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}