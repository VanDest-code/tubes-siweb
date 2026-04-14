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

    // Validasi Email
    if (!email.includes('@')) newErrors.email = "Format email salah (harus ada @)";
    if (!email) newErrors.email = "Email wajib diisi";

    // Validasi Password (8-12 Karakter)
    if (password.length < 8 || password.length > 12) {
      newErrors.password = "Password wajib 8 - 12 digit";
    }
    if (!password) newErrors.password = "Password wajib diisi";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Jika valid, tampilkan modal sukses
      setShowSuccess(true);
    }
  };

  return (
    <main className="min-h-screen bg-nadebee-green flex flex-col items-center px-6 py-12 relative font-poppins">
      <Link href="/auth/login" className="self-start text-gray-400 text-sm mb-12">← Kembali</Link>

      <div className="bg-nadebee-primary p-4 rounded-2xl text-white text-3xl mb-6 shadow-lg">👤</div>
      <h1 className="text-lg font-bold mb-8 text-gray-800 uppercase tracking-wide">Masuk sebagai Pelanggan</h1>

      <form onSubmit={handleLogin} className="w-full max-w-sm bg-white p-8 rounded-4xl border border-green-100 shadow-sm space-y-6">
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

        <button type="submit" className="w-full bg-nadebee-primary hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-all shadow-md active:scale-95">
          Login
        </button>

        <p className="text-center text-[10px] text-gray-500">
          Belum punya akun? <Link href="/auth/register/" className="text-nadebee-primary font-bold cursor-pointer hover:underline">Daftar</Link>
        </p>
      </form>

      {/* MODAL SUKSES (image_2b8e2c.png) */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 px-10">
          <div className="bg-white rounded-3xl p-8 w-full max-w-xs flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <div className="w-12 h-12 rounded-full border-2 border-nadebee-primary flex items-center justify-center text-nadebee-primary text-2xl mb-4">
              ✓
            </div>
            <h3 className="font-bold text-gray-800 mb-1">Login Berhasil.</h3>
            <p className="text-gray-500 text-sm mb-6">Selamat datang!</p>
            <Link href="/dashboard/pelanggan" className="w-full bg-nadebee-primary text-white font-bold py-3 rounded-xl text-center shadow-md">
              Oke
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}