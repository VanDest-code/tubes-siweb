"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, BookOpen, Clock, User, LogOut, HelpCircle } from "lucide-react";

const SidebarKurir = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = [
    { name: "Home", href: "/dashboard/kurir", icon: Home },
    { name: "Task", href: "/dashboard/kurir/task", icon: BookOpen },
    { name: "Riwayat", href: "/dashboard/kurir/riwayat", icon: Clock },
    { name: "Profile", href: "/dashboard/kurir/profil", icon: User },
  ];

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    router.push("/");
  };

  return (
    <>
      {/* 1. POP-UP LOGOUT (Tetap pakai blur dikit biar fokus) */}
      {showLogoutConfirm && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-[999999]">
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm w-full h-full"
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
              className="w-full bg-[#4CAF50] text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-all shadow-md"
            >
              Ya
            </button>
          </div>
        </div>
      )}

      {/* 2. OVERLAY SIDEBAR (DIUBAH: TIDAK BLUR) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/5 z-[45] transition-opacity duration-300" 
          onClick={onClose}
        ></div>
      )}

      {/* 3. SIDEBAR CONTAINER */}
      <div 
        className={`fixed inset-y-0 left-0 z-[50] w-64 bg-white border-r border-gray-100 flex flex-col p-6 transition-transform duration-500 ease-in-out shadow-lg ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header Logo */}
        <div className="mb-10">
          <h1 className="text-xl font-bold text-gray-800">
            Nadebee <span className="text-green-600">Express</span>
          </h1>
          <p className="text-sm text-gray-400 font-medium">Kurir</p>
        </div>

        {/* Navigation Menu */}
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

        {/* Footer / Logout */}
        <div className="pt-6 border-t border-gray-50">
          <button 
            onClick={() => {
              setShowLogoutConfirm(true);
              onClose(); 
            }}
            className="flex items-center gap-4 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-2xl transition-colors group"
          >
            <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Keluar</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SidebarKurir;