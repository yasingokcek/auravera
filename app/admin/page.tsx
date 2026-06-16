import Logo from "@/components/Logo";
import AdminPanel from "@/components/AdminPanel";
import { getServiceClient, type AdminLead } from "@/lib/supabase";
import { isAdminAuthed } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

function Login({ error }: { error?: string }) {
  return (
    <main className="container" style={{ maxWidth: 420, paddingTop: 70 }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <Logo size={36} />
      </div>
      <div className="card">
        <h2 style={{ fontSize: "1.3rem" }}>Yönetim Girişi</h2>
        <p className="sub" style={{ color: "#5b6675", margin: "4px 0 16px" }}>
          AuraVera operasyon paneli.
        </p>
        {error === "1" && <div className="alert error">Hatalı parola.</div>}
        {error === "config" && (
          <div className="alert error">ADMIN_PASSWORD tanımlı değil.</div>
        )}
        <form action="/api/admin/login" method="post">
          <div className="field">
            <label>Parola</label>
            <input name="password" type="password" required />
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
  searchParams: { err?: string };
}) {
  if (!isAdminAuthed()) return <Login error={searchParams.err} />;

  let leads: AdminLead[] = [];
  let stats: Record<string, unknown> = {};
  let clinics: { id: string; name: string; country: string | null; balance: number; leads: number }[] = [];
  let loadError = "";

  try {
    const supabase = getServiceClient();
    const [l, s, c] = await Promise.all([
      supabase.rpc("auravera_admin_leads", { p_limit: 200 }),
      supabase.rpc("auravera_admin_stats"),
      supabase.rpc("auravera_admin_clinics"),
    ]);
    if (l.error) loadError = l.error.message;
    leads = (l.data as AdminLead[]) || [];
    stats = (s.data as Record<string, unknown>) || {};
    clinics = (c.data as typeof clinics) || [];
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Bilinmeyen hata";
  }

  return (
    <main className="container dash">
      <div className="dash-head">
        <Logo size={30} />
        <a className="btn-ghost" href="/">
          Siteyi Gör
        </a>
      </div>

      {loadError && (
        <div className="alert error">
          Veri yüklenemedi: {loadError}
          <br />
          <small>SUPABASE_SERVICE_ROLE_KEY ortam değişkenini kontrol edin.</small>
        </div>
      )}

      <AdminPanel
        leads={leads}
        stats={stats}
        clinics={clinics}
      />
    </main>
  );
}
