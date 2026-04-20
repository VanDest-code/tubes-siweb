"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, MessageSquare, History, User, LogOut, X } from "lucide-react";

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();

  // SESUAIKAN PATH DI SINI
  const menuItems = [
    { 
      name: "Home", 
      // Sesuaikan dengan rute asli yang terbaca di browser Anda
      path: "/auth/dashboard/pelanggan", 
      icon: Home 
    },
    { name: "Tracking", path: "/pelanggan/tracking", icon: Search },
    { name: "Request Pickup", path: "/pelanggan/request-pickup", icon: MessageSquare },
    { name: "Riwayat", path: "/pelanggan/history", icon: History },
    { name: "Profile", path: "/profile", icon: User },
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} 
        onClick={onClose} 
      />
      
      <aside className={`fixed left-0 top-0 h-full w-[280px] bg-white z-50 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          
          <div className="pt-10 pb-6 px-8 flex justify-between items-start">
            <div>
              <h2 className="text-[20px] font-black text-black tracking-tighter">Nadebee Express</h2>
              <p className="text-[12px] text-gray-400 font-medium">Kirim cepat, hati senang!</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-black pt-1">
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          <hr className="border-gray-50 mx-6 mb-4" />

          <nav className="flex-1 px-4 space-y-2 mt-2">
            {menuItems.map((item) => {
              // LOGIKA DETEKSI:
              // Kita gunakan .startsWith agar jika ada sub-halaman, menu tetap hijau
              const active = pathname === item.path;
              
              return (
                <Link 
                  key={item.path}
                  href={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-4 px-6 py-4 rounded-[22px] transition-all duration-300 ${
                    active 
                      ? "bg-[#4CAF50] text-white shadow-[0_12px_25px_-5px_rgba(76,175,80,0.5)] scale-[1.02]" 
                      : "text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <item.icon 
                    size={22} 
                    strokeWidth={active ? 3 : 2} 
                    className={active ? "text-white" : "text-gray-500"} 
                  />
                  <span className={`text-[15px] ${active ? "font-bold" : "font-semibold text-gray-700"}`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="p-6 pb-10 border-t border-gray-50">
            <Link href="/auth/login" className="flex items-center gap-4 px-6 py-4 text-[#FF4D4D] font-bold hover:bg-red-50 rounded-[20px] transition-all">
              <LogOut size={22} strokeWidth={3} />
              <span>Keluar</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
} 