"use client";

import { useEffect, useState } from "react";

const TREATMENTS = [
  { slug: "sac_ekimi", label: "Saç Ekimi", icon: "🌱" },
  { slug: "dis", label: "Diş & Gülüş Tasarımı", icon: "🦷" },
  { slug: "estetik", label: "Estetik & Plastik Cerrahi", icon: "✨" },
  { slug: "obezite", label: "Obezite / Bariatrik", icon: "⚖️" },
  { slug: "tup_bebek", label: "Tüp Bebek / IVF", icon: "👶" },
  { slug: "goz", label: "Göz (LASIK)", icon: "👁️" },
  { slug: "diger", label: "Diğer", icon: "➕" },
];
const BUDGETS = [
  { v: "lt_1000", label: "< $1.000" },
  { v: "1000_3000", label: "$1.000 – $3.000" },
  { v: "3000_7000", label: "$3.000 – $7.000" },
  { v: "gt_7000", label: "$7.000+" },
];
const TIMELINES = [
  { v: "asap", label: "En kısa sürede" },
  { v: "1_3m", label: "1–3 ay içinde" },
  { v: "3_6m", label: "3–6 ay içinde" },
  { v: "researching", label: "Araştırıyorum" },
];

const CONSENT_VERSION = "2026-06-v1";
const PRIVACY_VERSION = "2026-06-v1";
const PARTNER_CLINICS = ["AuraVera anlaşmalı klinik ve estetik merkezleri"];
const CONSENT_TEXT =
  "Sağlık verilerim dahil kişisel verilerimin, tedavi danışmanlığı ve uygun klinikle eşleştirme amacıyla AuraVera ve anlaşmalı sağlık kuruluşları tarafından işlenmesine ve yurt dışına aktarılmasına açık rıza veriyorum.";

const TOTAL = 4;

export default function LeadFunnel() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [err, setErr] = useState("");
  const [utm, setUtm] = useState<Record<string, string>>({});

  const [data, setData] = useState({
    treatment: "",
    budget_band: "",
    timeline: "",
    country: "",
    city: "",
    language: "",
    full_name: "",
    email: "",
    phone: "",
    whatsapp: "",
    message: "",
    website: "", // honeypot
    aydinlatma: false,
    consent: false,
    crossBorder: false,
  });

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const cap: Record<string, string> = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach(
      (k) => {
        const v = p.get(k);
        if (v) cap[k] = v;
      }
    );
    if (document.referrer) cap.referrer = document.referrer;
    setUtm(cap);
  }, []);

  const up = (patch: Partial<typeof data>) => setData((d) => ({ ...d, ...patch }));

  function next() {
    setErr("");
    if (step === 1 && !data.treatment) return setErr("Lütfen bir tedavi seçin.");
    if (step === 2 && (!data.budget_band || !data.timeline))
      return setErr("Lütfen bütçe ve zaman planını seçin.");
    setStep((s) => Math.min(s + 1, TOTAL));
  }
  const back = () => {
    setErr("");
    setStep((s) => Math.max(1, s - 1));
  };

  async function submit() {
    setErr("");
    if (!data.full_name.trim()) return setErr("Ad Soyad zorunlu.");
    if (!data.email.trim() && !data.phone.trim() && !data.whatsapp.trim())
      return setErr("E-posta veya telefon/WhatsApp'tan en az biri zorunlu.");
    if (!data.aydinlatma) return setErr("Aydınlatma metnini onaylamanız gerekir.");
    if (!data.consent) return setErr("Sağlık verisi açık rızası gerekli.");

    setStatus("loading");
    const payload = {
      ...data,
      source: utm.utm_source ? `ad_${utm.utm_source}` : "website",
      utm,
      treatment: data.treatment,
      health_data_consent: data.consent,
      aydinlatma_acknowledged: data.aydinlatma,
      cross_border_consent: data.crossBorder,
      consent_text_version: CONSENT_VERSION,
      consent_text_snapshot: CONSENT_TEXT,
      privacy_notice_version: PRIVACY_VERSION,
      named_recipients: PARTNER_CLINICS,
      purposes: ["consultation", "clinic_matching"],
    };
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErr(j.error || "Bir hata oluştu.");
        return;
      }
      setStatus("ok");
    } catch {
      setStatus("error");
      setErr("Bağlantı hatası, tekrar deneyin.");
    }
  }

  if (status === "ok") {
    return (
      <div className="card funnel">
        <div className="alert success" style={{ marginBottom: 18 }}>
          ✓ Teşekkürler! Başvurunuz alındı.
        </div>
        <p style={{ color: "#5b6675" }}>
          Sağlık danışmanımız <strong>5 dakika içinde</strong> sizinle iletişime
          geçecek ve size en uygun akredite kliniği eşleştireceğiz.
        </p>
      </div>
    );
  }

  return (
    <div className="card funnel">
      <h2>Ücretsiz Tedavi Planı & Teklif</h2>
      <p className="sub">60 saniyede uygun kliniklerle eşleşin.</p>

      <div className="progress">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <div key={i} className={`seg ${i < step ? "on" : ""}`} />
        ))}
      </div>

      {err && <div className="alert error">{err}</div>}

      {step === 1 && (
        <>
          <p style={{ fontWeight: 600, marginBottom: 12, color: "var(--petrol)" }}>
            Hangi tedaviyle ilgileniyorsunuz?
          </p>
          <div className="choices">
            {TREATMENTS.map((t) => (
              <button
                type="button"
                key={t.slug}
                className={`choice ${data.treatment === t.slug ? "sel" : ""}`}
                onClick={() => up({ treatment: t.slug })}
              >
                <span style={{ marginRight: 8 }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <p style={{ fontWeight: 600, marginBottom: 10, color: "var(--petrol)" }}>
            Tahmini bütçeniz?
          </p>
          <div className="choices">
            {BUDGETS.map((b) => (
              <button
                type="button"
                key={b.v}
                className={`choice ${data.budget_band === b.v ? "sel" : ""}`}
                onClick={() => up({ budget_band: b.v })}
              >
                {b.label}
              </button>
            ))}
          </div>
          <p
            style={{
              fontWeight: 600,
              margin: "18px 0 10px",
              color: "var(--petrol)",
            }}
          >
            Ne zaman tedavi olmayı planlıyorsunuz?
          </p>
          <div className="choices">
            {TIMELINES.map((t) => (
              <button
                type="button"
                key={t.v}
                className={`choice ${data.timeline === t.v ? "sel" : ""}`}
                onClick={() => up({ timeline: t.v })}
              >
                {t.label}
              </button>
            ))}
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="row2">
            <div className="field">
              <label>Ülke</label>
              <input
                value={data.country}
                onChange={(e) => up({ country: e.target.value })}
                placeholder="Almanya, İngiltere..."
              />
            </div>
            <div className="field">
              <label>Şehir</label>
              <input
                value={data.city}
                onChange={(e) => up({ city: e.target.value })}
                placeholder="Berlin, Londra..."
              />
            </div>
          </div>
          <div className="field">
            <label>Tercih ettiğiniz dil</label>
            <input
              value={data.language}
              onChange={(e) => up({ language: e.target.value })}
              placeholder="Türkçe, English, Deutsch..."
            />
          </div>
          <div className="field">
            <label>Eklemek istedikleriniz (opsiyonel)</label>
            <textarea
              value={data.message}
              onChange={(e) => up({ message: e.target.value })}
              placeholder="Tedaviniz hakkında detaylar..."
            />
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <div className="field">
            <label>Ad Soyad *</label>
            <input
              value={data.full_name}
              onChange={(e) => up({ full_name: e.target.value })}
              placeholder="Adınız Soyadınız"
            />
          </div>
          <div className="row2">
            <div className="field">
              <label>E-posta</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => up({ email: e.target.value })}
                placeholder="ornek@mail.com"
              />
            </div>
            <div className="field">
              <label>WhatsApp / Telefon</label>
              <input
                value={data.whatsapp}
                onChange={(e) => up({ whatsapp: e.target.value, phone: e.target.value })}
                placeholder="+90 5xx xxx xx xx"
              />
            </div>
          </div>

          <div className="hp" aria-hidden="true">
            <input
              tabIndex={-1}
              autoComplete="off"
              value={data.website}
              onChange={(e) => up({ website: e.target.value })}
            />
          </div>

          {/* KVKK: aydınlatma ve açık rıza AYRI bloklar (2026/347) */}
          <label className="consent-block">
            <input
              type="checkbox"
              checked={data.aydinlatma}
              onChange={(e) => up({ aydinlatma: e.target.checked })}
            />
            <span>
              <a href="/privacy" target="_blank">
                Aydınlatma Metni
              </a>
              ’ni okudum; verilerimin kim tarafından, hangi amaçla işleneceğini
              anladım.
            </span>
          </label>
          <label className="consent-block">
            <input
              type="checkbox"
              checked={data.consent}
              onChange={(e) => up({ consent: e.target.checked })}
            />
            <span>{CONSENT_TEXT}</span>
          </label>
          <label className="consent-block">
            <input
              type="checkbox"
              checked={data.crossBorder}
              onChange={(e) => up({ crossBorder: e.target.checked })}
            />
            <span>
              Verilerimin yurt dışındaki anlaşmalı kliniklere aktarılabileceğini
              ve bunun olası risklerini kabul ediyorum.
            </span>
          </label>
        </>
      )}

      <div className="btn-line" style={{ marginTop: 18 }}>
        {step > 1 && (
          <button type="button" className="btn btn-sec" onClick={back}>
            Geri
          </button>
        )}
        {step < TOTAL ? (
          <button type="button" className="btn" onClick={next}>
            Devam
          </button>
        ) : (
          <button
            type="button"
            className="btn gold"
            onClick={submit}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Gönderiliyor..." : "Ücretsiz Teklif Al"}
          </button>
        )}
      </div>
    </div>
  );
}
