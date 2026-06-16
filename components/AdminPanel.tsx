"use client";

import { useState } from "react";
import type { AdminLead } from "@/lib/supabase";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLang } from "@/components/LangProvider";

type Clinic = { id: string; name: string; country: string | null; balance: number; leads: number };

async function post(action: string, params: Record<string, unknown>) {
  const res = await fetch("/api/admin/action", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, params }),
  });
  return res.json();
}

export default function AdminPanel({
  leads,
  stats,
  clinics,
}: {
  leads: AdminLead[];
  stats: Record<string, unknown>;
  clinics: Clinic[];
}) {
  const { t } = useLang();
  const [tab, setTab] = useState<"leads" | "clinics">("leads");
  const [msg, setMsg] = useState("");
  const num = (k: string) => Number(stats[k] ?? 0);
  const stage = (s: string) => t(`stage.${s}`);

  async function assign(leadId: string, clinicId: string, mode: string) {
    if (!clinicId) return;
    setMsg(t("admin.assigning"));
    const r = await post("assign", { lead_id: leadId, clinic_id: clinicId, mode });
    setMsg(r.ok ? t("admin.assignedMsg") : `${t("admin.error")}: ${r.error}`);
  }
  async function topup(clinicId: string) {
    const amount = prompt(t("admin.topupPrompt"), "100");
    if (!amount) return;
    const r = await post("topup", { clinic_id: clinicId, amount });
    setMsg(r.ok ? t("admin.done") : `${t("admin.error")}: ${r.error}`);
  }
  async function createClinic() {
    const name = prompt(t("admin.clinicNamePrompt"));
    if (!name) return;
    const r = await post("create_clinic", { name });
    setMsg(r.ok ? t("admin.done") : `${t("admin.error")}: ${r.error}`);
  }
  async function linkUser(clinicId: string) {
    const email = prompt(t("admin.linkUserPrompt"));
    if (!email) return;
    const r = await post("link_user", { email, clinic_id: clinicId, role: "clinic_admin" });
    setMsg(r.ok ? t("admin.done") : `${t("admin.error")}: ${r.error}`);
  }

  return (
    <>
      <div className="dash-head">
        <Logo size={30} />
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a className="btn-ghost" href="/">{t("admin.viewSite")}</a>
          <LanguageSwitcher />
        </div>
      </div>

      <div className="stat-row" style={{ marginBottom: 24 }}>
        <div className="stat"><div className="num">{num("total")}</div><div className="label">{t("admin.total")}</div></div>
        <div className="stat"><div className="num">{num("new")}</div><div className="label">{t("admin.new")}</div></div>
        <div className="stat"><div className="num">{num("hot")}</div><div className="label">{t("admin.hot")}</div></div>
        <div className="stat"><div className="num">{num("grade_a")}</div><div className="label">{t("admin.gradeA")}</div></div>
      </div>

      {msg && <div className="alert success">{msg}</div>}

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button className={`btn ${tab === "leads" ? "" : "btn-sec"}`} style={{ width: "auto", padding: "8px 18px" }} onClick={() => setTab("leads")}>
          {t("admin.leadsTab")} ({leads.length})
        </button>
        <button className={`btn ${tab === "clinics" ? "" : "btn-sec"}`} style={{ width: "auto", padding: "8px 18px" }} onClick={() => setTab("clinics")}>
          {t("admin.clinicsTab")} ({clinics.length})
        </button>
      </div>

      {tab === "leads" && (
        <div className="card" style={{ padding: 0, overflowX: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>{t("admin.date")}</th><th>{t("admin.score")}</th><th>{t("admin.name")}</th>
                <th>{t("admin.contact")}</th><th>{t("admin.treatment")}</th><th>{t("admin.budget")}</th>
                <th>{t("admin.country")}</th><th>{t("admin.status")}</th><th>{t("admin.assign")}</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 && <tr><td colSpan={9}>{t("admin.noLeads")}</td></tr>}
              {leads.map((l) => (
                <tr key={l.id}>
                  <td style={{ whiteSpace: "nowrap" }}>{new Date(l.created_at).toLocaleDateString()}</td>
                  <td>
                    <span className={`grade ${l.fit_grade || "D"}`}>{l.fit_grade || "?"}</span>{" "}
                    <span className={`pill ${l.temperature}`}>{l.total_score}</span>
                  </td>
                  <td>{l.full_name}</td>
                  <td style={{ fontSize: "0.82rem" }}>
                    {l.email && <div>{l.email}</div>}
                    {(l.whatsapp || l.phone) && <div>{l.whatsapp || l.phone}</div>}
                  </td>
                  <td>{l.treatment_name || l.treatment || "—"}</td>
                  <td>{l.budget_band || "—"}</td>
                  <td>{l.country || "—"}</td>
                  <td>{stage(l.status)}{l.assigned_count > 0 ? ` · ${l.assigned_count}🏥` : ""}</td>
                  <td>
                    <select defaultValue="" onChange={(e) => assign(l.id, e.target.value, "shared")}
                      style={{ padding: 6, borderRadius: 8, border: "1px solid var(--border)", fontSize: "0.82rem" }}>
                      <option value="">{t("admin.assignPh")}</option>
                      {clinics.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "clinics" && (
        <div>
          <button className="btn" style={{ width: "auto", padding: "8px 18px", marginBottom: 14 }} onClick={createClinic}>
            {t("admin.newClinic")}
          </button>
          <div className="card" style={{ padding: 0, overflowX: "auto" }}>
            <table className="tbl">
              <thead>
                <tr><th>{t("admin.clinic")}</th><th>{t("admin.country")}</th><th>{t("admin.balance")}</th><th>{t("admin.leads")}</th><th>{t("admin.action")}</th></tr>
              </thead>
              <tbody>
                {clinics.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.country || "—"}</td>
                    <td>${Number(c.balance).toFixed(0)}</td>
                    <td>{c.leads}</td>
                    <td style={{ display: "flex", gap: 6 }}>
                      <button className="btn-sec" style={{ padding: "5px 12px", borderRadius: 8, fontSize: "0.8rem", cursor: "pointer" }} onClick={() => topup(c.id)}>
                        {t("admin.topup")}
                      </button>
                      <button className="btn-sec" style={{ padding: "5px 12px", borderRadius: 8, fontSize: "0.8rem", cursor: "pointer" }} onClick={() => linkUser(c.id)}>
                        {t("admin.linkUser")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
