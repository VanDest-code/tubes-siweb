"use client";

import { useState, useEffect } from "react";
import { MapPin, ArrowRight, ArrowLeft, Phone, Upload, HelpCircle, XCircle, CheckCircle2, Package, Truck, User, Check, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function TaskPage() {
  const [activeTab, setActiveTab] = useState<"menunggu" | "aktif">("menunggu");
  const [selectedTask, setSelectedTask] = useState<any>(null);
  
  // State manajemen pop-up konfirmasi & sukses
  const [showAcceptConfirm, setShowAcceptConfirm] = useState(false); 
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); 
  const [showRejectConfirm, setShowRejectConfirm] = useState(false); 
  const [showRejectSuccess, setShowRejectSuccess] = useState(false); 
  const [showFinishedPopup, setShowFinishedPopup] = useState(false); 
  
  // State Pop-up Konfirmasi Update Status
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState("");
  
  const [currentStatus, setCurrentStatus] = useState("Kurir Menuju Lokasi");
  
  // State untuk Upload Foto
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // State Data Database
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    fetchTasks();

    const channel = supabase
      .channel('kurir-tasks-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'shipments' },
        () => { fetchTasks(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);
      const savedCourierId = sessionStorage.getItem("loggedInCourierId") || "a2c08fd2-ccc2-4271-8a7b-b74870c9dd60";

      const { data, error } = await supabase
        .from("shipments")
        .select("*")
        .eq("courier_id", savedCourierId);

      if (error) throw error;

      if (data) {
        // Filter otomatis membuang yang dibatalkan, ditolak, atau selesai
        const activeData = data.filter((d: any) => {
          const s = (d.status || "").toLowerCase().trim();
          return s !== "selesai" && s !== "dibatalkan" && s !== "ditolak";
        });

        const formattedData = activeData.map((d: any) => ({
          uuid: d.id, 
          id: d.resi_number, 
          status: (d.status || "Menunggu Kurir").trim(),
          name: d.sender_name,
          itemType: d.item_category || "Paket",
          pickup: d.sender_address,
          destination: d.receiver_address,
          price: `Rp ${d.shipping_cost?.toLocaleString('id-ID') || "0"}`,
          senderPhone: d.sender_phone || "-",
          receiverName: d.receiver_name,
          receiverPhone: d.receiver_phone || "-",
          weight: d.weight_range || "-",
          payment: d.payment_method || "Tunai", 
          notes: d.note || "Tidak ada catatan" 
        }));
        setAllTasks(formattedData);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // --- REVISI BULLETPROOF: ANTI-GHOSTING ---
  useEffect(() => {
    const checkGhosting = async () => {
      if (selectedTask) {
        const taskInActiveList = allTasks.find((task) => task.id === selectedTask.id);

        if (!taskInActiveList && !showRejectSuccess && !showFinishedPopup) {
          const { data, error } = await supabase
            .from("shipments")
            .select("status")
            .eq("resi_number", selectedTask.id)
            .single();

          if (!error && data) {
            const dbStatus = data.status.toLowerCase().trim();
            
            if (dbStatus === "dibatalkan") {
              alert(`🚨 Mohon maaf, pesanan ${selectedTask.id} baru saja dibatalkan oleh pelanggan.`);
              setShowAcceptConfirm(false);
              setShowRejectConfirm(false);
              setShowUpdateConfirm(false);
              setSelectedTask(null);
            }
          }
        }
      }
    };

    checkGhosting();
  }, [allTasks, selectedTask, showRejectSuccess, showFinishedPopup]);

  const waitingTasks = allTasks.filter(t => t.status.toLowerCase().trim() === "menunggu kurir");
  const activeTasks = allTasks.filter(t => t.status.toLowerCase().trim() !== "menunggu kurir");

  const dataTabSesuai = activeTab === "menunggu" ? waitingTasks : activeTasks;
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const dataPerHalaman = dataTabSesuai.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(dataTabSesuai.length / itemsPerPage) || 1;

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(i);
    }
    return buttons;
  };

  const getStatusStyle = (rawStatus: string) => {
    const status = (rawStatus || "").toLowerCase().trim();
    switch (status) {
      case "menunggu kurir": return "bg-orange-50 text-orange-500 border-orange-200"; 
      case "kurir menuju lokasi": return "bg-orange-50 text-orange-500 border-orange-200";
      case "paket sudah diambil": return "bg-blue-50 text-blue-500 border-blue-200"; 
      case "dalam perjalanan": return "bg-purple-50 text-purple-500 border-purple-200"; 
      case "selesai": return "bg-green-50 text-green-500 border-green-200"; 
      default: return "bg-gray-50 text-gray-400 border-gray-200";
    }
  };

  // --- FUNGSI AMBIL TUGAS ---
  const handleConfirmAmbil = async () => {
    try {
      setShowAcceptConfirm(false);
      const newStatus = 'Kurir Menuju Lokasi';
      
      const { data, error } = await supabase
        .from('shipments')
        .update({ status: newStatus })
        .eq('resi_number', selectedTask.id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error("Update diblokir oleh keamanan database (RLS) pada tabel shipments!");
      }

      await supabase.from('shipment_details').insert([{ shipment_id: selectedTask.uuid, status: newStatus }]);
      
      setAllTasks(prevTasks => prevTasks.map(task => task.id === selectedTask.id ? { ...task, status: newStatus } : task));
      
      setShowSuccessPopup(true);
    } catch (error: any) {
      console.error("Gagal ambil tugas:", error);
      alert(`Gagal mengambil tugas! Error: ${error.message}`);
    }
  };

  // --- FUNGSI TOLAK TUGAS ---
  const handleConfirmTolak = async () => {
    try {
      setShowRejectConfirm(false);
      
      const { data, error } = await supabase
        .from('shipments')
        .update({ status: 'Ditolak' })
        .eq('resi_number', selectedTask.id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error("Update diblokir oleh keamanan database (RLS)!");
      }

      setAllTasks(prevTasks => prevTasks.filter(task => task.id !== selectedTask.id));

      setShowRejectSuccess(true);
    } catch (error: any) {
      console.error("Gagal tolak tugas:", error);
      alert(`Gagal menolak tugas! Error: ${error.message}`);
    }
  };

  // --- FUNGSI UPDATE STATUS ---
  const updateStatusToDB = async (newStatus: string) => {
    try {
      const { data, error } = await supabase
        .from('shipments')
        .update({ status: newStatus })
        .eq('resi_number', selectedTask.id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error("Update diblokir oleh keamanan database (RLS)!");
      }

      setCurrentStatus(newStatus);
      
      setAllTasks(prevTasks => prevTasks.map(task => task.id === selectedTask.id ? { ...task, status: newStatus } : task));

      await supabase.from('shipment_details').insert([{ shipment_id: selectedTask.uuid, status: newStatus }]);
    } catch (error: any) {
      console.error("Gagal merubah status paket:", error);
      alert(`Gagal merubah status! Error: ${error.message}`);
    }
  };

  const handleRejectSuccessDone = () => {
    setShowRejectSuccess(false);
    setSelectedTask(null);
  };

  const handleStartMission = () => {
    setShowSuccessPopup(false);
    setSelectedTask(null);
    setActiveTab("aktif");
    setCurrentStatus("Kurir Menuju Lokasi");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && !["image/png", "image/jpeg"].includes(file.type)) {
      setFileError(true);
      setSelectedFile(null);
    } else {
      setFileError(false);
      setSelectedFile(file || null);
    }
  };

  // --- FUNGSI SELESAI (UPLOAD FOTO BUKTI) ---
  const handleFinishTask = async () => {
    if (!selectedFile || !selectedTask) return;
    
    try {
      setIsUploading(true);
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${selectedTask.id}-${Date.now()}.${fileExt}`;
      const filePath = `public/${fileName}`; 

      const { error: uploadError } = await supabase.storage.from('bukti-pengiriman').upload(filePath, selectedFile);
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('bukti-pengiriman').getPublicUrl(filePath);

      const { error: dbError } = await supabase.from('shipments').update({ 
        status: 'Selesai',
        bukti_foto_url: publicUrlData.publicUrl 
      }).eq('resi_number', selectedTask.id);
      
      if (dbError) throw dbError;

      await supabase.from('shipment_details').insert([{ shipment_id: selectedTask.uuid, status: 'Selesai' }]);
      
      setAllTasks(prevTasks => prevTasks.filter(task => task.id !== selectedTask.id));

      setShowFinishedPopup(true);
    } catch (error: any) {
      console.error("Gagal menyelesaikan tugas:", error);
      alert(`Gagal! Error: ${error.message || "Pastikan Storage Policy sudah diizinkan (Insert/Upload)."}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseAll = () => {
    setShowFinishedPopup(false);
    setSelectedTask(null);
    setActiveTab("menunggu");
    setSelectedFile(null);
  };

  if (selectedTask) {
    const isAktif = activeTab === "aktif";
    return (
      <div className="max-w-5xl mx-auto space-y-6 pb-20 px-4 md:px-0 py-6 md:py-0">
        
        {/* --- POP-UP MODALS --- */}
        {showAcceptConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
            <div className="bg-white rounded-[32px] p-8 md:p-10 max-w-sm w-full text-center relative z-10 shadow-2xl">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Yakin untuk mengambil <span className="font-black">{selectedTask.id}</span>?</h2>
              <div className="flex gap-3">
                <button onClick={() => setShowAcceptConfirm(false)} className="flex-1 bg-white border border-gray-300 text-gray-500 font-bold py-3 rounded-xl">Batal</button>
                <button onClick={handleConfirmAmbil} className="flex-1 bg-[#4CAF50] text-white font-bold py-3 rounded-xl">Ya</button>
              </div>
            </div>
          </div>
        )}

        {showRejectConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowRejectConfirm(false)}></div>
            <div className="bg-white border border-gray-100 rounded-[32px] w-full max-w-sm p-8 relative z-10 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-6">
                <HelpCircle size={40} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Tolak Tugas</h3>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                Apakah Anda yakin ingin menolak pesanan <span className="font-bold text-gray-800">{selectedTask.id}</span>?
              </p>
              <div className="flex gap-3 w-full">
                <button onClick={() => setShowRejectConfirm(false)} className="flex-1 bg-gray-100/80 text-gray-600 font-bold py-3.5 md:py-4 rounded-xl hover:bg-gray-200 transition-colors">Batal</button>
                <button onClick={handleConfirmTolak} className="flex-1 bg-[#FF3B30] text-white font-bold py-3.5 md:py-4 rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-100">Ya, Tolak</button>
              </div>
            </div>
          </div>
        )}

        {showUpdateConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowUpdateConfirm(false)}></div>
            <div className="bg-white rounded-[32px] p-8 md:p-10 max-w-sm w-full text-center relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle size={32} />
              </div>
              <h2 className="text-xl font-black text-gray-900 mb-2">Konfirmasi Update</h2>
              <p className="text-sm text-gray-500 mb-6">
                Yakin ingin mengubah status pickup menjadi <span className="font-bold text-gray-800">"{pendingStatus}"</span>?
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowUpdateConfirm(false)} className="flex-1 bg-white border border-gray-300 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50">Batal</button>
                <button onClick={() => { setShowUpdateConfirm(false); updateStatusToDB(pendingStatus); }} className="flex-1 bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-600">Ya, Ubah</button>
              </div>
            </div>
          </div>
        )}

        {showSuccessPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
            <div className="bg-white rounded-[32px] p-8 md:p-10 max-w-sm w-full text-center relative z-10 shadow-2xl">
              <h2 className="text-xl font-black text-gray-900 mb-2">Pickup Berhasil Diambil</h2>
              <button onClick={handleStartMission} className="w-full bg-[#4CAF50] text-white font-bold py-3 rounded-xl mt-4">Oke</button>
            </div>
          </div>
        )}

        {showRejectSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
            <div className="bg-white rounded-[32px] p-8 md:p-10 max-w-sm w-full text-center relative z-10 shadow-2xl">
              <h2 className="text-xl font-black text-gray-900 mb-2">Tugas Ditolak</h2>
              <button onClick={handleRejectSuccessDone} className="w-full bg-[#4CAF50] text-white font-bold py-4 rounded-xl mt-4">Oke</button>
            </div>
          </div>
        )}
        
        {showFinishedPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
            <div className="bg-white rounded-[32px] p-8 md:p-10 max-w-sm w-full text-center relative z-10 shadow-2xl">
              <h2 className="text-xl font-black text-gray-900 mb-2">Misi Selesai!</h2>
              <button onClick={handleCloseAll} className="w-full bg-[#4CAF50] text-white font-bold py-3 rounded-xl mt-4">Tutup Aktivitas</button>
            </div>
          </div>
        )}

        <button onClick={() => {setSelectedTask(null); setSelectedFile(null);}} className="flex items-center gap-2 text-gray-500 hover:text-green-600 font-medium mt-4 italic">
          <ArrowLeft size={20} /> Kembali
        </button>

        <div className="bg-white border border-green-500 rounded-[24px] p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
            <span className="font-black text-xl text-gray-900 block">{selectedTask.id}</span>
            <span className={`text-[10px] font-black px-8 py-2 rounded-full border uppercase ${getStatusStyle(isAktif ? currentStatus : "Menunggu Kurir")}`}>
              {isAktif ? currentStatus : "Menunggu Kurir"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="space-y-4">
              <h3 className="text-green-500 font-bold text-lg pb-2">Informasi Pengirim</h3>
              <div className="text-sm"><p className="text-gray-400 font-bold uppercase text-[10px]">Nama</p><p className="font-bold">{selectedTask.name}</p></div>
              <div className="text-sm"><p className="text-gray-400 font-bold uppercase text-[10px]">No.Telepon</p><p className="font-bold">{selectedTask.senderPhone}</p></div>
              <div className="text-sm"><p className="text-gray-400 font-bold uppercase text-[10px]">Alamat Pickup</p><p className="font-bold">{selectedTask.pickup}</p></div>
            </div>
            <div className="space-y-4">
              <h3 className="text-green-500 font-bold text-lg pb-2">Informasi Penerima</h3>
              <div className="text-sm"><p className="text-gray-400 font-bold uppercase text-[10px]">Nama</p><p className="font-bold">{selectedTask.receiverName}</p></div>
              <div className="text-sm"><p className="text-gray-400 font-bold uppercase text-[10px]">No.Telepon</p><p className="font-bold">{selectedTask.receiverPhone}</p></div>
              <div className="text-sm"><p className="text-gray-400 font-bold uppercase text-[10px]">Alamat Tujuan</p><p className="font-bold">{selectedTask.destination}</p></div>
            </div>
            <div className="space-y-4 pt-0 md:pt-9">
              <div className="text-sm"><p className="text-gray-400 font-bold uppercase text-[10px]">Jenis Barang</p><p className="font-bold">{selectedTask.itemType}</p></div>
              <div className="text-sm"><p className="text-gray-400 font-bold uppercase text-[10px]">Prediksi Berat</p><p className="font-bold">{selectedTask.weight}</p></div>
              <div className="text-sm"><p className="text-gray-400 font-bold uppercase text-[10px]">Metode Pembayaran</p><p className="font-bold">{selectedTask.payment}</p></div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-green-500 font-bold italic mb-2">Catatan tambahan</h3>
            <div className="bg-green-50/30 border border-green-200 rounded-xl p-4 md:p-6 text-sm italic text-gray-500">{selectedTask.notes}</div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4 text-lg font-black">
            Biaya Ongkir <span className="text-green-500">{selectedTask.price}</span>
          </div>
        </div>

        {!isAktif ? (
          <div className="flex flex-col md:flex-row gap-4 mt-10">
            <button onClick={() => setShowRejectConfirm(true)} className="flex-1 bg-white border border-red-500 text-red-500 font-bold py-4 rounded-full hover:bg-red-50 order-2 md:order-1">Tolak Tugas</button>
            <button onClick={() => setShowAcceptConfirm(true)} className="flex-1 bg-[#4CAF50] text-white font-bold py-4 rounded-full shadow-lg hover:bg-green-600 order-1 md:order-2">Ambil Tugas</button>
          </div>
        ) : (
          /* --- KODE BARU WORKFLOW LINEAR & UPLOAD ATOMIK DI SINI --- */
          <div className="space-y-6">
            <div className="bg-white border border-green-500 rounded-[24px] p-6 md:p-8 shadow-sm space-y-4">
              <p className="font-bold text-gray-900">Update Pengiriman</p>
              
              {/* --- TOMBOL 1: PAKET SUDAH DIAMBIL --- */}
              <button 
                type="button"
                disabled={currentStatus.toLowerCase().trim() !== "kurir menuju lokasi"}
                onClick={() => { setPendingStatus("Paket Sudah Diambil"); setShowUpdateConfirm(true); }} 
                className={`w-full text-left p-4 rounded-xl font-bold border transition-colors ${
                  currentStatus.toLowerCase().trim() === "paket sudah diambil" || currentStatus.toLowerCase().trim() === "dalam perjalanan"
                    ? "bg-blue-100 border-blue-400 text-blue-600 opacity-80" 
                    : currentStatus.toLowerCase().trim() === "kurir menuju lokasi"
                    ? "bg-blue-50/50 border-blue-100 text-blue-400 hover:bg-blue-100"
                    : "bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Paket Sudah Diambil</span>
                  {(currentStatus.toLowerCase().trim() === "paket sudah diambil" || currentStatus.toLowerCase().trim() === "dalam perjalanan") && <Check size={18} />}
                </div>
              </button>
              
              {/* --- TOMBOL 2: DALAM PERJALANAN --- */}
              <button 
                type="button"
                disabled={currentStatus.toLowerCase().trim() !== "paket sudah diambil"}
                onClick={() => { setPendingStatus("Dalam Perjalanan"); setShowUpdateConfirm(true); }} 
                className={`w-full text-left p-4 rounded-xl font-bold border transition-colors ${
                  currentStatus.toLowerCase().trim() === "dalam perjalanan"
                    ? "bg-purple-100 border-purple-400 text-purple-600 opacity-80" 
                    : currentStatus.toLowerCase().trim() === "paket sudah diambil"
                    ? "bg-purple-50/50 border-purple-100 text-purple-400 hover:bg-purple-100"
                    : "bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Dalam Perjalanan</span>
                  {currentStatus.toLowerCase().trim() === "dalam perjalanan" && <Check size={18} />}
                </div>
              </button>
            </div>
            
            {/* --- LANGKAH 3: FORM UPLOAD BUKTI (Hanya muncul saat status 'Dalam Perjalanan') --- */}
            {currentStatus.toLowerCase().trim() === "dalam perjalanan" && (
              <div className="bg-white border border-green-500 rounded-[24px] p-6 md:p-8 shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <p className="font-bold text-gray-900">Selesai</p>
                <label>
                  <div className={`border-2 border-dashed rounded-2xl p-6 md:p-10 flex flex-col items-center justify-center cursor-pointer ${fileError ? "border-red-400 bg-red-50/30" : "border-gray-300 hover:bg-gray-50"}`}>
                    <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleFileChange} />
                    <Upload className="mb-2 text-gray-500" size={32} />
                    <p className="text-sm font-medium text-center text-gray-600">{selectedFile ? selectedFile.name : "Klik untuk upload foto bukti (.png atau .jpg)"}</p>
                  </div>
                </label>
                {fileError && <p className="text-red-500 text-[11px] italic font-medium">Foto harus dalam bentuk .png/.jpg</p>}
                
                <button 
                  disabled={!selectedFile || fileError || isUploading} 
                  onClick={handleFinishTask} 
                  className={`w-full font-bold py-4 rounded-full flex items-center justify-center gap-2 ${(!selectedFile || fileError || isUploading) ? "bg-gray-300 cursor-not-allowed text-gray-100" : "bg-[#4CAF50] text-white hover:bg-green-600 shadow-lg"}`}
                >
                  {isUploading ? "Mengunggah Bukti..." : "Kirim Bukti & Selesaikan Misi"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 px-4 md:px-0 py-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pusat Aktivitas</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola tugas pickupmu</p>
      </div>

      <div className="flex bg-gray-100/50 p-1.5 rounded-full border border-gray-200 w-full md:w-fit">
        <button onClick={() => setActiveTab("menunggu")} className={`flex-1 md:flex-none px-8 py-3 rounded-full text-sm font-bold transition-all ${activeTab === "menunggu" ? "bg-white shadow-md text-gray-800" : "text-gray-400"}`}>
          Menunggu <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-1">{waitingTasks.length}</span>
        </button>
        <button onClick={() => setActiveTab("aktif")} className={`flex-1 md:flex-none px-10 py-3 rounded-full text-sm font-bold transition-all ${activeTab === "aktif" ? "bg-white shadow-md text-gray-800" : "text-gray-400"}`}>
          Aktif <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-1">{activeTasks.length}</span>
        </button>
      </div>

      <div className="flex flex-col justify-between min-h-[480px]">
        <div className="space-y-4">
          {loadingTasks ? (
            <div className="text-center py-12 text-[#4CAF50] font-bold animate-pulse">Memuat daftar tugas dari database...</div>
          ) : (
            <>
              {dataPerHalaman.map((task) => (
                <div 
                  key={task.id} 
                  onClick={() => {
                    setSelectedTask(task); 
                    setCurrentStatus(task.status.toLowerCase().trim() === "menunggu kurir" ? "Paket Sudah Diambil" : task.status);
                  }} 
                  className="bg-white border border-green-400 rounded-[20px] p-5 md:p-6 hover:shadow-md cursor-pointer group transition-all"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-black text-lg md:text-xl text-gray-900">{task.id}</span>
                      <span className={`${activeTab === "menunggu" ? "bg-orange-50 text-orange-500 border-orange-100" : getStatusStyle(task.status)} font-bold px-6 py-1.5 rounded-full border uppercase text-[10px]`}>
                        {task.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between w-full md:w-auto gap-4 font-black text-green-600 text-lg md:text-xl">
                      {task.price} 
                      <ArrowRight size={24} className="group-hover:translate-x-2 transition-all" />
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm text-gray-500 font-medium">
                    <div className="flex items-center gap-2.5">
                      <Package size={16} className="text-gray-400 shrink-0" />
                      <p>{task.name} <span className="mx-1 text-gray-300">|</span> Berat {task.weight}</p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
                      <p className="leading-snug">{task.pickup}</p>
                    </div>
                  </div>
                </div>
              ))}

              {dataPerHalaman.length === 0 && (
                <div className="text-center py-12 text-gray-400 bg-white border border-dashed border-gray-200 rounded-[20px]">
                  Tidak ada tugas di bagian ini.
                </div>
              )}
            </>
          )}
        </div>

        {!loadingTasks && dataTabSesuai.length > 0 && (
          <div className="flex items-center justify-center gap-1 mt-10">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`w-10 h-10 border rounded-l-xl flex items-center justify-center font-bold text-sm transition-all border-gray-200 ${
                currentPage === 1 ? "bg-white text-gray-300 cursor-not-allowed" : "bg-white text-gray-600 hover:bg-gray-50 active:scale-95"
              }`}
            >
              ←
            </button>

            {renderPaginationButtons().map((page) => {
              const isSelected = currentPage === page;
              return (
                <button
                  key={`page-${page}`}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 font-bold text-sm transition-all border-y border-x border-gray-200 flex items-center justify-center ${
                    isSelected ? "bg-green-600 text-white border-green-600 shadow-sm font-semibold" : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`w-10 h-10 border rounded-r-xl flex items-center justify-center font-bold text-sm transition-all border-gray-200 ${
                currentPage === totalPages ? "bg-white text-gray-300 cursor-not-allowed" : "bg-white text-gray-600 hover:bg-gray-50 active:scale-95"
              }`}
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}