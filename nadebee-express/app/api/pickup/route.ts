import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Cari nomor resi terakhir di tabel shipments
    const { data: lastShipment, error: fetchError } = await supabase
      .from("shipments")
      .select("resi_number")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError) throw fetchError;

    // 2. Logika Auto-Increment Resi (NDB010 -> NDB011)
    let newResiNumber = "NDB001"; 
    if (lastShipment && lastShipment.resi_number) {
      const lastNumber = parseInt(lastShipment.resi_number.replace("NDB", ""));
      if (!isNaN(lastNumber)) {
        newResiNumber = `NDB${String(lastNumber + 1).padStart(3, "0")}`;
      }
    }

    // 3. Masukkan data utama ke tabel shipments menggunakan biaya dinamis dari frontend
    const { data: insertedShipment, error: insertError } = await supabase
      .from("shipments")
      .insert([
        {
          resi_number: newResiNumber,
          // GANTI EMAIL DI BAWAH INI DENGAN EMAIL YANG ADA DI DATABASE-MU
          customer_email: body.customerEmail || "natalie@gmail.com", 
          sender_name: body.senderName,
          sender_phone: body.senderPhone,
          sender_address: body.senderAddress,
          receiver_name: body.receiverName,
          receiver_phone: body.receiverPhone,
          receiver_address: body.receiverAddress,
          destination_city: body.destination,
          item_category: body.itemType,
          item_name: "Paket Pickup", 
          weight_range: body.weight,
          shipping_cost: body.shippingCost, // <-- SUDAH DINAMIS
          status: "Menunggu Kurir",
          note: body.note || null
        }
      ])
      .select("id, resi_number")
      .single();

    if (insertError) throw insertError;

    // 4. Masukkan baris pertama ke tabel riwayat (shipment_details)
    const { error: detailError } = await supabase
      .from("shipment_details")
      .insert([
        {
          shipment_id: insertedShipment.id,
          status: "Menunggu Kurir",
        }
      ]);

    if (detailError) throw detailError;

    // 5. Kembalikan nomor resi baru ke Frontend
    return NextResponse.json({ success: true, resi: insertedShipment.resi_number });

  } catch (error: any) {
    console.error("Gagal membuat pickup:", error.message);
    return NextResponse.json({ error: "Gagal memproses request pickup" }, { status: 500 });
  }
}