"use client";

import { useState } from "react";
import type { AdminLead } from "@/lib/supabase";

type Clinic = { id: string; name: string; country: string | null; balance: number; leads: number };

const STAGE_TR: Record<string, string> = {
  new: "Yeni",
  contacted: "İletişimde",
  attempting: "Aranıyor",
  qualified: "Nitelikli",
  consultation_booked: "Konsültasyon",
  quoted: "Teklif Verildi",
  booked: "Rezerve",
  arrived: "Geldi",
  completed: "Tamamlandı",
  follow_up: "Takip",
  disqualified: "Elendi",
  lost: "Kayıp",
};

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
  const [tab, setTab] = useState<"leads" | "clinics">("leads");
  const [msg, setMsg] = useState("");
  const num = (k: string) => Number(stats[k] ?? 0);

  async function assign(leadId: string, clinicId: string, mode: string) {
    if (!clinicId) return;
    setMsg("Atanıyor...");
    const r = await post("assign", { lead_id: leadId, clinic_id: clinicId, mode });
    setMsg(r.ok ? "✓ Lead atandı. Sayfayı yenileyin." : `Hata: ${r.error}`);
  }
  async function topup(clinicId: string) {
    const amount = prompt("Yüklenecek kredi (USD):", "100");
    if (!amount) return;
    const r = await post("topup", { clinic_id: clinicId, amount });
    setMsg(r.ok ? "✓ Kredi yüklendi. Yenileyin." : `Hata: ${r.error}`);
  }
  async function createClinic() {
    const name = prompt("Klinik adı:");
    if (!name) return;
    const r = await post("create_clinic", { name });
    setMsg(r.ok ? "✓ Klinik oluşturuldu. Yenileyin." : `Hata: ${r.error}`);
  }
  async function linkUser(clinicId: string) {
    const email = prompt("Bağlanacak kullanıcının e-postası (önce Supabase Auth'ta oluşturulmalı):");
    if (!email) return;
    const r = await post("link_user", { email, clinic_id: clinicId, role: "clinic_admin" });
    setMsg(r.ok ? "✓ Kullanıcı kliniğe bağlandı." : `Hata: ${r.error}`);
  }

  return (
    <>
      <div className="stat-row" style={{ marginTop: 0, marginBottom: 24 }}>
        <div className="stat"><div className="num">{num("total")}</div><div className="label">Toplam Lead</div></div>
        <div className="stat"><div className="num">{num("new")}</div><div className="label">Yeni</div></div>
        <div className="stat"><div className="num">{num("hot")}</div><div className="label">🔥 Sıcak</div></div>
        <div className="stat"><div className="num">{num("grade_a")}</div><div className="label">A Sınıfı</div></div>
      </div>

      {msg && <div className="alert success">{msg}</div>}

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button className={`btn ${tab === "leads" ? "" : "btn-sec"}`} style={{ width: "auto", padding: "8px 18px" }} onClick={() => setTab("leads")}>
          Lead'ler ({leads.length})
        </button>
        <button className={`btn ${tab === "clinics" ? "" : "btn-sec"}`} style={{ width: "auto", padding: "8px 18px" }} onClick={() => setTab("clinics")}>
          Klinikler ({clinics.length})
        </button>
      </div>

      {tab === "leads" && (
        <div className="card" style={{ padding: 0, overflowX: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Tarih</th><th>Skor</th><th>Ad</th><th>İletişim</th>
                <th>Tedavi</th><th>Bütçe</th><th>Ülke</th><th>Durum</th><th>Ata</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 && (
                <tr><td colSpan={9}>Henüz lead yok.</td></tr>
              )}
              {leads.map((l) => (
                <tr key={l.id}>
                  <td style={{ whiteSpace: "nowrap" }}>{new Date(l.created_at).toLocaleDateString("tr-TR")}</td>
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
                  <td>{STAGE_TR[l.status] || l.status}{l.assigned_count > 0 ? ` · ${l.assigned_count}🏥` : ""}</td>
                  <td>
                    <select
                      defaultValue=""
                      onChange={(e) => assign(l.id, e.target.value, "shared")}
                      style={{ padding: 6, borderRadius: 8, border: "1px solid var(--gray)", fontSize: "0.82rem" }}
                    >
                      <option value="">Kliniğe ata…</option>
                      {clinics.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
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
            + Yeni Klinik
          </button>
          <div className="card" style={{ padding: 0, overflowX: "auto" }}>
            <table className="tbl">
              <thead>
                <tr><th>Klinik</th><th>Ülke</th><th>Bakiye</th><th>Lead</th><th>İşlem</th></tr>
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
                        Kredi Yükle
                      </button>
                      <button className="btn-sec" style={{ padding: "5px 12px", borderRadius: 8, fontSize: "0.8rem", cursor: "pointer" }} onClick={() => linkUser(c.id)}>
                        Kullanıcı Bağla
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
