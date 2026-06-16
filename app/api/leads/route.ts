import { NextRequest, NextResponse } from "next/server";
import { getAnonClient } from "@/lib/supabase";

export const runtime = "nodejs";

type Payload = {
  full_name?: string;
  email?: string;
  phone?: string;
  country?: string;
  language?: string;
  treatment?: string;
  message?: string;
  source?: string;
  consent?: boolean;
  utm?: Record<string, string>;
  // anti-spam honeypot — botlar doldurur, gerçek kullanıcı boş bırakır
  website?: string;
};

export async function POST(req: NextRequest) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  // Honeypot: doluysa spam say, sessizce başarı dön
  if (body.website && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const fullName = (body.full_name || "").trim();
  const email = (body.email || "").trim();
  const phone = (body.phone || "").trim();

  if (!fullName) {
    return NextResponse.json({ error: "Ad Soyad zorunlu" }, { status: 400 });
  }
  if (!email && !phone) {
    return NextResponse.json(
      { error: "E-posta veya telefondan en az biri zorunlu" },
      { status: 400 }
    );
  }
  if (!body.consent) {
    return NextResponse.json(
      { error: "KVKK/aydınlatma onayı gerekli" },
      { status: 400 }
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    null;

  const payload = {
    full_name: fullName,
    email: email || null,
    phone: phone || null,
    country: (body.country || "").trim() || null,
    language: (body.language || "").trim() || null,
    treatment: (body.treatment || "").trim() || null,
    message: (body.message || "").trim() || null,
    source: (body.source || "website").trim(),
    utm: body.utm || {},
    consent: Boolean(body.consent),
    ip,
    user_agent: req.headers.get("user-agent") || null,
  };

  try {
    const supabase = getAnonClient();
    const { data, error } = await supabase.rpc("auravera_submit_lead", {
      payload,
    });
    if (error) {
      console.error("submit_lead error", error);
      return NextResponse.json(
        { error: "Kayıt oluşturulamadı" },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: true, id: data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
