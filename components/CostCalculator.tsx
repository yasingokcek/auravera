"use client";

import { useMemo, useState } from "react";
import { useLang } from "@/components/LangProvider";
import type { Lang } from "@/lib/i18n";

type Mode =
  | { kind: "graft"; min: number; max: number; perMin: number; perMax: number }
  | { kind: "qty"; min: number; max: number; perMin: number; perMax: number }
  | { kind: "fixed"; lo: number; hi: number };

const TREATMENTS: { slug: string; icon: string; labels: Record<Lang, string>; mode: Mode }[] = [
  { slug: "sac_ekimi", icon: "🌱", labels: { tr: "Saç Ekimi", en: "Hair Transplant", de: "Haartransplantation", fr: "Greffe de cheveux", ar: "زراعة الشعر" }, mode: { kind: "graft", min: 1000, max: 5000, perMin: 0.5, perMax: 0.9 } },
  { slug: "dis", icon: "🦷", labels: { tr: "Diş İmplantı / Veneer", en: "Dental Implant / Veneer", de: "Zahnimplantat / Veneer", fr: "Implant / Facette", ar: "زرعة / عدسات أسنان" }, mode: { kind: "qty", min: 1, max: 20, perMin: 350, perMax: 650 } },
  { slug: "estetik", icon: "✨", labels: { tr: "Estetik Cerrahi", en: "Aesthetic Surgery", de: "Ästhetische Chirurgie", fr: "Chirurgie esthétique", ar: "جراحة تجميلية" }, mode: { kind: "fixed", lo: 2200, hi: 5500 } },
  { slug: "obezite", icon: "⚖️", labels: { tr: "Obezite / Tüp Mide", en: "Bariatric / Gastric Sleeve", de: "Adipositas / Magenverkleinerung", fr: "Bariatrique / Sleeve", ar: "تكميم المعدة" }, mode: { kind: "fixed", lo: 3500, hi: 5000 } },
  { slug: "tup_bebek", icon: "👶", labels: { tr: "Tüp Bebek / IVF", en: "IVF", de: "IVF", fr: "FIV", ar: "أطفال الأنابيب" }, mode: { kind: "fixed", lo: 3000, hi: 5000 } },
  { slug: "goz", icon: "👁️", labels: { tr: "Göz / LASIK (2 göz)", en: "Eye / LASIK (both)", de: "Augen / LASIK (beide)", fr: "Yeux / LASIK (2 yeux)", ar: "العيون / الليزك" }, mode: { kind: "fixed", lo: 1200, hi: 2000 } },
];

const fmt = (n: number) => "$" + (Math.round(n / 50) * 50).toLocaleString("en-US");

export default function CostCalculator() {
  const { t, lang } = useLang();
  const [slug, setSlug] = useState("sac_ekimi");
  const tr = TREATMENTS.find((x) => x.slug === slug)!;
  const [qty, setQty] = useState(2500);

  function pick(s: string) {
    setSlug(s);
    const m = TREATMENTS.find((x) => x.slug === s)!.mode;
    if (m.kind === "graft") setQty(2500);
    else if (m.kind === "qty") setQty(4);
  }

  const [lo, hi] = useMemo(() => {
    const m = tr.mode;
    if (m.kind === "fixed") return [m.lo, m.hi];
    return [qty * m.perMin, qty * m.perMax];
  }, [tr, qty]);

  return (
    <div className="card calc">
      <h2 style={{ fontSize: "1.35rem" }}>{t("calc.title")}</h2>
      <p className="sub" style={{ color: "var(--muted)", margin: "4px 0 16px" }}>{t("calc.sub")}</p>

      <div className="field">
        <label>{t("calc.treatment")}</label>
        <select value={slug} onChange={(e) => pick(e.target.value)}>
          {TREATMENTS.map((x) => (
            <option key={x.slug} value={x.slug}>{x.icon} {x.labels[lang]}</option>
          ))}
        </select>
      </div>

      {tr.mode.kind !== "fixed" && (
        <div className="field">
          <label>
            {tr.mode.kind === "graft" ? t("calc.graft") : t("calc.teeth")}:{" "}
            <strong>{qty.toLocaleString("en-US")}</strong>
          </label>
          <input className="range-input" type="range"
            min={tr.mode.min} max={tr.mode.max}
            step={tr.mode.kind === "graft" ? 100 : 1}
            value={qty} onChange={(e) => setQty(Number(e.target.value))} />
        </div>
      )}

      <div className="est">
        <div className="range">{fmt(lo)} – {fmt(hi)}</div>
        <div className="note">{t("calc.note")}</div>
      </div>

      <a href="#basvuru" className="btn" style={{ display: "block", textAlign: "center" }}>
        {t("calc.cta")}
      </a>
    </div>
  );
}
