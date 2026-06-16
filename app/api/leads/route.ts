import { NextRequest, NextResponse } from "next/server";
import { getAnonClient } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  // Honeypot
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const str = (k: string) =>
    typeof body[k] === "string" ? (body[k] as string).trim() : "";

  const fullName = str("full_name");
  const email = str("email");
  const phone = str("phone") || str("whatsapp");

  if (!fullName) return NextResponse.json({ error: "Ad Soyad zorunlu" }, { status: 400 });
  if (!email && !phone)
    return NextResponse.json(
      { error: "E-posta veya telefondan en az biri zorunlu" },
      { status: 400 }
    );
  if (!body.health_data_consent)
    return NextResponse.json({ error: "Sağlık verisi açık rızası gerekli" }, { status: 400 });
  if (!body.aydinlatma_acknowledged)
    return NextResponse.json({ error: "Aydınlatma onayı gerekli" }, { status: 400 });

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    null;

  const payload = {
    full_name: fullName,
    email: email || null,
    phone: str("phone") || null,
    whatsapp: str("whatsapp") || null,
    country: str("country") || null,
    city: str("city") || null,
    language: str("language") || null,
    treatment: str("treatment") || null,
    budget_band: str("budget_band") || null,
    timeline: str("timeline") || null,
    message: str("message") || null,
    source: str("source") || "website",
    utm: body.utm || {},
    ip,
    user_agent: req.headers.get("user-agent") || null,
    health_data_consent: Boolean(body.health_data_consent),
    aydinlatma_acknowledged: Boolean(body.aydinlatma_acknowledged),
    cross_border_consent: Boolean(body.cross_border_consent),
    consent_text_version: str("consent_text_version") || null,
    consent_text_snapshot: str("consent_text_snapshot") || null,
    privacy_notice_version: str("privacy_notice_version") || null,
    named_recipients: body.named_recipients || [],
    purposes: body.purposes || [],
  };

  try {
    const supabase = getAnonClient();
    const { data, error } = await supabase.rpc("auravera_submit_lead", { payload });
    if (error) {
      console.error("submit_lead error", error);
      const msg =
        error.message?.includes("consent")
          ? "Rıza onayları gerekli"
          : "Kayıt oluşturulamadı";
      return NextResponse.json({ error: msg }, { status: 500 });
    }
    return NextResponse.json({ ok: true, id: data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
