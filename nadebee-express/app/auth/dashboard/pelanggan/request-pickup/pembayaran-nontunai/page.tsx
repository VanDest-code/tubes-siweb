"use client";

import { useRouter } from "next/navigation";
export default function NontunaiPage() {
    const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <h2 className="text-2xl font-bold mb-2">Pembayaran Nontunai</h2>
      <p className="text-gray-500 mb-8 text-sm">Scan kode dibawah untuk melakukan pembayaran</p>
      
      <div className="bg-white border border-black rounded-[30px] p-8 w-full max-w-md shadow-sm mb-8 flex flex-col items-center">
        <div className="bg-gray-100 w-48 h-48 mb-6 flex items-center justify-center rounded-xl">
           {/* Ganti dengan Image QRIS kamu */}
           <span className="text-gray-400">QR CODE</span>
        </div>
        <div className="bg-[#E8F5E9] w-full py-4 rounded-2xl border border-green-200 text-center">
          <p className="text-xs text-gray-500">Total Pembayaran</p>
          <p className="text-xl font-bold text-green-600">RP 20.000</p>
        </div>
        <p className="mt-4 text-sm font-medium text-gray-400">Sisa waktu 05:00</p>
      </div>

      <button 
        onClick={() => router.push("/auth/dashboard/pelanggan/request-pickup/berhasil")}
        className="w-full max-w-md bg-[#4CAF50] text-white py-4 rounded-2xl font-bold shadow-lg"
      >
        Saya sudah bayar
      </button>
    </div>
  );
}