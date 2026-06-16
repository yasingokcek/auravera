"use client";

import { useRef, useState } from "react";
import { useLang } from "@/components/LangProvider";

export default function SimulationTool() {
  const { t, lang } = useLang();
  const [treatment, setTreatment] = useState<"sac_ekimi" | "dis">("sac_ekimi");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [err, setErr] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function onFile(f: File | null) {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function submit() {
    setErr("");
    if (!file) return setErr(t("sim.errFile"));
    if (!name.trim() || !phone.trim()) return setErr(t("sim.errContact"));
    if (!consent) return setErr(t("sim.errConsent"));
    setStatus("loading");
    const fd = new FormData();
    fd.append("photo", file);
    fd.append("full_name", name);
    fd.append("phone", phone);
    fd.append("treatment", treatment);
    fd.append("consent", "true");
    fd.append("lang", lang);
    try {
      const res = await fetch("/api/simulate", { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setStatus("error");
        setErr(j.error === "too_large" ? "Max 8MB" : t("sim.errFile"));
        return;
      }
      setStatus("ok");
    } catch {
      setStatus("error");
      setErr(t("err.conn"));
    }
  }

  if (status === "ok") {
    return (
      <div className="card">
        <h2 style={{ fontSize: "1.3rem" }}>{t("sim.title")}</h2>
        <div className="alert success" style={{ margin: "16px 0" }}>{t("sim.successTitle")}</div>
        <p style={{ color: "var(--muted)" }}>{t("sim.success")}</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 style={{ fontSize: "1.3rem" }}>{t("sim.title")}</h2>
      <p className="sub" style={{ color: "var(--muted)", margin: "4px 0 16px" }}>{t("sim.sub")}</p>

      <div className="choices" style={{ marginBottom: 14 }}>
        <button type="button" className={`choice ${treatment === "sac_ekimi" ? "sel" : ""}`} onClick={() => setTreatment("sac_ekimi")}>🌱 {t("sim.hair")}</button>
        <button type="button" className={`choice ${treatment === "dis" ? "sel" : ""}`} onClick={() => setTreatment("dis")}>🦷 {t("sim.smile")}</button>
      </div>

      {err && <div className="alert error">{err}</div>}

      <input ref={inputRef} type="file" accept="image/*" capture="user" style={{ display: "none" }}
        onChange={(e) => onFile(e.target.files?.[0] || null)} />

      {!preview ? (
        <button type="button" onClick={() => inputRef.current?.click()}
          style={{
            width: "100%", border: "2px dashed var(--border)", borderRadius: 14,
            padding: "34px 16px", background: "var(--bg-soft)", cursor: "pointer",
            color: "var(--muted)", fontSize: "0.95rem",
          }}>
          <div style={{ fontSize: "2rem", marginBottom: 8 }}>📸</div>
          <div style={{ fontWeight: 600, color: "var(--ink)" }}>{t("sim.upload")}</div>
          <div style={{ fontSize: "0.82rem", marginTop: 4 }}>{t("sim.uploadHint")}</div>
        </button>
      ) : (
        <div style={{ position: "relative" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="preview" style={{ width: "100%", borderRadius: 14, maxHeight: 280, objectFit: "cover", filter: status === "loading" ? "blur(2px)" : "none" }} />
          {status === "loading" && (
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "rgba(15,23,42,0.45)", borderRadius: 14, color: "#fff", fontWeight: 600 }}>
              ⚙️ {t("sim.processing")}
            </div>
          )}
          <button type="button" onClick={() => inputRef.current?.click()}
            style={{ marginTop: 8, fontSize: "0.85rem", color: "var(--emerald-dark)", background: "none", border: "none", cursor: "pointer" }}>
            {t("sim.change")}
          </button>
        </div>
      )}

      <div className="row2" style={{ marginTop: 14 }}>
        <div className="field"><label>{t("sim.name")}</label><input value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div className="field"><label>{t("sim.phone")}</label><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+90 5xx xxx xx xx" /></div>
      </div>

      <label className="consent-block">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>{t("sim.consent")}</span>
      </label>

      <button className="btn" onClick={submit} disabled={status === "loading"} style={{ marginTop: 6 }}>
        {status === "loading" ? t("sim.processing") : t("sim.btn")}
      </button>
      <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 10, textAlign: "center" }}>{t("sim.privacy")}</p>
    </div>
  );
}
