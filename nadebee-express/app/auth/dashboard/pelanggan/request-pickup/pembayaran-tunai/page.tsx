"use client";

import { useRouter } from "next/navigation";
export default function TunaiPage() {
    const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <h2 className="text-2xl font-bold mb-2">Pembayaran Tunai</h2>
      <p className="text-gray-500 mb-8 text-sm">Lakukan pembayaran langsung saat kurir datang</p>
      
      <div className="bg-white border border-black rounded-[30px] p-10 w-full max-w-md shadow-sm mb-8">
        <span className="text-4xl mb-4 block">💵</span>
        <p className="font-bold text-lg mb-1">Bayar saat kurir datang ya..</p>
        <p className="text-gray-500">Siapkan uang tunai sebesar <span className="text-green-600 font-bold">Rp 20.000</span></p>
      </div>

      <button 
        onClick={() => router.push("/auth/dashboard/pelanggan/request-pickup/berhasil")}
        className="w-full max-w-md bg-[#4CAF50] text-white py-4 rounded-2xl font-bold shadow-lg"
      >
        Oke, saya mengerti.
      </button>
    </div>
  );
}