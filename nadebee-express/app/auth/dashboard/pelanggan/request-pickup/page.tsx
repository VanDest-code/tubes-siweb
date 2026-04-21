"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import router
import Sidebar from "@/components/layout/Sidebar";
import { ChevronDown } from "lucide-react";

export default function RequestPickupPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter(); // Inisialisasi router
  
  const [formData, setFormData] = useState({
    senderName: "", senderPhone: "", senderAddress: "",
    receiverName: "", receiverPhone: "", receiverAddress: "",
    itemType: "", destination: "", weight: "", note: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleValidation = () => {
    let newErrors: Record<string, string> = {};
    if (!formData.senderName) newErrors.senderName = "Nama wajib diisi";
    if (!formData.senderPhone) newErrors.senderPhone = "No.telepon wajib diisi";
    if (!formData.senderAddress) newErrors.senderAddress = "Alamat wajib diisi";
    if (!formData.receiverName) newErrors.receiverName = "Nama wajib diisi";
    if (!formData.receiverPhone) newErrors.receiverPhone = "No.telepon wajib diisi";
    if (!formData.receiverAddress) newErrors.receiverAddress = "Alamat wajib diisi";
    if (!formData.itemType) newErrors.itemType = "Jenis wajib diisi";
    if (!formData.destination) newErrors.destination = "Wilayah wajib diisi";
    if (!formData.weight) newErrors.weight = "Berat wajib diisi";
    
    setErrors(newErrors);

    // Jika tidak ada error, pindah ke halaman pilih kurir
    if (Object.keys(newErrors).length === 0) {
      // Kamu bisa mengirim data via query params atau state management jika perlu
      router.push("/auth/dashboard/pelanggan/request-pickup/pilih-kurir");
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F9F4] font-sans pb-20">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <header className="h-20 bg-white flex items-center px-8 sticky top-0 z-30 justify-between border-b border-gray-100">
        <button onClick={() => setIsSidebarOpen(true)} className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex flex-col items-center justify-center gap-[3px]">
          <div className="w-5 h-[2px] bg-black"></div>
          <div className="w-5 h-[2px] bg-black"></div>
          <div className="w-5 h-[2px] bg-black"></div>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xl">🐝</span>
          <h1 className="text-[18px] font-bold tracking-tight">Nadebee <span className="text-[#4CAF50]">Express</span></h1>
        </div>
        <div className="w-10"></div>
      </header>

      <section className="max-w-[1100px] mx-auto pt-12 px-6">
        <div className="mb-10">
          <h2 className="text-[28px] font-bold text-[#1A1A1A]">Request Pickup</h2>
          <p className="text-gray-500 text-sm">Isi detail pickup kamu dibawah ini!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <SectionCard title="Data Pengirim">
            <InputField label="Nama" placeholder="Masukkan nama" error={errors.senderName} 
              onChange={(v: string) => setFormData({...formData, senderName: v})} />
            <InputField label="No.Telepon" placeholder="Masukkan no.telepon" error={errors.senderPhone} 
              onChange={(v: string) => setFormData({...formData, senderPhone: v})} />
            <InputField label="Alamat Pickup" placeholder="Masukkan alamat" error={errors.senderAddress} 
              onChange={(v: string) => setFormData({...formData, senderAddress: v})} />
          </SectionCard>

          <SectionCard title="Data Penerima">
            <InputField label="Nama" placeholder="Masukkan nama" error={errors.receiverName} 
              onChange={(v: string) => setFormData({...formData, receiverName: v})} />
            <InputField label="No.Telepon" placeholder="Masukkan no.telepon" error={errors.receiverPhone} 
              onChange={(v: string) => setFormData({...formData, receiverPhone: v})} />
            <InputField label="Alamat Pickup" placeholder="Masukkan alamat" error={errors.receiverAddress} 
              onChange={(v: string) => setFormData({...formData, receiverAddress: v})} />
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <DropdownField 
            label="Jenis Barang" 
            placeholder={formData.itemType || "Pilih jenis barang"} 
            error={errors.itemType}
            options={["Dokumen", "Barang Elektronik", "Makanan", "Barang Pecah Belah", "Lainnya"]}
            onSelect={(v: string) => setFormData({...formData, itemType: v})}
          />
          <DropdownField 
            label="Wilayah Tujuan" 
            placeholder={formData.destination || "Pilih wilayah pengiriman"} 
            error={errors.destination}
            isTable
            options={[
              {n: "Sleman", p: "Rp. 20.000"}, {n: "Kota Yogyakarta", p: "Rp. 23.000"},
              {n: "Bantul", p: "Rp. 30.000"}, {n: "Kulon Progo", p: "Rp. 40.000"},
              {n: "Gunung Kidul", p: "Rp. 50.000"}
            ]}
            onSelect={(v: string) => setFormData({...formData, destination: v})}
          />
          <DropdownField 
            label="Prediksi Berat" 
            placeholder={formData.weight || "Pilih berat barang"} 
            error={errors.weight}
            options={["< 1 kg", "1-5 kg", "5-10 kg"]}
            onSelect={(v: string) => setFormData({...formData, weight: v})}
          />
        </div>

        <div className="bg-white border border-black rounded-[25px] p-7 mb-8 shadow-sm">
          <h3 className="font-bold mb-4">Catatan (opsional)</h3>
          <textarea 
            placeholder="Catatan tambahan untuk kurir.." 
            className="w-full bg-[#EBF5EB] border border-[#A5D6A7] rounded-2xl p-4 h-32 outline-none"
            onChange={(e) => setFormData({...formData, note: e.target.value})}
          />
        </div>

        <button 
          onClick={handleValidation}
          className="w-full bg-[#4CAF50] hover:bg-[#43A047] text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition-transform active:scale-[0.98]"
        >
          Request Pickup
        </button>
      </section>
    </main>
  );
}

// --- SUB-COMPONENTS DENGAN TYPE DEFINITION ---

function SectionCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-white border border-black rounded-[25px] p-7 shadow-sm">
      <h3 className="font-bold mb-5 text-[16px]">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function InputField({ label, placeholder, error, onChange }: { label: string, placeholder: string, error?: string, onChange: (val: string) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[13px] font-bold ml-1">{label}</label>
      <input 
        onChange={(e) => onChange(e.target.value)}
        className={`bg-[#EBF5EB] border ${error ? 'border-red-400' : 'border-[#A5D6A7]'} rounded-xl px-4 py-3 outline-none text-sm placeholder:text-gray-400`}
        placeholder={placeholder}
      />
      {error && <span className="text-[11px] text-red-500 italic ml-1">{error}</span>}
    </div>
  );
}

function DropdownField({ label, placeholder, error, options, onSelect, isTable }: any) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-black rounded-[25px] p-7 relative">
      <h3 className="font-bold mb-4 text-[15px]">{label}</h3>
      <div 
        onClick={() => setOpen(!open)}
        className={`bg-[#EBF5EB] border ${error ? 'border-red-400' : 'border-[#A5D6A7]'} rounded-xl px-4 py-3 flex justify-between items-center cursor-pointer`}
      >
        <span className={`text-sm ${placeholder.includes("Pilih") ? 'text-gray-400' : 'text-black font-medium'}`}>{placeholder}</span>
        <ChevronDown size={18} className={`text-green-600 transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>
      {error && <span className="text-[11px] text-red-500 italic mt-1 block">{error}</span>}

      {open && (
        <div className="absolute left-7 right-7 top-[110px] z-20 bg-white border border-black rounded-lg overflow-hidden shadow-xl">
          {options.map((opt: any, i: number) => (
            <div 
              key={i} 
              onClick={() => { onSelect(isTable ? opt.n : opt); setOpen(false); }}
              className="flex justify-between p-3 text-[13px] hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-0 font-bold"
            >
              <span>{isTable ? opt.n : opt}</span>
              {isTable && <span className="text-gray-400 font-normal">{opt.p}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}