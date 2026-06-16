import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Logo from "@/components/Logo";
import ClinicAssignments from "@/components/ClinicAssignments";

export const dynamic = "force-dynamic";

export default async function PortalPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/portal/login");

  const { data: dashboard } = await supabase.rpc("auravera_clinic_dashboard");
  const { data: assignments } = await supabase.rpc("auravera_clinic_assignments");

  const d = (dashboard as Record<string, unknown>) || {};
  const noClinic = d.error === "no_clinic";

  return (
    <main className="container dash">
      <div className="dash-head">
        <Logo size={30} />
        <form action="/portal/logout" method="post">
          <button className="btn-ghost" type="submit">Çıkış</button>
        </form>
      </div>

      {noClinic ? (
        <div className="alert error">
          Hesabınız henüz bir kliniğe bağlı değil. Lütfen AuraVera ekibiyle
          iletişime geçin.
        </div>
      ) : (
        <>
          <h1 style={{ fontSize: "1.6rem" }}>
            {(d.clinic as { name?: string })?.name || "Klinik"} Paneli
          </h1>
          <div className="stat-row">
            <div className="stat">
              <div className="num">${Number(d.balance ?? 0).toFixed(0)}</div>
              <div className="label">Kredi Bakiyesi</div>
            </div>
            <div className="stat">
              <div className="num">{Number(d.offered ?? 0)}</div>
              <div className="label">Yeni Teklif</div>
            </div>
            <div className="stat">
              <div className="num">{Number(d.claimed ?? 0)}</div>
              <div className="label">Satın Alınan</div>
            </div>
            <div className="stat">
              <div className="num">{Number(d.won ?? 0)}</div>
              <div className="label">Dönüşen</div>
            </div>
          </div>

          <h2 style={{ fontSize: "1.3rem", margin: "30px 0 14px" }}>
            Hasta Lead'leri
          </h2>
          <ClinicAssignments
            initial={(assignments as unknown[]) || []}
            balance={Number(d.balance ?? 0)}
          />
        </>
      )}
    </main>
  );
}
