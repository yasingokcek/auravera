"use client";

import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import WhatsAppButton from "@/components/WhatsAppButton";
import TreatmentIcon from "@/components/TreatmentIcon";
import { useLang } from "@/components/LangProvider";
import { IMG } from "@/lib/images";
import type { Lang } from "@/lib/i18n";

const SPEC: Record<string, Record<Lang, string>> = {
  sac_ekimi: { tr: "Saç Ekimi", en: "Hair", de: "Haar", fr: "Cheveux", ar: "زراعة الشعر" },
  dis: { tr: "Diş", en: "Dental", de: "Zähne", fr: "Dentaire", ar: "أسنان" },
  estetik: { tr: "Estetik", en: "Aesthetic", de: "Ästhetik", fr: "Esthétique", ar: "تجميل" },
  obezite: { tr: "Obezite", en: "Bariatric", de: "Adipositas", fr: "Bariatrique", ar: "السمنة" },
  tup_bebek: { tr: "IVF", en: "IVF", de: "IVF", fr: "FIV", ar: "أطفال الأنابيب" },
  goz: { tr: "Göz", en: "Eye", de: "Augen", fr: "Yeux", ar: "العيون" },
};

const CLINICS = [
  { name: "Nova Hair Clinic", city: "İstanbul", rating: 4.9, reviews: 2100, specs: ["sac_ekimi"], accr: "JCI" },
  { name: "Estetik International", city: "İstanbul", rating: 4.9, reviews: 1280, specs: ["estetik", "sac_ekimi"], accr: "ISO 9001" },
  { name: "Smile Dental Clinic", city: "Antalya", rating: 4.8, reviews: 940, specs: ["dis"], accr: "ISO 9001" },
  { name: "LifeMed Bariatrics", city: "İzmir", rating: 4.7, reviews: 560, specs: ["obezite", "estetik"], accr: "JCI" },
  { name: "Horizon IVF Center", city: "İstanbul", rating: 4.8, reviews: 410, specs: ["tup_bebek"], accr: "ESHRE" },
  { name: "ClearVision Eye", city: "Ankara", rating: 4.9, reviews: 730, specs: ["goz"], accr: "ISO 9001" },
  { name: "Pearl Smile Dental", city: "İstanbul", rating: 4.9, reviews: 1560, specs: ["dis", "estetik"], accr: "JCI" },
  { name: "Grafix Hair Institute", city: "Antalya", rating: 4.8, reviews: 1340, specs: ["sac_ekimi"], accr: "ISO 9001" },
  { name: "Aurora Plastic Surgery", city: "İzmir", rating: 4.9, reviews: 870, specs: ["estetik"], accr: "JCI" },
  { name: "MedLife Obesity Center", city: "Bursa", rating: 4.7, reviews: 430, specs: ["obezite"], accr: "ISO 9001" },
  { name: "Genesis Fertility", city: "Ankara", rating: 4.8, reviews: 360, specs: ["tup_bebek", "estetik"], accr: "ESHRE" },
  { name: "VisionPro LASIK", city: "İstanbul", rating: 4.9, reviews: 990, specs: ["goz"], accr: "JCI" },
];

export default function ClinicsContent() {
  const { t, lang } = useLang();

  return (
    <>
      <header className="site-header">
        <div className="inner">
          <a href="/"><Logo size={32} /></a>
          <nav className="nav-links">
            <a href="/">← {t("portal.home").replace("← ", "")}</a>
            <a className="btn-ghost" href="/#basvuru">{t("cta.btn")}</a>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      <section className="hero" style={{ padding: "56px 0 36px" }}>
        <div className="container">
          <h1 style={{ fontSize: "2.4rem" }}>{t("cl.title")}</h1>
          <p className="lead">{t("cl.sub")}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 28 }}>
        <div className="container">
          <div className="grid-3">
            {CLINICS.map((c, i) => (
              <div className="card" key={c.name} style={{ padding: 24 }}>
                <div
                  className="clinic-media"
                  style={{
                    backgroundImage: `url(${IMG.clinic[i % IMG.clinic.length]}), linear-gradient(135deg, var(--emerald-soft), var(--blue-soft))`,
                  }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <h3 style={{ fontSize: "1.15rem" }}>{c.name}</h3>
                  <span className="pill" style={{ background: "var(--emerald-soft)", color: "var(--emerald-dark)" }}>
                    {t("cl.verified")}
                  </span>
                </div>
                <div style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: 10 }}>
                  📍 {c.city} · {c.accr}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <span style={{ color: "#f5b301", letterSpacing: 1 }}>★★★★★</span>
                  <strong>{c.rating.toFixed(1)}</strong>
                  <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                    ({c.reviews.toLocaleString("en-US")} {t("cl.reviews")})
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
                  {c.specs.map((s) => (
                    <span key={s} style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      border: "1px solid var(--border)", borderRadius: 999,
                      padding: "5px 12px", fontSize: "0.82rem", fontWeight: 600, color: "var(--ink)",
                    }}>
                      <TreatmentIcon slug={s} size={16} /> {SPEC[s][lang]}
                    </span>
                  ))}
                </div>
                <a className="btn" href="/#basvuru" style={{ display: "block", textAlign: "center" }}>
                  {t("cl.cta")}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">
          <Logo size={28} />
          <p style={{ marginTop: 12, maxWidth: 560 }}>{t("footer.desc")}</p>
          <p style={{ marginTop: 10 }}>
            <a href="/privacy">{t("footer.privacy")}</a> · <a href="/">AuraVera</a>
          </p>
        </div>
      </footer>

      <WhatsAppButton />
    </>
  );
}
