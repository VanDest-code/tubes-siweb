export const dynamic = "force-dynamic"; // <-- TRIK DEWA 1: Mematikan cache Next.js agar data selalu fresh!
export const revalidate = 0; // <-- TRIK DEWA 2: Memastikan tidak ada delay sinkronisasi

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; 

export async function GET(
  request: Request,
  { params }: { params: Promise<{ resi: string }> } 
) {
  try {
    const resolvedParams = await params; 
    const resiNumber = resolvedParams.resi.toUpperCase();

    const { data: shipment, error: shipmentError } = await supabase
      .from('shipments')
      .select('*, couriers(*)') 
      .eq('resi_number', resiNumber)
      .maybeSingle(); 

    if (shipmentError || !shipment) {
      return NextResponse.json({ error: "Resi tidak ditemukan" }, { status: 404 });
    }

    const { data: details } = await supabase
      .from('shipment_details')
      .select('*')
      .eq('shipment_id', shipment.id)
      .order('created_at', { ascending: false }); 

    const detailWithProof = details?.find((d: any) => d.proof_image_url);
    const proofImageUrl = detailWithProof ? detailWithProof.proof_image_url : null;

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
        default: return "bg-gray-100 text-gray-500 border-gray-200";
      }
    };

    const dataKurir = shipment.couriers; 

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
      
      kurir_nama: dataKurir?.username || "Kurir Baru", 
      kurir_avatar: dataKurir?.avatar_url,
      kurir_plat: dataKurir?.plat_nomor || "-",
      kurir_telp: dataKurir?.phone || "-",
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}