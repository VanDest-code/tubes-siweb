"use client";

import { Frown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="flex h-[80vh] flex-col items-center justify-center gap-2 font-sans">
      <Frown className="w-12 h-12 text-gray-400 mb-2" strokeWidth={1.5} />
      <h2 className="text-xl font-bold text-gray-900">404 Tidak Ditemukan</h2>
      <p className="text-sm text-gray-500 mb-2">Tidak dapat menemukan halaman yang diminta.</p>
      
      <button
        onClick={() => router.back()}
        className="mt-4 rounded-lg bg-[#4CAF50] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-green-600 active:scale-95 shadow-sm"
      >
        Kembali
      </button>
    </main>
  );
}