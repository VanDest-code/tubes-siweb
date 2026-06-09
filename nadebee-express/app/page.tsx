"use client"; 

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/layout/fotter';
import { Truck, ShieldCheck, Clock, MapPin, ArrowRight, ArrowUpRight, Home, Star, Phone } from 'lucide-react';

export default function LandingPage() {
  // State untuk melacak posisi scroll (agar navbar dinamis)
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Jika scroll lebih dari 50px, tampilkan logo
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fungsi untuk smooth scroll ke section tertentu
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen font-poppins flex flex-col bg-[#F4F9F4] pb-16 md:pb-0 relative">
      
      {/* === NAVBAR ATAS (Desktop & Header) === */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* Kiri: Logo/Brand (Sembunyi saat di paling atas, Muncul saat di-scroll) */}
          <div 
            onClick={() => scrollToSection('beranda')}
            className={`text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] cursor-pointer hover:scale-105 origin-left transition-all duration-500 ${isScrolled ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}
          >
            Nadebee <span className="text-green-600">Express</span>
          </div>

          {/* Kanan: Menu Navigasi (Hanya muncul di Desktop) */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center gap-8 text-sm font-bold text-gray-600">
              <button onClick={() => scrollToSection('beranda')} className="relative group hover:text-[#4CAF50] transition-colors">
                Beranda
                <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-[#4CAF50] transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button onClick={() => scrollToSection('keunggulan')} className="relative group hover:text-[#4CAF50] transition-colors">
                Keunggulan
                <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-[#4CAF50] transition-all duration-300 group-hover:w-full"></span>
              </button>
            </div>

            <button 
              onClick={() => scrollToSection('kontak')} 
              className={`group text-sm font-bold text-[#4CAF50] border-2 border-[#4CAF50] px-6 py-2 rounded-full hover:bg-[#4CAF50] hover:text-white transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md ${!isScrolled ? 'bg-white/50 backdrop-blur-sm hover:border-transparent' : ''}`}
            >
              Hubungi Kami 
              <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
          
        </div>
      </nav>

      {/* === NAVBAR BAWAH (Khusus Mobile) === */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 flex justify-around items-center px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
        <button onClick={() => scrollToSection('beranda')} className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#4CAF50] transition-colors active:scale-95">
          <Home size={20} />
          <span className="text-[10px] font-bold">Beranda</span>
        </button>
        <button onClick={() => scrollToSection('keunggulan')} className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#4CAF50] transition-colors active:scale-95">
          <Star size={20} />
          <span className="text-[10px] font-bold">Keunggulan</span>
        </button>
        <button onClick={() => scrollToSection('kontak')} className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#4CAF50] transition-colors active:scale-95">
          <Phone size={20} />
          <span className="text-[10px] font-bold">Kontak</span>
        </button>
      </nav>
      {/* ======================================= */}

      {/* 1. HERO SECTION */}
      <section id="beranda" className="relative flex-1 flex flex-col items-center justify-center px-4 md:px-6 py-32 md:py-40 text-center w-full min-h-[90vh] md:min-h-screen overflow-hidden">
        
        <Image 
          src="/siweb.jpg" 
          alt="Nadebee Background" 
          fill
          className="object-cover object-center z-0"
          priority
        />
        
        <div className="absolute inset-0 bg-white/60 z-0 backdrop-blur-[1px]"></div>

        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center pt-8 md:pt-0">
          <div className="bg-green-100 text-green-800 px-4 md:px-5 py-2 md:py-2.5 rounded-full flex items-center gap-2 mb-6 md:mb-8 shadow-sm border border-green-200 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <MapPin size={16} className="text-green-600 shrink-0" />
            <span className="text-[11px] md:text-sm font-bold tracking-wide">Melayani Khusus Wilayah Yogyakarta</span>
          </div>

          {/* Judul utama akan membesar/mengecil menyesuaikan layar dengan rapi */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#1A1A1A] mb-4 md:mb-6 leading-[1.1] tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 px-2">
            Kirim Paket Cepat dengan <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4CAF50] to-[#2E7D32]">
              Nadebee Express
            </span>
          </h1>

          <p className="text-gray-800 text-sm sm:text-base md:text-xl mb-10 md:mb-12 max-w-2xl font-semibold drop-shadow-sm animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 px-4">
            Solusi pengiriman paket lokal tanpa perlu keluar rumah. Kurir profesional kami yang akan datang menjemput paketmu tepat waktu.
          </p>

          <Link 
            href="/auth/login" 
            className="group bg-[#4CAF50] hover:bg-[#43A047] text-white font-bold text-base md:text-lg py-3.5 md:py-4 px-8 md:px-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_8px_30px_rgb(76,175,80,0.3)] hover:shadow-[0_8px_30px_rgb(76,175,80,0.5)] hover:-translate-y-1 active:scale-95 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500"
          >
            Mulai Pengiriman
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </Link>
        </div>
      </section>

      {/* 2. FEATURES / KEUNGGULAN SECTION */}
      <section id="keunggulan" className="relative bg-gradient-to-b from-[#E8F5E9] to-[#C8E6C9] w-full py-20 md:py-24 px-4 md:px-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] rounded-t-[2.5rem] md:rounded-t-[3rem] -mt-6 md:-mt-8 z-20">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-12 md:mb-16 px-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1B5E20] mb-2 md:mb-3">Kenapa Memilih Kami?</h2>
            <p className="text-[#2E7D32] font-medium text-sm md:text-lg">Layanan pengiriman terbaik untuk kebutuhanmu</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-3xl flex flex-col items-center text-center shadow-sm hover:shadow-xl md:hover:-translate-y-2 transition-all duration-300 border border-white">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[#E8F5E9] rounded-[18px] md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 text-[#4CAF50] shadow-inner">
                <Truck size={32} className="md:w-10 md:h-10" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Cepat & Aman</h3>
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed">Pengiriman instan di hari yang sama dengan standar keamanan tinggi untuk setiap paketmu.</p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-3xl flex flex-col items-center text-center shadow-sm hover:shadow-xl md:hover:-translate-y-2 transition-all duration-300 border border-white">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[#E8F5E9] rounded-[18px] md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 text-[#4CAF50] shadow-inner">
                <ShieldCheck size={32} className="md:w-10 md:h-10" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Terjamin</h3>
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed">Setiap barang yang dikirim dijamin sampai ke tangan penerima dalam kondisi utuh dan sempurna.</p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-3xl flex flex-col items-center text-center shadow-sm hover:shadow-xl md:hover:-translate-y-2 transition-all duration-300 border border-white sm:col-span-2 md:col-span-1">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[#E8F5E9] rounded-[18px] md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 text-[#4CAF50] shadow-inner">
                <Clock size={32} className="md:w-10 md:h-10" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Real-Time</h3>
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed max-w-[280px] md:max-w-none mx-auto">Lacak posisi paket dan kurir secara real-time langsung dari dalam genggamanmu.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOOTER */}
      <div id="kontak">
        <Footer />
      </div>
    </main>
  );
}