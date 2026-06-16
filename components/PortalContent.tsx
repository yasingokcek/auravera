"use client";

import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ClinicAssignments from "@/components/ClinicAssignments";
import { useLang } from "@/components/LangProvider";

export default function PortalContent({
  dashboard,
  assignments,
}: {
  dashboard: Record<string, unknown>;
  assignments: unknown[];
}) {
  const { t } = useLang();
  const d = dashboard || {};
  const noClinic = d.error === "no_clinic";

  return (
    <main className="container dash">
      <div className="dash-head">
        <Logo size={30} />
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <LanguageSwitcher />
          <form action="/portal/logout" method="post">
            <button className="btn-ghost" type="submit">{t("portal.logout")}</button>
          </form>
        </div>
      </div>

      {noClinic ? (
        <div className="alert error">{t("portal.noClinic")}</div>
      ) : (
        <>
          <h1 style={{ fontSize: "1.6rem" }}>
            {(d.clinic as { name?: string })?.name || "Clinic"} {t("portal.panel")}
          </h1>
          <div className="stat-row">
            <div className="stat"><div className="num">${Number(d.balance ?? 0).toFixed(0)}</div><div className="label">{t("portal.balance")}</div></div>
            <div className="stat"><div className="num">{Number(d.offered ?? 0)}</div><div className="label">{t("portal.offered")}</div></div>
            <div className="stat"><div className="num">{Number(d.claimed ?? 0)}</div><div className="label">{t("portal.claimed")}</div></div>
            <div className="stat"><div className="num">{Number(d.won ?? 0)}</div><div className="label">{t("portal.won")}</div></div>
          </div>

          <h2 style={{ fontSize: "1.3rem", margin: "30px 0 14px" }}>{t("portal.leadsTitle")}</h2>
          <ClinicAssignments initial={assignments} balance={Number(d.balance ?? 0)} />
        </>
      )}
    </main>
  );
}
