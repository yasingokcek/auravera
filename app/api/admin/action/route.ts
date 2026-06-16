import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { isAdminRequest } from "@/lib/adminAuth";

export const runtime = "nodejs";

/** Tüm admin işlemleri tek route'ta (cookie korumalı, service_role RPC). */
export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { action?: string; params?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const supabase = getServiceClient();
  const { action, params = {} } = body;

  const map: Record<string, { fn: string; args: (p: Record<string, unknown>) => Record<string, unknown> }> = {
    assign: {
      fn: "auravera_admin_assign",
      args: (p) => ({ p_lead_id: p.lead_id, p_clinic_id: p.clinic_id, p_mode: p.mode || "shared" }),
    },
    topup: {
      fn: "auravera_admin_topup",
      args: (p) => ({ p_clinic_id: p.clinic_id, p_amount: Number(p.amount), p_note: p.note || "Manual topup" }),
    },
    create_clinic: {
      fn: "auravera_admin_create_clinic",
      args: (p) => ({ p_name: p.name, p_country: p.country || null, p_city: p.city || null }),
    },
    link_user: {
      fn: "auravera_admin_link_user",
      args: (p) => ({ p_email: p.email, p_clinic_id: p.clinic_id, p_role: p.role || "clinic_admin" }),
    },
  };

  const entry = action ? map[action] : undefined;
  if (!entry) return NextResponse.json({ error: "unknown_action" }, { status: 400 });

  const { data, error } = await supabase.rpc(entry.fn, entry.args(params));
  if (error) {
    console.error("admin action error", action, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, data });
}
