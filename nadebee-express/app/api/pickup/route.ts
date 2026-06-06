import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const supabase = createRouteHandlerClient({ cookies });

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Ambil user aktif langsung dari instance supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user || !user.email) {
      return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 401 });
    }

    // 2. Cari nomor resi terakhir
    const { data: lastShipment } = await supabase
      .from("shipments")
      .select("resi_number")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let newResiNumber = "NDB001"; 
    if (lastShipment && lastShipment.resi_number) {
      const lastNumber = parseInt(lastShipment.resi_number.replace("NDB", ""));
      if (!isNaN(lastNumber)) {
        newResiNumber = `NDB${String(lastNumber + 1).padStart(3, "0")}`;
      }
    }

    // 3. Masukkan data ke shipments
    const { data: insertedShipment, error: insertError } = await supabase
      .from("shipments")
      .insert([
        {
          resi_number: newResiNumber,
          customer_email: user.email, 
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
          shipping_cost: body.shippingCost, 
          jenis_kendaraan: body.vehicleType, 
          courier_id: body.courier_id,       
          payment_method: body.payment_method,
          status: "Menunggu Kurir",
          note: body.note || null
        }
      ])
      .select("id, resi_number")
      .single();

    if (insertError) throw insertError;

    // 4. Masukkan ke shipment_details
    await supabase.from("shipment_details").insert([
      { shipment_id: insertedShipment.id, status: "Menunggu Kurir" }
    ]);

    return NextResponse.json({ success: true, resi: insertedShipment.resi_number });

  } catch (error: any) {
    console.error("Gagal membuat pickup:", error.message);
    return NextResponse.json({ error: "Gagal memproses request pickup" }, { status: 500 });
  }
}