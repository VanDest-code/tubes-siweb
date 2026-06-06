import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/layout/fotter';
import { Truck, ShieldCheck, Clock, MapPin, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="min-h-screen font-poppins flex flex-col bg-[#F4F9F4]">
      
      {/* 1. HERO SECTION DENGAN BACKGROUND GAMBAR */}
      <section className="relative flex-1 flex flex-col items-center justify-center px-6 py-24 md:py-32 text-center w-full min-h-[80vh] overflow-hidden">
        
        {/* Background Image Menggunakan Next.js Image (Anti Gagal) */}
        <Image 
          src="/siweb.jpg" 
          alt="Nadebee Background" 
          fill
          className="object-cover object-center z-0"
          priority
        />
        
        {/* Overlay: Efek kaca/transparan. Aku turunkan ketebalannya jadi 70 agar fotomu lebih kelihatan! */}
        <div className="absolute inset-0 bg-white/60 z-0"></div>

        {/* Konten Hero (z-10 agar berada di atas gambar & overlay) */}
        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
          <div className="bg-green-100 text-green-800 px-5 py-2.5 rounded-full flex items-center gap-2 mb-8 shadow-sm border border-green-200">
            <MapPin size={16} className="text-green-600" />
            <span className="text-xs md:text-sm font-bold tracking-wide">Melayani Khusus Wilayah Yogyakarta</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-[#1A1A1A] mb-6 leading-tight tracking-tight">
            Kirim Paket Cepat dengan <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4CAF50] to-[#2E7D32]">
              Nadebee Express
            </span>
          </h1>

          <p className="text-gray-800 text-base md:text-xl mb-12 max-w-2xl font-semibold drop-shadow-sm">
            Solusi pengiriman paket lokal tanpa perlu keluar rumah. Kurir profesional kami yang akan datang menjemput paketmu tepat waktu.
          </p>

          <Link 
            href="/auth/login" 
            className="group bg-[#4CAF50] hover:bg-[#43A047] text-white font-bold text-lg py-4 px-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_8px_30px_rgb(76,175,80,0.3)] hover:shadow-[0_8px_30px_rgb(76,175,80,0.5)] hover:-translate-y-1"
          >
            Mulai Pengiriman
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </Link>
        </div>
      </section>

      {/* 2. FEATURES SECTION DENGAN PALET HIJAU PREMIUM */}
      <section className="relative bg-gradient-to-b from-[#E8F5E9] to-[#C8E6C9] w-full py-24 px-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] rounded-t-[3rem] -mt-8 z-20">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-[#1B5E20] mb-3">Kenapa Memilih Kami?</h2>
            <p className="text-[#2E7D32] font-medium text-lg">Layanan pengiriman terbaik untuk kebutuhanmu</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-3xl flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-white">
              <div className="w-20 h-20 bg-[#E8F5E9] rounded-2xl flex items-center justify-center mb-6 text-[#4CAF50] shadow-inner">
                <Truck size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cepat & Aman</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Pengiriman instan di hari yang sama dengan standar keamanan tinggi untuk setiap paketmu.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-white">
              <div className="w-20 h-20 bg-[#E8F5E9] rounded-2xl flex items-center justify-center mb-6 text-[#4CAF50] shadow-inner">
                <ShieldCheck size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Terjamin</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Setiap barang yang dikirim dijamin sampai ke tangan penerima dalam kondisi utuh dan sempurna.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-white">
              <div className="w-20 h-20 bg-[#E8F5E9] rounded-2xl flex items-center justify-center mb-6 text-[#4CAF50] shadow-inner">
                <Clock size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Lacak posisi paket dan kurir secara real-time langsung dari dalam genggamanmu.</p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FOOTER */}
      <Footer />
    </main>
  );
}