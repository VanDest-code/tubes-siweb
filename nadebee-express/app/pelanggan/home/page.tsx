"use client";
import Link from "next/link";

export default function PelangganHomePage() {
  const now = new Date();
  const hari = now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const jam = now.toLocaleTimeString("id-ID", { hour12: false }).replace(/:/g, ".");

  return (
    <main className="min-h-screen bg-[#f4f4f4] overflow-hidden">
      <header className="h-[58px] bg-[#ebe6e6] flex items-center justify-center relative">
        <div className="absolute left-3 w-10 h-10 rounded-2xl bg-[#dce5da] flex items-center justify-center text-[22px] text-gray-700">☰</div>
        <h1 className="text-[15px] font-bold text-black tracking-tight">🐝 Nadebee <span className="text-[#58B65C]">Express</span></h1>
      </header>

      <section className="min-h-[calc(100vh-58px)] bg-gradient-to-r from-[#eef3ee] to-[#f6f6f6] relative flex flex-col items-center pt-8">
        <div className="absolute left-6 top-7 leading-tight">
          <p className="text-[11px] text-gray-500">Hari ini</p>
          <p className="text-[13px] font-bold capitalize">{hari}</p>
          <p className="text-[13px] font-bold text-[#43a047]">{jam}</p>
        </div>

        <div className="w-[74px] h-[74px] rounded-full border-2 border-[#64c97a] flex items-center justify-center text-center text-[#58B65C] text-[10px] font-bold leading-none mt-1">NADEBEE<br/>EXPRESS</div>

        <h2 className="mt-4 text-[18px] font-bold text-black">Halo! Selamat datang..</h2>

        <div className="mt-4 w-[205px] space-y-2">
          <Link href="/pelanggan/tracking" className="block h-[38px] rounded-xl bg-[#4CAF50] text-white text-[13px] font-bold text-center leading-[38px]">Lacak Paket</Link>
          <Link href="/pelanggan/request-pickup" className="block h-[38px] rounded-xl border border-gray-400 bg-[#f8f8f8] text-black text-[13px] font-semibold text-center leading-[38px]">Request Pickup</Link>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 w-[270px]">
          <div className="bg-[#f5f2f2] rounded-2xl px-2 py-4 text-center">
            <div className="w-8 h-8 mx-auto rounded-lg bg-[#dcefdc] flex items-center justify-center text-[13px] text-green-600">▣</div>
            <p className="text-[8px] font-semibold mt-2">Request Pickup</p>
            <p className="text-[8px] text-gray-500 mt-1 leading-tight">Isi form dan tentukan lokasi penjemputan</p>
          </div>
          <div className="bg-[#f5f2f2] rounded-2xl px-2 py-4 text-center">
            <div className="w-8 h-8 mx-auto rounded-lg bg-[#e2efff] flex items-center justify-center text-[13px] text-blue-500">◉</div>
            <p className="text-[8px] font-semibold mt-2">Kurir Datang</p>
            <p className="text-[8px] text-gray-500 mt-1 leading-tight">Kurir kami menuju lokasi anda</p>
          </div>
          <div className="bg-[#f5f2f2] rounded-2xl px-2 py-4 text-center">
            <div className="w-8 h-8 mx-auto rounded-lg bg-[#f6efcf] flex items-center justify-center text-[13px] text-yellow-700">◔</div>
            <p className="text-[8px] font-semibold mt-2">Paket Sampai</p>
            <p className="text-[8px] text-gray-500 mt-1 leading-tight">Paket diantarkan hingga tujuan</p>
          </div>
        </div>

        <div className="mt-5 w-[365px] max-w-[92%] rounded-2xl bg-[#cfe7ca] px-6 py-7 text-center">
          <p className="text-[10px] text-[#efb25a]">💡 Tips</p>
          <p className="text-[12px] text-gray-600 mt-1 leading-relaxed">Simpan nomor resimu, lalu masukkan di halaman Tracking untuk mulai melacak paketmu!</p>
        </div>
      </section>
    </main>
  );
}