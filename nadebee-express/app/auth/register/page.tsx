"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPelanggan() {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    nomorTelepon: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    let newErrors: Record<string, string> = {};

    // Validasi Nama
    if (!formData.nama) {
      newErrors.nama = "Nama wajib diisi";
    } else if (formData.nama.length > 6) {
      newErrors.nama = "Maks. 6 karakter";
    }

    // Validasi Email
    if (!formData.email) {
      newErrors.email = "Email wajib diisi";
    } else if (!formData.email.includes('@')) {
      newErrors.email = "Gunakan format Email! cth: pratisthanatalie@gmail.com";
    }

    // Validasi Nomor Telepon
    if (!formData.nomorTelepon) {
      newErrors.nomorTelepon = "No.Telepon wajib diisi";
    } else if (!/^\d+$/.test(formData.nomorTelepon)) {
      newErrors.nomorTelepon = "No.Telepon harus angka";
    }

    // Validasi Password (Min 8 & Maks 12 digit)
    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 8 || formData.password.length > 12) {
      newErrors.password = "Min. 8 digit & Maks. 12 digit";
    }

    // Validasi Konfirmasi Password
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Password tidak valid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log("Registrasi Berhasil", formData);
      // Lanjut ke logika sukses atau redirect
    }
  };

  return (
    <main className="min-h-screen bg-nadebee-green flex flex-col items-center px-6 py-10 font-poppins">
      <Link href="/auth/login/pelanggan" className="self-start text-gray-400 text-sm mb-6">← Kembali</Link>

      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">Daftar Akun Baru</h1>
        <p className="text-[10px] text-gray-500 max-w-50 mx-auto mt-1">
          Daftar sekarang dan mulai pengalaman menarikmu bersama Nadebee Express!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 rounded-4xl border border-green-100 shadow-sm space-y-4">
        {/* Input Nama */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Nama</label>
          <input 
            type="text"
            className={`w-full bg-green-50/50 border ${errors.nama ? 'border-red-400' : 'border-gray-100'} rounded-xl py-2 px-4 text-sm focus:outline-none`}
            value={formData.nama}
            onChange={(e) => setFormData({...formData, nama: e.target.value})}
          />
          {errors.nama && <p className="text-[10px] text-red-500 mt-1 italic">{errors.nama}</p>}
        </div>

        {/* Input Email */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
          <input 
            type="text"
            className={`w-full bg-green-50/50 border ${errors.email ? 'border-red-400' : 'border-gray-100'} rounded-xl py-2 px-4 text-sm focus:outline-none`}
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          {errors.email && <p className="text-[10px] text-red-500 mt-1 italic">{errors.email}</p>}
        </div>

        {/* Input Nomor Telepon */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Nomor Telepon</label>
          <input 
            type="text"
            className={`w-full bg-green-50/50 border ${errors.nomorTelepon ? 'border-red-400' : 'border-gray-100'} rounded-xl py-2 px-4 text-sm focus:outline-none`}
            value={formData.nomorTelepon}
            onChange={(e) => setFormData({...formData, nomorTelepon: e.target.value})}
          />
          {errors.nomorTelepon && <p className="text-[10px] text-red-500 mt-1 italic">{errors.nomorTelepon}</p>}
        </div>

        {/* Input Password */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
          <input 
            type="password"
            className={`w-full bg-green-50/50 border ${errors.password ? 'border-red-400' : 'border-gray-100'} rounded-xl py-2 px-4 text-sm focus:outline-none`}
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          {errors.password && <p className="text-[10px] text-red-500 mt-1 italic">{errors.password}</p>}
        </div>

        {/* Input Konfirmasi Password */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Konfirmasi Password</label>
          <input 
            type="password"
            placeholder="ulangi password"
            className={`w-full bg-green-50/50 border ${errors.confirmPassword ? 'border-red-400' : 'border-gray-100'} rounded-xl py-2 px-4 text-sm focus:outline-none`}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
          />
          {errors.confirmPassword && <p className="text-[10px] text-red-500 mt-1 italic">{errors.confirmPassword}</p>}
        </div>

        <button type="submit" className="w-full bg-nadebee-primary hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-all shadow-md mt-4">
          Daftar
        </button>
      </form>

      <p className="mt-6 text-[10px] text-gray-500">
        Sudah punya akun? <Link href="/auth/login/pelanggan" className="text-nadebee-primary font-bold">Login</Link>
      </p>
    </main>
  );
}