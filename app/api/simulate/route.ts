import { NextRequest, NextResponse } from "next/server";
import { getServiceClient, getAnonClient } from "@/lib/supabase";

export const runtime = "nodejs";

const BUCKET = "auravera-simulations";
const MAX = 8 * 1024 * 1024;

export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const file = form.get("photo");
  const fullName = String(form.get("full_name") || "").trim();
  const phone = String(form.get("phone") || "").trim();
  const treatment = String(form.get("treatment") || "sac_ekimi").trim();
  const consent = String(form.get("consent") || "") === "true";
  const lang = String(form.get("lang") || "tr");

  if (!(file instanceof File)) return NextResponse.json({ error: "no_file" }, { status: 400 });
  if (file.size > MAX) return NextResponse.json({ error: "too_large" }, { status: 400 });
  if (!fullName || !phone) return NextResponse.json({ error: "contact_required" }, { status: 400 });
  if (!consent) return NextResponse.json({ error: "consent_required" }, { status: 400 });

  const ext = file.type.includes("png") ? "png" : file.type.includes("webp") ? "webp" : "jpg";
  const path = `${treatment}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  try {
    const svc = getServiceClient();
    const buf = Buffer.from(await file.arrayBuffer());
    const { error: upErr } = await svc.storage.from(BUCKET).upload(path, buf, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });
    if (upErr) {
      console.error("storage upload", upErr);
      return NextResponse.json({ error: "upload_failed" }, { status: 500 });
    }

    // Lead oluştur (fotoğraf yolu utm içinde referanslanır)
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") || null;
    const anon = getAnonClient();
    await anon.rpc("auravera_submit_lead", {
      payload: {
        full_name: fullName,
        phone,
        whatsapp: phone,
        treatment,
        source: "ai_simulation",
        message: "AI simülasyon talebi (fotoğraf yüklendi)",
        language: lang,
        utm: { simulation_photo: path, tool: "ai_simulation" },
        health_data_consent: true,
        aydinlatma_acknowledged: true,
        consent_text_version: "2026-06-v1",
        consent_text_snapshot: "AI simülasyon için fotoğraf ve sağlık verisi işleme açık rızası",
        named_recipients: ["AuraVera partner clinics"],
        purposes: ["ai_simulation", "consultation", "clinic_matching"],
        ip,
        user_agent: req.headers.get("user-agent") || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
