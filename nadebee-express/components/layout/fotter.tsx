import Image from 'next/image';
import { Camera, MessageCircle, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    // Menggunakan bg-[#2E7D32] agar warnanya solid, bersih, dan konsisten
    <footer className="w-full bg-[#2E7D32] pt-16 pb-8 px-6 text-white">
      <div className="max-w-6xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* Column 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-xl">
                <Image src="/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white leading-tight">Nadebee <span className="text-[#A5D6A7]">Express</span></h2>
                <p className="text-[10px] text-[#C8E6C9] font-bold tracking-wider uppercase mt-1">Layanan Pickup & Delivery</p>
              </div>
            </div>
            <p className="text-sm text-green-50 font-medium leading-relaxed mt-4 max-w-sm">
              Solusi pengiriman paket lokal yang cepat, aman, dan terpercaya khusus wilayah Yogyakarta. Kami menjemput paketmu langsung di depan pintu.
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 border-b border-green-700 pb-2 inline-block">Area Layanan</h3>
            <ul className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm text-green-50 font-medium">
              {['Sleman', 'Kota Yogyakarta', 'Bantul', 'Kulon Progo', 'Gunungkidul'].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-[#A5D6A7] rounded-full"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 border-b border-green-700 pb-2 inline-block">Hubungi Kami</h3>
            <div className="space-y-5">
              <div className="flex items-start gap-4 text-sm">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0">
                  <Camera size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-[#C8E6C9] leading-none uppercase font-bold mb-1">Instagram</p>
                  <p className="font-bold text-white">@Nadebee.id</p>
                </div>
              </div>
              <div className="flex items-start gap-4 text-sm">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-[#C8E6C9] leading-none uppercase font-bold mb-1">WhatsApp</p>
                  <p className="font-bold text-white">+62 812-3456-7890</p>
                </div>
              </div>
              <div className="flex items-start gap-4 text-sm">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-[#C8E6C9] leading-none uppercase font-bold mb-1">Alamat</p>
                  <p className="font-medium text-green-50 leading-relaxed max-w-[200px]">
                    Jl. Stan No. 113, Maguwoharjo, Depok, Sleman, Yogyakarta
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-green-700 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-green-100">
          <p className="text-xs md:text-sm font-medium">© 2026 Nadebee Express. All rights reserved.</p>
          <p className="text-xs md:text-sm font-medium flex items-center gap-1.5">
            Dibuat dengan <Heart size={14} className="text-red-400 fill-red-400" /> untuk Yogyakarta
          </p>
        </div>
      </div>
    </footer>
  );
}