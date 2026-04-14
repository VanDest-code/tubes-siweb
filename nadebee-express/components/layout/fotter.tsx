import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full bg-white pt-12 pb-6 px-6 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          
          {/* Column 1: Brand & Desc */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Logo" width={40} height={40} />
              <div>
                <h2 className="font-bold text-gray-800 leading-none">Nadebee Express</h2>
                <p className="text-[10px] text-gray-500">Layanan Pickup & Delivery</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Solusi pengiriman paket lokal yang cepat, aman, dan terpercaya khusus wilayah Yogyakarta.
            </p>
          </div>

          {/* Column 2: Area Layanan */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Area Layanan</h3>
            <ul className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              {['Sleman', 'Kota Yogyakarta', 'Bantul', 'Kulon Progo', 'Gunungkidul'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-nadebee-primary rounded-full"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Hubungi Kami */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 mb-4">Hubungi Kami</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600">📸</div>
                <div>
                  <p className="text-[10px] text-gray-400 leading-none uppercase font-bold">Instagram</p>
                  <p className="font-medium text-gray-700">@Nadebee.id</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">💬</div>
                <div>
                  <p className="text-[10px] text-gray-400 leading-none uppercase font-bold">WhatsApp</p>
                  <p className="font-medium text-gray-700">+6281234567</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">📍</div>
                <div>
                  <p className="text-[10px] text-gray-400 leading-none uppercase font-bold">Alamat</p>
                  <p className="font-medium text-gray-700 leading-tight">
                    Jl. Stan No. 113, Maguwoharjo, Depok, Sleman, Yogyakarta
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-100 pt-6 text-center">
          <p className="text-[10px] md:text-xs text-gray-400">
            © 2025 Nadebee Express · Melayani dengan sepenuh hati untuk Yogyakarta 💚
          </p>
        </div>
      </div>
    </footer>
  );
}