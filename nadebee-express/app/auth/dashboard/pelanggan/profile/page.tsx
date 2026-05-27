"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/layout/Sidebar";
import { User, Phone, Mail, Edit3, CheckCircle2, Key, LogOut, Check } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: ""
  });
  const [isEditMode, setIsEditMode] = useState(false);

  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });
  const [errors, setErrors] = useState({ old: "", new: "", confirm: "" });

  useEffect(() => {
    async function getProfile() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          router.push("/auth/login/pelanggan");
          return;
        }

        const userEmail = session.user.email ? session.user.email.toLowerCase().trim() : "";

        // KEMBALI KE KOLOM ASLI: full_name dan phone_number
        const { data, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, phone_number, email") 
          .eq("email", userEmail)
          .single();

        if (profileError) {
          console.log("⚠️ Menggunakan data fallback dari session.");
          setFormData({
            username: session.user.user_metadata?.username || "Pelanggan Nadebee",
            phone: session.user.user_metadata?.phone || "",
            email: userEmail
          });
          return;
        }

        if (data) {
          setFormData({
            username: data.full_name || "",
            phone: data.phone_number || "",
            email: data.email || ""
          });
        }
      } catch (err) {
        console.error("Gagal mengeksekusi fungsi profil:", err);
      } finally {
        setLoading(false);
      }
    }
    getProfile();
  }, [router]);

  const handleUpdateProfile = async () => {
    try {
      setIsSaving(true);
      const targetEmail = formData.email.toLowerCase().trim();
      
      const { data, error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.username, // KEMBALI KE KOLOM ASLI
          phone_number: formData.phone, // KEMBALI KE KOLOM ASLI
          user_type: "pelanggan"
        })
        .eq("email", targetEmail)
        .select(); 

      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error("Update diblokir oleh sistem keamanan database (RLS)!");
      }

      setIsEditMode(false);
      setSuccessMessage("Profil Berhasil Disimpan");
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error("Gagal mengupdate profil:", err);
      alert(`Gagal menyimpan perubahan: ${err.message || "Periksa koneksi atau keamanan database."}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    let tempErrors = { old: "", new: "", confirm: "" };
    let isValid = true;

    if (!passwords.old) {
      tempErrors.old = "Password lama wajib diisi";
      isValid = false;
    } else if (passwords.old.length < 8 || passwords.old.length > 12) {
      tempErrors.old = "Min. 8 digit Maks. 12 digit";
      isValid = false;
    }

    if (!passwords.new) {
      tempErrors.new = "Password baru wajib diisi";
      isValid = false;
    } else if (passwords.new.length < 8 || passwords.new.length > 12) {
      tempErrors.new = "Min. 8 digit Maks. 12 digit";
      isValid = false;
    }

    if (!passwords.confirm) {
      tempErrors.confirm = "Konfirmasi password wajib diisi";
      isValid = false;
    } else if (passwords.confirm !== passwords.new) {
      tempErrors.confirm = "Password tidak cocok";
      isValid = false;
    }

    setErrors(tempErrors);

    if (isValid) {
      try {
        const { error } = await supabase.auth.updateUser({ password: passwords.new });
        if (error) throw error;
        setSuccessMessage("Password Berhasil Disimpan");
        setShowSuccessModal(true);
        setPasswords({ old: "", new: "", confirm: "" });
        setErrors({ old: "", new: "", confirm: "" });
      } catch (err) {
        console.error("Gagal memperbarui password:", err);
        alert("Gagal memperbarui password auth.");
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login/pelanggan");
  };

  if (loading && formData.email === "") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F9F4]">
        <p className="text-sm font-bold text-[#4CAF50] animate-pulse">Memuat informasi profil...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F9F4] pb-20">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <section className="flex flex-col items-center pt-12 px-6 max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-black text-gray-900">Profil Saya</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Kelola informasi akunmu</p>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 border-2 border-[#4CAF50] rounded-full flex items-center justify-center bg-white mb-4 shadow-sm">
            <User className="text-[#4CAF50]" size={32} />
          </div>
          <h2 className="text-xl font-black text-gray-900">{formData.username || "Pelanggan"}</h2>
          <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">Akun Terverifikasi</p>
        </div>

        <div className="w-full bg-white border border-gray-200 rounded-[32px] p-8 shadow-sm mb-6 relative">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black text-gray-900">Informasi Pribadi</h3>
            <button 
              onClick={() => isEditMode ? handleUpdateProfile() : setIsEditMode(true)}
              disabled={isSaving}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
            >
              {isEditMode ? <Check size={18} /> : <Edit3 size={18} />}
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                <User size={16} className="text-gray-400"/> Username
              </label>
              <input 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                disabled={!isEditMode}
                className={`w-full p-4 rounded-xl text-sm font-medium border transition-colors ${isEditMode ? "bg-white border-[#4CAF50] focus:ring-2 focus:ring-green-100 outline-none text-black" : "bg-gray-50/50 border-gray-100 text-gray-500"}`}
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                <Phone size={16} className="text-gray-400"/> Nomor Telepon
              </label>
              <input 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                disabled={!isEditMode}
                className={`w-full p-4 rounded-xl text-sm font-medium border transition-colors ${isEditMode ? "bg-white border-[#4CAF50] focus:ring-2 focus:ring-green-100 outline-none text-black" : "bg-gray-50/50 border-gray-100 text-gray-500"}`}
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                <Mail size={16} className="text-gray-400"/> Email
              </label>
              <input 
                disabled 
                value={formData.email} 
                className="w-full p-4 rounded-xl text-sm font-medium border bg-green-50/30 border-green-100 text-gray-400 cursor-not-allowed" 
              />
            </div>
            {isEditMode && (
              <button 
                onClick={handleUpdateProfile} 
                disabled={isSaving}
                className="w-full bg-[#4CAF50] text-white font-bold py-4 rounded-xl mt-4 hover:bg-green-600 transition-colors shadow-lg shadow-green-100"
              >
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            )}
          </div>
        </div>

        {!showPasswordForm && (
          <p className="mb-8 text-sm font-medium text-gray-500">
            Ubah Password? <button onClick={() => setShowPasswordForm(true)} className="font-black text-gray-900 hover:underline">Klik disini</button>
          </p>
        )}

        {showPasswordForm && (
          <div className="w-full bg-white border border-gray-200 rounded-[32px] p-8 shadow-sm mb-8">
            <h3 className="flex items-center gap-2 font-black text-lg text-gray-900 mb-6"><Key size={20} className="text-[#4CAF50]" /> Ubah Password</h3>
            <div className="space-y-5">
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">Password Lama</label>
                <input 
                  type="password" placeholder="Masukkan password lama"
                  className={`w-full p-4 rounded-xl text-sm font-medium border outline-none ${errors.old ? 'border-red-300' : 'border-gray-200 focus:border-[#4CAF50]'}`}
                  value={passwords.old} onChange={(e) => {setPasswords({...passwords, old: e.target.value}); setErrors({...errors, old: ""});}}
                />
                {errors.old && <p className="text-red-500 text-[11px] font-bold mt-1.5">{errors.old}</p>}
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">Password Baru</label>
                <input 
                  type="password" placeholder="Min. 8 karakter"
                  className={`w-full p-4 rounded-xl text-sm font-medium border outline-none ${errors.new ? 'border-red-300' : 'border-gray-200 focus:border-[#4CAF50]'}`}
                  value={passwords.new} onChange={(e) => {setPasswords({...passwords, new: e.target.value}); setErrors({...errors, new: ""});}}
                />
                {errors.new && <p className="text-red-500 text-[11px] font-bold mt-1.5">{errors.new}</p>}
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">Konfirmasi Password Baru</label>
                <input 
                  type="password" placeholder="Ulangi password baru"
                  className={`w-full p-4 rounded-xl text-sm font-medium border outline-none ${errors.confirm ? 'border-red-300' : 'border-gray-200 focus:border-[#4CAF50]'}`}
                  value={passwords.confirm} onChange={(e) => {setPasswords({...passwords, confirm: e.target.value}); setErrors({...errors, confirm: ""});}}
                />
                {errors.confirm && <p className="text-red-500 text-[11px] font-bold mt-1.5">{errors.confirm}</p>}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowPasswordForm(false)} className="flex-1 bg-white border border-gray-200 text-gray-600 font-bold py-4 rounded-xl hover:bg-gray-50">Batal</button>
                <button onClick={handleUpdatePassword} className="flex-1 bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800">Simpan</button>
              </div>
            </div>
          </div>
        )}

        <button onClick={handleLogout} className="w-full bg-white border border-red-200 text-red-500 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-50">
          <LogOut size={18} /> Logout
        </button>
      </section>

      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => { setShowSuccessModal(false); if(successMessage.includes("Password")) setShowPasswordForm(false); }}></div>
          <div className="bg-white border border-gray-100 rounded-[32px] w-full max-w-sm p-10 relative z-10 shadow-2xl flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={40} className="text-[#4CAF50]" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-8">{successMessage}</h3>
            <button onClick={() => { setShowSuccessModal(false); if(successMessage.includes("Password")) setShowPasswordForm(false); }} className="w-full bg-[#4CAF50] text-white font-bold py-4 rounded-xl hover:bg-green-600 shadow-lg shadow-green-100">
              Oke
            </button>
          </div>
        </div>
      )}
    </main>
  );
}