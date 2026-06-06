"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // <-- IMPORT SUPABASE DITAMBAHKAN
import { 
  Home, 
  Search, 
  MessageSquare, 
  History, 
  User, 
  LogOut, 
  HelpCircle 
} from "lucide-react";

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = [
    { name: "Home", path: "/auth/dashboard/pelanggan", icon: Home },
    { name: "Tracking", path: "/auth/dashboard/pelanggan/tracking", icon: Search },
    { name: "Request Pickup", path: "/auth/dashboard/pelanggan/request-pickup", icon: MessageSquare },
    { name: "Riwayat", path: "/auth/dashboard/pelanggan/riwayat", icon: History },
    { name: "Profile", path: "/auth/dashboard/pelanggan/profile", icon: User },
  ];

  // --- FUNGSI LOGOUT YANG SUDAH DIPERKUAT ---
  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    
    // 1. Hancurkan karcis keamanan Middleware
    document.cookie = "nadebee-auth-token=; path=/; max-age=0";
    
    // 2. Putus sesi resmi dari Supabase
    await supabase.auth.signOut();
    
    // 3. Tendang kembali ke halaman utama
    router.push("/"); 
  };

  return (
    <>
      {/* 1. POP-UP LOGOUT */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 w-screen h-screen flex items-center justify-center z-[999999]">
          <div 
            className="absolute inset-0 bg-black/10 backdrop-blur-sm w-full h-full"
            onClick={() => setShowLogoutConfirm(false)}
          ></div>
          
          <div className="bg-white rounded-[32px] p-10 max-w-sm w-[90%] text-center relative z-[1000000] shadow-2xl animate-in zoom-in duration-300">
            <div className="w-16 h-16 border-2 border-green-500 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <HelpCircle size={32} strokeWidth={2.5} />
            </div>
            
            <h2 className="text-sm font-black text-gray-900 mb-8">
              Yakin untuk keluar?
            </h2>
            
            <button 
              onClick={handleLogout}
              className="w-full bg-[#4CAF50] text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-all shadow-md active:scale-95"
            >
              Ya
            </button>
          </div>
        </div>
      )}

      {/* 2. OVERLAY SIDEBAR */}
      <div 
        className={`fixed inset-0 bg-black/5 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`} 
        onClick={onClose} 
      />
      
      {/* 3. SIDEBAR MAIN CONTAINER */}
      <aside className={`fixed left-0 top-0 h-full w-[280px] bg-white border-r border-gray-100 z-50 transition-transform duration-500 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex flex-col h-full">
          
          <div className="pt-12 pb-8 px-8">
            <h2 className="text-[22px] font-black text-gray-900 tracking-tighter">
              Nadebee Express
            </h2>
            <p className="text-[12px] text-gray-400 font-medium mt-1">Kirim cepat, hati senang! 🐝</p>
          </div>

          <hr className="border-gray-50 mx-6 mb-4" />

          <nav className="flex-1 px-4 space-y-2 mt-2">
            {menuItems.map((item) => {
              const active = pathname === item.path;
              
              return (
                <Link 
                  key={item.path}
                  href={item.path}
                  onClick={onClose} 
                  className={`flex items-center gap-4 px-6 py-4 rounded-[22px] transition-all duration-300 ${
                    active 
                      ? "bg-[#4CAF50] text-white shadow-md shadow-green-100 scale-[1.02]" 
                      : "text-gray-600 hover:bg-green-50 hover:text-green-600"
                  }`}
                >
                  <item.icon 
                    size={22} 
                    strokeWidth={active ? 2.5 : 2} 
                  />
                  <span className={`text-[15px] ${active ? "font-bold" : "font-semibold"}`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="p-6 pb-10 border-t border-gray-50">
            <button 
              onClick={() => {
                setShowLogoutConfirm(true);
                onClose(); 
              }}
              className="flex items-center gap-4 px-6 py-4 w-full text-red-500 font-black hover:bg-red-50 rounded-[22px] transition-all group"
            >
              <LogOut size={22} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}