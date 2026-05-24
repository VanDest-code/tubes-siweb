"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function BerhasilContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Tangkap parameter ?resi= dari URL. Jika tidak ada, kasih default "Memuat..."
  const nomorResi = searchParams.get("resi") || "Memuat...";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <h2 className="text-2xl font-bold mb-2">Request Berhasil! 🎉</h2>
      <p className="text-gray-500 mb-10 text-sm">Kurir akan segera menjemput paketmu</p>
      
      <div className="bg-white border border-black rounded-[30px] p-10 w-full max-w-md shadow-sm mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-bold">Nomor Resi</p>
        {/* Tampilkan nomor resi dinamis di sini */}
        <p className="text-3xl font-extrabold text-green-600 mb-4 tracking-tighter">
          {nomorResi}
        </p>
        <p className="text-sm text-gray-500 px-4">Simpan nomor ini untuk melacak paketmu</p>
      </div>

      <button 
        onClick={() => router.push("/auth/dashboard/pelanggan")}
        className="w-full max-w-md bg-[#4CAF50] hover:bg-[#43A047] text-white py-4 rounded-2xl font-bold shadow-lg"
      >
        Kembali ke Dashboard
      </button>
    </div>
  );
}

export default function BerhasilPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center">Memuat data...</div>}>
      <BerhasilContent />
    </Suspense>
  );
}