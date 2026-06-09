"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  Home, 
  BookOpen, 
  Clock, 
  User, 
  LogOut, 
  HelpCircle,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

const SidebarKurir = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "Home", href: "/auth/dashboard/kurir", icon: Home },
    { name: "Task", href: "/auth/dashboard/kurir/task", icon: BookOpen },
    { name: "Riwayat", href: "/auth/dashboard/kurir/riwayat", icon: Clock },
    { name: "Profile", href: "/auth/dashboard/kurir/profil", icon: User },
  ];

  // --- CUSTOM DIALOG STATE ---
  const [dialog, setDialog] = useState<{
    isOpen: boolean; type: "success" | "error" | "confirm"; title: string; message: string; onConfirm: (() => void) | null;
  }>({ isOpen: false, type: "success", title: "", message: "", onConfirm: null });

  const showDialog = (type: "success" | "error" | "confirm", title: string, message: string, onConfirm: (() => void) | null = null) => {
    setDialog({ isOpen: true, type, title, message, onConfirm });
  };

  // --- LOGIKA KONFIRMASI LOGOUT ---
  const confirmLogout = () => {
    onClose(); // Tutup sidebar terlebih dahulu
    showDialog("confirm", "Keluar Akun", "Apakah Anda yakin ingin keluar dari aplikasi?", executeLogout);
  };

  const executeLogout = async () => {
    // 1. Hancurkan karcis keamanan Middleware
    document.cookie = "nadebee-auth-token=; path=/; max-age=0";
    
    // 2. Bersihkan memori ID Kurir dari browser
    sessionStorage.removeItem("loggedInCourierId");
    
    // 3. Putus sesi resmi dari Supabase
    await supabase.auth.signOut();
    
    // 4. Tendang kembali ke halaman utama
    router.push("/");
  };

  return (
    <>
      {/* 1. OVERLAY SIDEBAR */}
      <div 
        className={`fixed inset-0 bg-black/5 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`} 
        onClick={onClose} 
      />

      {/* 2. SIDEBAR CONTAINER */}
      <aside 
        className={`fixed inset-y-0 left-0 z-[50] w-[280px] bg-white border-r border-gray-100 flex flex-col p-6 transition-transform duration-500 ease-in-out shadow-lg ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-10">
          <h1 className="text-xl font-bold text-gray-800">
            Nadebee <span className="text-green-600">Express</span>
          </h1>
          <p className="text-sm text-gray-400 font-medium">Kurir</p>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "bg-[#4CAF50] text-white shadow-md shadow-green-100"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="font-semibold">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-gray-50">
          <button 
          suppressHydrationWarning
          onClick={confirmLogout}
          className="flex items-center gap-4 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-2xl transition-colors group"
        >
          <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold">Logout</span>
        </button>
        </div>
      </aside>

      {/* 3. RENDER CUSTOM DIALOG */}
      {dialog.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDialog({...dialog, isOpen: false})}></div>
          <div className="bg-white border border-gray-100 rounded-[32px] w-full max-w-sm p-8 relative z-10 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${dialog.type === 'error' ? 'bg-red-50 text-red-500' : dialog.type === 'confirm' ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-[#4CAF50]'}`}>
              {dialog.type === 'error' ? <AlertCircle size={40} /> : dialog.type === 'confirm' ? <HelpCircle size={40} /> : <CheckCircle2 size={40} />}
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">{dialog.title}</h3>
            <p className="text-sm text-gray-500 mb-8">{dialog.message}</p>
            
            {dialog.type === 'confirm' ? (
              <div className="flex gap-3 w-full">
                <button onClick={() => setDialog({...dialog, isOpen: false})} className="flex-1 bg-gray-100 text-gray-600 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors">Batal</button>
                <button onClick={() => { setDialog({...dialog, isOpen: false}); dialog.onConfirm?.(); }} className="flex-1 bg-red-500 text-white font-bold py-3.5 rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-100">Ya, Lanjutkan</button>
              </div>
            ) : (
              <button onClick={() => { setDialog({...dialog, isOpen: false}); dialog.onConfirm?.(); }} className="w-full bg-[#4CAF50] text-white font-bold py-4 rounded-xl hover:bg-green-600 shadow-lg shadow-green-100 transition-colors">
                Oke Mengerti
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarKurir;