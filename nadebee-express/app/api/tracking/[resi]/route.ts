import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; 

export async function GET(
  request: Request,
  { params }: { params: Promise<{ resi: string }> } 
) {
  try {
    const resolvedParams = await params; 
    const resiNumber = resolvedParams.resi.toUpperCase();

    // 1. REVISI: Ambil data utama paket SEKALIGUS join dengan data Kurir
    // Kita menyuruh Supabase mengambil semua kolom (*) shipments 
    // DAN semua kolom (*) dari tabel couriers yang terhubung
    const { data: shipment, error: shipmentError } = await supabase
      .from('shipments')
      .select('*, couriers(*)') // <-- KUNCI PERUBAHANNYA DI SINI
      .eq('resi_number', resiNumber)
      .maybeSingle(); 

    if (shipmentError || !shipment) {
      return NextResponse.json({ error: "Resi tidak ditemukan" }, { status: 404 });
    }

    // 2. Ambil riwayat detail untuk mendapatkan gambar bukti pengiriman (jika ada)
    const { data: details } = await supabase
      .from('shipment_details')
      .select('*')
      .eq('shipment_id', shipment.id)
      .order('created_at', { ascending: false }); 

    const detailWithProof = details?.find((d: any) => d.proof_image_url);
    const proofImageUrl = detailWithProof ? detailWithProof.proof_image_url : null;

    // --- LOGIKA TIMELINE VISUAL (Tanpa Jam) ---
    const STANDARD_STATUSES = [
      { title: "Menunggu Kurir", desc: "Permintaan Pickup sudah masuk, menunggu konfirmasi kurir" },
      { title: "Kurir Menuju Lokasi", desc: "Kurir sedang dalam perjalanan ke alamat penjemputan" },
      { title: "Paket Sudah Diambil", desc: "Paket sudah berhasil dijemput oleh kurir" },
      { title: "Dalam Perjalanan", desc: "Paket sedang dikirim menuju alamat tujuan" },
      { title: "Selesai", desc: "Paket sudah sampai dan diterima dengan selamat" }
    ];

    const currentStatusTitle = shipment.status || "Menunggu Kurir";
    const currentIndex = STANDARD_STATUSES.findIndex(s => s.title === currentStatusTitle);
    const resolvedIndex = currentIndex === -1 ? 0 : currentIndex;

    const history = STANDARD_STATUSES.map((stdStep, index) => {
      return {
        title: stdStep.title,
        desc: stdStep.desc,
        active: index <= resolvedIndex 
      };
    });

    const getColorByStatus = (status: string) => {
      switch (status) {
        case "Selesai": return "bg-green-100 text-green-600 border-green-200";
        case "Dalam Perjalanan": return "bg-orange-100 text-orange-600 border-orange-200";
        case "Paket Sudah Diambil": return "bg-blue-100 text-blue-500 border-blue-200";
        case "Kurir Menuju Lokasi": return "bg-yellow-100 text-yellow-600 border-yellow-200";
        default: return "bg-gray-100 text-gray-500 border-gray-200"; // Menunggu Kurir
      }
    };

    // Ekstrak data kurir dari hasil join Supabase
    const dataKurir = shipment.couriers; // Hasil join biasanya dalam bentuk nested object

    const formattedData = {
      status: currentStatusTitle,
      pengirim: shipment.sender_name || "-",
      penerima: shipment.receiver_name || "-",
      wilayah: shipment.destination_city || "-",
      ongkir: `Rp. ${shipment.shipping_cost?.toLocaleString('id-ID') || 0}`,
      color: getColorByStatus(currentStatusTitle),
      proof_image_url: proofImageUrl, 
      history: history,
      email_pelanggan: shipment.customer_email,
      
      // VVV --- TAMBAHAN DATA KURIR UNTUK FRONTEND --- VVV
      kurir_nama: dataKurir?.username, 
      kurir_avatar: dataKurir?.avatar_url,
      kurir_plat: dataKurir?.plat_nomor,
      kurir_telp: dataKurir?.phone,
      // ^^^ ---------------------------------------- ^^^
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}