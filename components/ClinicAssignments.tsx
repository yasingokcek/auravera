"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useLang } from "@/components/LangProvider";

type Assignment = {
  assignment_id: string;
  status: string;
  mode: string;
  price: number;
  lead_id: string;
  treatment: string | null;
  country: string | null;
  city: string | null;
  language: string | null;
  budget_band: string | null;
  timeline: string | null;
  temperature: "hot" | "warm" | "cold";
  fit_grade: string | null;
  total_score: number;
  stage: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  message: string | null;
  revealed: boolean;
};

const STAGES = [
  "contacted",
  "qualified",
  "consultation_booked",
  "quoted",
  "booked",
  "completed",
  "lost",
];

export default function ClinicAssignments({
  initial,
  balance,
}: {
  initial: unknown[];
  balance: number;
}) {
  const { t } = useLang();
  const [rows, setRows] = useState<Assignment[]>(initial as Assignment[]);
  const [bal, setBal] = useState(balance);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const supabase = createSupabaseBrowserClient();

  async function claim(a: Assignment) {
    setMsg("");
    if (bal < a.price) {
      setMsg(`${t("portal.insufficient")} ($${a.price} / $${bal})`);
      return;
    }
    setBusy(a.assignment_id);
    const { data, error } = await supabase.rpc("auravera_clinic_claim", {
      p_assignment_id: a.assignment_id,
    });
    setBusy(null);
    if (error || (data as { error?: string })?.error) {
      setMsg("Hata: " + (error?.message || (data as { error?: string }).error));
      return;
    }
    const lead = (data as { lead: Assignment }).lead;
    setRows((rs) =>
      rs.map((r) =>
        r.assignment_id === a.assignment_id
          ? { ...r, status: "claimed", revealed: true, full_name: lead.full_name, email: lead.email, phone: lead.phone, whatsapp: lead.whatsapp, message: lead.message }
          : r
      )
    );
    setBal((b) => b - a.price);
    setMsg(t("portal.boughtMsg"));
  }

  async function updateStage(a: Assignment, stage: string) {
    setBusy(a.assignment_id);
    const { error } = await supabase.rpc("auravera_clinic_update_stage", {
      p_lead_id: a.lead_id,
      p_stage: stage,
    });
    setBusy(null);
    if (error) {
      setMsg("Hata: " + error.message);
      return;
    }
    setRows((rs) => rs.map((r) => (r.lead_id === a.lead_id ? { ...r, stage } : r)));
  }

  if (rows.length === 0) {
    return <div className="card">{t("portal.noLeads")}</div>;
  }

  return (
    <>
      {msg && <div className="alert success">{msg}</div>}
      <div style={{ display: "grid", gap: 14 }}>
        {rows.map((a) => (
          <div className="card" key={a.assignment_id} style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className={`grade ${a.fit_grade || "D"}`}>{a.fit_grade || "?"}</span>
                  <strong style={{ fontSize: "1.05rem" }}>{a.treatment || "Tedavi"}</strong>
                  <span className={`pill ${a.temperature}`}>
                    {t(`portal.${a.temperature}`)} · {a.total_score}
                  </span>
                  {a.mode === "exclusive" && <span className="pill warm">{t("portal.exclusive")}</span>}
                </div>
                <div style={{ color: "#5b6675", marginTop: 6, fontSize: "0.9rem" }}>
                  {[a.country, a.city, a.language].filter(Boolean).join(" · ") || "—"}
                  {a.budget_band ? ` · Bütçe: ${a.budget_band}` : ""}
                  {a.timeline ? ` · ${a.timeline}` : ""}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                {!a.revealed ? (
                  <>
                    <div style={{ fontWeight: 700, color: "var(--teal)", marginBottom: 6 }}>
                      ${Number(a.price).toFixed(0)}
                    </div>
                    <button
                      className="btn gold"
                      style={{ width: "auto", padding: "9px 18px" }}
                      onClick={() => claim(a)}
                      disabled={busy === a.assignment_id}
                    >
                      {busy === a.assignment_id ? "..." : t("portal.buy")}
                    </button>
                  </>
                ) : (
                  <span className="pill" style={{ background: "var(--emerald-soft)", color: "var(--emerald-dark)" }}>
                    {t("portal.bought")}
                  </span>
                )}
              </div>
            </div>

            {a.revealed && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--gray)" }}>
                <div style={{ fontSize: "0.92rem" }}>
                  <strong>{a.full_name}</strong>
                  {a.email && <span> · {a.email}</span>}
                  {(a.whatsapp || a.phone) && <span> · {a.whatsapp || a.phone}</span>}
                </div>
                {a.message && (
                  <p style={{ color: "#5b6675", marginTop: 6, fontSize: "0.9rem" }}>“{a.message}”</p>
                )}
                <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{t("portal.stageLabel")}</span>
                  <select
                    value={STAGES.includes(a.stage) ? a.stage : ""}
                    onChange={(e) => updateStage(a, e.target.value)}
                    style={{ padding: 7, borderRadius: 8, border: "1px solid var(--border)", fontSize: "0.85rem" }}
                  >
                    <option value="">{t("portal.updateStage")}</option>
                    {STAGES.map((s) => (
                      <option key={s} value={s}>{t(`stage.${s}`)}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
