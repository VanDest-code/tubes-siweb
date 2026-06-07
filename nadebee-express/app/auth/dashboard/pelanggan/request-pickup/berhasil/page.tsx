"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle } from "lucide-react"; // Import ikon profesional

function BerhasilContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Tangkap parameter ?resi= dari URL. Jika tidak ada, kasih default "Memuat..."
  const nomorResi = searchParams.get("resi") || "Memuat...";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 md:px-6">
      
      {/* Emoji diganti menjadi Icon dan disejajarkan dengan judul */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <h2 className="text-xl md:text-2xl font-bold">Request Berhasil!</h2>
        <CheckCircle className="text-[#4CAF50] w-6 h-6 md:w-7 md:h-7" />
      </div>
      
      <p className="text-gray-500 mb-8 md:mb-10 text-xs md:text-sm">Kurir akan segera menjemput paketmu</p>
      
      {/* Box resi dibuat lebih responsif padding dan sudutnya */}
      <div className="bg-white border border-black rounded-[24px] md:rounded-[30px] p-6 md:p-10 w-full max-w-md shadow-sm mb-6 md:mb-8">
        <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-widest mb-2 font-bold">Nomor Resi</p>
        
        {/* Tampilkan nomor resi dinamis di sini (ditambahkan break-all agar teks panjang tidak jebol di HP) */}
        <p className="text-2xl md:text-3xl font-extrabold text-green-600 mb-3 md:mb-4 tracking-tighter break-all">
          {nomorResi}
        </p>
        
        <p className="text-xs md:text-sm text-gray-500 px-2 md:px-4">Simpan nomor ini untuk melacak paketmu</p>
      </div>

      <button 
        onClick={() => router.push("/auth/dashboard/pelanggan")}
        className="w-full max-w-md bg-[#4CAF50] hover:bg-[#43A047] text-white py-3.5 md:py-4 rounded-[20px] md:rounded-2xl font-bold shadow-lg text-sm md:text-base transition-all"
      >
        Kembali ke Dashboard
      </button>
    </div>
  );
}

export default function BerhasilPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-sm md:text-base text-gray-500">Memuat data...</div>}>
      <BerhasilContent />
    </Suspense>
  );
}