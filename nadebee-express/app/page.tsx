import Image from 'next/image';
import Link from 'next/link';
import LogoNadebee from '@/public/logo.png';
import Footer from '@/components/layout/fotter';
  
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-nadebee-green flex flex-col items-center px-6 py-12 font-poppins">
      
      {/* 1. Logo Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-80 h-32 mb-4">
          <Image 
            src={LogoNadebee}
            alt="Nadebee Express Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <p className="text-gray-600 text-[10px] tracking-widest uppercase">
          Layanan Pickup & Delivery Terpercaya
        </p>
        <h1 className="text-xl font-bold mt-1">
          Selamat Datang di <span className="text-nadebee-primary">Nadebee Express</span>
        </h1>
        <p className="text-lg font-bold">
          Kirim Paket Tanpa Perlu Keluar Rumah!
        </p>
      </div>

      {/* 2. Features Cards (3 Kotak Kecil) */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-sm mb-6">
        {[
          { icon: "🚚", label: "Cepat & Aman" },
          { icon: "🛡️", label: "Terjamin"},
          { icon: "⏰", label: "Real-Time" }
        ].map((feature, idx) => (
          <div 
            key={idx} 
            className={`bg-white p-4 rounded-xl flex flex-col items-center shadow-sm border-2`}
          >
            <span className="text-xl mb-1">{feature.icon}</span>
            <span className="text-[8px] font-medium text-center leading-tight">{feature.label}</span>
          </div>
        ))}
      </div>

      {/* 3. Location Badge */}
      <div className="bg-[#D1E7DD] px-4 py-2 rounded-full flex items-center mb-10 shadow-inner">
        <span className="mr-2 text-xs">📍</span>
        <p className="text-[10px] font-medium text-green-800">
          Melayani Pengiriman Khusus Wilayah Yogyakarta
        </p>
      </div>

      {/* 4. CTA Button */}
      <div className="w-full max-w-xs mb-16">
      <Link href="/auth/login" className="w-full bg-nadebee-primary hover:bg-green-600 text-white font-bold py-4 px-6 rounded-full flex items-center justify-center transition-all shadow-lg">Mulai Sekarang <span className="ml-2">→</span>
        </Link>
      </div>

      {/* 5. Footer Information */}
      <Footer />
    </main>
  );
}