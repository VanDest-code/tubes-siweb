"use client";

import { useState, useEffect } from "react";
import { Package, MapPin, ArrowRight, ArrowLeft, CheckCircle2, Phone, Upload, Clock, HelpCircle, XCircle } from "lucide-react";

export default function TaskPage() {
  const [activeTab, setActiveTab] = useState<"menunggu" | "aktif">("menunggu");
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showFinishedPopup, setShowFinishedPopup] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [showRejectSuccess, setShowRejectSuccess] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("Kurir Menuju Lokasi");

  // State Timer & Error Handling
  const [startTime, setStartTime] = useState<number | null>(null);
  const [liveDuration, setLiveDuration] = useState("00:00");
  const [finalDuration, setFinalDuration] = useState("");
  const [fileError, setFileError] = useState(false);

  // Live Timer Logic
  useEffect(() => {
    let interval: any;
    if (startTime && selectedTask && activeTab === "aktif") {
      interval = setInterval(() => {
        const diff = Math.floor((Date.now() - startTime) / 1000);
        const mins = Math.floor(diff / 60).toString().padStart(2, '0');
        const secs = (diff % 60).toString().padStart(2, '0');
        setLiveDuration(`${mins}:${secs}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, selectedTask, activeTab]);

  // Data Pusat
  const [allTasks, setAllTasks] = useState([
    { id: "NDB001", status: "Menunggu Kurir", name: "Siti Rahayu", itemType: "Dokumen", pickup: "Jl.Dagen Malioboro No.15", destination: "Jl.Babarsari No.113", price: "Rp 20.000", senderPhone: "082250082024", receiverName: "Siti Rahayu", receiverPhone: "082250082025", weight: "1-5 Kg", payment: "Tunai", notes: "tidak ada catatan tambahan" },
    { id: "NDB002", status: "Menunggu Kurir", name: "Ray Claudio Moses", itemType: "Makanan", pickup: "Jl.Wonomartani, Sleman", destination: "Kota Yogyakarta", price: "Rp 23.000", senderPhone: "081234567890", receiverName: "Budi Santoso", receiverPhone: "089876543210", weight: "1 Kg", payment: "QRIS", notes: "Tolong hati-hati." },
    { id: "NDB003", status: "Menunggu Kurir", name: "Miguel", itemType: "Elektronik", pickup: "Jl.Paingan, Sleman", destination: "Kulon Progo", price: "Rp 40.000", senderPhone: "087711223344", receiverName: "Toko Maju", receiverPhone: "081199887766", weight: "5-10 Kg", payment: "Transfer", notes: "Fragile." },
    { id: "NDB004", status: "Menunggu Kurir", name: "Talasia", itemType: "Dokumen", pickup: "Jl.Babadan, Sleman", destination: "Depok, Sleman", price: "Rp 10.000", senderPhone: "085566778899", receiverName: "Andi Wijaya", receiverPhone: "085522334455", weight: "0.5 Kg", payment: "Tunai", notes: "Titip satpam." },
    { id: "NDB005", status: "Menunggu Kurir", name: "Raymondo", itemType: "Makanan", pickup: "Jl.Godean, Sleman", destination: "Gamping, Sleman", price: "Rp 10.000", senderPhone: "081122233344", receiverName: "Rina Kartika", receiverPhone: "081155566677", weight: "2 Kg", payment: "Tunai", notes: "Panggil di pagar." },
  ]);

  const waitingTasks = allTasks.filter(t => t.status === "Menunggu Kurir");
  const activeTasks = allTasks.filter(t => t.status !== "Menunggu Kurir");

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Paket Sudah Diambil": return "bg-blue-50 text-blue-500 border-blue-200";
      case "Dalam Perjalanan": return "bg-purple-50 text-purple-500 border-purple-200";
      case "Selesai": return "bg-green-50 text-green-500 border-green-200";
      default: return "bg-orange-50 text-orange-400 border-orange-200";
    }
  };

  const handleConfirmAmbil = () => {
    setAllTasks(prev => prev.map(task => 
      task.id === selectedTask.id ? { ...task, status: "Kurir Menuju Lokasi" } : task
    ));
    setShowSuccessPopup(true);
  };

  const handleConfirmTolak = () => {
    setShowRejectConfirm(false);
    setShowRejectSuccess(true);
  };

  const handleRejectSuccessDone = () => {
    setAllTasks(prev => prev.filter(t => t.id !== selectedTask.id));
    setShowRejectSuccess(false);
    setSelectedTask(null);
  };

  const handleStartMission = () => {
    setShowSuccessPopup(false);
    setSelectedTask(null);
    setActiveTab("aktif");
    setCurrentStatus("Kurir Menuju Lokasi");
    setStartTime(Date.now());
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && !["image/png", "image/jpeg"].includes(file.type)) {
      setFileError(true);
    } else {
      setFileError(false);
    }
  };

  const handleFinishTask = () => {
    if (startTime) {
      const diffInSeconds = Math.floor((Date.now() - startTime) / 1000);
      const minutes = Math.floor(diffInSeconds / 60);
      const seconds = diffInSeconds % 60;
      setFinalDuration(`${minutes} menit : ${seconds} detik`);
      setShowFinishedPopup(true);
    }
  };

  const handleCloseAll = () => {
    setAllTasks(prev => prev.filter(t => t.id !== selectedTask.id));
    setShowFinishedPopup(false);
    setSelectedTask(null);
    setActiveTab("menunggu");
    setStartTime(null);
    setLiveDuration("00:00");
  };

  if (selectedTask) {
    const isAktif = activeTab === "aktif";

    return (
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        {/* POP-UP KONFIRMASI TOLAK */}
        {showRejectConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
            <div className="bg-white rounded-[32px] p-10 max-w-sm w-full text-center relative z-10 shadow-2xl animate-in zoom-in duration-300">
              <div className="w-16 h-16 border-2 border-green-500 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"><HelpCircle size={32} /></div>
              <h2 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Yakin untuk menolak <span className="font-black">{selectedTask.id}</span>?</h2>
              <button onClick={handleConfirmTolak} className="w-full bg-[#4CAF50] text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-colors">Ya</button>
            </div>
          </div>
        )}

        {/* POP-UP BERHASIL DITOLAK */}
        {showRejectSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
            <div className="bg-white rounded-[32px] p-10 max-w-sm w-full text-center relative z-10 shadow-2xl animate-in zoom-in duration-300">
              <div className="w-16 h-16 border-2 border-green-500 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={32} /></div>
              <h2 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Pickup <span className="font-black">{selectedTask.id}</span> berhasil <span className="text-red-500">ditolak</span></h2>
              <button onClick={handleRejectSuccessDone} className="w-full bg-[#4CAF50] text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-colors">Oke</button>
            </div>
          </div>
        )}

        {/* POP-UP BERHASIL AMBIL */}
        {showSuccessPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
            <div className="bg-white rounded-[32px] p-10 max-w-sm w-full text-center relative z-10 shadow-2xl animate-in zoom-in duration-300">
              <div className="w-16 h-16 border-2 border-green-500 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={32} /></div>
              <h2 className="text-lg font-bold text-gray-900 mb-6">Pickup <span className="font-black">{selectedTask.id}</span> berhasil <span className="text-green-500">diambil</span></h2>
              <button onClick={handleStartMission} className="w-full bg-[#4CAF50] text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-colors">Oke</button>
            </div>
          </div>
        )}

        {/* POP-UP BERHASIL SELESAI */}
        {showFinishedPopup && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
            <div className="bg-white rounded-[32px] p-10 max-w-sm w-full text-center relative z-10 shadow-2xl animate-in zoom-in duration-300">
              <div className="w-16 h-16 border-2 border-[#4CAF50] text-[#4CAF50] rounded-full flex items-center justify-center mx-auto mb-6"><Clock size={32} /></div>
              <h2 className="text-lg font-bold text-gray-900 mb-6">Selamat! Kamu berhasil menyelesaikan tugas selama <span className="text-green-500 font-black">{finalDuration}</span></h2>
              <button onClick={handleCloseAll} className="w-full bg-[#4CAF50] text-white font-bold py-3 rounded-xl hover:bg-green-600">Oke</button>
            </div>
          </div>
        )}

        <button onClick={() => setSelectedTask(null)} className="flex items-center gap-2 text-gray-500 hover:text-green-600 font-medium transition-colors"><ArrowLeft size={20} /> Kembali</button>

        <div className="bg-white border border-green-500 rounded-[24px] p-8 shadow-sm">
          <div className="flex justify-between items-start mb-10">
            <div className="space-y-1">
              <span className="font-black text-xl text-gray-900 block">{selectedTask.id}</span>
              {isAktif && (
                <div className="flex items-center gap-2 text-red-500 font-bold text-xs animate-pulse"><Clock size={12} /><span>Durasi: {liveDuration}</span></div>
              )}
            </div>
            <span className={`text-[10px] font-black px-8 py-2 rounded-full border uppercase transition-all duration-300 ${isAktif ? getStatusStyle(currentStatus) : "bg-red-50 text-red-500 border-red-200"}`}>
              {isAktif ? currentStatus : "Menunggu Kurir"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="space-y-4">
              <h3 className="text-green-500 font-bold text-lg">Informasi Pengirim</h3>
              <div className="text-sm"><p className="text-gray-400 font-bold uppercase text-[10px]">Nama</p><p className="font-bold">{selectedTask.name}</p></div>
              <div className="text-sm"><p className="text-gray-400 font-bold uppercase text-[10px]">No.Telepon</p><p className="font-bold">{selectedTask.senderPhone}</p></div>
              <div className="text-sm"><p className="text-gray-400 font-bold uppercase text-[10px]">Alamat Pickup</p><p className="font-bold">{selectedTask.pickup}</p></div>
            </div>
            <div className="space-y-4">
              <h3 className="text-green-500 font-bold text-lg">Informasi Penerima</h3>
              <div className="text-sm"><p className="text-gray-400 font-bold uppercase text-[10px]">Nama</p><p className="font-bold">{selectedTask.receiverName}</p></div>
              <div className="text-sm"><p className="text-gray-400 font-bold uppercase text-[10px]">No.Telepon</p><p className="font-bold">{selectedTask.receiverPhone}</p></div>
              <div className="text-sm"><p className="text-gray-400 font-bold uppercase text-[10px]">Alamat Tujuan</p><p className="font-bold">{selectedTask.destination}</p></div>
            </div>
            <div className="space-y-4 pt-9">
              <div className="text-sm"><p className="text-gray-400 font-bold uppercase text-[10px]">Jenis Barang</p><p className="font-bold">{selectedTask.itemType}</p></div>
              <div className="text-sm"><p className="text-gray-400 font-bold uppercase text-[10px]">Prediksi Berat</p><p className="font-bold">{selectedTask.weight}</p></div>
              <div className="text-sm"><p className="text-gray-400 font-bold uppercase text-[10px]">Metode Pembayaran</p><p className="font-bold">{selectedTask.payment}</p></div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-green-500 font-bold italic mb-2">Catatan tambahan</h3>
            <div className="bg-green-50/30 border border-green-200 rounded-xl p-6 text-sm italic text-gray-500">{selectedTask.notes}</div>
          </div>
          <div className="flex items-center gap-4 text-lg font-black">Biaya Ongkir <span className="text-green-500">{selectedTask.price}</span></div>
        </div>

        {!isAktif ? (
          <div className="flex gap-6 mt-10">
            <button onClick={() => setShowRejectConfirm(true)} className="flex-1 bg-white border border-red-500 text-red-500 font-bold py-4 rounded-full transition-colors hover:bg-red-50">Tolak Tugas</button>
            <button onClick={handleConfirmAmbil} className="flex-1 bg-[#4CAF50] text-white font-bold py-4 rounded-full shadow-lg transition-colors hover:bg-green-600">Ambil Tugas</button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white border border-green-500 rounded-[24px] p-8 shadow-sm space-y-4">
              <p className="font-bold text-gray-900">Update Status</p>
              <button onClick={() => setCurrentStatus("Paket Sudah Diambil")} className={`w-full text-left p-4 rounded-xl font-bold border transition-all ${currentStatus === "Paket Sudah Diambil" ? "bg-blue-100 border-blue-400 text-blue-600" : "bg-blue-50/50 border-blue-100 text-blue-400"}`}>Paket Sudah Diambil</button>
              <button onClick={() => setCurrentStatus("Dalam Perjalanan")} className={`w-full text-left p-4 rounded-xl font-bold border transition-all ${currentStatus === "Dalam Perjalanan" ? "bg-purple-100 border-purple-400 text-purple-600" : "bg-purple-50/50 border-purple-100 text-purple-400"}`}>Dalam Perjalanan</button>
              <button onClick={() => setCurrentStatus("Selesai")} className={`w-full text-left p-4 rounded-xl font-bold border transition-all ${currentStatus === "Selesai" ? "bg-green-100 border-green-400 text-green-600" : "bg-green-50/50 border-green-100 text-green-400"}`}>Selesai</button>
            </div>
            {currentStatus === "Selesai" && (
              <div className="bg-white border border-green-500 rounded-[24px] p-8 shadow-sm space-y-4 animate-in slide-in-from-bottom duration-300">
                <p className="font-bold text-gray-900">Foto Bukti Selesai</p>
                <label>
                  <div className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${fileError ? "border-red-400 bg-red-50/30" : "border-gray-300 hover:bg-gray-50"}`}>
                    <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleFileChange} />
                    <Upload className={`${fileError ? "text-red-400" : "text-gray-400"} mb-2`} size={32} />
                    <p className={`${fileError ? "text-red-400" : "text-gray-400"} text-sm font-medium`}>Klik untuk upload foto bukti</p>
                  </div>
                </label>
                {fileError && <p className="text-red-500 text-[11px] italic font-medium ml-1">Foto harus dalam bentuk .png/.jpg</p>}
                <button disabled={fileError} onClick={handleFinishTask} className={`w-full font-bold py-4 rounded-full transition-all ${fileError ? "bg-gray-300 cursor-not-allowed text-gray-100" : "bg-[#4CAF50] text-white hover:bg-green-600"}`}>Kirim Bukti</button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div><h1 className="text-2xl font-bold text-gray-900">Pusat Aktivitas</h1><p className="text-sm text-gray-500 mt-1">Kelola tugas pickupmu</p></div>
      <div className="inline-flex bg-gray-100/50 p-1.5 rounded-full border border-gray-200">
        <button onClick={() => setActiveTab("menunggu")} className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${activeTab === "menunggu" ? "bg-white shadow-md text-gray-800" : "text-gray-400"}`}>Menunggu Kurir <span className="bg-green-500 text-white text-[10px] px-2.5 py-1 rounded-full ml-2">{waitingTasks.length}</span></button>
        <button onClick={() => setActiveTab("aktif")} className={`px-10 py-3 rounded-full text-sm font-bold transition-all ${activeTab === "aktif" ? "bg-white shadow-md text-gray-800" : "text-gray-400"}`}>Aktif <span className="bg-green-500 text-white text-[10px] px-2.5 py-1 rounded-full ml-2">{activeTasks.length}</span></button>
      </div>
      <div className="space-y-4">
        {allTasks.filter(t => activeTab === "menunggu" ? t.status === "Menunggu Kurir" : t.status !== "Menunggu Kurir").map((task) => (
          <div key={task.id} onClick={() => setSelectedTask(task)} className="bg-white border border-green-400 rounded-[20px] p-6 hover:shadow-md cursor-pointer group transition-all">
            <div className="flex justify-between items-center mb-5 text-sm">
              <div className="flex items-center gap-4">
                <span className="font-black text-xl text-gray-900">{task.id}</span>
                <span className={`${activeTab === "menunggu" ? "bg-red-50 text-red-500 border-red-100" : getStatusStyle(currentStatus)} font-bold px-6 py-1.5 rounded-full border uppercase text-[10px]`}>{activeTab === "aktif" ? currentStatus : task.status}</span>
              </div>
              <div className="flex items-center gap-4 font-black text-green-600 text-xl">{task.price} <ArrowRight size={24} className="group-hover:translate-x-2 transition-all" /></div>
            </div>
            <div className="space-y-2 text-sm text-gray-500 font-medium"><div className="flex items-center gap-3"><Package size={18} className="text-gray-300"/> {task.name} | Berat {task.weight}</div><div className="flex items-center gap-3"><MapPin size={18} className="text-gray-300"/> {task.pickup}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}