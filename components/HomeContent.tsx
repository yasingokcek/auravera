"use client";

import Logo from "@/components/Logo";
import LeadFunnel from "@/components/LeadFunnel";
import CostCalculator from "@/components/CostCalculator";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLang } from "@/components/LangProvider";

export default function HomeContent() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <>
      <header className="site-header">
        <div className="inner">
          <Logo size={32} />
          <nav className="nav-links">
            <a href="#hesapla">{t("nav.cost")}</a>
            <a href="#nasil">{t("nav.how")}</a>
            <a href="#neden">{t("nav.why")}</a>
            <a href="#klinikler">{t("nav.clinics")}</a>
            <a className="btn-ghost" href="/portal/login">
              {t("nav.login")}
            </a>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <span className="eyebrow">● {t("hero.eyebrow")}</span>
          <h1>
            {t("hero.t1")} <span className="grad">{t("hero.grad")}</span>{" "}
            {t("hero.t2")}
          </h1>
          <p className="lead">{t("hero.lead")}</p>
          <div className="badges">
            <span className="badge">{t("hero.b1")}</span>
            <span className="badge">{t("hero.b2")}</span>
            <span className="badge">{t("hero.b3")}</span>
            <span className="badge">{t("hero.b4")}</span>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="split" id="hesapla">
          <div style={{ display: "grid", gap: 20 }}>
            <CostCalculator />
            <div className="stat-row">
              <div className="stat"><div className="num">40+</div><div className="label">{t("stat.countries")}</div></div>
              <div className="stat"><div className="num">6</div><div className="label">{t("stat.areas")}</div></div>
              <div className="stat"><div className="num">&lt;5dk</div><div className="label">{t("stat.response")}</div></div>
              <div className="stat"><div className="num">%100</div><div className="label">{t("stat.transparent")}</div></div>
            </div>
          </div>
          <div id="basvuru">
            <LeadFunnel />
          </div>
        </div>
      </div>

      <section className="section soft" id="neden">
        <div className="container">
          <h2>{t("why.title")}</h2>
          <p className="muted">{t("why.sub")}</p>
          <div className="grid-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div className="feature" key={i}>
                <div className="icon">{["🎯", "💸", "🛬", "✅", "🔒", "💬"][i - 1]}</div>
                <h3>{t(`why.${i}t`)}</h3>
                <p>{t(`why.${i}d`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="nasil">
        <div className="container">
          <h2>{t("how.title")}</h2>
          <p className="muted">{t("how.sub")}</p>
          <div className="grid-3">
            {[1, 2, 3].map((i) => (
              <div className="feature" key={i}>
                <div className="icon">{["1️⃣", "2️⃣", "3️⃣"][i - 1]}</div>
                <h3>{t(`how.${i}t`)}</h3>
                <p>{t(`how.${i}d`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section soft" id="klinikler">
        <div className="container">
          <h2>{t("clinics.title")}</h2>
          <p className="muted">{t("clinics.sub")}</p>
          <div className="grid-3">
            {[1, 2, 3].map((i) => (
              <div className="feature" key={i}>
                <div className="icon">{["🎯", "🔐", "💳"][i - 1]}</div>
                <h3>{t(`clinics.${i}t`)}</h3>
                <p>{t(`clinics.${i}d`)}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 26 }}>
            <a className="btn-ghost" href="/portal/login">
              {t("clinics.cta")}
            </a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">
          <Logo size={28} />
          <p style={{ marginTop: 12, maxWidth: 560 }}>{t("footer.desc")}</p>
          <p style={{ marginTop: 10 }}>
            <a href="/privacy">{t("footer.privacy")}</a> ·{" "}
            <a href="/portal/login">{t("footer.login")}</a> · © {year} AuraVera
          </p>
        </div>
      </footer>
    </>
  );
}
