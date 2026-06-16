"use client";

import { useEffect, useState } from "react";

const TREATMENTS = [
  { value: "", label: "İlgilendiğiniz tedavi" },
  { value: "sac_ekimi", label: "Saç Ekimi" },
  { value: "dis", label: "Diş Tedavisi / Estetik" },
  { value: "estetik", label: "Plastik & Estetik Cerrahi" },
  { value: "obezite", label: "Obezite / Bariatrik Cerrahi" },
  { value: "goz", label: "Göz (LASIK / Katarakt)" },
  { value: "tup_bebek", label: "Tüp Bebek / IVF" },
  { value: "diger", label: "Diğer" },
];

export default function LeadForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [utm, setUtm] = useState<Record<string, string>>({});

  useEffect(() => {
    // UTM / kampanya parametrelerini yakala
    const params = new URLSearchParams(window.location.search);
    const captured: Record<string, string> = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach(
      (k) => {
        const v = params.get(k);
        if (v) captured[k] = v;
      }
    );
    if (document.referrer) captured.referrer = document.referrer;
    setUtm(captured);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload = {
      full_name: String(fd.get("full_name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      country: String(fd.get("country") || ""),
      language: String(fd.get("language") || ""),
      treatment: String(fd.get("treatment") || ""),
      message: String(fd.get("message") || ""),
      consent: fd.get("consent") === "on",
      website: String(fd.get("website") || ""), // honeypot
      source: "website",
      utm,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Bir hata oluştu, lütfen tekrar deneyin.");
        return;
      }
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMsg("Bağlantı hatası, lütfen tekrar deneyin.");
    }
  }

  if (status === "ok") {
    return (
      <div className="card">
        <div className="alert success">
          ✓ Başvurunuz alındı! Sağlık danışmanımız en kısa sürede sizinle
          iletişime geçecek.
        </div>
        <button className="btn" onClick={() => setStatus("idle")}>
          Yeni başvuru gönder
        </button>
      </div>
    );
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Ücretsiz Danışmanlık Alın</h2>
      <p className="sub">
        Formu doldurun, uzman ekibimiz size özel tedavi planı ve fiyat teklifi
        sunsun.
      </p>

      {status === "error" && <div className="alert error">{errorMsg}</div>}

      <div className="field">
        <label htmlFor="full_name">Ad Soyad *</label>
        <input id="full_name" name="full_name" required placeholder="Adınız Soyadınız" />
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="email">E-posta</label>
          <input id="email" name="email" type="email" placeholder="ornek@mail.com" />
        </div>
        <div className="field">
          <label htmlFor="phone">Telefon (WhatsApp)</label>
          <input id="phone" name="phone" type="tel" placeholder="+90 5xx xxx xx xx" />
        </div>
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="country">Ülke</label>
          <input id="country" name="country" placeholder="Almanya, İngiltere..." />
        </div>
        <div className="field">
          <label htmlFor="language">Dil</label>
          <input id="language" name="language" placeholder="Türkçe, English, Deutsch..." />
        </div>
      </div>

      <div className="field">
        <label htmlFor="treatment">İlgilendiğiniz Tedavi</label>
        <select id="treatment" name="treatment" defaultValue="">
          {TREATMENTS.map((t) => (
            <option key={t.value} value={t.value} disabled={t.value === ""}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="message">Mesajınız</label>
        <textarea
          id="message"
          name="message"
          placeholder="Tedaviniz hakkında detayları buraya yazabilirsiniz..."
        />
      </div>

      {/* Honeypot — gizli, botlar için tuzak */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="consent">
        <input type="checkbox" name="consent" required />
        <span>
          Kişisel verilerimin tedavi danışmanlığı amacıyla işlenmesini ve
          tarafımla iletişime geçilmesini kabul ediyorum (KVKK / GDPR).
        </span>
      </label>

      <button className="btn" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Gönderiliyor..." : "Ücretsiz Teklif Al"}
      </button>
    </form>
  );
}
