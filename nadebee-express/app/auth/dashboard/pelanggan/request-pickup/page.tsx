"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; 
import Sidebar from "@/components/layout/Sidebar";
import { ChevronDown } from "lucide-react";

export default function RequestPickupPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter(); 
  
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

    // Jika tidak ada error, eksekusi logika pintar penentuan kendaraan
    if (Object.keys(newErrors).length === 0) {
      
      // LOGIKA OTOMATIS: Penentuan jenis kendaraan berdasarkan berat
      let calculatedVehicle = "Motor";
      if (formData.weight === "5-10 kg") {
        calculatedVehicle = "Mobil";
      }

      // Gabungkan data form dengan data kendaraan otomatis
      const finalDataToSubmit = {
        ...formData,
        vehicleType: calculatedVehicle // Field tersembunyi untuk Supabase
      };

      sessionStorage.setItem("pickupData", JSON.stringify(finalDataToSubmit));
      router.push("/auth/dashboard/pelanggan/request-pickup/pilih-kurir");
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F9F4] font-sans pb-20">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
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
            <InputField label="Alamat Tujuan" placeholder="Masukkan alamat" error={errors.receiverAddress} 
              onChange={(v: string) => setFormData({...formData, receiverAddress: v})} />
          </SectionCard>
        </div>

        {/* Kembali ke layout 3 kolom yang estetik */}
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
            placeholder={formData.destination || "Pilih wilayah"} 
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
            placeholder={formData.weight || "Pilih berat"} 
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

function SectionCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-white border border-black rounded-[25px] p-7 shadow-sm flex-1">
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
        className={`bg-[#EBF5EB] border ${error ? 'border-red-400 focus:ring-red-100' : 'border-[#A5D6A7] focus:border-green-500'} rounded-xl px-4 py-3 outline-none text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-green-100 transition-all`}
        placeholder={placeholder}
      />
      {error && <span className="text-[11px] text-red-500 font-bold italic ml-1 mt-0.5">{error}</span>}
    </div>
  );
}

function DropdownField({ label, placeholder, error, options, onSelect, isTable }: any) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-black rounded-[25px] p-7 relative h-full flex flex-col">
      <h3 className="font-bold mb-4 text-[15px]">{label}</h3>
      <div 
        onClick={() => setOpen(!open)}
        className={`bg-[#EBF5EB] border ${error ? 'border-red-400' : 'border-[#A5D6A7] hover:border-green-500'} rounded-xl px-4 py-3 flex justify-between items-center cursor-pointer transition-colors mt-auto`}
      >
        <span className={`text-sm ${placeholder.includes("Pilih") ? 'text-gray-400' : 'text-black font-bold'}`}>{placeholder}</span>
        <ChevronDown size={18} className={`text-green-600 transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>
      {error && <span className="text-[11px] text-red-500 font-bold italic mt-1 block absolute bottom-2 left-7">{error}</span>}

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