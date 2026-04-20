"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Helper untuk mengecek apakah menu sedang aktif
  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Tombol Hamburger untuk Mobile */}
      <header className="lg:hidden h-16 bg-white border-b flex items-center px-6 sticky top-0 z-30">
        <button onClick={toggleSidebar} className="w-10 h-10 rounded-xl bg-[#DCE5DA] flex items-center justify-center text-[20px]">
          ☰
        </button>
        <div className="flex items-center gap-2 mx-auto">
           <Image src="/logo.png" alt="Logo" width={30} height={30} style={{ width: 'auto', height: '30px' }} />
           <h1 className="text-[16px] font-bold text-black">Nadebee <span className="text-[#4CAF50]">Express</span></h1>
        </div>
      </header>

      {/* Overlay Mobile */}
      <div className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={toggleSidebar} />

      {/* Sidebar Utama */}
      <aside className={`fixed left-0 top-0 h-full w-72 bg-[#F8F9F8] z-50 border-r transition-transform lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="p-8 pb-6">
            <h2 className="text-[18px] font-bold text-black">Nadebee Express</h2>
            <p className="text-[12px] text-gray-400 font-medium">Kirim cepat, hati senang!</p>
          </div>
          
          <hr className="border-gray-200/60 mx-4 mb-4" />
          
          <nav className="flex-1 px-4 space-y-2">
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
                className={`flex items-center gap-4 px-6 py-4 rounded-[20px] font-bold text-[14px] transition-all ${
                  isActive(menu.path) ? "bg-[#4CAF50] text-white shadow-md shadow-green-100" : "text-black hover:bg-gray-100"
                }`}
              >
                <span>{menu.icon}</span> {menu.name}
              </Link>
            ))}
          </nav>

          <div className="p-6 border-t">
             <Link href="/auth/login" className="flex items-center gap-4 px-6 py-4 rounded-[20px] text-red-500 hover:bg-red-50 transition-all font-bold text-[14px]">
               🚪 Keluar
             </Link>
          </div>
        </div>
      </aside>
    </>
  );
}