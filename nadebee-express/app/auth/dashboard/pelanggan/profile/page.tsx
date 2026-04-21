"use client";
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { User, Phone, Mail, Edit3, CheckCircle2, Key, LogOut } from "lucide-react";

export default function ProfilePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // State Data & Edit Mode
  const [formData, setFormData] = useState({
    username: "Natalie Laura",
    phone: "082250082024",
    email: "pratisthanatalie@gmai.com"
  });
  const [isEditUsername, setIsEditUsername] = useState(false);
  const [isEditPhone, setIsEditPhone] = useState(false);

  // State Password & Error Objek
  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });
  const [errors, setErrors] = useState({ old: "", new: "", confirm: "" });

  const handleUpdatePassword = () => {
    let tempErrors = { old: "", new: "", confirm: "" };
    let isValid = true;

    // Validasi Password Lama (Wajib diisi)
    if (!passwords.old) {
      tempErrors.old = "Password lama wajib diisi";
      isValid = false;
    } else if (passwords.old.length < 8 || passwords.old.length > 12) {
      tempErrors.old = "Min. 8 digit Maks. 12 digit";
      isValid = false;
    }

    // Validasi Password Baru (Wajib diisi & Digit)
    if (!passwords.new) {
      tempErrors.new = "Password baru wajib diisi";
      isValid = false;
    } else if (passwords.new.length < 8 || passwords.new.length > 12) {
      tempErrors.new = "Min. 8 digit Maks. 12 digit";
      isValid = false;
    }

    // Validasi Konfirmasi (Wajib diisi & Cocok)
    if (!passwords.confirm) {
      tempErrors.confirm = "Konfirmasi password wajib diisi";
      isValid = false;
    } else if (passwords.confirm !== passwords.new) {
      tempErrors.confirm = "Password tidak valid"; // Sesuai desain Anda jika tidak cocok
      isValid = false;
    }

    setErrors(tempErrors);

    if (isValid) {
      setSuccessMessage("Password Berhasil Disimpan");
      setShowSuccessModal(true);
      setPasswords({ old: "", new: "", confirm: "" });
      setErrors({ old: "", new: "", confirm: "" });
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FFF8] pb-20">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* NAVBAR
      <header className="h-16 bg-white flex items-center px-6 sticky top-0 z-30 justify-between border-b border-gray-50">
        <button onClick={() => setIsSidebarOpen(true)} className="w-10 h-10 rounded-lg bg-gray-50 flex flex-col items-center justify-center gap-[3px]">
          <div className="w-5 h-[2px] bg-black"></div>
          <div className="w-5 h-[2px] bg-black"></div>
          <div className="w-5 h-[2px] bg-black"></div>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xl">🐝</span>
          <h1 className="text-lg font-bold">Nadebee <span className="text-[#4CAF50]">Express</span></h1>
        </div>
        <div className="w-10"></div>
      </header> */}

      <section className="flex flex-col items-center pt-12 px-6 max-w-xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Profil Saya</h2>
          <p className="text-gray-400 text-sm">Kelola inforomasi akunmu</p>
        </div>

        {/* AVATAR */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full border border-[#4CAF50] flex items-center justify-center bg-white mb-2">
            <User className="text-[#4CAF50]" size={28} />
          </div>
          <h3 className="text-lg font-bold">Natalie Pratistha</h3>
          <p className="text-gray-400 text-xs">Bergabung sejak 2026</p>
        </div>

        {/* FORM PROFIL */}
        <div className="w-full bg-white border border-gray-200 rounded-[25px] p-6 shadow-sm mb-6">
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-gray-500 text-xs font-bold mb-1 ml-1"><User size={12}/> Username</label>
              <div className="relative">
                <input 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  disabled={!isEditUsername}
                  className={`w-full px-4 py-3 border rounded-xl outline-none text-sm ${isEditUsername ? "border-[#4CAF50]" : "border-gray-200 bg-gray-50"}`}
                />
                <button onClick={() => setIsEditUsername(!isEditUsername)} className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Edit3 size={16} className={isEditUsername ? "text-[#4CAF50]" : "text-gray-300"} />
                </button>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-500 text-xs font-bold mb-1 ml-1"><Phone size={12}/> Nomor Telepon</label>
              <div className="relative">
                <input 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  disabled={!isEditPhone}
                  className={`w-full px-4 py-3 border rounded-xl outline-none text-sm ${isEditPhone ? "border-[#4CAF50]" : "border-gray-200 bg-gray-50"}`}
                />
                <button onClick={() => setIsEditPhone(!isEditPhone)} className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Edit3 size={16} className={isEditPhone ? "text-[#4CAF50]" : "text-gray-300"} />
                </button>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-500 text-xs font-bold mb-1 ml-1"><Mail size={12}/> Email</label>
              <input disabled value={formData.email} className="w-full px-4 py-3 bg-[#E8F5E9] border border-[#4CAF50] rounded-xl text-sm text-gray-600" />
            </div>

            <button onClick={() => {setSuccessMessage("Perubahan Berhasil Disimpan"); setShowSuccessModal(true);}} className="w-full bg-[#4CAF50] text-white font-bold py-3.5 rounded-xl mt-2">Simpan Profil</button>
          </div>
        </div>

        {/* UBAH PASSWORD TOGGLE */}
        {!showPasswordForm && (
          <p className="mb-6 text-sm text-gray-500">
            Ubah Password? <button onClick={() => setShowPasswordForm(true)} className="font-bold underline text-gray-700">Klik disini</button>
          </p>
        )}

        {/* FORM PASSWORD DENGAN ERROR HANDLING */}
        {showPasswordForm && (
          <div className="w-full bg-white border border-gray-200 rounded-[25px] p-6 shadow-sm mb-6 animate-in slide-in-from-top-4">
            <h3 className="flex items-center gap-2 font-bold text-sm mb-4"><Key size={16} /> Ubah Password</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 ml-1">Password Lama</label>
                <input 
                  type="password"
                  placeholder="Masukkan password lama"
                  className={`w-full px-4 py-3 border rounded-xl outline-none text-sm focus:border-[#4CAF50] ${errors.old ? 'border-red-300' : 'border-gray-200'}`}
                  value={passwords.old}
                  onChange={(e) => {setPasswords({...passwords, old: e.target.value}); setErrors({...errors, old: ""});}}
                />
                {errors.old && <p className="text-red-400 text-[10px] italic mt-1 ml-1">{errors.old}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 ml-1">Password Baru</label>
                <input 
                  type="password"
                  placeholder="Masukkan password baru (angka/huruf)"
                  className={`w-full px-4 py-3 border rounded-xl outline-none text-sm focus:border-[#4CAF50] ${errors.new ? 'border-red-300' : 'border-gray-200'}`}
                  value={passwords.new}
                  onChange={(e) => {setPasswords({...passwords, new: e.target.value}); setErrors({...errors, new: ""});}}
                />
                {errors.new && <p className="text-red-400 text-[10px] italic mt-1 ml-1">{errors.new}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 ml-1">Konfirmasi Password Baru</label>
                <input 
                  type="password"
                  placeholder="Ulangi password baru"
                  className={`w-full px-4 py-3 border rounded-xl outline-none text-sm focus:border-[#4CAF50] ${errors.confirm ? 'border-red-300' : 'border-gray-200'}`}
                  value={passwords.confirm}
                  onChange={(e) => {setPasswords({...passwords, confirm: e.target.value}); setErrors({...errors, confirm: ""});}}
                />
                {errors.confirm && <p className="text-red-400 text-[10px] italic mt-1 ml-1">{errors.confirm}</p>}
              </div>

              <button 
                onClick={handleUpdatePassword}
                className="w-full border border-gray-300 text-gray-800 font-bold py-3 rounded-full mt-2"
              >
                Simpan Perubahan Password
              </button>
            </div>
          </div>
        )}

        <button className="w-full border border-red-200 bg-white text-red-500 font-bold py-3 rounded-xl flex items-center justify-center gap-2">
          <LogOut size={18} /> Logout
        </button>
      </section>

      {/* MODAL SUKSES */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
          <div className="bg-white border border-gray-100 rounded-[30px] w-full max-w-sm p-10 relative z-10 shadow-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 border border-green-500 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={32} className="text-[#4CAF50]" />
            </div>
            <h3 className="text-lg font-bold mb-8">{successMessage}</h3>
            <button 
              onClick={() => { setShowSuccessModal(false); if(successMessage.includes("Password")) setShowPasswordForm(false); }}
              className="w-full bg-[#4CAF50] text-white font-bold py-3 rounded-xl"
            >
              Oke
            </button>
          </div>
        </div>
      )}
    </main>
  );
}