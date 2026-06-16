"use client";

import { useMemo, useState } from "react";

/**
 * Maliyet hesaplayıcı — hastaya anlık tahmini fiyat aralığı verir.
 * Türkiye sağlık turizmi ortalama paket fiyatlarına dayalı (USD, tahmini).
 */
type Mode =
  | { kind: "graft"; min: number; max: number; perMin: number; perMax: number; unit: string }
  | { kind: "qty"; min: number; max: number; perMin: number; perMax: number; unit: string }
  | { kind: "fixed"; lo: number; hi: number };

const TREATMENTS: { slug: string; label: string; icon: string; mode: Mode }[] = [
  { slug: "sac_ekimi", label: "Saç Ekimi", icon: "🌱", mode: { kind: "graft", min: 1000, max: 5000, perMin: 0.5, perMax: 0.9, unit: "greft" } },
  { slug: "dis", label: "Diş İmplantı / Veneer", icon: "🦷", mode: { kind: "qty", min: 1, max: 20, perMin: 350, perMax: 650, unit: "diş/implant" } },
  { slug: "estetik", label: "Estetik Cerrahi", icon: "✨", mode: { kind: "fixed", lo: 2200, hi: 5500 } },
  { slug: "obezite", label: "Obezite / Tüp Mide", icon: "⚖️", mode: { kind: "fixed", lo: 3500, hi: 5000 } },
  { slug: "tup_bebek", label: "Tüp Bebek / IVF", icon: "👶", mode: { kind: "fixed", lo: 3000, hi: 5000 } },
  { slug: "goz", label: "Göz / LASIK (2 göz)", icon: "👁️", mode: { kind: "fixed", lo: 1200, hi: 2000 } },
];

const fmt = (n: number) =>
  "$" + (Math.round(n / 50) * 50).toLocaleString("en-US");

export default function CostCalculator() {
  const [slug, setSlug] = useState("sac_ekimi");
  const t = TREATMENTS.find((x) => x.slug === slug)!;
  const [qty, setQty] = useState(2000);

  // Tedavi değişince makul varsayılan
  function pick(s: string) {
    setSlug(s);
    const m = TREATMENTS.find((x) => x.slug === s)!.mode;
    if (m.kind === "graft") setQty(2500);
    else if (m.kind === "qty") setQty(4);
  }

  const [lo, hi] = useMemo(() => {
    const m = t.mode;
    if (m.kind === "fixed") return [m.lo, m.hi];
    return [qty * m.perMin, qty * m.perMax];
  }, [t, qty]);

  return (
    <div className="card calc">
      <h2 style={{ fontSize: "1.35rem" }}>💰 Maliyet Hesaplayıcı</h2>
      <p className="sub" style={{ color: "var(--muted)", margin: "4px 0 16px" }}>
        Tedavinizin tahmini fiyat aralığını saniyeler içinde görün.
      </p>

      <div className="field">
        <label>Tedavi</label>
        <select value={slug} onChange={(e) => pick(e.target.value)}>
          {TREATMENTS.map((x) => (
            <option key={x.slug} value={x.slug}>
              {x.icon} {x.label}
            </option>
          ))}
        </select>
      </div>

      {t.mode.kind !== "fixed" && (
        <div className="field">
          <label>
            {t.mode.kind === "graft" ? "Greft sayısı" : "Diş / implant sayısı"}:{" "}
            <strong>{qty.toLocaleString("en-US")}</strong> {t.mode.unit}
          </label>
          <input
            className="range-input"
            type="range"
            min={t.mode.min}
            max={t.mode.max}
            step={t.mode.kind === "graft" ? 100 : 1}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
          />
        </div>
      )}

      <div className="est">
        <div className="range">
          {fmt(lo)} – {fmt(hi)}
        </div>
        <div className="note">
          Tahmini paket aralığı · kesin fiyat ücretsiz değerlendirmeyle netleşir
        </div>
      </div>

      <a href="#basvuru" className="btn" style={{ display: "block", textAlign: "center" }}>
        Bu tahminle ücretsiz teklif al →
      </a>
    </div>
  );
}
