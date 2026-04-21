"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function LoginKurir() {
  const [email, setEmail] = useState('');
  const [kurirCode, setKurirCode] = useState('');
  const [errors, setErrors] = useState<{email?: string; code?: string}>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    let newErrors: {email?: string; code?: string} = {};

    // Validasi Email
    if (!email) {
      newErrors.email = "Email wajib diisi";
    } else if (!email.includes('@')) {
      newErrors.email = "Gunakan format Email! cth: kurirbudi@gmail.com";
    }

    // Validasi Kode Kurir (Contoh: Harus 6 digit angka)
    if (!kurirCode) {
      newErrors.code = "Kode kurir wajib diisi";
    } else if (kurirCode.length !== 6) {
      newErrors.code = "Gunakan kode yang diberikan perusahaan (232424)";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setShowSuccess(true);
    }
  };

  return (
    <main className="min-h-screen bg-nadebee-green flex flex-col items-center relative font-poppins">
      
      {/* --- HEADER BAR --- */}
      <header className="w-full bg-white border-b border-gray-100 px-8 h-[80px] flex items-center justify-between sticky top-0 z-50">
        <Link href="/auth/login" className="text-gray-400 hover:text-gray-600 transition-all font-medium italic text-sm flex items-center gap-2">
          ← Kembali
        </Link>
        
        <div className="flex items-center gap-2">
           <span className="text-xl">🐝</span>
           <h1 className="text-lg font-black text-gray-900 tracking-tighter">
             Nadebee <span className="text-green-500">Express</span>
           </h1>
        </div>

        {/* Spacer agar logo tetap di tengah */}
        <div className="w-[80px]"></div>
      </header>

      {/* --- CONTENT AREA --- */}
      <div className="flex flex-col items-center px-6 py-12 w-full">
        {/* Icon Kurir */}
        <div className="bg-nadebee-primary p-4 rounded-2xl text-white text-3xl mb-6 shadow-lg">
          🚚
        </div>
        
        <h1 className="text-lg font-bold mb-8 text-gray-800 uppercase tracking-wide">Masuk sebagai Kurir</h1>

        <form onSubmit={handleLogin} className="w-full max-w-sm bg-white p-8 rounded-[32px] border-none shadow-xl shadow-green-900/5 space-y-6">
          {/* Input Email */}
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

          {/* Input Kode Kurir */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Kode Kurir</label>
            <input 
              type="text"
              placeholder="Masukkan Kode Kurir"
              className={`w-full bg-green-50/50 border ${errors.code ? 'border-red-400' : 'border-gray-100'} rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-nadebee-primary`}
              value={kurirCode}
              onChange={(e) => setKurirCode(e.target.value)}
            />
            {errors.code && <p className="text-[10px] text-red-500 mt-1 italic">{errors.code}</p>}
          </div>

          <button type="submit" className="w-full bg-nadebee-primary hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-all shadow-md active:scale-95">
            Masuk
          </button>
        </form>
      </div>

      {/* MODAL SUKSES KURIR */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 px-10">
          <div className="bg-white rounded-3xl p-8 w-full max-w-xs flex flex-col items-center animate-in fade-in zoom-in duration-300 shadow-2xl">
            <div className="w-12 h-12 rounded-full border-2 border-nadebee-primary flex items-center justify-center text-nadebee-primary text-2xl mb-4">
              ✓
            </div>
            <h3 className="font-bold text-gray-800 text-center leading-tight mb-6">
              Selamat datang dan <br /> selamat bekerja!
            </h3>
            <Link href="/auth/dashboard/kurir" className="w-full bg-nadebee-primary text-white font-bold py-3 rounded-xl text-center shadow-md">
              Oke
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}