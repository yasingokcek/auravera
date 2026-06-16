import { cookies } from "next/headers";
import { getServiceClient, type Lead } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  new: "Yeni",
  contacted: "İletişime geçildi",
  qualified: "Nitelikli",
  consultation: "Konsültasyon",
  converted: "Dönüştü",
  lost: "Kaybedildi",
};

function LoginForm({ error }: { error?: string }) {
  return (
    <main className="container" style={{ maxWidth: 420, paddingTop: 80 }}>
      <div className="card">
        <h2>Admin Girişi</h2>
        <p className="sub">Lead panosuna erişmek için parolanızı girin.</p>
        {error === "1" && (
          <div className="alert error">Hatalı parola.</div>
        )}
        {error === "config" && (
          <div className="alert error">
            ADMIN_PASSWORD ortam değişkeni tanımlı değil.
          </div>
        )}
        <form action="/api/admin/login" method="post">
          <div className="field">
            <label htmlFor="password">Parola</label>
            <input id="password" name="password" type="password" required />
          </div>
          <button className="btn" type="submit">
            Giriş Yap
          </button>
        </form>
      </div>
    </main>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { err?: string; status?: string };
}) {
  const cookieStore = cookies();
  const auth = cookieStore.get("av_admin")?.value;
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected || auth !== expected) {
    return <LoginForm error={searchParams.err} />;
  }

  let leads: Lead[] = [];
  let loadError = "";
  try {
    const supabase = getServiceClient();
    const { data, error } = await supabase.rpc("auravera_list_leads", {
      p_status: searchParams.status || null,
      p_limit: 200,
      p_offset: 0,
    });
    if (error) loadError = error.message;
    else leads = (data as Lead[]) || [];
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Bilinmeyen hata";
  }

  return (
    <main className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 20,
        }}
      >
        <h1 style={{ fontSize: "1.8rem" }}>
          Lead Panosu{" "}
          <span style={{ color: "var(--accent)" }}>({leads.length})</span>
        </h1>
        <a href="/admin">Yenile</a>
      </div>

      {loadError && (
        <div className="alert error">
          Lead'ler yüklenemedi: {loadError}
          <br />
          <small>SUPABASE_SERVICE_ROLE_KEY ortam değişkenini kontrol edin.</small>
        </div>
      )}

      <div
        className="card"
        style={{ padding: 0, overflowX: "auto", color: "var(--card-text)" }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ background: "#f4f6f9", textAlign: "left" }}>
              <th style={th}>Tarih</th>
              <th style={th}>Ad Soyad</th>
              <th style={th}>İletişim</th>
              <th style={th}>Ülke/Dil</th>
              <th style={th}>Tedavi</th>
              <th style={th}>Kaynak</th>
              <th style={th}>Durum</th>
              <th style={th}>Mesaj</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && !loadError && (
              <tr>
                <td style={td} colSpan={8}>
                  Henüz lead yok.
                </td>
              </tr>
            )}
            {leads.map((l) => (
              <tr key={l.id} style={{ borderTop: "1px solid #eceff3" }}>
                <td style={td}>
                  {new Date(l.created_at).toLocaleString("tr-TR")}
                </td>
                <td style={td}>{l.full_name}</td>
                <td style={td}>
                  {l.email && <div>{l.email}</div>}
                  {l.phone && <div>{l.phone}</div>}
                </td>
                <td style={td}>
                  {[l.country, l.language].filter(Boolean).join(" / ") || "—"}
                </td>
                <td style={td}>{l.treatment || "—"}</td>
                <td style={td}>
                  {l.source || "—"}
                  {l.utm?.utm_campaign ? (
                    <div style={{ color: "#8a93a0", fontSize: "0.8rem" }}>
                      {String(l.utm.utm_campaign)}
                    </div>
                  ) : null}
                </td>
                <td style={td}>{STATUS_LABELS[l.status] || l.status}</td>
                <td style={{ ...td, maxWidth: 240 }}>{l.message || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

const th: React.CSSProperties = {
  padding: "12px 14px",
  fontWeight: 700,
  whiteSpace: "nowrap",
};
const td: React.CSSProperties = {
  padding: "11px 14px",
  verticalAlign: "top",
};
