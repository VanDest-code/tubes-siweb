import Image from 'next/image';
import Link from 'next/link';
import LogoNadebee from '@/public/logo.png';

export default function RoleSelection() {
  return (
    <main className="min-h-screen bg-nadebee-green flex flex-col items-center px-6 py-12">
      <Link href="/" className="self-start text-gray-500 text-sm mb-8 flex items-center gap-1">
        ← Kembali
      </Link>

      <div className="flex flex-col items-center mb-10">
        <Image src={LogoNadebee} alt="Nadebee Express Logo" width={200} height={200} className="mb-4" priority />
        <h1 className="text-lg font-bold">
          Selamat Datang di <span className="text-nadebee-primary">Nadebee Express</span>
        </h1>
        <p className="text-gray-500 text-xs">Solusi Pickup mudah untuk UMKM</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        {/* Card Pelanggan */}
        <Link href="/auth/login/pelanggan" className="block bg-white p-6 rounded-2xl shadow-sm border border-transparent hover:border-nadebee-primary transition-all">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl text-nadebee-primary text-xl">👤</div>
            <div>
              <h2 className="font-bold text-gray-800">Masuk sebagai Pelanggan</h2>
              <p className="text-[10px] text-gray-500">Request Pickup dan lacak paketmu</p>
            </div>
          </div>
        </Link>

        {/* Card Kurir */}
        <Link href="/auth/login/kurir" className="block bg-white p-6 rounded-2xl shadow-sm border border-transparent hover:border-nadebee-primary transition-all">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl text-nadebee-primary text-xl">🚚</div>
            <div>
              <h2 className="font-bold text-gray-800">Masuk sebagai Kurir</h2>
              <p className="text-[10px] text-gray-500">Kelola Pickup</p>
            </div>
          </div>
        </Link>
      </div>
      
    </main>
  );
}