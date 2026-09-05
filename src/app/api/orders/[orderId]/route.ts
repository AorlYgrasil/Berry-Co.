import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/session";
import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

// GET /api/orders/:orderId — order confirmation page after checkout
export async function GET(_req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const session = await requireUser();
    const { orderId } = await params;

    const order = await db.order.findUnique({ where: { id: orderId }, include: { items: true } });

    if (!order || order.userId !== session.userId) {
      // Same 404 whether it doesn't exist or belongs to someone else —
      // never leak which orderIds are valid for other accounts.
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (err) {
    const e = err as { status?: number; message?: string };
    return NextResponse.json({ error: e.message ?? "Something went wrong." }, { status: e.status ?? 500 });
  }
}

// POST /api/orders/:orderId — cancel an owned pending or processing order
export async function POST(_req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    await requireUser();
    const { orderId } = await params;
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("cancel_order", { p_order_id: orderId });

    if (error) throw new Error(error.message);
    if (!data) return NextResponse.json({ error: "Order cannot be cancelled." }, { status: 409 });
    return NextResponse.json({ success: true });
  } catch (err) {
    const e = err as { status?: number; message?: string };
    if (e.message?.includes("Could not find the function public.cancel_order")) {
      return NextResponse.json(
        { error: "Order cancellation is not enabled yet. Apply Supabase migration 008_cancel_order.sql first." },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: e.message ?? "Unable to cancel order." }, { status: e.status ?? 500 });
  }
}
