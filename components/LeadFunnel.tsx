"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/components/LangProvider";
import { COUNTRIES, CITIES, LANGUAGES } from "@/lib/geo";
import type { Lang } from "@/lib/i18n";

const TREATMENTS: { slug: string; icon: string; labels: Record<Lang, string> }[] = [
  { slug: "sac_ekimi", icon: "🌱", labels: { tr: "Saç Ekimi", en: "Hair Transplant", de: "Haartransplantation", fr: "Greffe de cheveux" } },
  { slug: "dis", icon: "🦷", labels: { tr: "Diş & Gülüş", en: "Dental & Smile", de: "Zähne & Lächeln", fr: "Dentaire & Sourire" } },
  { slug: "estetik", icon: "✨", labels: { tr: "Estetik Cerrahi", en: "Aesthetic Surgery", de: "Ästhetische Chirurgie", fr: "Chirurgie esthétique" } },
  { slug: "obezite", icon: "⚖️", labels: { tr: "Obezite", en: "Bariatric", de: "Adipositas", fr: "Bariatrique" } },
  { slug: "tup_bebek", icon: "👶", labels: { tr: "Tüp Bebek / IVF", en: "IVF", de: "IVF", fr: "FIV" } },
  { slug: "goz", icon: "👁️", labels: { tr: "Göz / LASIK", en: "Eye / LASIK", de: "Augen / LASIK", fr: "Yeux / LASIK" } },
  { slug: "diger", icon: "➕", labels: { tr: "Diğer", en: "Other", de: "Andere", fr: "Autre" } },
];
const BUDGETS = [
  { v: "lt_1000", k: "budget.lt" }, { v: "1000_3000", k: "budget.1" },
  { v: "3000_7000", k: "budget.2" }, { v: "gt_7000", k: "budget.gt" },
];
const TIMELINES = [
  { v: "asap", k: "time.asap" }, { v: "1_3m", k: "time.13" },
  { v: "3_6m", k: "time.36" }, { v: "researching", k: "time.research" },
];

const CONSENT_VERSION = "2026-06-v1";
const PRIVACY_VERSION = "2026-06-v1";
const PARTNER_CLINICS = ["AuraVera partner clinics"];
const TOTAL = 4;

export default function LeadFunnel() {
  const { t, lang } = useLang();
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [err, setErr] = useState("");
  const [utm, setUtm] = useState<Record<string, string>>({});

  const [data, setData] = useState({
    treatment: "", budget_band: "", timeline: "",
    country: "", city: "", language: "",
    full_name: "", email: "", phone: "", message: "", website: "",
    aydinlatma: false, consent: false, crossBorder: false,
  });

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const cap: Record<string, string> = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((k) => {
      const v = p.get(k);
      if (v) cap[k] = v;
    });
    if (document.referrer) cap.referrer = document.referrer;
    setUtm(cap);
  }, []);

  const up = (patch: Partial<typeof data>) => setData((d) => ({ ...d, ...patch }));
  const cityOptions = data.country ? CITIES[data.country] : undefined;

  function next() {
    setErr("");
    if (step === 1 && !data.treatment) return setErr(t("err.treatment"));
    if (step === 2 && (!data.budget_band || !data.timeline)) return setErr(t("err.budgetTime"));
    setStep((s) => Math.min(s + 1, TOTAL));
  }
  const back = () => { setErr(""); setStep((s) => Math.max(1, s - 1)); };

  async function submit() {
    setErr("");
    if (!data.full_name.trim()) return setErr(t("err.name"));
    if (!data.email.trim() && !data.phone.trim()) return setErr(t("err.contact"));
    if (!data.aydinlatma) return setErr(t("err.aydinlatma"));
    if (!data.consent) return setErr(t("err.consent"));

    setStatus("loading");
    const payload = {
      ...data, whatsapp: data.phone,
      source: utm.utm_source ? `ad_${utm.utm_source}` : "website",
      utm, ui_language: lang,
      health_data_consent: data.consent,
      aydinlatma_acknowledged: data.aydinlatma,
      cross_border_consent: data.crossBorder,
      consent_text_version: CONSENT_VERSION,
      consent_text_snapshot: t("funnel.consent"),
      privacy_notice_version: PRIVACY_VERSION,
      named_recipients: PARTNER_CLINICS,
      purposes: ["consultation", "clinic_matching"],
    };
    try {
      const res = await fetch("/api/leads", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await res.json();
      if (!res.ok) { setStatus("error"); setErr(j.error || t("err.generic")); return; }
      setStatus("ok");
    } catch { setStatus("error"); setErr(t("err.conn")); }
  }

  if (status === "ok") {
    return (
      <div className="card funnel">
        <div className="alert success" style={{ marginBottom: 18 }}>{t("funnel.successTitle")}</div>
        <p style={{ color: "var(--muted)" }}>{t("funnel.success")}</p>
      </div>
    );
  }

  return (
    <div className="card funnel" id="basvuru-form">
      <h2>{t("funnel.title")}</h2>
      <p className="sub">{t("funnel.sub")}</p>

      <div className="progress">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <div key={i} className={`seg ${i < step ? "on" : ""}`} />
        ))}
      </div>

      {err && <div className="alert error">{err}</div>}

      {step === 1 && (
        <>
          <p style={{ fontWeight: 600, marginBottom: 12 }}>{t("funnel.qTreatment")}</p>
          <div className="choices">
            {TREATMENTS.map((tr) => (
              <button type="button" key={tr.slug}
                className={`choice ${data.treatment === tr.slug ? "sel" : ""}`}
                onClick={() => up({ treatment: tr.slug })}>
                <span style={{ marginRight: 8 }}>{tr.icon}</span>
                {tr.labels[lang]}
              </button>
            ))}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <p style={{ fontWeight: 600, marginBottom: 10 }}>{t("funnel.qBudget")}</p>
          <div className="choices">
            {BUDGETS.map((b) => (
              <button type="button" key={b.v}
                className={`choice ${data.budget_band === b.v ? "sel" : ""}`}
                onClick={() => up({ budget_band: b.v })}>{t(b.k)}</button>
            ))}
          </div>
          <p style={{ fontWeight: 600, margin: "18px 0 10px" }}>{t("funnel.qTimeline")}</p>
          <div className="choices">
            {TIMELINES.map((tl) => (
              <button type="button" key={tl.v}
                className={`choice ${data.timeline === tl.v ? "sel" : ""}`}
                onClick={() => up({ timeline: tl.v })}>{t(tl.k)}</button>
            ))}
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="row2">
            <div className="field">
              <label>{t("funnel.country")}</label>
              <select value={data.country} onChange={(e) => up({ country: e.target.value, city: "" })}>
                <option value="">{t("funnel.countryPh")}</option>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="field">
              <label>{t("funnel.city")}</label>
              {cityOptions ? (
                <select value={data.city} onChange={(e) => up({ city: e.target.value })}>
                  <option value="">{t("funnel.cityPh")}</option>
                  {cityOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              ) : (
                <input value={data.city} onChange={(e) => up({ city: e.target.value })}
                  placeholder={t("funnel.cityType")} />
              )}
            </div>
          </div>
          <div className="field">
            <label>{t("funnel.language")}</label>
            <select value={data.language} onChange={(e) => up({ language: e.target.value })}>
              <option value="">{t("funnel.languagePh")}</option>
              {LANGUAGES.map((l) => <option key={l.code} value={l.label}>{l.label}</option>)}
            </select>
          </div>
          <div className="field">
            <label>{t("funnel.msg")}</label>
            <textarea value={data.message} onChange={(e) => up({ message: e.target.value })}
              placeholder={t("funnel.msgPh")} />
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <div className="field">
            <label>{t("funnel.name")} *</label>
            <input value={data.full_name} onChange={(e) => up({ full_name: e.target.value })}
              placeholder={t("funnel.namePh")} />
          </div>
          <div className="row2">
            <div className="field">
              <label>{t("funnel.email")}</label>
              <input type="email" value={data.email} onChange={(e) => up({ email: e.target.value })}
                placeholder="ornek@mail.com" />
            </div>
            <div className="field">
              <label>{t("funnel.phone")}</label>
              <input value={data.phone} onChange={(e) => up({ phone: e.target.value })}
                placeholder="+90 5xx xxx xx xx" />
            </div>
          </div>

          <div className="hp" aria-hidden="true">
            <input tabIndex={-1} autoComplete="off" value={data.website}
              onChange={(e) => up({ website: e.target.value })} />
          </div>

          <label className="consent-block">
            <input type="checkbox" checked={data.aydinlatma}
              onChange={(e) => up({ aydinlatma: e.target.checked })} />
            <span>
              <a href="/privacy" target="_blank">{t("funnel.aydinlatmaLink")}</a>
              {t("funnel.aydinlatma")}
            </span>
          </label>
          <label className="consent-block">
            <input type="checkbox" checked={data.consent}
              onChange={(e) => up({ consent: e.target.checked })} />
            <span>{t("funnel.consent")}</span>
          </label>
          <label className="consent-block">
            <input type="checkbox" checked={data.crossBorder}
              onChange={(e) => up({ crossBorder: e.target.checked })} />
            <span>{t("funnel.crossBorder")}</span>
          </label>
        </>
      )}

      <div className="btn-line" style={{ marginTop: 18 }}>
        {step > 1 && (
          <button type="button" className="btn btn-sec" onClick={back}>{t("funnel.back")}</button>
        )}
        {step < TOTAL ? (
          <button type="button" className="btn" onClick={next}>{t("funnel.next")}</button>
        ) : (
          <button type="button" className="btn blue" onClick={submit} disabled={status === "loading"}>
            {status === "loading" ? t("funnel.sending") : t("funnel.submit")}
          </button>
        )}
      </div>
    </div>
  );
}
