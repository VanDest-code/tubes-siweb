"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  
  // Fungsi pengecekan path agar spotlight tepat sasaran
  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={onClose}
      />

      {/* Sidebar Panel - Lebar disesuaikan agar tidak terlalu lebar */}
      <aside className={`fixed left-0 top-0 h-full w-[260px] bg-white z-50 transition-transform duration-300 ease-in-out border-r border-gray-100 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          
          {/* Header Sidebar - Jarak Pading disesuaikan desain */}
          <div className="pt-10 pb-8 px-7">
            <h2 className="text-[18px] font-bold text-black tracking-tight">Nadebee Express</h2>
            <p className="text-[12px] text-gray-400 font-medium">Kirim cepat, hati senang!</p>
          </div>

          <hr className="border-gray-50 mx-6 mb-4" />

          {/* Menu Navigasi dengan Spotlight */}
          <nav className="flex-1 px-3 space-y-1">
            {[
              { name: "Home", path: "/pelanggan/dashboard", icon: "🏠" },
              { name: "Tracking", path: "/pelanggan/tracking", icon: "🔍" },
              { name: "Request Pickup", path: "/pelanggan/request-pickup", icon: "💬" },
              { name: "Riwayat", path: "/pelanggan/history", icon: "🕒" },
              { name: "Profile", path: "/profile", icon: "👤" },
            ].map((menu) => (
              <Link 
                key={menu.path}
                href={menu.path}
                onClick={onClose}
                className={`flex items-center gap-4 px-5 py-3.5 rounded-[18px] font-bold text-[14px] transition-all duration-200 ${
                  isActive(menu.path) 
                    ? "bg-[#4CAF50] text-white shadow-md shadow-green-200/50" 
                    : "text-black hover:bg-gray-50"
                }`}
              >
                <span className={`text-lg ${isActive(menu.path) ? "" : "grayscale"}`}>{menu.icon}</span>
                {menu.name}
              </Link>
            ))}
          </nav>

          {/* Tombol Keluar di Bawah */}
          <div className="p-6 pb-8 border-t border-gray-50">
            <Link 
              href="/auth/login" 
              className="flex items-center gap-4 px-5 py-3 rounded-xl text-red-500 hover:bg-red-50 font-bold text-[14px] transition-colors"
            >
              <span className="text-lg">🚪</span>
              Keluar
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}