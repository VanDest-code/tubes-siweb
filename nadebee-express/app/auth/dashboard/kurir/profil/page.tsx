"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Edit2, Check, Lock, Trash2, Truck, Camera, X, AlertCircle, HelpCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ProfilKurirPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [courierData, setCourierData] = useState({
    id: "", username: "", email: "", phone: "", jenis_kendaraan: "", plat_nomor: "", avatar_url: "",
  });
  
  const [originalData, setOriginalData] = useState({
    id: "", username: "", email: "", phone: "", jenis_kendaraan: "", plat_nomor: "", avatar_url: "",
  });

  const [profileErrors, setProfileErrors] = useState({ username: "", phone: "", plat_nomor: "" });
  const [stats, setStats] = useState({ totalPengiriman: 0, avgRating: "0.0", pesananAktif: 0 });

  // --- CUSTOM DIALOG STATE ---
  const [dialog, setDialog] = useState<{
    isOpen: boolean; type: "success" | "error" | "confirm"; title: string; message: string; onConfirm: (() => void) | null;
  }>({ isOpen: false, type: "success", title: "", message: "", onConfirm: null });

  const showDialog = (type: "success" | "error" | "confirm", title: string, message: string, onConfirm: (() => void) | null = null) => {
    setDialog({ isOpen: true, type, title, message, onConfirm });
  };

  useEffect(() => {
    fetchProfileAndStats();
  }, []);

  const fetchProfileAndStats = async () => {
    try {
      setLoading(true);
      const savedCourierId = sessionStorage.getItem("loggedInCourierId") || "a2c08fd2-ccc2-4271-8a7b-b74870c9dd60";
      const { data: profile, error: profileError } = await supabase.from("couriers").select("*").eq("id", savedCourierId).single();
      if (profileError) throw profileError;

      if (profile) {
        const fetchedData = {
          id: profile.id, username: profile.username || "Kurir", email: profile.email || "", phone: profile.phone || "",
          jenis_kendaraan: profile.jenis_kendaraan || "-", plat_nomor: profile.plat_nomor || "-", avatar_url: profile.avatar_url || "",
        };
        setCourierData(fetchedData);
        setOriginalData(fetchedData);
      }

      const { data: shipments, error: shipError } = await supabase.from("shipments").select("status, rating").eq("courier_id", savedCourierId);
      if (shipError) throw shipError;

      if (shipments) {
        let selesai = 0, totalBintang = 0, jumlahPemberiRating = 0, aktif = 0;
        shipments.forEach((task) => {
          const status = (task.status || "").toLowerCase().trim();
          if (status === "selesai") {
            selesai++;
            if (task.rating && task.rating > 0) { totalBintang += task.rating; jumlahPemberiRating++; }
          } else if (status !== "dibatalkan" && status !== "ditolak" && status !== "menunggu kurir") {
            aktif++;
          }
        });
        const rataRataRating = jumlahPemberiRating > 0 ? (totalBintang / jumlahPemberiRating).toFixed(1) : "0.0";
        setStats({ totalPengiriman: selesai, avgRating: rataRataRating, pesananAktif: aktif });
      }
    } catch (error) {
      console.error("Gagal memuat profil:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    let tempErrors = { username: "", phone: "", plat_nomor: "" };
    let isValid = true;

    if (!courierData.username.trim()) { tempErrors.username = "Username wajib diisi"; isValid = false; } 
    else if (courierData.username.trim().length < 3) { tempErrors.username = "Username minimal 3 karakter"; isValid = false; }

    if (!courierData.phone.trim()) { tempErrors.phone = "Nomor telepon wajib diisi"; isValid = false; } 
    else if (!courierData.phone.startsWith("08")) { tempErrors.phone = "Nomor harus diawali dengan '08'"; isValid = false; } 
    else if (courierData.phone.length < 10 || courierData.phone.length > 13) { tempErrors.phone = "Nomor telepon harus 10 - 13 digit"; isValid = false; }

    if (!courierData.plat_nomor.trim()) { tempErrors.plat_nomor = "Plat nomor wajib diisi"; isValid = false; }

    setProfileErrors(tempErrors);
    if (!isValid) return;

    try {
      setIsSaving(true);
      const { error } = await supabase.from("couriers").update({
        username: courierData.username.trim(), phone: courierData.phone, plat_nomor: courierData.plat_nomor.trim(), 
      }).eq("id", courierData.id);

      if (error) throw error;
      
      setOriginalData(courierData); 
      setIsEditing(false);
      showDialog("success", "Berhasil", "Profil berhasil disimpan.");
    } catch (error) {
      console.error("Gagal update profil:", error);
      showDialog("error", "Gagal", "Terjadi kesalahan saat menyimpan profil.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setCourierData(originalData); 
    setProfileErrors({ username: "", phone: "", plat_nomor: "" }); 
    setIsEditing(false);
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) throw new Error("Anda harus memilih gambar.");

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${courierData.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      const { error: updateError } = await supabase.from('couriers').update({ avatar_url: publicUrl }).eq('id', courierData.id);
      if (updateError) throw updateError;

      setCourierData({ ...courierData, avatar_url: publicUrl });
      showDialog("success", "Berhasil", "Foto profil berhasil diperbarui!");
    } catch (error: any) {
      showDialog("error", "Gagal", "Gagal mengunggah foto: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const confirmDeleteAvatar = () => {
    showDialog("confirm", "Hapus Foto", "Yakin ingin menghapus foto profil?", executeDeleteAvatar);
  };

  const executeDeleteAvatar = async () => {
    try {
      setUploading(true);
      if (courierData.avatar_url) {
        const fileName = courierData.avatar_url.split('/').pop();
        if (fileName) await supabase.storage.from('avatars').remove([fileName]);
      }
      const { error: updateError } = await supabase.from('couriers').update({ avatar_url: "" }).eq('id', courierData.id);
      if (updateError) throw updateError;

      setCourierData({ ...courierData, avatar_url: "" });
      showDialog("success", "Berhasil", "Foto profil berhasil dihapus!");
    } catch (error: any) {
      showDialog("error", "Gagal", "Gagal menghapus foto: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const confirmHapusAkun = () => {
    showDialog("confirm", "Hapus Akun Permanen", "PERINGATAN! Apakah Anda yakin ingin menghapus akun kurir Anda secara permanen? Data yang dihapus tidak bisa dikembalikan.", executeHapusAkun);
  };

  const executeHapusAkun = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.from("couriers").delete().eq("id", courierData.id);
      if (error) throw error;
      sessionStorage.clear(); 
      router.push("/auth/login"); 
    } catch (error: any) {
      console.error("Gagal menghapus:", error);
      showDialog("error", "Gagal", "Terjadi kesalahan saat menghapus akun: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 px-4 md:px-0 pt-6">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-black text-gray-900">Profil Kurir</h1>
        <p className="text-sm text-gray-500 font-medium mt-1">Kelola informasi akunmu</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#4CAF50] font-bold animate-pulse">Memuat data profil...</div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white border border-green-400 rounded-[32px] p-8 shadow-sm flex flex-col items-center">
            <div className="relative mb-4 group">
              <div className="w-28 h-28 border-4 border-green-500 rounded-full overflow-hidden flex items-center justify-center text-green-500 bg-green-50 relative">
                {courierData.avatar_url ? (
                  <img src={courierData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={48} />
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-green-600 animate-pulse">Loading...</span>
                  </div>
                )}
              </div>
              
              {courierData.avatar_url && (
                <button onClick={confirmDeleteAvatar} disabled={uploading} className={`absolute bottom-0 left-0 w-9 h-9 bg-white rounded-full flex items-center justify-center text-red-500 cursor-pointer hover:bg-red-50 border-2 border-red-100 shadow-md transition-all z-10 ${uploading ? 'opacity-50 pointer-events-none' : ''}`} title="Hapus Foto">
                  <Trash2 size={16} />
                </button>
              )}

              <label htmlFor="avatar-upload" className={`absolute bottom-0 right-0 w-9 h-9 bg-green-500 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-green-600 border-2 border-white shadow-md transition-all z-10 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                <Camera size={16} />
              </label>
              <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={uploadAvatar} disabled={uploading} />
            </div>

            <h2 className="text-xl font-black text-gray-900 mb-8 truncate max-w-[250px] md:max-w-[350px] px-4 text-center">
              {courierData.username}
            </h2>

            <div className="flex w-full justify-between px-4 md:px-12 text-center divide-x divide-gray-100">
              <div className="flex-1"><p className="text-3xl font-black text-[#4CAF50] mb-1">{stats.totalPengiriman}</p><p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Pengiriman</p></div>
              <div className="flex-1"><p className="text-3xl font-black text-orange-400 mb-1">{stats.avgRating}</p><p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Rating</p></div>
              <div className="flex-1"><p className="text-3xl font-black text-blue-500 mb-1">{stats.pesananAktif}</p><p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Pesanan Aktif</p></div>
            </div>
          </div>

          <div className="bg-white border border-green-400 rounded-[32px] p-8 md:p-10 shadow-sm relative">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black text-gray-900">Informasi Pribadi</h3>
              {isEditing ? (
                <div className="flex items-center gap-3">
                  <button onClick={handleCancelEdit} disabled={isSaving} className="w-10 h-10 rounded-full flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 transition-colors shadow-sm" title="Batal">
                    <X size={18} />
                  </button>
                  <button onClick={handleSaveProfile} disabled={isSaving} className="w-10 h-10 rounded-full flex items-center justify-center bg-green-50 text-green-600 hover:bg-green-100 transition-colors shadow-sm" title="Simpan">
                    <Check size={18} />
                  </button>
                </div>
              ) : (
                <button onClick={() => setIsEditing(true)} className="w-10 h-10 rounded-full flex items-center justify-center bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="Edit Profil">
                  <Edit2 size={18} />
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><User size={16} /> Username</label>
                <input
                  type="text" value={courierData.username}
                  onChange={(e) => {
                    const cleanName = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
                    if (cleanName.length > 30) {
                      setProfileErrors({...profileErrors, username: "Maksimal 30 karakter!"});
                      setCourierData({...courierData, username: cleanName.slice(0, 30)});
                    } else {
                      setProfileErrors({...profileErrors, username: ""});
                      setCourierData({...courierData, username: cleanName});
                    }
                  }}
                  disabled={!isEditing}
                  className={`w-full p-4 rounded-xl text-sm font-medium border outline-none transition-colors ${!isEditing ? "bg-gray-50/50 border-gray-100 text-gray-500" : profileErrors.username ? "bg-white border-red-300 text-black" : "bg-white border-green-400 focus:ring-2 focus:ring-green-100 text-black"}`}
                />
                {profileErrors.username && <p className="text-red-500 text-[11px] italic mt-1.5">{profileErrors.username}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><Mail size={16} /> Email</label>
                <div className="relative">
                  <input type="text" value={courierData.email} disabled className="w-full p-4 rounded-xl text-sm font-medium border bg-green-50/30 border-green-100 text-gray-500 pr-12" />
                  <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><Phone size={16} /> Nomor Telepon</label>
                <input
                  type="text" value={courierData.phone}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                    if (onlyNums.length > 13) {
                      setProfileErrors({...profileErrors, phone: "Maksimal 13 digit angka!"});
                      setCourierData({...courierData, phone: onlyNums.slice(0, 13)});
                    } else {
                      setProfileErrors({...profileErrors, phone: ""});
                      setCourierData({...courierData, phone: onlyNums});
                    }
                  }}
                  disabled={!isEditing}
                  className={`w-full p-4 rounded-xl text-sm font-medium border outline-none transition-colors ${!isEditing ? "bg-gray-50/50 border-gray-100 text-gray-500" : profileErrors.phone ? "bg-white border-red-300 text-black" : "bg-white border-green-400 focus:ring-2 focus:ring-green-100 text-black"}`}
                />
                {profileErrors.phone && <p className="text-red-500 text-[11px] italic mt-1.5">{profileErrors.phone}</p>}
              </div>

              <div className="flex gap-4">
                 <div className="flex-1">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><Truck size={16} /> Armada</label>
                    <div className="relative">
                      <input type="text" value={courierData.jenis_kendaraan} disabled className="w-full p-4 rounded-xl text-sm font-medium border bg-green-50/30 border-green-100 text-gray-500 pr-12" />
                      <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    </div>
                 </div>
                 <div className="flex-1">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">Plat Nomor</label>
                    <input
                      type="text" value={courierData.plat_nomor}
                      onChange={(e) => {
                        const cleanPlat = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '').toUpperCase();
                        if (cleanPlat.length > 11) {
                          setProfileErrors({...profileErrors, plat_nomor: "Maksimal 11 karakter!"});
                          setCourierData({...courierData, plat_nomor: cleanPlat.slice(0, 11)});
                        } else {
                          setProfileErrors({...profileErrors, plat_nomor: ""});
                          setCourierData({...courierData, plat_nomor: cleanPlat});
                        }
                      }}
                      disabled={!isEditing}
                      className={`w-full p-4 rounded-xl text-sm font-medium border outline-none transition-colors uppercase ${!isEditing ? "bg-gray-50/50 border-gray-100 text-gray-500" : profileErrors.plat_nomor ? "bg-white border-red-300 text-black" : "bg-white border-green-400 focus:ring-2 focus:ring-green-100 text-black"}`}
                      placeholder="Misal: AB 1234 CD"
                    />
                    {profileErrors.plat_nomor && <p className="text-red-500 text-[11px] italic mt-1.5">{profileErrors.plat_nomor}</p>}
                 </div>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-red-100 pt-6">
            <h3 className="text-red-500 font-bold mb-2 flex items-center gap-2"><Trash2 size={20} /> Warning!</h3>
            <p className="text-sm text-gray-500 mb-4">Tindakan ini akan menghapus seluruh data Anda dari sistem secara permanen.</p>
            <button onClick={confirmHapusAkun} className="w-full bg-red-50 text-red-600 border border-red-200 font-bold py-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
              Hapus Akun Saya
            </button>
          </div>
        </div>
      )}

      {/* --- RENDER CUSTOM DIALOG --- */}
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
                <button onClick={() => { setDialog({...dialog, isOpen: false}); dialog.onConfirm?.(); }} className="flex-1 bg-red-500 text-white font-bold py-3.5 rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-100">Ya, Hapus</button>
              </div>
            ) : (
              <button onClick={() => { setDialog({...dialog, isOpen: false}); dialog.onConfirm?.(); }} className="w-full bg-[#4CAF50] text-white font-bold py-4 rounded-xl hover:bg-green-600 shadow-lg shadow-green-100 transition-colors">
                Oke Mengerti
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}