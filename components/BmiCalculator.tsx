"use client";

import { useMemo, useState } from "react";
import { useLang } from "@/components/LangProvider";

export default function BmiCalculator() {
  const { t } = useLang();
  const [h, setH] = useState(170);
  const [w, setW] = useState(90);

  const { bmi, catKey, eligible } = useMemo(() => {
    const m = h / 100;
    const b = w / (m * m);
    let key = "normal";
    if (b < 18.5) key = "under";
    else if (b < 25) key = "normal";
    else if (b < 30) key = "over";
    else if (b < 35) key = "ob1";
    else if (b < 40) key = "ob2";
    else key = "ob3";
    return { bmi: b, catKey: key, eligible: b >= 35 || (b >= 30) };
  }, [h, w]);

  const color =
    bmi >= 35 ? "#dc2626" : bmi >= 30 ? "#ea580c" : bmi >= 25 ? "#f59e0b" : "#0fb39a";

  return (
    <div className="card calc">
      <h2 style={{ fontSize: "1.3rem" }}>{t("bmi.title")}</h2>
      <p className="sub" style={{ color: "var(--muted)", margin: "4px 0 16px" }}>{t("bmi.sub")}</p>

      <div className="field">
        <label>{t("bmi.height")}: <strong>{h}</strong></label>
        <input className="range-input" type="range" min={140} max={210} value={h} onChange={(e) => setH(Number(e.target.value))} />
      </div>
      <div className="field">
        <label>{t("bmi.weight")}: <strong>{w}</strong></label>
        <input className="range-input" type="range" min={40} max={200} value={w} onChange={(e) => setW(Number(e.target.value))} />
      </div>

      <div className="est" style={{ background: "var(--bg-soft)" }}>
        <div className="note" style={{ marginBottom: 4 }}>{t("bmi.your")}</div>
        <div className="range" style={{ color }}>{bmi.toFixed(1)}</div>
        <div style={{ marginTop: 6, fontWeight: 700, color }}>{t(`bmi.cat.${catKey}`)}</div>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: 8 }}>
          {eligible ? t("bmi.eligible") : t("bmi.notEligible")}
        </p>
      </div>

      <a href="/#basvuru" className="btn" style={{ display: "block", textAlign: "center" }}>{t("bmi.cta")}</a>
    </div>
  );
}
